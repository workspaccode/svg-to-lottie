Build a web app called "SVG Animation Studio".

The user uploads or pastes an SVG. The app parses all named elements (rect, circle, path, text, g with id/data-name) and displays them in a sidebar list with a colored dot per element.

Clicking an element highlights it on the canvas (dashed blue outline) and selects it.

The right panel shows 8 animation presets as clickable cards:
- Fade in (opacity 0→1)
- Slide up (translateY + opacity)
- Pop in (scale bounce, cubic-bezier .34 1.56 .64 1)
- Shake (horizontal wiggle)
- Pulse (scale loop)
- Spin (360° rotation)
- Flip X (rotateY perspective)
- Rubber band (scaleX/scaleY elastic)

Below the presets, show 4 controls:
- Duration slider (0.1s – 3s)
- Delay slider (0s – 2s)
- Repeat selector (once / twice / 3× / loop)
- Easing selector (ease / ease-in-out / bounce / linear)

A "Run ▶" button injects a <style> tag targeting the selected element by its id/data attribute and fires the animation. A "Reset" button removes all injected styles and clears selection.

At the bottom, a "Export CSS" button copies the generated @keyframes + element selector CSS to clipboard.

Tech: plain HTML + CSS + vanilla JS, single file, no dependencies.
Design: flat, clean, sidebar layout 300px + canvas fills rest. Dark mode supported via CSS variables.