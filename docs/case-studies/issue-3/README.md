# Case Study: Issue #3 - Animation is broken

## Issue Overview

**Issue:** [#3](https://github.com/konard/rotating-yin-yang/issues/3)
**Title:** Animation is broken
**Status:** Fixed
**Labels:** bug

### Problem Statement

The rotating yin-yang animation does not match the specification from [issue #1](https://github.com/konard/rotating-yin-yang/issues/1). The animation should have speed measured in **degrees per frame**, but the implementation used **degrees per second**, resulting in dramatically slower rotation than intended.

### Original Specification (from Issue #1)

> Looped animation. Speed of rotation gradually increases from 0 degrees per frame at 0 seconds, 180 at 60 seconds of animation, 360 at 120 seconds. After it equals to 360 is the same as 0 degrees, so we can reset speed to 0 and loop forever.

Key requirements:

1. **Speed unit**: degrees per frame (not per second)
2. **Linear growth**: speed(t) = 3t degrees per frame
3. **Speed at t=0s**: 0 deg/frame
4. **Speed at t=30s**: 90 deg/frame ("very fast" rotation)
5. **Speed at t=60s**: 180 deg/frame
6. **Speed at t=120s**: 360 deg/frame (visually equivalent to 0, enabling seamless loop)
7. **Very fast rotation** in the 30-90 second range

## Root Cause Analysis

### The Bug

The original implementation used CSS `@keyframes` with `animation: rotate 120s linear infinite` and 120 keyframe steps approximating a quadratic angle curve `angle(t) = 1.5 * t^2`.

The CSS approach interpreted speed as **degrees per second**:

- At t=120s: speed = 360 deg/s = 1 rotation/s (clearly visible rotation)

But the specification requires **degrees per frame** (at ~60fps display rate):

- At t=120s: speed = 360 deg/frame = 21,600 deg/s = 60 rotations/s (appears stationary)

### Why CSS Cannot Express This

CSS keyframe animations use time-based interpolation. The browser interpolates linearly between keyframe values over wall-clock time. There is no concept of "per frame" in CSS animations — the browser decides when to render frames.

To achieve the required speeds at 60fps:

| Time (s) | Required Speed (deg/frame) | Equivalent (deg/s) | Equivalent (rot/s) |
| -------- | -------------------------- | ------------------ | ------------------ |
| 0        | 0                          | 0                  | 0                  |
| 30       | 90                         | 5,400              | 15                 |
| 60       | 180                        | 10,800             | 30                 |
| 90       | 270                        | 16,200             | 45                 |
| 120      | 360                        | 21,600             | 60                 |

These speeds are far beyond what CSS keyframes can reasonably represent. At 15+ rotations per second, the animation needs precise per-frame control that only JavaScript's `requestAnimationFrame` can provide.

### Key Insight: 360 deg/frame = Visual Stationarity

The specification states: "After it equals to 360 is the same as 0 degrees, so we can reset speed to 0 and loop forever."

At 360 degrees per frame, the symbol advances exactly one full rotation between consecutive display frames. Since each frame shows the symbol in the same orientation, it **appears stationary** — visually identical to 0 deg/frame. This is what enables seamless looping.

## Solution

### Approach

Replace the CSS `@keyframes` animation with a JavaScript `requestAnimationFrame` loop that implements true per-frame speed control.

### Implementation

```javascript
(function () {
  var CYCLE = 120;
  var container = document.querySelector('.yin-yang-container');
  var angle = 0;
  var start = null;

  function frame(ts) {
    if (start === null) start = ts;
    var t = ((ts - start) / 1000) % CYCLE;
    angle += 3 * t;
    container.style.transform = 'rotate(' + (angle % 360) + 'deg)';
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
```

### How It Works

1. Each `requestAnimationFrame` callback computes elapsed time `t` within the 120s cycle
2. Speed at time `t` is `3 * t` degrees per frame (linear growth)
3. The cumulative angle is incremented by the speed each frame
4. `angle % 360` keeps the rotation value bounded
5. When `t` wraps from ~120 back to 0 (via modulo), speed resets to 0

### Seamless Loop Mechanism

At t ≈ 120s, speed ≈ 360 deg/frame. Each frame advances the symbol by ~360°, so every frame looks identical — the symbol appears frozen. When the cycle resets to t = 0, speed becomes 0 deg/frame — also frozen. The transition from "spinning so fast it looks still" to "actually still" is invisible to the viewer.

## Changes Made

1. **index.html**: Removed CSS `@keyframes rotate` (120 keyframe steps) and `animation` property. Added JavaScript `requestAnimationFrame` animation loop with `speed(t) = 3t` deg/frame.
2. **tests/yin-yang.test.js**: Updated rotation animation tests to verify JS-based animation (checks for `requestAnimationFrame`, `3 * t`, `% 360`, `% CYCLE`).
3. **experiments/**: Added debug HTML files used during investigation.

## Verification

- All 28 tests pass
- ESLint, Prettier, and JSCPD checks pass
- Visual verification via Playwright confirms correct rendering and animation behavior
