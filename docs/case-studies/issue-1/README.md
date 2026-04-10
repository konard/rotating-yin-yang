# Case Study: Rotating Yin-Yang SVG Animation

**Issue:** [#1](https://github.com/konard/rotating-yin-yang/issues/1)

## Problem Statement

Create a full-screen, looped SVG animation of a rotating Yin-Yang symbol hosted on GitHub Pages. The animation must work across all screen sizes and devices with specific rotation speed requirements and strict UI constraints.

## Requirements Analysis

### R1: SVG Yin-Yang Animation

- Render a classic Yin-Yang symbol using pure SVG
- Symbol must be exactly black and white
- Background must be gray

### R2: Full-Screen Responsive Layout

- Yin-Yang centered on screen
- Uses 100% of the smallest viewport dimension (height or width)
- 2% padding from screen edges
- Works on all screen sizes and all devices

### R3: Rotation Animation with Gradual Speed Increase

- Looped animation
- Speed increases from 0°/frame at t=0s to 180°/frame at t=60s to 360°/frame at t=120s
- At 360°/frame the symbol completes a full rotation per frame (equivalent to 0°), so speed resets to 0
- The cycle repeats forever

### R4: UI Constraints

- No scrolling allowed
- No zoom allowed on any device
- No right-click context menu
- No text selection (even if no text is present)

### R5: CI/CD GitHub Pages Deployment

- Automatically publish to GitHub Pages on push to default branch
- Use GitHub Actions workflow

## Solution Design

### SVG Yin-Yang Construction

The Yin-Yang symbol is constructed using SVG path elements:

1. **Outer circle**: Full circle split into two halves (black left, white right)
2. **S-curve**: Two semicircles creating the classic wave division
3. **Inner dots**: Small circles in contrasting colors within each half

### Animation Approach

CSS `@keyframes` with `animation` property for the rotation. The speed curve (0° → 360° over 120s, then reset) is achieved using a single CSS keyframe animation that maps the cumulative rotation angle over time:

- The rotation angle at time t follows the integral of speed: `angle(t) = (180/120²) × t²`
- At t=120s: angle = 180 × (120²/120²) = 180 × 120 / 2 = 10800° (= 30 full rotations)
- The animation then loops

### Responsive Sizing

Using CSS `min(96vh, 96vw)` (100% minus 2% padding on each side) to ensure the symbol fills the smallest dimension while maintaining the 2% edge padding.

### GitHub Pages Deployment

A dedicated GitHub Actions workflow (`pages.yml`) that deploys the `index.html` to GitHub Pages on push to main branch.

## Existing Solutions Research

### SVG Yin-Yang Implementations

- Pure SVG yin-yang can be constructed with arcs (`A` path command) and circles
- CSS animations provide smooth rotation with hardware acceleration
- `transform: rotate()` is the standard approach for rotation animations

### GitHub Pages Deployment

- `actions/upload-pages-artifact` + `actions/deploy-pages` is the recommended approach
- Requires `pages: write` and `id-token: write` permissions

## References

- [SVG Path specification](https://www.w3.org/TR/SVG2/paths.html)
- [CSS Animations specification](https://www.w3.org/TR/css-animations-1/)
- [GitHub Pages deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
