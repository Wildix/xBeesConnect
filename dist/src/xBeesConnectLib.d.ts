import { SearchResultItemBuilder } from './searchResponse/searchResultItembuilder';
import { ContactShape, ISearchResponseCreator, IxBeesConnect, ListenerCallback, ResponseFromChannel, ThemeChangeListenerCallback } from './types';
/**
 * xBeesConnectLib provides functionality of communication between xBees and integrated web applications via iFrame or ReactNative WebView
 *
 * integration runs creates na instance with new xBeesConnect(), and uses provided functions
 * */
export declare class xBeesConnectLib implements IxBeesConnect {
    private worker;
    private listeners;
    private useSubscription;
    private searchQuery;
    private readonly iframeId;
    private readonly variant;
    private readonly searchResponseCreator;
    constructor();
    private sendAsync;
    ready(): Promise<ResponseFromChannel>;
    version(): string;
    isDaemon(): boolean;
    showsUi(): boolean;
    getSearchResponseCreator(): ISearchResponseCreator;
    SearchResultItemBuilder(): SearchResultItemBuilder;
    getContext(): Promise<ResponseFromChannel>;
    getCurrentContact(): Promise<ResponseFromChannel>;
    getThemeMode(): Promise<ResponseFromChannel>;
    getTheme(): Promise<ResponseFromChannel>;
    startCall(phoneNumber: string): Promise<ResponseFromChannel>;
    reboot(): Promise<ResponseFromChannel>;
    setViewport(payload: {
        height: number;
        width: number;
    }): Promise<ResponseFromChannel>;
    toClipboard(payload: string): Promise<ResponseFromChannel>;
    isNotAuthorized(payload: string): Promise<ResponseFromChannel>;
    isAuthorized(payload: string): Promise<ResponseFromChannel>;
    getSearchResult(payload: ContactShape[]): Promise<ResponseFromChannel>;
    getContactsAutoSuggest(payload: ContactShape[]): Promise<ResponseFromChannel>;
    addEventListener(eventName: string, callback: ListenerCallback): void;
    removeEventListener(eventName: string | undefined, callback: ListenerCallback): void;
    private parseMessage;
    private onMessageMiddleware;
    private onMessage;
    off(callback: ListenerCallback): void;
    onCallEnded(callback: ListenerCallback): void;
    onCallStarted(callback: ListenerCallback): void;
    onPbxTokenChange(callback: ListenerCallback): void;
    onSearchContacts(callback: ListenerCallback): void;
    onThemeChange(callback: ThemeChangeListenerCallback): void;
}
