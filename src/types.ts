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
  START_CALL = 'xBeesStartCall',
  VIEW_PORT = 'xBeesViewPort',
  REBOOT = 'xBeesReboot',
  TO_CLIPBOARD = 'xBeesToClipboard',
  NOT_AUTHORIZED = 'xBeesNotAuthorized',
  AUTHORIZED = 'xBeesAuthorized',
  SEARCH_RESULT = 'xBeesSearchResult',
}

export type xBeesMessageType = XBeesResponseType | XBeesEventType;
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
   * Sends to xBees signal that iFrame is ready to be shown. iFrame should send it when the application starts and ready */
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
   * Retrieves current xBees context data */
  getContext: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves current opened in xBees contact data */
  getCurrentContact: () => Promise<ResponseFromChannel>;
  /**
   * Retrieves current theme mode (light or dark) */
  getThemeMode: () => Promise<ResponseFromChannel>;
  /**
   * Sends request to xBees to start a call with the number */
  startCall: (phoneNumber: string) => Promise<ResponseFromChannel>;
  /**
   * Sends request to xBees to restart the iFrame, reload with actual params and token */
  reboot: () => Promise<ResponseFromChannel>;
  /**
   * Sends request to xBees about current frame size change */
  setViewport: (payload: {height: number; width: number}) => Promise<ResponseFromChannel>;
  /**
   * Sends request to xBees to put string to the users clipboard */
  toClipboard: (payload: string) => Promise<ResponseFromChannel>;
  /**
   * Sends a request to xBees for search results */
  getSearchResult: (payload: ContactShape[]) => Promise<ResponseFromChannel>;
  /**
   * pushes to xBees message that user is authorized and no more actions required */
  isAuthorized: (payload: string) => Promise<ResponseFromChannel>;
  /**
   * pushes to xBees message that user actions required */
  isNotAuthorized: (payload: string) => Promise<ResponseFromChannel>;
  /**
   * Starts listen for one of the events of the xBees and handle with the provided callback */
  addEventListener: (eventName: string, callback: ListenerCallback) => void;
  /**
   * Stops listen for one of the events of the xBees with this particular callback */
  removeEventListener: (eventName: string, callback: ListenerCallback) => void;
}

export interface ISearchResponseCreator {
  prepareResponse(contacts: ContactShape[]): void;
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