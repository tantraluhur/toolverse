"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragMode =
  | "none"
  | "draw"
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "e"
  | "w";

const presets = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "9:16", ratio: 9 / 16 },
];

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState(1);

  // Drag state
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const dragStart = useRef({ mx: 0, my: 0, crop: { x: 0, y: 0, w: 0, h: 0 } });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOrigW(img.naturalWidth);
        setOrigH(img.naturalHeight);
        setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
        setAspectRatio(0);
      };
      img.src = src;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  }

  // Recalculate display scale on resize
  useEffect(() => {
    if (!imageSrc || !containerRef.current || origW === 0) return;
    function update() {
      if (containerRef.current) {
        setDisplayScale(containerRef.current.clientWidth / origW);
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [imageSrc, origW]);

  function handlePreset(ratio: number) {
    setAspectRatio(ratio);
    if (ratio === 0) return;
    let w = origW;
    let h = Math.round(w / ratio);
    if (h > origH) {
      h = origH;
      w = Math.round(h * ratio);
    }
    const x = Math.round((origW - w) / 2);
    const y = Math.round((origH - h) / 2);
    setCrop({ x, y, w, h });
  }

  function updateCrop(field: keyof CropArea, value: number) {
    setCrop((prev) => {
      const next = { ...prev, [field]: Math.max(0, value) };
      if (next.x + next.w > origW) next.w = origW - next.x;
      if (next.y + next.h > origH) next.h = origH - next.y;
      if (next.x < 0) next.x = 0;
      if (next.y < 0) next.y = 0;
      if (aspectRatio > 0) {
        if (field === "w") {
          next.h = Math.round(next.w / aspectRatio);
          if (next.y + next.h > origH) {
            next.h = origH - next.y;
            next.w = Math.round(next.h * aspectRatio);
          }
        } else if (field === "h") {
          next.w = Math.round(next.h * aspectRatio);
          if (next.x + next.w > origW) {
            next.w = origW - next.x;
            next.h = Math.round(next.w / aspectRatio);
          }
        }
      }
      return next;
    });
  }

  // --- Interactive crop drag logic ---

  function toImageCoords(clientX: number, clientY: number) {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      ix: Math.round((clientX - rect.left) / displayScale),
      iy: Math.round((clientY - rect.top) / displayScale),
    };
  }

  function clampCrop(c: CropArea): CropArea {
    const x = Math.max(0, Math.min(c.x, origW));
    const y = Math.max(0, Math.min(c.y, origH));
    const w = Math.max(1, Math.min(c.w, origW - x));
    const h = Math.max(1, Math.min(c.h, origH - y));
    return { x, y, w, h };
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { ix, iy } = toImageCoords(e.clientX, e.clientY);
    dragStart.current = { mx: ix, my: iy, crop: { ...crop } };

    // Determine drag mode based on where they clicked
    const s = crop;
    const threshold = 12 / displayScale;

    const onLeft = Math.abs(ix - s.x) < threshold && iy >= s.y - threshold && iy <= s.y + s.h + threshold;
    const onRight = Math.abs(ix - (s.x + s.w)) < threshold && iy >= s.y - threshold && iy <= s.y + s.h + threshold;
    const onTop = Math.abs(iy - s.y) < threshold && ix >= s.x - threshold && ix <= s.x + s.w + threshold;
    const onBottom = Math.abs(iy - (s.y + s.h)) < threshold && ix >= s.x - threshold && ix <= s.x + s.w + threshold;

    if (onTop && onLeft) setDragMode("nw");
    else if (onTop && onRight) setDragMode("ne");
    else if (onBottom && onLeft) setDragMode("sw");
    else if (onBottom && onRight) setDragMode("se");
    else if (onTop) setDragMode("n");
    else if (onBottom) setDragMode("s");
    else if (onLeft) setDragMode("w");
    else if (onRight) setDragMode("e");
    else if (ix > s.x && ix < s.x + s.w && iy > s.y && iy < s.y + s.h) {
      setDragMode("move");
    } else {
      // Draw new rectangle
      setDragMode("draw");
      setCrop({ x: ix, y: iy, w: 0, h: 0 });
      dragStart.current = { mx: ix, my: iy, crop: { x: ix, y: iy, w: 0, h: 0 } };
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragMode === "none") return;
    e.preventDefault();
    const { ix, iy } = toImageCoords(e.clientX, e.clientY);
    const { mx, my, crop: start } = dragStart.current;
    const dx = ix - mx;
    const dy = iy - my;

    let next: CropArea;

    switch (dragMode) {
      case "draw": {
        const x = Math.min(mx, ix);
        const y = Math.min(my, iy);
        let w = Math.abs(ix - mx);
        let h = Math.abs(iy - my);
        if (aspectRatio > 0) {
          h = Math.round(w / aspectRatio);
        }
        next = { x, y, w, h };
        break;
      }
      case "move":
        next = {
          x: start.x + dx,
          y: start.y + dy,
          w: start.w,
          h: start.h,
        };
        // Keep within bounds
        if (next.x < 0) next.x = 0;
        if (next.y < 0) next.y = 0;
        if (next.x + next.w > origW) next.x = origW - next.w;
        if (next.y + next.h > origH) next.y = origH - next.h;
        break;
      case "se":
        next = { x: start.x, y: start.y, w: start.w + dx, h: start.h + dy };
        if (aspectRatio > 0) next.h = Math.round(next.w / aspectRatio);
        break;
      case "sw":
        next = { x: start.x + dx, y: start.y, w: start.w - dx, h: start.h + dy };
        if (aspectRatio > 0) next.h = Math.round(next.w / aspectRatio);
        break;
      case "ne":
        next = { x: start.x, y: start.y + dy, w: start.w + dx, h: start.h - dy };
        if (aspectRatio > 0) next.h = Math.round(next.w / aspectRatio);
        break;
      case "nw":
        next = { x: start.x + dx, y: start.y + dy, w: start.w - dx, h: start.h - dy };
        if (aspectRatio > 0) next.h = Math.round(next.w / aspectRatio);
        break;
      case "n":
        next = { x: start.x, y: start.y + dy, w: start.w, h: start.h - dy };
        break;
      case "s":
        next = { x: start.x, y: start.y, w: start.w, h: start.h + dy };
        break;
      case "e":
        next = { x: start.x, y: start.y, w: start.w + dx, h: start.h };
        break;
      case "w":
        next = { x: start.x + dx, y: start.y, w: start.w - dx, h: start.h };
        break;
      default:
        return;
    }

    setCrop(clampCrop(next));
  }

  function handlePointerUp() {
    setDragMode("none");
  }

  // Cursor based on position
  function getCursor(e: React.PointerEvent): string {
    if (dragMode !== "none") {
      const map: Record<DragMode, string> = {
        none: "default", draw: "crosshair", move: "grabbing",
        nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize",
        n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
      };
      return map[dragMode];
    }
    const { ix, iy } = toImageCoords(e.clientX, e.clientY);
    const s = crop;
    const t = 12 / displayScale;
    const onL = Math.abs(ix - s.x) < t && iy >= s.y - t && iy <= s.y + s.h + t;
    const onR = Math.abs(ix - (s.x + s.w)) < t && iy >= s.y - t && iy <= s.y + s.h + t;
    const onT = Math.abs(iy - s.y) < t && ix >= s.x - t && ix <= s.x + s.w + t;
    const onB = Math.abs(iy - (s.y + s.h)) < t && ix >= s.x - t && ix <= s.x + s.w + t;
    if ((onT && onL) || (onB && onR)) return "nwse-resize";
    if ((onT && onR) || (onB && onL)) return "nesw-resize";
    if (onT || onB) return "ns-resize";
    if (onL || onR) return "ew-resize";
    if (ix > s.x && ix < s.x + s.w && iy > s.y && iy < s.y + s.h) return "grab";
    return "crosshair";
  }

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || crop.w <= 0 || crop.h <= 0) return;
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cropped-${crop.w}x${crop.h}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [crop]);

  function handleClear() {
    setImageSrc(null);
    setOrigW(0);
    setOrigH(0);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    imgRef.current = null;
  }

  // Display crop coordinates
  const dc = {
    x: crop.x * displayScale,
    y: crop.y * displayScale,
    w: crop.w * displayScale,
    h: crop.h * displayScale,
  };

  return (
    <div className="space-y-4">
      <Input id="crop-upload" type="file" label="Upload Image" accept="image/*" onChange={handleFile} />

      {imageSrc && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button key={p.label} variant={aspectRatio === p.ratio ? "primary" : "outline"} size="sm" onClick={() => handlePreset(p.ratio)}>
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["x", "y", "w", "h"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  {field === "x" ? "Left" : field === "y" ? "Top" : field === "w" ? "Width" : "Height"}
                </label>
                <input type="number" min={0} max={field === "x" || field === "w" ? origW : origH} value={crop[field]} onChange={(e) => updateCrop(field, Number(e.target.value))} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
            ))}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Original: {origW} x {origH} px &rarr; Crop: {crop.w} x {crop.h} px
            <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">Drag on the image to crop freely</span>
          </p>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleDownload}>Crop & Download</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>

          {/* Interactive crop area */}
          <div
            ref={containerRef}
            className="relative touch-none overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700"
            onPointerDown={handlePointerDown}
            onPointerMove={(e) => {
              handlePointerMove(e);
              if (dragMode === "none" && containerRef.current) {
                containerRef.current.style.cursor = getCursor(e);
              }
            }}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ cursor: dragMode !== "none" ? undefined : "crosshair" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Source" className="block w-full select-none" draggable={false} />

            {displayScale > 0 && crop.w > 0 && crop.h > 0 && (
              <>
                {/* Dark overlays */}
                <div className="absolute left-0 top-0 bg-black/50" style={{ width: "100%", height: dc.y }} />
                <div className="absolute bottom-0 left-0 bg-black/50" style={{ width: "100%", height: Math.max(0, containerRef.current ? containerRef.current.clientHeight - dc.y - dc.h : 0) }} />
                <div className="absolute left-0 bg-black/50" style={{ top: dc.y, width: dc.x, height: dc.h }} />
                <div className="absolute right-0 bg-black/50" style={{ top: dc.y, width: Math.max(0, containerRef.current ? containerRef.current.clientWidth - dc.x - dc.w : 0), height: dc.h }} />

                {/* Crop border */}
                <div className="absolute border-2 border-white" style={{ left: dc.x, top: dc.y, width: dc.w, height: dc.h }}>
                  {/* Grid lines (rule of thirds) */}
                  <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-white/30" />
                  <div className="absolute left-0 top-2/3 h-px w-full bg-white/30" />

                  {/* Corner handles */}
                  <Handle position="-left-1.5 -top-1.5" cursor="nwse-resize" />
                  <Handle position="-right-1.5 -top-1.5" cursor="nesw-resize" />
                  <Handle position="-left-1.5 -bottom-1.5" cursor="nesw-resize" />
                  <Handle position="-right-1.5 -bottom-1.5" cursor="nwse-resize" />

                  {/* Edge handles */}
                  <Handle position="left-1/2 -top-1 -translate-x-1/2" cursor="ns-resize" />
                  <Handle position="left-1/2 -bottom-1 -translate-x-1/2" cursor="ns-resize" />
                  <Handle position="-left-1 top-1/2 -translate-y-1/2" cursor="ew-resize" />
                  <Handle position="-right-1 top-1/2 -translate-y-1/2" cursor="ew-resize" />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function Handle({ position, cursor }: { position: string; cursor: string }) {
  return (
    <div
      className={`absolute h-3 w-3 rounded-full border-2 border-white bg-accent-purple shadow-sm ${position}`}
      style={{ cursor }}
    />
  );
}
