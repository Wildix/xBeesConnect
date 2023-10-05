import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
export class SearchResultItemBuilder {
    constructor() {
        this.item = {
            id: '',
            name: '',
        };
        this.validate = () => {
            let failedFields = '';
            if (!this.item.id || !isString(this.item.id)) {
                failedFields = !failedFields ? 'id' : failedFields + ', id';
            }
            if (!this.item.name || !isString(this.item.name)) {
                failedFields = !failedFields ? 'name' : failedFields + ', name';
            }
            if (!this.item.email && !this.item.phone) {
                failedFields = !failedFields ? 'email and phone' : failedFields + ', email and phone';
            }
            if (!isEmpty(failedFields)) {
                console.error(`Field ${failedFields} is empty or not a string`, this.item);
            }
        };
    }
    id(id) {
        this.item.id = id;
        return this;
    }
    name(name) {
        this.item.name = name;
        return this;
    }
    email(email) {
        this.item.email = email;
        return this;
    }
    phone(phone) {
        this.item.phone = phone;
        return this;
    }
    extension(extension) {
        this.item.extension = extension;
        return this;
    }
    picture(picture) {
        console.debug("picture setup is not supported yet", picture, "is ignored");
        return this;
    }
    mobileNumber(mobileNumber) {
        this.item.mobileNumber = mobileNumber;
        return this;
    }
    officeNumber(officeNumber) {
        this.item.officeNumber = officeNumber;
        return this;
    }
    faxNumber(faxNumber) {
        this.item.faxNumber = faxNumber;
        return this;
    }
    homeNumber(homeNumber) {
        this.item.homeNumber = homeNumber;
        return this;
    }
    homeMobileNumber(homeMobileNumber) {
        this.item.homeMobileNumber = homeMobileNumber;
        return this;
    }
    organization(organization) {
        this.item.organization = organization;
        return this;
    }
    create() {
        this.validate();
        return this.item;
    }
}
