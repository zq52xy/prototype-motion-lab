# Prototype Motion Lab

[English](README.md) | [简体中文](README.zh-CN.md)

Tune Spring and Cubic Bézier motion inside a real interactive prototype—not in a disconnected easing playground.

![Priority Orbit with draggable Cubic Bézier handles](docs/images/priority-orbit-cubic-handles-desktop.png)

`prototype-motion-lab` is a Codex Skill for building an in-page motion control panel. It keeps settings independent for every real `component / target / effect`, preserves direct pointer tracking, and makes the selected motion easy to preview, slow down, inspect, persist, and export.

## Why this exists

Prototype motion is often tuned outside the interface, buried in code, or reduced to one easing value shared by unrelated elements. That approach breaks down when list reflow, release landing, and target changes need different feedback. Pointer-held content must respond directly, while autonomous motion after release needs its own Spring or Cubic timing. This Skill puts the controls inside the prototype so motion can be judged in the layout, content, and interaction where people will actually experience it.

## Problems it solves

| Problem | What the motion lab changes |
| --- | --- |
| One global curve changes every component | Stores a separate profile for each real `componentId / targetId / effectId`. |
| Applying Spring while an item is held makes dragging lag behind the pointer | Keeps direct manipulation under the pointer and applies timing only to autonomous motion such as reflow or landing. |
| Abstract parameters are hard to judge at normal speed | Combines manual millisecond values, curve visualization, draggable Cubic handles, live preview, and four slow-play rates. |
| A fixed inspector covers the interface being evaluated | Makes the panel movable, collapsible, scrollable, and bounded to the viewport. |
| Switching objects or refreshing the page loses carefully tuned values | Persists independent Spring and Cubic profiles without collapsing them into global state. |
| Motion intent gets handed off as screenshots or vague numbers | Exports only the selected effect for Web, Motion for React, SwiftUI, or Jetpack Compose and states where native solvers may differ. |

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
├── README.md
├── README.zh-CN.md
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

See [the publishing checklist](docs/PUBLISHING.md) for release guidance. This repository is public, but no license is included yet; public visibility alone does not grant permission to reuse the code. The repository owner should choose a license before presenting it as open source.
