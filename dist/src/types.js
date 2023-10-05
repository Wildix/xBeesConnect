export var XBeesEventType;
(function (XBeesEventType) {
    XBeesEventType["GET_SEARCH_RESULT"] = "xBeesGetSearchResult";
    XBeesEventType["GET_CONTACTS_AUTO_SUGGEST"] = "xBeesGetContactsAutoSuggest";
    XBeesEventType["ADD_CALL"] = "xBeesAddCall";
    XBeesEventType["TERMINATE_CALL"] = "xBeesTerminateCall";
    XBeesEventType["USE_THEME"] = "xBeesUseTheme";
    XBeesEventType["PBX_TOKEN"] = "xBeesPbxToken";
})(XBeesEventType || (XBeesEventType = {}));
export var XBeesResponseType;
(function (XBeesResponseType) {
    XBeesResponseType["READY"] = "xBeesReady";
    XBeesResponseType["CONTEXT"] = "xBeesContext";
    XBeesResponseType["CURRENT_CONTACT"] = "xBeesCurrentContact";
    XBeesResponseType["THEME_MODE"] = "xBeesThemeMode";
    XBeesResponseType["THEME"] = "xBeesTheme";
    XBeesResponseType["START_CALL"] = "xBeesStartCall";
    XBeesResponseType["VIEW_PORT"] = "xBeesViewPort";
    XBeesResponseType["REBOOT"] = "xBeesReboot";
    XBeesResponseType["TO_CLIPBOARD"] = "xBeesToClipboard";
    XBeesResponseType["NOT_AUTHORIZED"] = "xBeesNotAuthorized";
    XBeesResponseType["AUTHORIZED"] = "xBeesAuthorized";
    XBeesResponseType["SEARCH_RESULT"] = "xBeesSearchResult";
    XBeesResponseType["CONTACTS_AUTOSUGGEST"] = "xBeesContactsAutosuggest";
})(XBeesResponseType || (XBeesResponseType = {}));
