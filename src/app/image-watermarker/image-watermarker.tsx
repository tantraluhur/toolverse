"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";

// ---------- Types ----------

type WatermarkType = "text" | "image";

type Position =
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-right"
  | "custom";

type OutputFormat = "png" | "jpg";

interface TextSettings {
  text: string;
  fontFamily: string;
  fontSize: number; // px in source-image space
  color: string;
  opacity: number; // 0-100
  rotation: number; // 0-360
  bold: boolean;
  italic: boolean;
}

interface ImageWmSettings {
  src: string | null;
  scale: number; // 0-100 (% of base image width)
  opacity: number; // 0-100
  naturalW: number;
  naturalH: number;
}

interface CenterPoint {
  x: number;
  y: number;
}

// ---------- Constants ----------

const FONT_FAMILIES = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" },
];

const PRESETS: { label: string; value: Position }[] = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
  { label: "Center", value: "center" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
];

// ---------- Pure drawing utilities ----------

function buildFontString(t: TextSettings): string {
  const parts: string[] = [];
  if (t.italic) parts.push("italic");
  if (t.bold) parts.push("bold");
  parts.push(`${t.fontSize}px`);
  parts.push(t.fontFamily);
  return parts.join(" ");
}

function measureTextBox(
  ctx: CanvasRenderingContext2D,
  t: TextSettings,
): { w: number; h: number } {
  ctx.font = buildFontString(t);
  const metrics = ctx.measureText(t.text || " ");
  const ascent = metrics.actualBoundingBoxAscent ?? t.fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? t.fontSize * 0.2;
  return {
    w: Math.max(1, metrics.width),
    h: Math.max(1, ascent + descent),
  };
}

function drawTextAt(
  ctx: CanvasRenderingContext2D,
  t: TextSettings,
  cx: number,
  cy: number,
) {
  ctx.save();
  ctx.font = buildFontString(t);
  ctx.fillStyle = t.color;
  ctx.globalAlpha = t.opacity / 100;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(cx, cy);
  ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.fillText(t.text, 0, 0);
  ctx.restore();
}

function drawImageWmAt(
  ctx: CanvasRenderingContext2D,
  wmImg: HTMLImageElement,
  scaledW: number,
  scaledH: number,
  opacity: number,
  cx: number,
  cy: number,
  rotation: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity / 100;
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(wmImg, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
  ctx.restore();
}

function presetCenter(
  preset: Position,
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
  margin: number,
): CenterPoint {
  switch (preset) {
    case "top-left":
      return { x: margin + boxW / 2, y: margin + boxH / 2 };
    case "top-right":
      return { x: imgW - margin - boxW / 2, y: margin + boxH / 2 };
    case "bottom-left":
      return { x: margin + boxW / 2, y: imgH - margin - boxH / 2 };
    case "bottom-right":
      return { x: imgW - margin - boxW / 2, y: imgH - margin - boxH / 2 };
    case "center":
    default:
      return { x: imgW / 2, y: imgH / 2 };
  }
}

// ---------- Component ----------

export default function ImageWatermarker() {
  // Source image state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  // Watermark type
  const [wmType, setWmType] = useState<WatermarkType>("text");

  // Text watermark state
  const [text, setText] = useState<TextSettings>({
    text: "© Toolverse",
    fontFamily: FONT_FAMILIES[0].value,
    fontSize: 64,
    color: "#ffffff",
    opacity: 80,
    rotation: 0,
    bold: true,
    italic: false,
  });

  // Image watermark state
  const [imgWm, setImgWm] = useState<ImageWmSettings>({
    src: null,
    scale: 25,
    opacity: 80,
    naturalW: 0,
    naturalH: 0,
  });
  const wmImgRef = useRef<HTMLImageElement | null>(null);

  // Position state
  const [preset, setPreset] = useState<Position>("bottom-right");
  const [center, setCenter] = useState<CenterPoint>({ x: 0, y: 0 });
  const [margin, setMargin] = useState(40);

  // Tile mode
  const [tile, setTile] = useState(false);
  const [tileSpacing, setTileSpacing] = useState(200);
  const [tileRotation, setTileRotation] = useState(-30);

  // Output
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(92);

  // Display
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayScale, setDisplayScale] = useState(1);

  // Drag state
  const dragging = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // ----- File handlers -----

  const loadFontSize = useCallback((imgW: number) => {
    return Math.max(16, Math.round(imgW * 0.05));
  }, []);

  function handleSourceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        sourceImgRef.current = img;
        setOrigW(img.naturalWidth);
        setOrigH(img.naturalHeight);
        setText((prev) => ({
          ...prev,
          fontSize: loadFontSize(img.naturalWidth),
        }));
        setMargin(Math.round(img.naturalWidth * 0.03));
        setPreset("bottom-right");
      };
      img.src = src;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  }

  function handleWatermarkFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        wmImgRef.current = img;
        setImgWm((prev) => ({
          ...prev,
          src,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
        }));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  // ----- Display scaling -----

  useEffect(() => {
    if (!imageSrc || origW === 0) return;
    function update() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDisplayScale(w / origW);
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [imageSrc, origW]);

  // ----- Compute current box (in source-image coords) -----

  const currentBox = useMemo(() => {
    if (wmType === "text") {
      // Approximate without measuring (real measurement happens in render)
      const approxW = (text.text.length || 1) * text.fontSize * 0.55;
      return { w: approxW, h: text.fontSize * 1.2 };
    }
    if (imgWm.naturalW === 0 || origW === 0) return { w: 0, h: 0 };
    const w = (origW * imgWm.scale) / 100;
    const h = (w / imgWm.naturalW) * imgWm.naturalH;
    return { w, h };
  }, [wmType, text, imgWm.scale, imgWm.naturalW, imgWm.naturalH, origW]);

  // ----- Render canvas (preview & export share the same canvas) -----

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const img = sourceImgRef.current;
    if (!canvas || !img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    if (wmType === "text") {
      if (!text.text) return;
      const box = measureTextBox(ctx, text);
      if (tile) {
        const step = Math.max(40, tileSpacing);
        for (let y = 0; y < img.naturalHeight + step; y += step) {
          for (let x = 0; x < img.naturalWidth + step; x += step) {
            drawTextAt(
              ctx,
              { ...text, rotation: tileRotation },
              x,
              y,
            );
          }
        }
      } else {
        const c =
          preset === "custom"
            ? center
            : presetCenter(preset, img.naturalWidth, img.naturalHeight, box.w, box.h, margin);
        drawTextAt(ctx, text, c.x, c.y);
      }
    } else {
      const wmImg = wmImgRef.current;
      if (!wmImg) return;
      const scaledW = (img.naturalWidth * imgWm.scale) / 100;
      const scaledH = (scaledW / wmImg.naturalWidth) * wmImg.naturalHeight;
      if (tile) {
        const stepX = Math.max(scaledW + 40, tileSpacing);
        const stepY = Math.max(scaledH + 40, tileSpacing);
        for (let y = 0; y < img.naturalHeight + stepY; y += stepY) {
          for (let x = 0; x < img.naturalWidth + stepX; x += stepX) {
            drawImageWmAt(
              ctx,
              wmImg,
              scaledW,
              scaledH,
              imgWm.opacity,
              x,
              y,
              tileRotation,
            );
          }
        }
      } else {
        const c =
          preset === "custom"
            ? center
            : presetCenter(
                preset,
                img.naturalWidth,
                img.naturalHeight,
                scaledW,
                scaledH,
                margin,
              );
        drawImageWmAt(
          ctx,
          wmImg,
          scaledW,
          scaledH,
          imgWm.opacity,
          c.x,
          c.y,
          0,
        );
      }
    }
    // imgWm.naturalW/H are tracked so render re-fires once the watermark image loads
    // even though the values are read from wmImgRef.current inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wmType,
    text,
    imgWm.scale,
    imgWm.opacity,
    imgWm.naturalW,
    imgWm.naturalH,
    preset,
    center,
    margin,
    tile,
    tileSpacing,
    tileRotation,
  ]);

  // Schedule renders via rAF to coalesce multiple state changes per frame
  const rafId = useRef<number | null>(null);
  useEffect(() => {
    if (!imageSrc) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      render();
      rafId.current = null;
    });
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [imageSrc, render]);

  // ----- Drag-to-position -----

  function toImageCoords(clientX: number, clientY: number) {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      ix: (clientX - rect.left) / displayScale,
      iy: (clientY - rect.top) / displayScale,
    };
  }

  function isInsideWatermark(ix: number, iy: number): boolean {
    if (tile) return false;
    const box = currentBox;
    if (box.w === 0 || box.h === 0) return false;
    const c =
      preset === "custom"
        ? center
        : presetCenter(preset, origW, origH, box.w, box.h, margin);
    return (
      ix >= c.x - box.w / 2 &&
      ix <= c.x + box.w / 2 &&
      iy >= c.y - box.h / 2 &&
      iy <= c.y + box.h / 2
    );
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!imageSrc || tile) return;
    const { ix, iy } = toImageCoords(e.clientX, e.clientY);
    const box = currentBox;
    const c =
      preset === "custom"
        ? center
        : presetCenter(preset, origW, origH, box.w, box.h, margin);
    if (!isInsideWatermark(ix, iy)) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    dragOffset.current = { dx: ix - c.x, dy: iy - c.y };
    if (preset !== "custom") {
      setCenter(c);
      setPreset("custom");
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    e.preventDefault();
    const { ix, iy } = toImageCoords(e.clientX, e.clientY);
    const nx = Math.max(0, Math.min(origW, ix - dragOffset.current.dx));
    const ny = Math.max(0, Math.min(origH, iy - dragOffset.current.dy));
    setCenter({ x: nx, y: ny });
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  // ----- Actions -----

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const ext = format === "jpg" ? "jpg" : "png";
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `toolverse_watermarked.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mime,
      format === "jpg" ? quality / 100 : undefined,
    );
  }, [format, quality]);

  function handleReset() {
    setText({
      text: "© Toolverse",
      fontFamily: FONT_FAMILIES[0].value,
      fontSize: origW > 0 ? loadFontSize(origW) : 64,
      color: "#ffffff",
      opacity: 80,
      rotation: 0,
      bold: true,
      italic: false,
    });
    setImgWm((prev) => ({ ...prev, scale: 25, opacity: 80 }));
    setPreset("bottom-right");
    setMargin(origW > 0 ? Math.round(origW * 0.03) : 40);
    setTile(false);
    setTileSpacing(200);
    setTileRotation(-30);
  }

  function handleReplaceImage() {
    setImageSrc(null);
    sourceImgRef.current = null;
    setOrigW(0);
    setOrigH(0);
    setPreset("bottom-right");
  }

  // ----- Render -----

  if (!imageSrc) {
    return (
      <div className="space-y-3">
        <Input
          id="wm-source-upload"
          type="file"
          label="Upload Image"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleSourceFile}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Supports JPG, PNG, and WebP. Everything runs in your browser &mdash;
          your image never leaves your device.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Preview canvas */}
      <div className="space-y-3">
        <div
          ref={containerRef}
          className="relative touch-none overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: tile ? "default" : "grab" }}
        >
          <canvas ref={canvasRef} className="block w-full" />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {origW} × {origH} px
          {!tile && (
            <span className="ml-2">
              &middot; Drag the watermark to reposition
            </span>
          )}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={handleReplaceImage}>
            Replace Image
          </Button>
        </div>
      </div>

      {/* Controls panel */}
      <div className="space-y-5 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        {/* Type toggle */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Watermark Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={wmType === "text" ? "primary" : "outline"}
              size="sm"
              onClick={() => setWmType("text")}
            >
              Text
            </Button>
            <Button
              variant={wmType === "image" ? "primary" : "outline"}
              size="sm"
              onClick={() => setWmType("image")}
            >
              Image
            </Button>
          </div>
        </div>

        {wmType === "text" ? (
          <TextControls text={text} setText={setText} />
        ) : (
          <ImageControls
            settings={imgWm}
            setSettings={setImgWm}
            onUpload={handleWatermarkFile}
          />
        )}

        {/* Position */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.value}
                variant={preset === p.value ? "primary" : "outline"}
                size="sm"
                onClick={() => setPreset(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          {preset === "custom" && (
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Custom position &middot; pick a preset to snap back
            </p>
          )}
        </div>

        <Input
          id="wm-margin"
          type="range"
          label={`Safe Margin: ${margin}px`}
          min={0}
          max={Math.max(40, Math.round(origW * 0.15))}
          step={1}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          disabled={preset === "custom"}
        />

        {/* Tile */}
        <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <Input
            id="wm-tile"
            type="checkbox"
            label="Tile across image"
            checked={tile}
            onChange={(e) => setTile(e.target.checked)}
          />
          {tile && (
            <>
              <Input
                id="wm-tile-spacing"
                type="range"
                label={`Tile Spacing: ${tileSpacing}px`}
                min={60}
                max={Math.max(200, Math.round(origW / 2))}
                step={10}
                value={tileSpacing}
                onChange={(e) => setTileSpacing(Number(e.target.value))}
              />
              <Input
                id="wm-tile-rotation"
                type="range"
                label={`Tile Rotation: ${tileRotation}°`}
                min={-90}
                max={90}
                step={1}
                value={tileRotation}
                onChange={(e) => setTileRotation(Number(e.target.value))}
              />
            </>
          )}
        </div>

        {/* Output */}
        <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <Dropdown
            label="Output Format"
            options={[
              { label: "PNG (lossless)", value: "png" },
              { label: "JPG (smaller file)", value: "jpg" },
            ]}
            value={format}
            onChange={(v) => setFormat(v as OutputFormat)}
          />
          {format === "jpg" && (
            <Input
              id="wm-quality"
              type="range"
              label={`JPG Quality: ${quality}%`}
              min={50}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function TextControls({
  text,
  setText,
}: {
  text: TextSettings;
  setText: React.Dispatch<React.SetStateAction<TextSettings>>;
}) {
  return (
    <div className="space-y-3">
      <Input
        id="wm-text"
        label="Text"
        type="text"
        value={text.text}
        onChange={(e) => setText({ ...text, text: e.target.value })}
        placeholder="Your watermark text"
      />
      <Dropdown
        label="Font"
        options={FONT_FAMILIES}
        value={text.fontFamily}
        onChange={(v) => setText({ ...text, fontFamily: v })}
      />
      <Input
        id="wm-font-size"
        type="range"
        label={`Size: ${text.fontSize}px`}
        min={10}
        max={400}
        step={1}
        value={text.fontSize}
        onChange={(e) => setText({ ...text, fontSize: Number(e.target.value) })}
      />
      <div>
        <label
          htmlFor="wm-color"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="wm-color"
            type="color"
            value={text.color}
            onChange={(e) => setText({ ...text, color: e.target.value })}
            className="h-10 w-14 cursor-pointer rounded-md border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            value={text.color}
            onChange={(e) => setText({ ...text, color: e.target.value })}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>
      <Input
        id="wm-opacity"
        type="range"
        label={`Opacity: ${text.opacity}%`}
        min={0}
        max={100}
        step={1}
        value={text.opacity}
        onChange={(e) => setText({ ...text, opacity: Number(e.target.value) })}
      />
      <Input
        id="wm-rotation"
        type="range"
        label={`Rotation: ${text.rotation}°`}
        min={0}
        max={360}
        step={1}
        value={text.rotation}
        onChange={(e) => setText({ ...text, rotation: Number(e.target.value) })}
      />
      <div className="flex gap-4">
        <Input
          id="wm-bold"
          type="checkbox"
          label="Bold"
          checked={text.bold}
          onChange={(e) => setText({ ...text, bold: e.target.checked })}
        />
        <Input
          id="wm-italic"
          type="checkbox"
          label="Italic"
          checked={text.italic}
          onChange={(e) => setText({ ...text, italic: e.target.checked })}
        />
      </div>
    </div>
  );
}

function ImageControls({
  settings,
  setSettings,
  onUpload,
}: {
  settings: ImageWmSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageWmSettings>>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        id="wm-logo-upload"
        type="file"
        label="Watermark Image (Logo)"
        accept="image/png,image/jpeg,image/webp"
        onChange={onUpload}
      />
      {!settings.src && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          PNG with transparency works best for logos.
        </p>
      )}
      <Input
        id="wm-img-scale"
        type="range"
        label={`Scale: ${settings.scale}%`}
        min={2}
        max={100}
        step={1}
        value={settings.scale}
        onChange={(e) =>
          setSettings({ ...settings, scale: Number(e.target.value) })
        }
        disabled={!settings.src}
      />
      <Input
        id="wm-img-opacity"
        type="range"
        label={`Opacity: ${settings.opacity}%`}
        min={0}
        max={100}
        step={1}
        value={settings.opacity}
        onChange={(e) =>
          setSettings({ ...settings, opacity: Number(e.target.value) })
        }
        disabled={!settings.src}
      />
    </div>
  );
}
