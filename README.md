# Prototype Motion Lab

Tune Spring and Cubic Bézier motion inside a real interactive prototype—not in a disconnected easing playground.

![Priority Orbit with draggable Cubic Bézier handles](docs/images/priority-orbit-cubic-handles-desktop.png)

`prototype-motion-lab` is a Codex Skill for building an in-page motion control panel. It keeps settings independent for every real `component / target / effect`, preserves direct pointer tracking, and makes the selected motion easy to preview, slow down, inspect, persist, and export.

## Highlights

- Apple-style Spring controls with response in milliseconds, damping fraction, and initial velocity.
- Spring or Cubic Bézier per real motion effect—not one global easing value.
- Draggable Cubic control-point handles plus number inputs, sliders, and keyboard nudging.
- Four preview rates: `1x`, `0.75x`, `0.5x`, and `0.25x`, without changing saved or exported timing.
- Movable, collapsible, viewport-bounded tooling that stays out of the prototype's way.
- Persistence, reduced-motion handling, interruption/cancellation guidance, and scoped code export.
- Web, Motion for React, SwiftUI, and Jetpack Compose handoff patterns.

## Examples

### Priority Orbit

A planning surface used to verify independent `reflow` and `landing` profiles, direct curve manipulation, keyboard adjustment, persistence, and responsive panel behavior.

[Open the standalone Priority Orbit example](examples/priority-orbit-motion-lab.html)

![Priority Orbit Cubic editor at desktop width](docs/images/priority-orbit-cubic-handles-desktop.png)

![Priority Orbit Cubic editor at narrow width](docs/images/priority-orbit-cubic-handles-narrow.png)

### Drag Spring Variants

Three drag-and-drop directions—Lift List, Magnetic Board, and Elastic Shelf—share one motion lab while keeping each visible object and real effect layer independent.

[Open the standalone Drag Spring starter](assets/drag-spring-motion-lab.html)

![Lift List with a selected Spring landing layer](docs/images/drag-spring-effect-layers.png)

![Elastic Shelf with Cubic timing controls](docs/images/drag-spring-cubic-mode.jpg)

## Install

Clone or copy this repository as one folder named `prototype-motion-lab` inside your Codex skills directory:

- Windows: `%USERPROFILE%\.codex\skills\prototype-motion-lab`
- macOS or Linux: `~/.codex/skills/prototype-motion-lab`

The repository root is the Skill root, so `SKILL.md` should remain at the top level.

## Use

Invoke it directly:

```text
Use $prototype-motion-lab to add an animation tuning panel to this prototype.
```

Useful additions to the prompt include the target interaction, animated elements, real effect layers, desired export stacks, and whether the result is a standalone exploration or an existing product surface.

Read [SKILL.md](SKILL.md) for routing and [the motion lab contract](references/motion-lab-contract.md) for state, solver, panel, export, and verification requirements.

## Motion model

| Surface | Contract |
| --- | --- |
| Scope | One persistent profile per real `componentId / targetId / effectId`. |
| Spring | Apple-style response mapping with documented units; response is not total settling time. |
| Cubic | Invert Bézier X before evaluating Y; control handles and fields share one record. |
| Drag | Pointer-held content stays under the pointer; timing applies only to autonomous motion. |
| Slow play | Scales preview/simulation time only; saved physics and exported timing stay unchanged. |
| Export | Emits only the selected target/effect and discloses native solver differences. |

## Repository structure

```text
prototype-motion-lab/
├── SKILL.md
├── agents/openai.yaml
├── assets/drag-spring-motion-lab.html
├── examples/priority-orbit-motion-lab.html
├── references/motion-lab-contract.md
├── docs/
│   ├── PUBLISHING.md
│   └── images/
└── tests/validate-package.cjs
```

## Validate

The repository has no package dependency or build step. Run:

```bash
node tests/validate-package.cjs
```

The check validates the Skill entrypoint, metadata, README links, screenshots, inline JavaScript syntax, and the examples' no-network runtime boundary.

## Scope and limitations

The included HTML files are standalone prototypes and implementation references, not a production animation library. Framework exports map motion intent to native primitives and may not be frame-identical; compile and review them in the destination stack before production use.

## Publishing and license

See [the publishing checklist](docs/PUBLISHING.md) before making the repository public. No license is included yet; the repository owner should choose one before public release.
