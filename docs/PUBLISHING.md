# Publishing checklist

This directory is prepared as a repository-root Codex Skill. Publication itself remains a repository-owner action.

## Suggested repository metadata

- Name: `prototype-motion-lab`
- Description: `A Codex Skill for per-effect Spring and Cubic Bézier tuning inside interactive prototypes.`
- Topics: `codex-skill`, `prototyping`, `motion-design`, `spring-animation`, `cubic-bezier`, `drag-and-drop`

## Before making it public

1. Run `node tests/validate-package.cjs` from the repository root.
2. Open both standalone HTML examples locally and check the panel at desktop and narrow widths.
3. Confirm the four screenshots still describe the shipped examples.
4. Choose and add a license. No license is included in this package.
5. Review author/credit wording and remove any material you do not have permission to publish.
6. Confirm that no local paths, tokens, credentials, generated browser profiles, or evaluation logs were added.

## Local Git preparation

```bash
git init
git add .
git commit -m "Initial release of Prototype Motion Lab"
```

Create the empty repository under the intended GitHub account, then follow the push commands GitHub displays for that repository. Do not commit build caches or local evaluation output.

## Suggested first release

- Tag: `v0.1.0`
- Title: `Prototype Motion Lab v0.1.0`
- Summary: `Initial Skill release with per-effect Spring/Cubic tuning, draggable Bézier handles, slow playback, persistence, responsive tooling, and two standalone examples.`

## Final GitHub review

- README images render on the repository page.
- `SKILL.md` remains at repository root.
- Both example links open their source on GitHub; optionally enable GitHub Pages for live demos.
- Repository visibility, license, issue settings, and release notes match the owner's intent.
