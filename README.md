# Armada Analyzer

Analyzes the data from STFC combat logs to help you see how your crews and ships
are performing.

It's currently deployed on [Render][1]. You can see it at
[armada-analyzer.onrender.com][2]. Note that it may take a minute to load
initially, because I'm using Render's free tier so the instance gets spun down
from inactivity.

## Development

There are two components, a backend API service built in NodeJS/TypeScript, and
a frontend UI built in React/TypeScript. They use the same toolchain so first
install the dependencies listed below, and then see the corresponding
component's instructions on how to develop each one.

### Requirements

- A Node.js runtime of the version specified in `.nvmrc`
  - It's not technically required, but I strongly recommend using
    [fnm](https://github.com/Schniz/fnm).
- [pnpm](https://pnpm.io)

This project makes use of Node.js's [corepack][5] functionality to simplify
managing the pnpm installation. You can take advantage of this by enabling
corepack:

```sh
corepack enable
```

From that point forward, any calls to pnpm should work transparently without any
extra setup.

### Pre-commit hooks

Git pre-commit hooks are enabled using [Husky][3] and [lint-staged][4]. They
should automatically be installed for you when you install your dependencies
using `pnpm install` The hook will run ESLint and Prettier on the files you
modified in your current changeset, and it will abort your commit if any lint
rules fail. Fix them before committing!

If you want to commit without fixing errors, you can bypass the hook by using
`git commit -n`. Be warned however that these same checks are run against pull
requests, so you will have to fix them before merging any changes.

### Using VS Code

If you use VS Code, you can open the `armada-analyzer.code-workspace` file to
configure your workspace to work with both subprojects. If you have extensions
installed for ESLint and Prettier, they should automatically use the config
files in this repo. The workspace file will also create a run/debug
configuration for you to run the UI or service in the NodeJS debugger using
[tsx](https://tsx.is/) for TypeScript transpilation.

### Developing the Service

Change directories into the service subproject's root directory, then install
all dependencies.

```sh
cd packages/service && pnpm install
```

Build and run the service.

```sh
pnpm dev
```

Note that currently there is no hot-reloading in the service code, but `dev`
will both build and run the program.

### Developing the UI

Change directories into the UI subproject's root directory, then install all
dependencies.

```sh
cd packages/ui && pnpm install
```

There are two ways to build and run the UI. One assumes you have an API running
that the UI can call.

```sh
pnpm dev
```

You can also use API mocks provided by [MSW](https://mswjs.io/) instead.

```sh
pnpm dev:noapi
```

### Linting

This project is configured to use [ESLint](https://eslint.org/) for code
linting. You can run it either at the project root to lint everything, or in a
subproject to lint that subproject only.

```sh
pnpm lint
```

### Testing

Testing in the API service uses [Jest][6]. Testing in the UI uses [Vitest][7]
and [React Testing Library][8].

To run the tests, simply run:

```sh
pnpm test
```

### Code Formatting

The code (and much of the configuration) is formatted using
[Prettier](https://prettier.io) with mostly-default settings.

If you want to manually run the formatter, use:

```sh
pnpm format
```

The precommit hook should automatically run it on any files you modified in your
changeset, however.

# Deployment

Both the service and the UI are deployed to [Render][1]. The deployment
configuration is defined in `render.yaml`.

Documentation on how to use this file can be found here:

https://docs.render.com/blueprint-spec

[1]: https://render.com/
[2]: https://armada-analyzer.onrender.com
[3]: https://typicode.github.io/husky/
[4]: https://github.com/lint-staged/lint-staged
[5]: https://nodejs.org/docs/latest-v22.x/api/corepack.html#corepack
[6]: https://jestjs.io
[7]: https://vitest.dev/
[8]: https://testing-library.com/docs/react-testing-library/intro
