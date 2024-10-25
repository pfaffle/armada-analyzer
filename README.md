# Armada Analyzer

Analyzes the data from STFC combat logs to help you see how your crews and ships
are performing.

It's currently deployed on [Render](https://render.com/). You can see it at
[armada-analyzer.onrender.com][1]. Note that it may take a minute to load
initially, because I'm using Render's free tier so the instance gets spun down
from inactivity.

# Development

There are two components, a backend API service built in NodeJS/TypeScript, and
a frontend UI built in React/TypeScript. They use the same toolchain so first
install the dependencies listed below, and then see the corresponding
component's instructions on how to develop each one.

## Using VS Code

If you use VS Code, you can open the `armada-analyzer.code-workspace` file to
configure your workspace to work with both subprojects. If you have extensions
installed for ESLint and Prettier, they should automatically use the config
files in this repo. The workspace file will also create a run/debug
configuration for you to run the UI or service in the NodeJS debugger using
[tsx](https://tsx.is/) for TypeScript transpilation.

## Requirements

- A Node.js runtime of the version specified in `.nvmrc`
  - It's not technically required, but I strongly recommend using
    [fnm](https://github.com/Schniz/fnm).
- [pnpm](https://pnpm.io)

## Developing the Service

Change directories into the service subproject's root directory, then install
all dependencies.

```sh
$ cd packages/service
$ pnpm install
```

Build and run the service.

```sh
$ pnpm dev
```

Note that currently there is no hot-reloading in the service code, but `dev`
will both build and run the program.

## Developing the UI

Change directories into the UI subproject's root directory, then install all
dependencies.

```sh
$ cd packages/ui
$ pnpm install
```

Build and run the UI.

```sh
$ pnpm dev
```

## Linting

This project is configured to use [ESLint](https://eslint.org/) for code
linting. You can run it either at the project root to lint everything, or in a
subproject to lint that subproject only.

```sh
$ pnpm lint
```

## Testing

Testing in the API service uses [Jest](https://jestjs.io). Testing in the UI is
not implemented yet.

To run the tests, simply run:

```sh
$ pnpm test
```

## Code Formatting

The code (and much of the configuration) is formatted using
[Prettier](https://prettier.io) with mostly-default settings.

# Deployment

Both the service and the UI are deployed to Render. The deployment configuration
is defined in `render.yaml`.

Documentation on how to use this file can be found here:

https://docs.render.com/blueprint-spec

[1]: https://armada-analyzer.onrender.com
