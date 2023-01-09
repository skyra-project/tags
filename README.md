<div align="center">

# @skyra/tags

**An advanced tags system for custom commands**

[![GitHub](https://img.shields.io/github/license/skyra-project/tags)](https://github.com/skyra-project/tags/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/skyra-project/audio/branch/main/graph/badge.svg?token=DH5G4MJQZM)](https://codecov.io/gh/skyra-project/audio)

[![npm](https://img.shields.io/npm/v/@skyra/tags?color=crimson&label=NPM&logo=npm&style=flat-square)](https://www.npmjs.com/package/@skyra/tags)
![npm bundle size minified (scoped)](https://img.shields.io/bundlephobia/min/@skyra/tags?label=minified&logo=webpack)
![npm bundle size minzipped (scoped)](https://img.shields.io/bundlephobia/minzip/@skyra/tags?label=minified&logo=webpack)

</div>

---

**Table of Contents**

-   [@skyra/tags](#skyratags)
    -   [Description](#description)
    -   [Features](#features)
    -   [Installation and Usage](#installation-and-usage)
        -   [Package managers](#package-managers)
            -   [Usage](#usage)
        -   [Browser build](#browser-build)
            -   [Usage](#usage-1)
    -   [API Documentation](#api-documentation)
    -   [Buy us some doughnuts](#buy-us-some-doughnuts)
    -   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

Advanced custom commmands system for [Skyra] discord bot.

## Features

-   Written in TypeScript.
-   @skyra/tags is an advanced tags system for custom commands supporting UTF-16 and a Lexer with `O(n)` time complexity.
-   Supports both NodeJS and Browsers by providing CommonJS, ES Module and UMD bundles.

## Installation and Usage

### Package managers

```bash
yarn add @skyra/tags
# or npm install @skyra/tags
```

#### Usage

```js
const { parse } = require('@skyra/tags');
```

```ts
import { parse } from '@skyra/tags';
```

### Browser build

If you want to use the browser build you can pull it directly via unpkg. Note that when using a Framework such as React, Vue or Angular we recommend you refer to [the package managers section.](#package-managers)

```html
<script src="https://unpkg.com/@skyra/tags"></script>
```

#### Usage

The UMD module is exported as `SkyraTags`:

```html
<script>
	SkyraTags.parse('Hello {{user}}!');
</script>
```

## API Documentation

For the full API documentation please refer to the TypeDoc generated [documentation](https://sapphire-project.github.io/framework).

## Buy us some doughnuts

Skyra Project is open source and always will be, even if we don't get donations. That said, we know there are amazing people who
may still want to donate just to show their appreciation. Thanks you very much in advance!

We accept donations through Patreon, BitCoin, Ethereum, and Litecoin. You can use the buttons below to donate through your method of choice.

| Donate With |         QR         |                                                                  Address                                                                  |
| :---------: | :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|   Patreon   | ![PatreonImage][]  |                                               [Click Here](https://donate.skyra.pw/patreon)                                               |
|   PayPal    |  ![PayPalImage][]  |                                               [Click Here](https://donate.skyra.pw/paypal)                                                |
|   BitCoin   | ![BitcoinImage][]  |         [3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco](bitcoin:3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco?amount=0.01&label=Skyra%20Discord%20Bot)          |
|  Ethereum   | ![EthereumImage][] | [0xcB5EDB76Bc9E389514F905D9680589004C00190c](ethereum:0xcB5EDB76Bc9E389514F905D9680589004C00190c?amount=0.01&label=Skyra%20Discord%20Bot) |
|  Litecoin   | ![LitecoinImage][] |         [MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM](litecoin:MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM?amount=0.01&label=Skyra%20Discord%20Bot)         |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/kyranet"><img src="https://avatars0.githubusercontent.com/u/24852502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aura Román</b></sub></a><br /><a href="https://github.com/skyra-project/tags/commits?author=kyranet" title="Code">💻</a> <a href="https://github.com/skyra-project/tags/commits?author=kyranet" title="Tests">⚠️</a> <a href="#ideas-kyranet" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-kyranet" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="#infra-Favna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/apps/depfu"><img src="https://avatars.githubusercontent.com/in/715?v=4?s=100" width="100px;" alt=""/><br /><sub><b>depfu[bot]</b></sub></a><br /><a href="#maintenance-depfu[bot]" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[.net]: https://github.com/dotnet
[discord c# community]: https://discord.gg/csharp
[patreonimage]: https://cdn.skyra.pw/gh-assets/patreon.png
[paypalimage]: https://cdn.skyra.pw/gh-assets/paypal.png
[bitcoinimage]: https://cdn.skyra.pw/gh-assets/bitcoin.png
[ethereumimage]: https://cdn.skyra.pw/gh-assets/ethereum.png
[litecoinimage]: https://cdn.skyra.pw/gh-assets/litecoin.png
[skyra]: https://github.com/skyra-project/skyra
