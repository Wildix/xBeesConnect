# Integrations
## Add a new integration
You can use the following template project to start developing your integration: https://github.com/Wildix/iframe-xbees-template-react

## Add xBeesConnect library
Install xBeesConnect library from this project. Use the latest version:
```
yarn add https://github.com/Wildix/xBeesConnect.git#vX.X.X
```
### xBeesConnect listeners
Use `xBeesConnect()` in your JS for communication with x-bees to send requests to x-bees:
```js
// send requests to x-bees
xBeesConnect().getContext().then((response: ResponseFromChannel) => {
    // do smth with context data, for example fetch the data and show the view
})
```
Listen to x-bees events:
```js
// listen to xBees events
xBeesConnect().addEventListener('xBeesUseTheme', (theme: string) => {
    // change the view according to the theme
});
```
# xBeesConnect API Guide
## Initialization
#### `ready()`

Sends the signal to x-bees that iFrame is ready to be shown. iFrame should send it when the application starts and is ready.

```js
// for example in React it's ok to send it when the root component is mounted
useEffect(() => {
    xBeesConnect().ready();
}, []);
```

#### `isAuthorized: (payload: string) => Promise<ResponseFromChannel>`
Sends the message to x-bees that the user is authorized and no more actions are required.

#### `isNotAuthorized: (payload: string) => Promise<ResponseFromChannel>`
Sends the message to x-bees that user actions are required:
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
Retrieves an object to create a search response.

#### `SearchResultItemBuilder: () => ISearchResultItemBuilder`
Retrieves an object to create a search response item.

#### `getSearchResult: (payload: ContactShape[]) => Promise<ResponseFromChannel>`
Sends a response to x-bees for search results.
#### `onSearchContacts: (callback: ListenerCallback) => void;`
Starts listening for the events of contacts search and handles auto-suggestion with the provided callback:
```js
xBeesConnect().onSuggestContacts(async (query: string) => {
    try {
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
        ).send();
    } catch (e) {
        console.error(e)
    }
})
```

## Context
#### `getContext(): Promise<Response>`

Retrieves current x-bees context data. The data may be different depending on context.

```js
useEffect(() => {
    xBeesConnect().getContext().then((response) => {
        // do smth with context data, for example fetch the data and show the view
    })
}, []);
```

#### `getCurrentContact(): Promise<Response>`

Retrieves contact data currently opened in x-bees.

```js
useEffect(() => {
    xBeesConnect().getCurrentContact().then((response) => {
        // do smth with contact data, for example fetch additional data and show the view
    })
}, []);
```

#### `getThemeMode(): Promise<Response>`

Retrieves current theme mode (light or dark):

```js
xBeesConnect().getThemeMode().then((resp: any) => {
    changeTheme(resp.payload);
})
```

#### `getTheme(): Promise<Response>`

Retrieves current theme mode and theme options:

```js
xBeesConnect().getTheme().then((resp: any) => {
    const {mode, themeOptions: {typography, palette}} = resp.payload;
    changeTheme(mode, typography, palette);
})
```

#### `onThemeChange: (callback: ThemeChangeListenerCallback) => void;`
Starts to listen for the events of changing theme and returns the provided callback:
```js
xBeesConnect().onThemeChange((payload: any) => {
    const {mode, themeOptions: {typography, palette}} = payload;
    changeTheme(mode, typography, palette);
})
```

#### `onPbxTokenChange: (callback: ListenerCallback) => void;`
Starts to listen for the events of changing PBX token and returns the provided callback:
```js
xBeesConnect().onPbxTokenChange((jwt: string) => {
    auth.setToken(jwt);
})
```

#### `onCallStarted: (callback: ListenerCallback) => void;`
Starts to listen for the events of starting the call and returns the provided callback:
```js
xBeesConnect().onCallStarted(() => {
    // do smth when call was started
})
```
#### `onCallEnded: (callback: ListenerCallback) => void;`
Starts to listen for the events of ending the call and returns the provided callback:
```js
xBeesConnect().onCallEnded(() => {
    // do smth when call was ended
})
```
#### `off: (callback: ListenerCallback) => void;`
Removes particular callback from handling events:
```js
const onThemeChangeCallback = (payload: any) => {
    const {mode, themeOptions: {typography, palette}} = payload;
    changeTheme(mode, typography, palette);
};

xBeesConnect().onThemeChange(onThemeChangeCallback); // subscribe a listener
xBeesConnect().off(onThemeChangeCallback) // remove the subscribed listener
```


## Other
#### `version(): string`

Retrieves the version of xBeesConnect:

```js
const version = xBeesConnect().version();
console.log("Current xBeesConnect version: ", version);
```

#### `startCall(phoneNumber: string)`

Sends a request to x-bees to start a call with a number:

```js
useEffect(() => {
    xBeesConnect().startCall().then((response) => {
        // after the call is started, the "response" message is 'call started'
    });
}, []);
```

#### `reboot()`

Sends a request to x-bees to restart the iFrame, reload with actual parameters and token:

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

Sends a request to x-bees about changes of the current frame size:

```js
useEffect(() => {
    const height = document.body.clientHeight;
    const width = document.documentElement.scrollWidth;

    xBeesConnect().setViewport({ height, width });
}, []);
```

#### `toClipboard(payload: string)`

Sends a request to x-bees to put a string to the user's clipboard:

```js
xBeesConnect().toClipboard(somestring);
```

#### `addEventListener()`

Starts listening for one of the x-bees events and returns the provided callback:

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

Stops listening for one of the x-bees events with the particular callback:

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

Some requests retrieve a response from x-bees with data or message:

```ts
type Response = {
    type?: string;
    message?: string;
    errorMessage?: string;
    payload?: any;
};
```
### Known issues
The below function can fix cases when `String.replaceAll()` does not work in the mobile version. Most likely, this is some kind of WebView bug.
```ts
function replaceAll(str: string, search: string, replace: string) {
    return str.split(search).join(replace);
}
```
