# Integrations
## Add new integration
### Vite
```
yarn create vite <my-react-app> --template react-swc-ts
```

## Start
Import xBeesConnect library into iframe embeddable app:

```html
<head>
 <script src="https://app.x-bees.com/integrations/xBeesConnect.js"></script>
</head>
```
Use other environments adding subdomain dev,stage,XBS-0000 etc
```html
<head>
 <script src="https://stage.app.x-bees.com/integrations/xBeesConnect.js"></script>
</head>
```

Use `new xBeesConnect()` in your JS for communication with xBees
send requests to xBees:
```js
// send requests to xBees
new xBeesConnect().getContext().then((response: ResponseFromChannel) => {
    // do smth with context data, for example fetch the data and show the view
})
```
listen to xBees events:
```js
// listen to xBees events
new xBeesConnect().addEventListener('xBeesUseTheme', (theme: string) => {
    // change the view according to the theme
});
```
# API Guide
## Initialization
### `ready()`

Sends to xBees signal that iFrame is ready to be shown. iFrame should send it when the application starts and is ready.

```js
// for example in React it's ok to send it when the root component is mounted
useEffect(() => {
    new xBeesConnect().ready();
}, []);
```

### `isAuthorized: (payload: string) => Promise<ResponseFromChannel>`
pushes to xBees message that user is authorized and no more actions required
### `isNotAuthorized: (payload: string) => Promise<ResponseFromChannel>`
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
### `getSearchResponseCreator: () => ISearchResponseCreator`
Retrieves an object to create a search response

### `SearchResultItemBuilder: () => ISearchResultItemBuilder`
Retrieves an object to create a search response item

### `getSearchResult: (payload: ContactShape[]) => Promise<ResponseFromChannel>`
Sends a response to xBees for search results

## Context
### `getContext(): Promise<Response>`

Retrieves current xBees context data. Data may be different depending on context (TBD description of context variants)

```js
useEffect(() => {
    new xBeesConnect().getContext().then((response) => {
    // do smth with context data, for example fetch the data and show the view
}), []);
```

### `getCurrentContact(): Promise<Response>`

Retrieves currently opened in xBees contact data

```js
useEffect(() => {
    new xBeesConnect().getCurrentContact().then((response) => {
    // do smth with contact data, for example fetch additional data and show the view
}), []);
```

### `getThemeMode(): Promise<Response>`

Retrieves current theme mode (light or dark)

```js
new xBeesConnect().getThemeMode().then((resp: any) => {
    changeTheme(resp.payload);
})
```

## Others
### `version(): string`

Retrieves the version of xBeesConnect

```js
const version = new xBeesConnect().version();
console.log("Current xBeesConnect version: ", version);
```

### `startCall(phoneNumber: string)`

Sends a request to xBees to start a call with the number

```js
useEffect(() => {
    new xBeesConnect().startCall().then((response) => {
    // after call is started "response" message is 'call started'
}, []);
```

### `reboot()`

Sends a request to xBees to restart the iFrame, reload with actual params and token
```js
try {
    fetchData().then((response) => {
        // update the view
    })
} catch (e) {
    if (isAuthorizationExpired) {
        new xBeesConnect().reboot()
    }
}
```

### `setViewport({height: number; width: number})`

Sends a request to xBees about the current frame size change

```js
useEffect(() => {
    const height = document.body.clientHeight;
    const width = document.documentElement.scrollWidth;
    
    new xBeesConnect().setViewport({ height, width });
}, []);
```

### `toClipboard(payload: string)`

Sends a request to xBees to put a string to the user's clipboard

```js
new xBeesConnect().toClipboard(somestring);
```

### `addEventListener()`

Starts listening for one of the events of the xBees and handles with the provided callback

```js
useEffect(() => {
    setViewport();
    const connect = new xBeesConnect();
    
    connect.addEventListener("xBeesAddCall", processAddCall);
    connect.addEventListener("xBeesTerminateCall", processRemoveCall);
    
    return () => {
        connect.removeEventListener("xBeesUseCall", processAddCall);
        connect.removeEventListener("xBeesTerminateCall", processRemoveCall);
    }
}, []);
```

### `removeEventListener()`

Stops listen for one of the events of the xBees with this particular callback

```js
useEffect(() => {
    setViewport();
    const connect = new xBeesConnect();
    
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
