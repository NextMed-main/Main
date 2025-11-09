# NextMed

## Setup

### Install Dependencies

```bash
pnpm install
```

### Install Submodules

This project uses Git submodules. When setting up for the first time or reinstalling submodules, run the following command:

```bash
git submodule update --init --recursive
```

**Command Options:**

* `--init` - Initialize uninitialized submodules
* `--recursive` - Recursively process submodules within submodules

**Other Useful Commands:**

* Update a specific submodule: `git submodule update --init references/helixchain`
* Update to latest commit: `git submodule update --remote`
* Update all to latest: `git submodule update --remote --recursive`

## Start Development Server

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Start Production Server

```bash
pnpm start
```
