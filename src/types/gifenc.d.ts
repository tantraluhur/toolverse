declare module "gifenc" {
  type RGBA = [number, number, number, number] | [number, number, number];

  interface FrameOptions {
    palette: RGBA[];
    delay?: number;
    transparent?: boolean;
    transparentIndex?: number;
    dispose?: number;
    repeat?: number;
    first?: boolean;
  }

  interface QuantizeOptions {
    format?: "rgb444" | "rgb565" | "rgba4444";
    oneBitAlpha?: boolean | number;
    clearAlpha?: boolean;
    clearAlphaThreshold?: number;
    clearAlphaColor?: number;
  }

  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array | number[],
      width: number,
      height: number,
      opts?: FrameOptions,
    ): void;
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    reset(): void;
  }

  export function GIFEncoder(opts?: {
    initialCapacity?: number;
    auto?: boolean;
  }): GIFEncoderInstance;

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    opts?: QuantizeOptions,
  ): RGBA[];

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: RGBA[],
    format?: "rgb444" | "rgb565" | "rgba4444",
  ): Uint8Array;
}
