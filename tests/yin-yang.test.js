/**
 * Tests for the rotating yin-yang HTML page
 * Validates structure, SVG content, animation, and UI constraints
 * Works with Node.js, Bun, and Deno
 */

import { describe, it, expect } from 'test-anywhere';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(dir, '..', 'index.html'), 'utf-8');

describe('index.html structure', () => {
  it('should contain a valid HTML document', () => {
    expect(html.includes('<!doctype html>')).toBe(true);
    expect(html.includes('<html')).toBe(true);
    expect(html.includes('</html>')).toBe(true);
  });

  it('should have a viewport meta tag disabling user scaling', () => {
    expect(html.includes('user-scalable=no')).toBe(true);
    expect(html.includes('maximum-scale=1.0')).toBe(true);
  });

  it('should have the correct title', () => {
    expect(html.includes('<title>Rotating Yin Yang</title>')).toBe(true);
  });
});

describe('SVG yin-yang symbol', () => {
  it('should contain an SVG element', () => {
    expect(html.includes('<svg')).toBe(true);
    expect(html.includes('</svg>')).toBe(true);
  });

  it('should use black and white fills only', () => {
    expect(html.includes('fill="black"')).toBe(true);
    expect(html.includes('fill="white"')).toBe(true);
  });

  it('should have circle elements for mask, base, and dots', () => {
    const circleMatches = html.match(/<circle/g);
    expect(circleMatches !== null).toBe(true);
    // mask circle + base circle + white dot + black dot = 4
    expect(circleMatches.length).toBe(4);
  });

  it('should have a path element for the white half', () => {
    const pathMatches = html.match(/<path/g);
    expect(pathMatches !== null).toBe(true);
    expect(pathMatches.length).toBe(1);
  });

  it('should use a mask to clip the symbol to a circle boundary', () => {
    expect(html.includes('<mask')).toBe(true);
    expect(html.includes('mask="url(#circle-mask)"')).toBe(true);
  });

  it('should use large-arc arcs for lobe coverage in the white half path', () => {
    // The white path uses large-arc=1 (A ... 1,1 ... and A ... 1,0 ...) for lobe arcs
    expect(html.includes('A 0.5,0.5 0 1,1')).toBe(true);
    expect(html.includes('A 0.5,0.5 0 1,0')).toBe(true);
  });
});

describe('gray background', () => {
  it('should set exact middle-gray (#808080) background on body', () => {
    expect(html.includes('background: #808080')).toBe(true);
  });
});

describe('responsive sizing', () => {
  it('should use min(96vw, 96vh) for 2% padding', () => {
    expect(html.includes('min(96vw, 96vh)')).toBe(true);
  });

  it('should center content with flexbox', () => {
    expect(html.includes('justify-content: center')).toBe(true);
    expect(html.includes('align-items: center')).toBe(true);
  });
});

describe('rotation animation', () => {
  it('should use requestAnimationFrame for animation', () => {
    expect(html.includes('requestAnimationFrame')).toBe(true);
  });

  it('should have 120-second cycle duration', () => {
    expect(html.includes('120')).toBe(true);
  });

  it('should compute speed as 3 * t degrees per frame', () => {
    expect(html.includes('3 * t')).toBe(true);
  });

  it('should apply rotation via transform style', () => {
    expect(html.includes('rotate(')).toBe(true);
  });

  it('should use modulo 360 to keep angle bounded', () => {
    expect(html.includes('% 360')).toBe(true);
  });

  it('should use modulo cycle duration for looping', () => {
    expect(html.includes('% CYCLE')).toBe(true);
  });
});

describe('UI constraints', () => {
  it('should disable scrolling with overflow hidden', () => {
    expect(html.includes('overflow: hidden')).toBe(true);
  });

  it('should disable touch actions', () => {
    expect(html.includes('touch-action: none')).toBe(true);
  });

  it('should disable text selection', () => {
    expect(html.includes('user-select: none')).toBe(true);
  });

  it('should disable right-click context menu', () => {
    expect(html.includes('contextmenu')).toBe(true);
    expect(html.includes('preventDefault')).toBe(true);
  });
});
