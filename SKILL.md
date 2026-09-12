---
name: prototype-motion-lab
description: Use when a frontend prototype needs an in-page motion tuning panel for Spring or Cubic animation, especially when multiple UI elements or effects need independent parameters, curves, slow playback, persistence, or code export.
---

# Prototype Motion Lab

Build a motion instrument, not a decorative settings card. Mirror the real motion graph: each `componentId / targetId / effectId` owns its profile, while direct manipulation remains under the pointer.

## When to use

Use for interactive prototypes, drag/drop explorations, Spring-versus-Cubic comparisons, or motion handoff. With `$prototype`, add the lab to its isolated harness without changing picker chrome or promoting production code.

Do not use for a production-only animation-library integration with no tuning UI, or for a static mockup that has no real motion.

## Workflow

1. Inspect the target's design system, stack, motion library, existing evaluation contract, and reduced-motion convention. Reuse its components and tokens; only use the starter's styling in an empty/static project.
2. Enumerate every animated target and its real effects before drawing controls. Read [references/motion-lab-contract.md](references/motion-lab-contract.md) for the registry, state boundaries, solver semantics, and verification gates.
3. Build selection in this order: component or variant → target element → actual effect layer. Canvas focus/press should select the corresponding target. Never invent a layer that no runtime path consumes.
4. Bind number inputs and sliders to the selected profile. For Cubic tuning, also provide two draggable control-point handles with keyboard nudging, backed by the same X1/Y1/X2/Y2 record. Keep this parametric editor distinct from the elapsed-time response plot. Provide curve and replay, four preview speeds, movable/collapsible behavior, persistence, and export only to the requested scope.
5. Route every real animation through the registry and capture its mode/profile when the animation starts. Keep pointer tracking immediate; playback speed changes only autonomous preview and settling motion.
6. Verify isolation, invalid input recovery, reload/migration, interruption/cancellation, reduced motion, pointer and keyboard paths, narrow layout, exports, and console cleanliness. Preserve failures and produce Evidence before claiming completion.

## Starting points

- Existing app: adapt its own architecture; do not paste the complete starter over the app.
- Standalone exploration: copy [assets/drag-spring-motion-lab.html](assets/drag-spring-motion-lab.html), rename storage keys, then replace its variants/registry with the requested UI.

## Quick reference

| Concern | Rule |
| --- | --- |
| Scope | Profiles belong to a real component, target, and effect—not global state. |
| Spring | Display response in `ms`; store a documented canonical unit. |
| Cubic | Invert Bézier X before evaluating Y; duration is nominal time. Draggable handles and keyboard nudges write the same point record as inputs. |
| Slow play | Preview-only; never alter saved physics or exported timing. |
| Drag | Pointer position is immediate; Spring/Cubic begins only for autonomous motion. |
| Export | Export the selected mode/effect and disclose solver differences. |

## Common mistakes

- One profile for a whole component: split by target and real effect.
- Preview settings that do not reach the actual motion call: treat that as a failed integration.
- Copying starter visuals into an established product: extend its design system instead.
- Claiming cross-stack equivalence from parameter mapping alone: verify current APIs and require native feel review.
