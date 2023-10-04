import {ContactShape, ISearchResponseCreator, IxBeesConnect} from '../types';

export class SearchResponseCreator implements ISearchResponseCreator {
  private connect: IxBeesConnect;
  private response: ContactShape[];

  constructor(connect: IxBeesConnect) {
    this.connect = connect;
    this.response = [];
  }

  prepareResponse(contacts: ContactShape[]) {
    this.response = contacts;
    return this;
  }

  // TODO remove this after multiiframe search will released
  sendResponse() {
    let hasNonValidContact = false;
    const filteredContacts = this.response.filter((contact) => {
      if (contact.name && contact.id && (contact.phone || contact.email)) {
        return true;
      }
      hasNonValidContact = true;
      return false;
    });
    if (hasNonValidContact) {
      console.error('There are contacts without email or phone number fields');
    }
    this.connect.getSearchResult(filteredContacts);
  }

  sendResponseV2() {
    let hasNonValidContact = false;
    const filteredContacts = this.response.filter((contact) => {
      if (contact.name && contact.id && (contact.phone || contact.email)) {
        return true;
      }
      hasNonValidContact = true;
      return false;
    });
    if (hasNonValidContact) {
      console.error('There are contacts without email or phone number fields');
    }
    this.connect.getContactsAutosuggest(filteredContacts);
  }
}
