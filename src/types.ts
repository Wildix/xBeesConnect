export interface ContactShape {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  officeNumber?: string;
  faxNumber?: string;
  homeNumber?: string;
  homeMobileNumber?: string;
  extension?: string;
  organization?: string;
}
export interface Message {
  type?: xBeesMessageType;
  payload?: unknown;
}

export type ResponseFromChannel = {
  type?: string;
  message?: string;
  errorMessage?: string;
  payload?: any;
};

export enum XBeesEventType {
  GET_SEARCH_RESULT = 'xBeesGetSearchResult',
  GET_CONTACTS_AUTO_SUGGEST = 'xBeesGetContactsAutoSuggest',
  ADD_CALL = 'xBeesAddCall',
  TERMINATE_CALL = 'xBeesTerminateCall',
  USE_THEME = 'xBeesUseTheme',
  PBX_TOKEN = 'xBeesPbxToken',
}

export enum XBeesResponseType {
  READY = 'xBeesReady',
  CONTEXT = 'xBeesContext',
  CURRENT_CONTACT = 'xBeesCurrentContact',
  THEME_MODE = 'xBeesThemeMode',
  THEME = 'xBeesTheme',
  START_CALL = 'xBeesStartCall',
  VIEW_PORT = 'xBeesViewPort',
  REBOOT = 'xBeesReboot',
  TO_CLIPBOARD = 'xBeesToClipboard',
  NOT_AUTHORIZED = 'xBeesNotAuthorized',
  AUTHORIZED = 'xBeesAuthorized',
  SEARCH_RESULT = 'xBeesSearchResult',
  CONTACTS_AUTOSUGGEST = 'xBeesContactsAutosuggest',
}

export type xBeesMessageType = XBeesResponseType | XBeesEventType;
type ThemeChangePayload = { mode: "light" | "dark", themeOptions?: { typography?: unknown, palette?: unknown } };
export type ThemeChangeListenerCallback = (payload: ThemeChangePayload | unknown) => void;
export type ListenerCallback = (payload: unknown) => void;

export interface IReactNativeWebView {
  postMessage: (payload: unknown, origin?: string, d?: unknown[]) => void;
}

export interface IListener {
  eventName: string;
  callback: ListenerCallback;
}

export interface IxBeesSend {
  sendAsync(data: any): Promise<ResponseFromChannel>;
}

export interface IxBeesConnect {
  /**
   * Sends to x-bees signal that iFrame is ready to be shown. iFrame should send it when the application starts and ready */
  ready: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves the version of xBeesConnect */
  version: () => string;
  /**
   * Retrieves an object to create a search response */
  getSearchResponseCreator: () => ISearchResponseCreator;
  /**
   * Retrieves an object to create a search response item */
  SearchResultItemBuilder: () => ISearchResultItemBuilder;
  /**
   * Retrieves current x-bees context data */
  getContext: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves current opened in x-bees contact data */
  getCurrentContact: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves current theme mode (light or dark) */
  getThemeMode: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves current theme with mode (light or dark) and theme options like typography settings and palette */
  getTheme: () => Promise<ResponseFromChannel>;
  /**
   * Sends request to x-bees to start a call with the number */
  startCall: (phoneNumber: string) => Promise<ResponseFromChannel>;
  /**
   * Sends request to x-bees to restart the iFrame, reload with actual params and token */
  reboot: () => Promise<ResponseFromChannel>;
  /**
   * Sends request to x-bees about current frame size change */
  setViewport: (payload: {height: number; width: number}) => Promise<ResponseFromChannel>;
  /**
   * Sends request to x-bees to put string to the users clipboard */
  toClipboard: (payload: string) => Promise<ResponseFromChannel>;
  // TODO remove this after multiiframe search will released
  /**
   * Sends a response to x-bees for search results
   * @deprecated
   * */
  getSearchResult: (payload: ContactShape[]) => Promise<ResponseFromChannel>;
  /**
   * Sends a response to x-bees for contacts autoSuggest */
  getContactsAutoSuggest: (payload: ContactShape[]) => Promise<ResponseFromChannel>;
  /**
   * pushes to x-bees message that user is authorized and no more actions required */
  isAuthorized: (payload: string) => Promise<ResponseFromChannel>;
  /**
   * pushes to x-bees message that user actions required */
  isNotAuthorized: (payload: string) => Promise<ResponseFromChannel>;
  /**
   * Starts listen for one of the events of the x-bees and handle with the provided callback */
  addEventListener: (eventName: string, callback: ListenerCallback) => void;
  /**
   * Stops listen for one of the events of the x-bees with this particular callback */
  removeEventListener: (eventName: string, callback: ListenerCallback) => void;
  /**
   * Starts listen for the events of changing theme and handle with the provided callback */
  onThemeChange: (callback: ThemeChangeListenerCallback) => void;
  /**
   * Starts listen for the events of changing pbx token and handle with the provided callback */
  onPbxTokenChange: (callback: ListenerCallback) => void;
  /**
   * Starts listen for the events of searching contacts and handle autosuggestion with the provided callback */
  onSearchContacts: (callback: ListenerCallback) => void;
  /**
   * Starts listen for the events of starting the call and handle with the provided callback */
  onCallStarted: (callback: ListenerCallback) => void;
  /**
   * Starts listen for the events of ending the call and handle with the provided callback */
  onCallEnded: (callback: ListenerCallback) => void;
  /**
   * Removes particular callback from handling events */
  off: (callback: ListenerCallback) => void;
}

export interface ISearchResponseCreator {
  /**
   * Sends response to x-bees
   */
  prepareResponse(contacts: ContactShape[]): void;

  /**
   * Sends response to x-bees
   */
  send(): void;

  /**
   * Sends response to x-bees
   *
   * @deprecated: use {@link SearchResponseCreator.send} instead
   * TODO remove this after multiiframe search will released
   */
  // deprecated TODO remove this after multiiframe search will released
  sendResponse(): void;
}

export interface ISearchResultItemBuilder {
  id(id: string): ISearchResultItemBuilder;
  name(name: string): ISearchResultItemBuilder;
  picture(picture: string): ISearchResultItemBuilder;
  extension(extension: string): ISearchResultItemBuilder;
  email(email: string): ISearchResultItemBuilder;
  phone(phone: string): ISearchResultItemBuilder;
  homeNumber(homeNumber: string): ISearchResultItemBuilder;
  mobileNumber(mobileNumber: string): ISearchResultItemBuilder;
  officeNumber(officeNumber: string): ISearchResultItemBuilder;
  faxNumber(faxNumber: string): ISearchResultItemBuilder;
  homeMobileNumber(homeMobileNumber: string): ISearchResultItemBuilder;
  organization(organization: string): ISearchResultItemBuilder;
  create(): ContactShape;
}
