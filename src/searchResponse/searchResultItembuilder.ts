import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import {ContactShape, ISearchResultItemBuilder} from '../types';

export class SearchResultItemBuilder implements ISearchResultItemBuilder {
  private item: ContactShape = {
    id: '',
    name: '',
  };

  private validate = () => {
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

  id(id: string) {
    this.item.id = id;
    return this;
  }

  name(name: string) {
    this.item.name = name;

    return this;
  }

  email(email: string) {
    this.item.email = email;
    return this;
  }

  phone(phone: string) {
    this.item.phone = phone;
    return this;
  }

  extension(extension: string) {
    this.item.extension = extension;
    return this;
  }

  picture(picture: string) {
    console.debug("picture setup is not supported yet")
    return this;
  }

  mobileNumber(mobileNumber: string) {
    this.item.mobileNumber = mobileNumber;
    return this;
  }

  officeNumber(officeNumber: string) {
    this.item.officeNumber = officeNumber;
    return this;
  }

  faxNumber(faxNumber: string) {
    this.item.faxNumber = faxNumber;
    return this;
  }

  homeNumber(homeNumber: string) {
    this.item.homeNumber = homeNumber;
    return this;
  }

  homeMobileNumber(homeMobileNumber: string) {
    this.item.homeMobileNumber = homeMobileNumber;
    return this;
  }

  organization(organization: string) {
    this.item.organization = organization;
    return this;
  }

  create() {
    this.validate();

    return this.item;
  }
}
