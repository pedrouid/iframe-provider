# iframe-provider [![npm version](https://badge.fury.io/js/iframe-provider.svg)](https://badge.fury.io/js/iframe-provider)

Iframe JSON-RPC Provider

## Example

```javascript
import IframeProvider from 'iframe-provider';

const provider = new IframeProvider({
  id: 'iframe-provider-id',
  src: 'http://locahost:8080',
});

await provider.enable();
```
