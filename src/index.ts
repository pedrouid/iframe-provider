import BasicProvider from 'basic-provider';

import { IframeRpcConnection } from './rpc';
import { IframeOptions } from './types';

class IframeProvider extends BasicProvider {
  constructor(opts: IframeOptions) {
    super(new IframeRpcConnection(opts) as any);
  }

  get is3idProvider(): boolean {
    return true;
  }

  public async enable(): Promise<any> {
    try {
      if (!this.connected) {
        await this.open();
      }
      this.emit('enable');
      return;
    } catch (err) {
      await this.close();
      throw err;
    }
  }
}

export default IframeProvider;
