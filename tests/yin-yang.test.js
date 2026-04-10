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

  it('should have both contrasting dots', () => {
    const circleMatches = html.match(/<circle/g);
    expect(circleMatches !== null).toBe(true);
    expect(circleMatches.length).toBe(2);
  });

  it('should have two path elements for the halves', () => {
    const pathMatches = html.match(/<path/g);
    expect(pathMatches !== null).toBe(true);
    expect(pathMatches.length).toBe(2);
  });
});

describe('gray background', () => {
  it('should set gray background on body', () => {
    expect(html.includes('background: gray')).toBe(true);
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
  it('should define a rotate keyframes animation', () => {
    expect(html.includes('@keyframes rotate')).toBe(true);
  });

  it('should have 120s animation duration', () => {
    expect(html.includes('animation: rotate 120s')).toBe(true);
  });

  it('should loop infinitely', () => {
    expect(html.includes('infinite')).toBe(true);
  });

  it('should start at 0deg', () => {
    expect(html.includes('rotate(0deg)')).toBe(true);
  });

  it('should end at 21600deg (60 full rotations)', () => {
    expect(html.includes('rotate(21600deg)')).toBe(true);
  });

  it('should have correct midpoint at 50% (5400deg)', () => {
    expect(html.includes('rotate(5400deg)')).toBe(true);
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
