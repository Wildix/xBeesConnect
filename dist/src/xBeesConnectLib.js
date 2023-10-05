import isString from 'lodash/isString';
import { SearchResponseCreator } from './searchResponse/searchResponseCreator';
import { SearchResultItemBuilder } from './searchResponse/searchResultItembuilder';
import { XBeesResponseType, } from './types';
import { xBeesConnectNative } from './xBeesConnectNative';
import { xBeesConnectWeb } from './xBeesConnectWeb';
import packageJson from '../package.json';
/**
 * xBeesConnectLib provides functionality of communication between xBees and integrated web applications via iFrame or ReactNative WebView
 *
 * integration runs creates na instance with new xBeesConnect(), and uses provided functions
 * */
export class xBeesConnectLib {
    constructor() {
        this.listeners = [];
        this.useSubscription = false;
        this.searchQuery = null;
        this.iframeId = null;
        this.variant = null;
        const params = new URLSearchParams(window.location.search);
        this.iframeId = params.get('iframeId');
        this.variant = params.get('variant');
        // @ts-expect-error window.ReactNativeWebView will be provided by ReactNative WebView
        this.worker = window.ReactNativeWebView ? new xBeesConnectNative() : new xBeesConnectWeb();
        this.searchResponseCreator = new SearchResponseCreator(this);
    }
    async sendAsync(data) {
        return this.worker.sendAsync({
            ...data,
            iframeId: this.iframeId,
        });
    }
    async ready() {
        return this.sendAsync({ type: XBeesResponseType.READY, payload: { version: this.version() } });
    }
    version() {
        return packageJson.version;
    }
    isDaemon() {
        return this.variant === 'daemon';
    }
    showsUi() {
        return !this.isDaemon();
    }
    getSearchResponseCreator() {
        return this.searchResponseCreator;
    }
    SearchResultItemBuilder() {
        return new SearchResultItemBuilder();
    }
    async getContext() {
        return this.sendAsync({ type: XBeesResponseType.CONTEXT });
    }
    async getCurrentContact() {
        return this.sendAsync({ type: XBeesResponseType.CURRENT_CONTACT });
    }
    async getThemeMode() {
        return this.sendAsync({ type: XBeesResponseType.THEME_MODE });
    }
    async getTheme() {
        return this.sendAsync({ type: XBeesResponseType.THEME });
    }
    async startCall(phoneNumber) {
        return this.sendAsync({ type: XBeesResponseType.START_CALL, payload: { phoneNumber } });
    }
    async reboot() {
        return this.sendAsync({ type: XBeesResponseType.REBOOT });
    }
    async setViewport(payload) {
        return this.sendAsync({ type: XBeesResponseType.VIEW_PORT, payload });
    }
    async toClipboard(payload) {
        return this.sendAsync({ type: XBeesResponseType.TO_CLIPBOARD, payload });
    }
    async isNotAuthorized(payload) {
        return this.sendAsync({ type: XBeesResponseType.NOT_AUTHORIZED, payload });
    }
    async isAuthorized(payload) {
        return this.sendAsync({ type: XBeesResponseType.AUTHORIZED, payload });
    }
    // TODO remove this after multiiframe search will released
    async getSearchResult(payload) {
        return this.sendAsync({
            type: XBeesResponseType.SEARCH_RESULT,
            payload: payload,
        });
    }
    async getContactsAutoSuggest(payload) {
        return this.sendAsync({
            type: XBeesResponseType.CONTACTS_AUTOSUGGEST,
            payload: {
                query: this.searchQuery,
                contacts: payload,
            },
        });
    }
    addEventListener(eventName, callback) {
        // TODO here we can restrict some events to only supported, but currently it is not useful
        // if (!supportedEventTypes.includes(eventName)) {
        //   console.warn(`type ${eventName} not support`);
        //   return;
        // }
        if (!this.useSubscription) {
            this.useSubscription = true;
            window.addEventListener('message', this.onMessage.bind(this));
        }
        const foundThisEvent = this.listeners.find(({ eventName: _eventName, callback: _callback }) => eventName === _eventName && Object.is(callback, _callback));
        if (!foundThisEvent) {
            this.listeners.push({ eventName, callback });
        }
    }
    removeEventListener(eventName, callback) {
        this.listeners = this.listeners.filter(({ eventName: _eventName, callback: _callback }) => !(Object.is(callback, _callback) && (!eventName ? true : eventName === _eventName)));
        if (this.useSubscription && !this.listeners.length) {
            this.useSubscription = false;
            window.removeEventListener('message', this.onMessage.bind(this));
        }
    }
    parseMessage(message) {
        try {
            const data = isString(message?.data) ? JSON.parse(message?.data) : message?.data;
            if (!data?.type) {
                return null;
            }
            return data;
        }
        catch (e) {
            return null;
        }
    }
    onMessageMiddleware(data) {
        const { type, payload } = data;
        switch (type) {
            case 'xBeesGetContactsAutoSuggest':
                if (isString(payload)) {
                    this.searchQuery = payload;
                }
                break;
            default:
                break;
        }
    }
    onMessage(message) {
        const data = this.parseMessage(message);
        if (!data) {
            return;
        }
        this.onMessageMiddleware(data);
        const { type, payload } = data;
        this.listeners.forEach(({ eventName, callback }) => {
            if (eventName === type) {
                callback(payload);
            }
        });
    }
    off(callback) {
        this.removeEventListener(undefined, callback);
    }
    onCallEnded(callback) {
        this.addEventListener("xBeesTerminateCall", callback);
    }
    onCallStarted(callback) {
        this.addEventListener("xBeesAddCall", callback);
    }
    onPbxTokenChange(callback) {
        this.addEventListener("xBeesPbxToken", callback);
    }
    onSearchContacts(callback) {
        this.addEventListener("xBeesGetSearchResult", callback);
    }
    onThemeChange(callback) {
        this.addEventListener("xBeesUseTheme", callback);
    }
}
