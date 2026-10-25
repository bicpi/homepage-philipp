# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static personal website of Philipp Rieber. Currently a placeholder page; real content follows. No build step, package manager, tests or linter unless this file says otherwise.

The repo is **public**. Never put hosting details, credentials or infrastructure specifics into any committed file, including README, CLAUDE.md, commit messages and PR descriptions.

## Structure

`public/` is the entire website and the only thing ever published. Everything outside it (README, CLAUDE.md, `.github/`) stays out of production, so new site files must go into `public/`.

Preview locally with `python3 -m http.server -d public` (http://localhost:8000).

## Workflow and deployment

- `main` is protected: no direct pushes. Work on a branch, open a PR, and squash-merge it (the only enabled merge method).
- Merging to `main` deploys `public/` to production through `.github/workflows/deploy.yml`, mirroring it exactly (files removed from `public/` disappear from the live site).
- Deployment is gated by the repository variable `DEPLOY_ENABLED`: pushes to `main` only deploy while it is `true`, otherwise the deploy job is skipped. A manual dry run works either way. Never enable it or change this gate without being asked.
- The workflow appends an invisible `<!-- deploy <sha> -->` marker to `index.html` on the CI runner to verify the deploy. Never commit that marker.
- The workflow intentionally depends only on `public/` and `public/index.html`. Keep it free of references to specific pages or files, and if `public/` is ever renamed, change the workflow in the same PR.
- Actions in workflows are pinned to commit SHAs with a version comment. Pin any new action the same way.
