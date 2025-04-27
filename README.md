# NavetteJS

![navettejs logo](https://github.com/navettejs/navettejs/blob/alpha/packages/core/assets/small_logo_whitebg.png?raw=true)

**The Lightweight Frontend Event Bus**

![npm badge](https://img.shields.io/npm/v/%40navettejs%2Fcore)

NavetteJS provides a lightweight event bus system
for your frontends and microfrontends.

It has no dependencies and is easy to integrate
with tools like RxJS or React hooks.

Under the hood, NavetteJS uses HTML CustomEvents
for communication, enabling multiple versions
to coexist without conflict. It simplifies
communication between microfrontends
without requiring the same version to be deployed
across all of them.

## Packages

NavetteJS is composed of the following packages, 
please refer to their respective READMEs for more information:

- [@navettejs/core](packages/core) 
for the bare minimum required to use NavetteJS

All packages are published on NPM under the `@navettejs` 
scope with the same version. You must use the **matching 
versions of all @navettejs packages** you're using in your project.

*It might not be ideal to manage major versions 
of their related frameworks, but it's the best we 
can do for now.*
