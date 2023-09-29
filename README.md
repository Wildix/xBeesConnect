# Integrations
## Add new integration
### Vite
```
yarn create vite <my-react-app> --template react-swc-ts
```

## Install
Setup xBeesConnect library from https://github.com/Wildix/xBeesConnect:

```
yarn add https://github.com/Wildix/xBeesConnect.git#v1.0.6
```

Use `xBeesConnect()` in your JS for communication with xBees
send requests to xBees:
```js
// send requests to xBees
xBeesConnect().getContext().then((response: ResponseFromChannel) => {
    // do smth with context data, for example fetch the data and show the view
})
```
listen to xBees events:
```js
// listen to xBees events
xBeesConnect().addEventListener('xBeesUseTheme', (theme: string) => {
    // change the view according to the theme
});
```
# API Guide
## Initialization
#### `ready()`

Sends to xBees signal that iFrame is ready to be shown. iFrame should send it when the application starts and is ready.

```js
// for example in React it's ok to send it when the root component is mounted
useEffect(() => {
    xBeesConnect().ready();
}, []);
```

#### `isAuthorized: (payload: string) => Promise<ResponseFromChannel>`
pushes to xBees message that user is authorized and no more actions required
#### `isNotAuthorized: (payload: string) => Promise<ResponseFromChannel>`
pushes to xBees message that user actions required
```js
const [user] = useUserContext();

useEffect(() => {
    const connect = connectProvider();
    const isAuthorized = !!user;
    
    if (isAuthorized) {
      void connect?.isAuthorized?.();
    } else {
      void connect?.isNotAuthorized?.()
    }
}, [user]);
```

## Contacts search
#### `getSearchResponseCreator: () => ISearchResponseCreator`
Retrieves an object to create a search response

#### `SearchResultItemBuilder: () => ISearchResultItemBuilder`
Retrieves an object to create a search response item

#### `getSearchResult: (payload: ContactShape[]) => Promise<ResponseFromChannel>`
Sends a response to xBees for search results
#### `onSearchContacts: (callback: ListenerCallback) => void;`
Starts listen for the events of searching contacts and handle autosuggestion with the provided callback
```js

xBeesConnect().onSearchContacts(async (query: string) => {
    await xBeesConnect().getSearchResponseCreator().prepareResponse(
        filteredContacts.map((record: any) => connect.SearchResultItemBuilder()
            .id(record.id)
            .name(record.name)
            .email(record.email)
            .phone(record.phone || record.home || record.mobile || record.office || record.home_mobile || record.fax)
            .extension(record.extension)
            .homeNumber(record.home)
            .mobileNumber(record.mobile)
            .officeNumber(record.office)
            .homeMobileNumber(record.home_mobile)
            .faxNumber(record.fax)
            .organization(record.organization)
            .create())
        ).sendResponse();
    } catch (e) {
        console.error(e)
    }
})
```

## Context
#### `getContext(): Promise<Response>`

Retrieves current xBees context data. Data may be different depending on context (TBD description of context variants)

```js
useEffect(() => {
    xBeesConnect().getContext().then((response) => {
    // do smth with context data, for example fetch the data and show the view
}), []);
```

#### `getCurrentContact(): Promise<Response>`

Retrieves currently opened in xBees contact data

```js
useEffect(() => {
    xBeesConnect().getCurrentContact().then((response) => {
    // do smth with contact data, for example fetch additional data and show the view
}), []);
```

#### `getThemeMode(): Promise<Response>`

Retrieves current theme mode (light or dark)

```js
xBeesConnect().getThemeMode().then((resp: any) => {
    changeTheme(resp.payload);
})
```

#### `getTheme(): Promise<Response>`

Retrieves current theme mode and theme options

```js
xBeesConnect().getTheme().then((resp: any) => {
    const {mode, themeOptions: {typography, palette}} = resp.payload;
    changeTheme(mode, typography, palette);
})
```

#### `onThemeChange: (callback: ThemeChangeListenerCallback) => void;`
Starts listen for the events of changing theme and handle with the provided callback
```js
xBeesConnect().onThemeChange((payload: any) => {
    const {mode, themeOptions: {typography, palette}} = payload;
    changeTheme(mode, typography, palette);
})
```

#### `onPbxTokenChange: (callback: ListenerCallback) => void;`
Starts listen for the events of changing pbx token and handle with the provided callback
```js
xBeesConnect().onPbxTokenChange((jwt: string) => {
    auth.setToken(jwt);
})
```

#### `onCallStarted: (callback: ListenerCallback) => void;`
Starts listen for the events of starting the call and handle with the provided callback
```js
xBeesConnect().onCallStarted(() => {
})
```
#### `onCallEnded: (callback: ListenerCallback) => void;`
Starts listen for the events of ending the call and handle with the provided callback
```js
xBeesConnect().onCallEnded(() => {
})
```
#### `off: (callback: ListenerCallback) => void;`
Removes particular callback from handling events
```js
const onThemeChangeCallback = (payload: any) => {
    const {mode, themeOptions: {typography, palette}} = payload;
    changeTheme(mode, typography, palette);
};

xBeesConnect().onThemeChange(onThemeChangeCallback); // add subscription listener
xBeesConnect().off(onThemeChangeCallback) // remove subscribed listener
```


## Others
#### `version(): string`

Retrieves the version of xBeesConnect

```js
const version = xBeesConnect().version();
console.log("Current xBeesConnect version: ", version);
```

#### `startCall(phoneNumber: string)`

Sends a request to xBees to start a call with the number

```js
useEffect(() => {
    xBeesConnect().startCall().then((response) => {
    // after call is started "response" message is 'call started'
}, []);
```

#### `reboot()`

Sends a request to xBees to restart the iFrame, reload with actual params and token
```js
try {
    fetchData().then((response) => {
        // update the view
    })
} catch (e) {
    if (isAuthorizationExpired) {
        xBeesConnect().reboot()
    }
}
```

#### `setViewport({height: number; width: number})`

Sends a request to xBees about the current frame size change

```js
useEffect(() => {
    const height = document.body.clientHeight;
    const width = document.documentElement.scrollWidth;
    
    xBeesConnect().setViewport({ height, width });
}, []);
```

#### `toClipboard(payload: string)`

Sends a request to xBees to put a string to the user's clipboard

```js
xBeesConnect().toClipboard(somestring);
```

#### `addEventListener()`

Starts listening for one of the events of the xBees and handles with the provided callback

```js
useEffect(() => {
    setViewport();
    const connect = xBeesConnect();
    
    connect.addEventListener("xBeesAddCall", processAddCall);
    connect.addEventListener("xBeesTerminateCall", processRemoveCall);
    
    return () => {
        connect.removeEventListener("xBeesUseCall", processAddCall);
        connect.removeEventListener("xBeesTerminateCall", processRemoveCall);
    }
}, []);
```

#### `removeEventListener()`

Stops listen for one of the events of the xBees with this particular callback

```js
useEffect(() => {
    setViewport();
    const connect = xBeesConnect();
    
    connect.addEventListener("xBeesAddCall", processAddCall);
    connect.addEventListener("xBeesTerminateCall", processRemoveCall);

    return () => {
        connect.removeEventListener("xBeesUseCall", processAddCall);
        connect.removeEventListener("xBeesTerminateCall", processRemoveCall);
    }
}, []);
```

### Response type

some requests retrieve a response from xBees with data or message

```ts
type Response = {
    type?: string;
    message?: string;
    errorMessage?: string;
    payload?: any;
};
```
### Known issues
Using this function fixes cases when `String.replaceAll()` does not work in the mobile version.
Most likely, this is some kind of WebView bug.
```ts
function replaceAll(str: string, search: string, replace: string) {
    return str.split(search).join(replace);
}
```
