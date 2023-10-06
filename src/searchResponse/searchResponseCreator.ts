import {ContactShape, ISearchResponseCreator, IxBeesConnect} from '../types';

export class SearchResponseCreator implements ISearchResponseCreator {
  private connect: IxBeesConnect;
  private contacts: ContactShape[] = [];
  private response: ContactShape[] = [];
  private query: string = '';
  private hasNonValidContact = false;

  constructor(connect: IxBeesConnect) {
    this.connect = connect;
  }

  private createValidatedResponse() {
    this.response = this.contacts.filter((contact) => {
      if (contact.name && contact.id && (contact.phone || contact.email)) {
        return true;
      }
      this.hasNonValidContact = true;
      return false;
    });
    if (this.hasNonValidContact) {
      console.error('There are contacts without email or phone number fields');
    }
  }

  prepareResponse(contacts: ContactShape[], query: string) {
    this.contacts = contacts;
    this.query = query;
    this.createValidatedResponse()
    return this;
  }

  sendResponse() {
    this.connect.getSearchResult(this.response);
  }

  send() {
    this.connect.getContactsAutoSuggest({
      contacts: this.response,
      query: this.query
    });
  }
}
