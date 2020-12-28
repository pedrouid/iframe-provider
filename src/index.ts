import JsonRpcProvider from '@json-rpc-tools/provider';

import { IframeRpcConnection } from './rpc';
import { IframeOptions } from './types';

class IframeProvider extends JsonRpcProvider {
  constructor(opts: IframeOptions) {
    super(new IframeRpcConnection(opts));
  }

  get isIframeProvider(): boolean {
    return true;
  }

  public async enable(): Promise<any> {
    try {
      if (!this.connection.connected) {
        await this.connect();
      }
      this.events.emit('enable');
      return;
    } catch (err) {
      await this.disconnect();
      throw err;
    }
  }
}

export default IframeProvider;
