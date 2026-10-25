# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static personal website of Philipp Rieber (https://philipp-rieber.net), a modernized rewrite of an old PHP/jQuery site. English only. Plain HTML, one hand-written CSS file and a small vanilla JS file. No build step, package manager, Tailwind, tests or linter.

The repo is **public**. Never put hosting details, credentials or infrastructure specifics into any committed file, including README, CLAUDE.md, commit messages and PR descriptions.

## Structure

`public/` is the entire website and the only thing ever published. Everything outside it (README, CLAUDE.md, `.github/`) stays out of production, so new site files must go into `public/`.

Preview locally with `python3 -m http.server -d public` (http://localhost:8000). Asset URLs are root-absolute (`/styles.css`, `/img/...`), so the site must be served from a domain root.

## Site conventions

- Design: warm paper background, Newsreader (serif, headings) and Hanken Grotesk (sans, body), both self-hosted variable fonts in `public/fonts/` (OFL). Colors and type live as CSS variables in `:root` of `styles.css`. Sections use a hanging heading column (`.row` / `.row__head` / `.row__body`); dated lists use `.timeline`.
- The portrait is blended into the page with `mix-blend-mode: multiply`; it relies on the photo's white background. In dark mode it sits on a light panel for that reason. Dark mode is automatic (`prefers-color-scheme`), with its own variable set at the top of `styles.css`.
- Book and magazine covers (`public/img/covers/`) are small (about 130 px wide); keep them displayed at a modest size.
- The site must stay mobile friendly: check every change at 390 px and 1280 px wide, in light and dark mode, and keep the page free of horizontal scrolling.
- `site.js` does three things only: decodes the obfuscated email (`a.mail` with `data-user`/`data-domain`, never write the address into the HTML), highlights the nav link of the section in view, and loads Google Analytics only after consent. Keep it dependency-free.
- Google Analytics must never load before the visitor allows it (consent notice in the page, choice in `localStorage`). Do not add any other third-party request, cookie or tracker.
- Old URLs must keep working: `/talks/*.pdf`, `/downloads/*.pdf` and `/imprint-and-privacy` (a folder with an `index.html`). Do not rename or remove these.
- Update `sitemap.xml` when adding or removing a page.
- The Impressum and privacy text in `public/imprint-and-privacy/` is legal content. Do not change its wording unless asked.

## Workflow and deployment

- `main` is protected: no direct pushes. Work on a branch, open a PR, and squash-merge it (the only enabled merge method).
- Merging to `main` deploys `public/` to production through `.github/workflows/deploy.yml`, mirroring it exactly (files removed from `public/` disappear from the live site).
- Deployment is gated by the repository variable `DEPLOY_ENABLED`: pushes to `main` only deploy while it is `true`, otherwise the deploy job is skipped. A manual dry run works either way. Never enable it or change this gate without being asked.
- The workflow appends an invisible `<!-- deploy <sha> -->` marker to `index.html` on the CI runner to verify the deploy. Never commit that marker.
- The workflow intentionally depends only on `public/` and `public/index.html`. Keep it free of references to specific pages or files, and if `public/` is ever renamed, change the workflow in the same PR.
- Actions in workflows are pinned to commit SHAs with a version comment. Pin any new action the same way.
