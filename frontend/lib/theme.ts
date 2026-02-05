/**
 * App background color. Used for screen containers, splash, gradients, and related UI.
 * Keep app.json splash screen and android adaptiveIcon backgroundColor in sync with this value.
 */
export const BACKGROUND_COLOR = "#d3e9f2";

/** RGB components of BACKGROUND_COLOR (126, 140, 145) for use in rgba(). */
export const BACKGROUND_RGB = { r: 126, g: 140, b: 145 } as const;

/** Returns BACKGROUND_COLOR as rgba string for gradients. */
export function backgroundRgba(alpha: number): string {
  return `rgba(${BACKGROUND_RGB.r},${BACKGROUND_RGB.g},${BACKGROUND_RGB.b},${alpha})`;
}
