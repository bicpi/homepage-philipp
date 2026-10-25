# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static, English-language personal website of Philipp Rieber (https://philipp-rieber.net), a rewrite of an old PHP/jQuery site. Plain HTML, one hand-written CSS file and one small vanilla JS file. No build step, package manager, Tailwind, tests or linter.

The repo is **public**. Never put hosting details, credentials or infrastructure specifics into any committed file, including README, CLAUDE.md, commit messages and PR descriptions.

## Structure

`public/` is the entire website and the only thing ever published. Everything outside it (README, CLAUDE.md, `.github/`) stays out of production, so new site files must go into `public/`.

Preview locally with `python3 -m http.server -d public` (http://localhost:8000). Asset URLs are root-absolute (`/styles.css`, `/img/...`), so the site must be served from a domain root.

## Site conventions

- Design: warm paper background, Newsreader (serif, headings) and Hanken Grotesk (sans, body), both self-hosted variable fonts in `public/fonts/` (OFL). Colors and type are CSS variables at the top of `styles.css`; dark mode is automatic via `prefers-color-scheme` with its own variable set.
- Layout vocabulary: sections use a hanging heading column (`.row`, `.row__head`, `.row__body`); dated lists use `.timeline`, and `.timeline--covers` puts a cover thumbnail (`public/img/covers/`) next to each entry. Covers are small scans (about 130 px wide), so keep them small.
- The portrait is a transparent cutout (`img/philipp-cutout.webp`); `img/philipp.jpg` is only the `<img>` fallback. The favicon is the serif "P." (`favicon.svg` plus PNG/ICO fallbacks) and doubles as the header badge. `img/og.jpg` is the social preview.
- Mobile first: check every change at 390 px and 1280 px, in light and dark mode, with no horizontal page scroll.
- `site.js` only: decodes the obfuscated email (`a.mail` with `data-user`/`data-domain`; never write the address into the HTML), fills the current year, highlights the nav link of the section in view, and loads Google Analytics after consent. Keep it dependency-free.
- Google Analytics must never load or set cookies before the visitor clicks Allow (consent notice in the page, choice in `localStorage`, Decline as prominent as Allow). Add no other third-party request, cookie or tracker.
- External links that stop working are turned into plain text, not removed from the content.
- URLs that must keep working: `/talks/*.pdf`, `/downloads/*.pdf`, `/imprint-and-privacy/`. URLs of the old site that were dropped on purpose may 404.
- Update `sitemap.xml` when adding or removing a page.
- The Impressum and privacy text in `public/imprint-and-privacy/` is legal content: change it only deliberately, keep it matching what the site really does, and tell the owner it needs their review (it is not legal advice).

## Workflow and deployment

- `main` is protected: no direct pushes. Work on a branch, open a PR, and squash-merge it (the only enabled merge method).
- Merging to `main` deploys `public/` through `.github/workflows/deploy.yml`, mirroring it exactly: files removed from `public/` disappear from the live site, and so does anything else in the target folder.
- Deployment is gated by the repository variable `DEPLOY_ENABLED`: pushes to `main` only deploy while it is `true`, otherwise the job is skipped; a manual dry run works either way. Never enable it or change the gate without being asked. Before the first real deploy, back up the remote folder and read a dry run started from `main`.
- The workflow appends an invisible `<!-- deploy <sha> -->` marker to `index.html` on the CI runner to verify the deploy. Never commit that marker.
- The workflow depends only on `public/` and `public/index.html`. Keep it free of references to specific pages or files, and if `public/` is renamed, change the workflow in the same PR.
- Actions are pinned to commit SHAs with a version comment; pin any new action the same way. Dependabot proposes updates.
