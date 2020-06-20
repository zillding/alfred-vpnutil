# alfred-vpnutil

> [Alfred](https://www.alfredapp.com) workflow to list configured VPN profiles and connect to/disconnect from a selected one (support IKEv2 service)

## Install

```bash
npm install --global alfred-vpnutil
```

Requires [Node.js](https://nodejs.org/) 12+ and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/)

## Usage

In Alfred, type `vpn`, all configured VPN profiles will display in a list with their connection status.

Continue typing <kbd>Space</kbd>, and your query to filter the list.

Select an item and press <kbd>Enter</kbd> to connect/disconnect based on the current connection status.

## Related

- [alfred-npms](https://github.com/sindresorhus/alfred-npms)
- [alfy](https://github.com/sindresorhus/alfy)
- [vpnutil](https://github.com/Timac/VPNStatus)
