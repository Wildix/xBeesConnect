export class SearchResponseCreator {
    constructor(connect) {
        this.contacts = [];
        this.response = [];
        this.hasNonValidContact = false;
        this.connect = connect;
    }
    createValidatedResponse() {
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
    prepareResponse(contacts) {
        this.contacts = contacts;
        this.createValidatedResponse();
        return this;
    }
    sendResponse() {
        this.connect.getSearchResult(this.response);
    }
    send() {
        this.connect.getContactsAutoSuggest(this.response);
    }
}
