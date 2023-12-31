import isString from 'lodash/isString';

import {SearchResponseCreator} from './searchResponse/searchResponseCreator';
import {SearchResultItemBuilder} from './searchResponse/searchResultItembuilder';
import {
  ContactShape,
  IAutoSuggestResult,
  IListener,
  ISearchResponseCreator,
  IxBeesConnect,
  ListenerCallback, Message,
  ResponseFromChannel, ThemeChangeListenerCallback, WorkVariants, XBeesEventType,
  XBeesResponseType,
} from './types';
import {xBeesConnectNative} from './xBeesConnectNative';
import {xBeesConnectWeb} from './xBeesConnectWeb';
import packageJson from '../package.json';

/**
 * xBeesConnectLib provides functionality of communication between xBees and integrated web applications via iFrame or ReactNative WebView
 *
 * integration runs creates na instance with new xBeesConnect(), and uses provided functions
 * */
export class xBeesConnectLib implements IxBeesConnect {
  private worker: xBeesConnectWeb | xBeesConnectNative;

  private listeners: IListener[] = [];
  private useSubscription = false;
  private readonly iframeId: string | null = null;
  private readonly variant: WorkVariants | null = null;
  private readonly searchResponseCreator: ISearchResponseCreator;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.iframeId = params.get('iframeId');
    this.variant = params.get('variant') as WorkVariants;
    // @ts-expect-error window.ReactNativeWebView will be provided by ReactNative WebView
    this.worker = window.ReactNativeWebView ? new xBeesConnectNative() : new xBeesConnectWeb();
    this.searchResponseCreator = new SearchResponseCreator(this);
  }

  private async sendAsync(data: any): Promise<ResponseFromChannel> {
    return this.worker.sendAsync({
      ...data,
      iframeId: this.iframeId,
    });
  }

  public async ready() {
    return this.sendAsync({type: XBeesResponseType.READY, payload: { version: this.version() }});
  }

  public version() {
    return packageJson.version;
  }

  public isDaemon() {
    return this.variant === 'daemon';
  }

  public showsUi() {
    return !this.isDaemon();
  }

  getSearchResponseCreator() {
    return this.searchResponseCreator;
  }

  SearchResultItemBuilder() {
    return new SearchResultItemBuilder();
  }

  public async getContext(): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.CONTEXT});
  }

  public async getCurrentContact(): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.CURRENT_CONTACT});
  }

  public async getThemeMode(): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.THEME_MODE});
  }

  public async getTheme(): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.THEME});
  }

  public async startCall(phoneNumber: string): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.START_CALL, payload: {phoneNumber}});
  }

  public async reboot(): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.REBOOT});
  }

  public async setViewport(payload: {height: number; width: number}): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.VIEW_PORT, payload});
  }

  public async toClipboard(payload: string): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.TO_CLIPBOARD, payload});
  }

  public async isNotAuthorized(payload: string): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.NOT_AUTHORIZED, payload});
  }

  public async isAuthorized(payload: string): Promise<ResponseFromChannel> {
    return this.sendAsync({type: XBeesResponseType.AUTHORIZED, payload});
  }

  // TODO remove this after multiiframe search will released
  public async getSearchResult(payload: ContactShape[]): Promise<ResponseFromChannel> {
    return this.sendAsync({
      type: XBeesResponseType.SEARCH_RESULT,
      payload: payload,
    });
  }

  public async getContactsAutoSuggest(payload: IAutoSuggestResult): Promise<ResponseFromChannel> {
    return this.sendAsync({
      type: XBeesResponseType.CONTACTS_AUTO_SUGGEST,
      payload: payload,
    });
  }

  public addEventListener(eventName: string, callback: ListenerCallback): void {
    // TODO here we can restrict some events to only supported, but currently it is not useful
    // if (!supportedEventTypes.includes(eventName)) {
    //   console.warn(`type ${eventName} not support`);
    //   return;
    // }

    if (!this.useSubscription) {
      this.useSubscription = true;
      window.addEventListener('message', this.onMessage.bind(this));
    }

    const foundThisEvent = this.listeners.find(
      ({eventName: _eventName, callback: _callback}) => eventName === _eventName && Object.is(callback, _callback),
    );

    if (!foundThisEvent) {
      this.listeners.push({eventName, callback});
    }
  }

  public removeEventListener(eventName: string | undefined, callback: ListenerCallback): void {
    this.listeners = this.listeners.filter(
      ({eventName: _eventName, callback: _callback}) => !(Object.is(callback, _callback) && (!eventName ? true : eventName === _eventName)),
    );

    if (this.useSubscription && !this.listeners.length) {
      this.useSubscription = false;
      window.removeEventListener('message', this.onMessage.bind(this));
    }
  }

  private parseMessage(message: any): Message | null {
    try {
      const data = isString(message?.data) ? JSON.parse(message?.data) : message?.data;
      if (!data?.type) {
        return null;
      }
      return data as Message;
    } catch (e) {
      return null;
    }
  }

  private onMessage(message: unknown) {
    const data = this.parseMessage(message);
    if (!data) {
      return;
    }

    const {type, payload} = data;

    this.listeners.forEach(({eventName, callback}) => {
      if (eventName === type) {
        callback(payload);
      }
    });
  }

  off(callback: ListenerCallback): void {
    this.removeEventListener(undefined, callback);
  }

  onCallEnded(callback: ListenerCallback): void {
    this.addEventListener(XBeesEventType.TERMINATE_CALL, callback);
  }

  onCallStarted(callback: ListenerCallback): void {
    this.addEventListener(XBeesEventType.ADD_CALL, callback);
  }

  onPbxTokenChange(callback: ListenerCallback): void {
    this.addEventListener(XBeesEventType.PBX_TOKEN, callback);
  }

  onSearchContacts(callback: ListenerCallback): void {
    this.addEventListener(XBeesEventType.GET_SEARCH_RESULT, callback);
  }

  onSuggestContacts(callback: ListenerCallback): void {
    this.addEventListener(XBeesEventType.GET_CONTACTS_AUTO_SUGGEST, callback);
  }

  onThemeChange(callback: ThemeChangeListenerCallback): void {
    this.addEventListener(XBeesEventType.USE_THEME, callback);
  }
}
