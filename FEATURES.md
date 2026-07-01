# SVG Animation Studio — Feature Reference

**File:** `editor-perview.html` (single HTML, zero dependencies)

---

## Layout

Three-zone responsive layout:

| Zone | Description |
|---|---|
| **Left sidebar** (300px) | SVG upload/paste, elements list, groups list |
| **Canvas** (flex) | SVG preview with click-to-select, hover highlight |
| **Right drawer** (400px, slide-in) | Tabbed panel: Presets / Settings / Elements |

The right panel slides in/out via a toggle button (◀) on the canvas edge, freeing full width for the editor when closed.

---

## SVG Input

- **Upload** — select an `.svg` file from disk
- **Paste** — modal dialog to paste raw SVG markup
- **Auto-naming** — unnamed elements get `<tag>-<n>` identifiers
- **Element detection** — parses all drawable tags: `rect`, `circle`, `ellipse`, `path`, `text`, `g`, `polygon`, `polyline`, `line`, `image`, `use`

---

## Element Selection

| Action | Behavior |
|---|---|
| Click | Select single element |
| Ctrl/Cmd + Click | Toggle element in/out of multi-selection |
| Click empty canvas | Clear selection |
| Canvas hover | Hover highlight on elements |
| Sidebar list click | Same as canvas click |
| **All** button | Select all elements |
| Esc key | Reset animation / close modals |

---

## Groups

- Select 2+ elements → click **Group** to create a named group
- Groups appear in the Groups list below the element list
- Click a group to select all its members
- Delete groups with the ✕ button
- Groups have auto-assigned colors

---

## Animation Presets — 60 presets

Organized into 3 categories, browsable via filter tabs (All / Entrance / Emphasis / Exit):

### Entrance (15)
Fade In, Fade In Up, Fade In Down, Fade In Left, Fade In Right, Fade + Scale, Slide In Up, Slide In Down, Slide In Left, Slide In Right, Zoom In, Zoom Out (Enter), Flip In X, Flip In Y, Bounce In

### Emphasis (25)
Pulse, Bounce, Shake, Head Shake, Swing, Tada, Wobble, Jello, Flash, Heart Beat, Rubber Band, Glow, Wave, Spin, Spin Half, Spin Slow, Pulse Quick, Vibrate, Vertical Bounce, Horiz Bounce, Roll, Rotate In, Swash In, Fade Out-In, Perspective

### Exit (20)
Fade Out, Fade Out Up, Fade Out Down, Fade Out Left, Fade Out Right, Fade Out Scale, Slide Out Up, Slide Out Down, Slide Out Left, Slide Out Right, Zoom Out (Exit), Zoom Out Big, Flip Out X, Flip Out Y, Bounce Out, Shrink, Collapse Vert, Collapse Horiz, Fall, Swash Out

Each preset stores numeric keyframe arrays (`{ opacity: [0, 1], y: [40, 0] }`) shared across CSS + Lottie generation.

---

## Per-Element Animation Assignment

Each element can have its own independent animation:

- **Assign** — select preset + settings → click "Assign to Element" → stored in `elementAnimations` map
- **Clear** — click ✕ on an element card in the Elements tab, or double-click an element in the sidebar
- **Sidebar badge** — assigned elements show a colored preset name badge next to their name (`.element-anim-badge`)
- **Multi-select assign** — assign one preset to multiple elements simultaneously
- **Stagger** — when 2+ elements are selected, a stagger slider appears for sequenced delays

### Elements Tab (drawer)
Shows every SVG element as an individual card with:
- Color dot + name + tag
- Assigned preset badge (or "—" if unassigned)
- Detailed settings: duration, delay, repeat, easing
- ✕ clear button per element

---

## Animation Settings

Per-session (applied when assigning):

| Setting | Range |
|---|---|
| Duration | 0.1s – 3.0s |
| Delay | 0.0s – 2.0s |
| Stagger (multi-select) | 0ms – 500ms |
| Repeat | Once / Twice / 3× / Loop |
| Easing | ease / ease-in-out / bounce / linear |

---

## Preview & Controls

- **Run Animation** — plays assigned animations on the canvas (Space key as shortcut)
- **Reset** — clears all animation states and selections (Esc key)

---

## Export

### CSS Export
- Generates `@keyframes` + per-element class CSS
- Supports all standard CSS animation properties
- Output shown in modal with syntax highlighting + copy to clipboard

### Lottie JSON Export
- Full Lottie `v5.5.2` JSON output
- SVG path parser converts all commands to Lottie bezier format:
  - `M`, `L`, `H`, `V`, `C`, `S`, `Q`, `T`, `Z` (absolute + relative)
  - `A` (arc) approximated via 16 line segments
- Per-element anchor points derived from `getBBox()` center
- Supports fill, stroke, stroke-width, opacity
- Uses per-element assigned animations (falls back to current selection)

---

## Theme

- Dark/Light toggle via header button
- CSS custom properties (`data-theme="dark|light"`)
- Ambient background gradient animation

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| Space | Run animation |
| Esc | Close modals / Reset animation |
| Ctrl/Cmd + A | Select all elements |

---

## File

- Single self-contained HTML file (~1905 lines)
- Google Fonts: Bricolage Grotesque, DM Sans, JetBrains Mono
- No build step, no dependencies — open in any modern browser
