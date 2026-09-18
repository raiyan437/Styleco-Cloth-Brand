# Styleco Git workflow

This file documents the Git workflow for cloning, updating, running, validating
and publishing the Styleco storefront.

Repository: <https://github.com/raiyan437/Styleco-Cloth-Brand>

The default branch is `main`. Keep it deployable, use short-lived feature
branches, and never force-push `main`.

## Requirements

- Git 2.40 or newer
- Node.js 24 LTS
- pnpm 11.19.0
- Google Chrome for Playwright browser tests

Enable the repository's pinned pnpm version with Corepack:

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
```

## Clone and run

```sh
git clone https://github.com/raiyan437/Styleco-Cloth-Brand.git
cd Styleco-Cloth-Brand
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:3000>. The storefront uses the mock catalog by default;
Appwrite, Docker and external services are not required.

To run a production build locally:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Stop either server with `Ctrl+C`.

## GitHub Pages demo

The `main` branch deploys automatically through `.github/workflows/deploy-pages.yml`.
The workflow builds a static export with the repository path baked into links and
assets, then publishes it to GitHub Pages. After the first successful workflow
run, open:

<https://raiyan437.github.io/Styleco-Cloth-Brand/>

To trigger a deployment without a code change, open the repository's Actions tab,
select **Deploy Styleco to GitHub Pages**, and choose **Run workflow**. The
repository Pages source must be set to **GitHub Actions**; the workflow has the
required Pages and OIDC permissions.

## Start work safely

From the repository root, inspect the checkout and remote:

```sh
git status --short --branch
git remote -v
git fetch --prune origin
```

When the tree is clean, update `main` with a fast-forward-only pull:

```sh
git switch main
git pull --ff-only origin main
```

Create a branch for each change:

```sh
git switch -c feat/short-description
```

Use lowercase prefixes such as `feat/`, `fix/`, `chore/`, `docs/` or
`refactor/`.

If work is uncommitted, commit it or stash it before pulling:

```sh
git stash push -u -m "work in progress"
git pull --ff-only origin main
git stash pop
```

## Validate before committing

Run these commands from the repository root:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
git diff --check
```

The browser suite uses Chrome and local port 3000. Generated builds, dependency
folders, logs, screenshots, traces, `.env.local` and credentials must not be
committed. The root `.gitignore` excludes the generated paths.

## Commit and push

Review the exact change before staging it:

```sh
git status --short
git diff
git diff --check
```

Stage only intended files and create a focused imperative commit:

```sh
git add path/to/file another/file
git diff --cached --check
git diff --cached
git commit -m "Fix category product grid density"
```

Publish a new branch and set its upstream:

```sh
git push --set-upstream origin feat/short-description
```

Later updates use `git push`. Open a pull request from the feature branch into
`main` and include the behavior changed, checks that passed, screenshots for
visual changes and known follow-ups.

## Keep a branch current

```sh
git fetch origin
git rebase origin/main
```

After resolving a conflict, run `git add resolved/file` and
`git rebase --continue`. Abort safely with `git rebase --abort`.

After a rebase, update a published feature branch with:

```sh
git push --force-with-lease
```

Never use `git push --force` on a shared branch.

## Safe recovery

Inspect history before undoing anything:

```sh
git log --oneline --decorate --graph -20
git reflog -20
```

Use `git restore --staged path/to/file` to unstage a file and
`git revert <commit>` to undo a published commit without rewriting history.
Use `git restore path/to/file` only when its uncommitted edits can be discarded.

Avoid `git reset --hard`, recursive deletion and branch deletion unless the
exact target and data loss are understood. Never use them against the whole
repository to solve an ordinary merge or update problem.

## Remote checks

```sh
git remote get-url origin
git branch --show-current
git ls-remote --heads origin
```

Expected `origin` URL:

```text
https://github.com/raiyan437/Styleco-Cloth-Brand.git
```

Use the configured GitHub credential manager or SSH setup if authentication is
requested. Never put access tokens in this file, shell history or the repository.
