# Motion Lab Contract

Use this contract to adapt the control surface to the requested prototype. The packaged HTML is a complete example, not a universal component library.

## 1. Recon and scope

Before implementation, identify:

- The project design system: tokens, panel, button, input, typography, focus and responsive patterns.
- The runtime stack and installed motion library/version. Consult current Context7 or official docs only when mapping framework APIs or version-sensitive syntax.
- The real interaction paths: pointer drag, keyboard alternative, entrance, reflow, landing, hover, expand/collapse, or other autonomous effects.
- Whether the user needs the full lab or a subset. Do not force export, persistence, or both modes into a smaller request.

For `$prototype`, keep the visual picker unchanged and render one variant at full size. Treat the motion lab as harness chrome shared by the active variant.

## 2. Registry is the source of truth

Model only effects that are actually called by the UI. A stable profile key is `componentId / targetId / effectId`.

```js
const motionRegistry = {
  lift: {
    label: 'Lift List',
    targets: {
      qa: {
        label: 'QA card',
        effects: {
          reflow: { label: 'List reflow', speed: 1.1 },
          landing: { label: 'Release landing', speed: 1 }
        }
      }
    }
  }
};

const profileKey = ({ componentId, targetId, effectId }) =>
  `${componentId}/${targetId}/${effectId}`;
```

Changing one key must not mutate any sibling target or effect. Component selection may follow the active prototype variant. Target selection should also follow canvas focus or press so the panel always names the visible element being tuned. Preserve the effect selection when the new target supports it; otherwise choose that target's first real effect.

## 3. State boundaries and schema migration

Keep these stores separate:

| State | Lifetime | Rule |
| --- | --- | --- |
| Spring profiles | Persistent | One normalized record per profile key. |
| Motion mode + Cubic profile | Persistent | Independent per profile key; switching modes retains both sets of values. |
| Schema version | Persistent | Use a namespaced key; validate, clamp, and migrate older global/component/target records forward. |
| Panel position/open state | Persistent or session | Never store inside motion profiles. Clamp position to the viewport after resize. |
| Playback rate | Session by default | Preview preference only; default `1x`. |
| Active selection | Session | Never use it as the lookup for an already-running animation. |

Capture `{ mode, settings }` at animation start. Retargeting cancels the previous request and begins from the current visual value; switching the panel selection must not redirect in-flight motion.

## 4. Parameter contract

Spring controls:

- Response: display and manually edit in `ms`; a canonical seconds value is acceptable internally. Clarify that response is not total settling duration.
- Damping fraction: dimensionless and positive.
- Initial velocity: document it as normalized progress units per second for a 0 → 1 animation.
- For unit mass, map Apple-style response with `ω = 2π / response`, `stiffness = ω²`, and `damping = 2 × dampingFraction × ω`. If an effect has a speed factor, divide response by speed before resolving physics.

Cubic controls:

- Duration in `ms`, plus manually editable X1/Y1/X2/Y2 and paired sliders.
- Constrain X to `[0,1]`; choose and document a practical Y range that can express overshoot.
- Given elapsed fraction, invert Bézier X to find parameter `t`, then evaluate Y. Do not use elapsed fraction directly as `t`.
- Draw two visible control-point handles and their guide lines in a normalized Bézier editor. Each handle must support pointer drag and keyboard arrow nudging; Shift+arrow may provide a documented coarse step. Pointer capture should keep the active handle controllable until release, and out-of-bounds movement must clamp to the same X/Y ranges as the inputs.
- Write both coordinates from a dragged handle to the selected profile as one update. The handles, number fields, sliders, presets, export and preview must immediately read that same normalized record; never keep separate visual-only handle state.

Number input, slider, active preset, curve, preview and the next real animation must update from the same normalized record. Invalid manual input restores the last valid value; do not persist `NaN` or partial state.

## 5. Playback, curve and direct manipulation

Expose preview rates `1x / 0.75x / 0.5x / 0.25x` with `aria-pressed`. Scale elapsed simulation time, not stored parameters. Switching rate mid-flight preserves current position and velocity. Exported duration, response and physics never include the preview rate.

The response curve plots normalized progress against elapsed time. Autoscale to show Cubic or Spring under/overshoot, draw the target line, label the selected target/effect, and state the sampled time range. Replay uses the selected profile. Keep a Cubic parametric control-space editor visually and semantically distinct from this elapsed-time plot: its horizontal coordinate is Bézier X and its vertical coordinate is Bézier Y, including the documented overshoot range.

Pointer tracking is immediate: the dragged visual stays under the pointer at every playback rate. Apply Spring/Cubic only to autonomous reflow, snap, return, landing, entrance, or other explicitly registered effects. Provide a keyboard drag/drop or equivalent accessible interaction and visible status feedback.

## 6. Panel behavior

Reuse the destination design system. The panel is movable and collapsible: the title is a pointer handle and keyboard-nudge target, the toggle exposes `aria-expanded`, the header always remains reachable, long content scrolls inside a viewport-bounded body, and resize/narrow layouts keep the panel on-screen. Panel movement must not change the selected profile or trigger canvas dragging.

## 7. Export contract

Export only the selected target/effect and selected mode. At minimum include a scope comment, units, effect speed, reduced-motion path, cancellation/retarget guidance, and what the helper omits. For a multi-stack handoff, support Web, React Motion, SwiftUI and Jetpack Compose when requested, but verify current APIs against the installed version or current official documentation.

- Web may reproduce the prototype solver exactly.
- Framework exports map intent/physics to native primitives and may not be frame-identical.
- Cubic export uses nominal duration and control points, never preview slowdown.
- Do not claim native equivalence without compiling/running in the destination stack and reviewing feel.

## 8. Verification matrix

Block completion on evidence for:

1. Every runtime effect resolves the intended profile key; no fake selector options exist.
2. Edit one target/effect, switch away/back, reload, and verify isolation plus persistence.
3. Spring and Cubic retain independent values; invalid inputs recover without corrupting storage. Both Cubic handles pass pointer capture, keyboard fine/coarse adjustment, boundary clamping, input synchronization and per-profile persistence checks.
4. Curve and preview match the selected mode; all four playback rates preserve the trajectory and export bytes.
5. Pointer stays aligned during drag; valid/invalid drop, cancellation, retargeting, and keyboard paths work.
6. Reduced motion completes immediately without abandoned transforms or callbacks.
7. Panel drag, keyboard nudge, collapse/expand, resize clamping, desktop and narrow layouts work with no console errors.
8. Copy/download content matches the visible export for every requested stack. Native compilation and subjective motion feel remain explicit human-review items when unavailable.
