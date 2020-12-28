import EventEmitter from 'eventemitter3';
import { IJsonRpcConnection, JsonRpcPayload } from '@json-rpc-tools/utils';

import { renderElement } from './util';
import { IframeOptions } from './types';

export class IframeRpcConnection extends IJsonRpcConnection {
  public events: any = new EventEmitter();

  public iframe: HTMLIFrameElement | undefined;
  public opts: IframeOptions;

  constructor(opts: IframeOptions) {
    super();
    this.opts = opts;
    window.addEventListener('DOMContentLoaded', () => {
      this.render();
    });
  }

  get connected() {
    return (
      typeof this.iframe !== 'undefined' && this.iframe.contentWindow !== null
    );
  }

  public on(event: string, listener: any): void {
    this.events.on(event, listener);
  }

  public once(event: string, listener: any): void {
    this.events.once(event, listener);
  }

  public off(event: string, listener: any): void {
    this.events.off(event, listener);
  }

  public send(payload: JsonRpcPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof this.iframe === 'undefined') {
        throw new Error('iframe is not rendered!');
      }
      if (this.iframe.contentWindow === null) {
        throw new Error('iframe inner page not loaded!');
      }
      this.iframe.contentWindow.postMessage(
        JSON.stringify(payload),
        this.iframe.src
      );
    });
  }

  public render(): Promise<void> {
    return new Promise(resolve => {
      this.on('iframe-initialized', () => {
        this.events.emit('open');
        resolve();
      });
      this.iframe = renderElement(
        'iframe',
        {
          id: this.opts.id,
          src: this.opts.src,
          style: 'width:0;height:0;border:0; border:none;',
        },
        window.document.body
      ) as HTMLIFrameElement;
    });
  }

  public handleIncomingMessages(e: MessageEvent) {
    const iframeOrigin = new URL(this.opts.src).origin;
    if (e.origin === iframeOrigin) {
      if (typeof e.data !== 'string') {
        throw new Error(`Invalid incoming message data:${e.data}`);
      }
      if (e.data.startsWith('event:')) {
        const event = e.data.replace('event:', '');
        this.events.emit(event);
      } else {
        const payload = JSON.parse(e.data);
        this.events.emit(`'payload'`, payload);
      }
    }
  }

  public async open() {
    this.subscribe();
    await this.render();
  }

  public async close() {
    this.unsubscribe();
    this.events.emit('close');
  }

  public subscribe() {
    window.addEventListener('message', e => this.handleIncomingMessages(e));
  }

  public unsubscribe() {
    window.removeEventListener('message', e => this.handleIncomingMessages(e));
  }
}
