import { ContactShape, ISearchResultItemBuilder } from '../types';
export declare class SearchResultItemBuilder implements ISearchResultItemBuilder {
    private item;
    private validate;
    id(id: string): this;
    name(name: string): this;
    email(email: string): this;
    phone(phone: string): this;
    extension(extension: string): this;
    picture(picture: string): this;
    mobileNumber(mobileNumber: string): this;
    officeNumber(officeNumber: string): this;
    faxNumber(faxNumber: string): this;
    homeNumber(homeNumber: string): this;
    homeMobileNumber(homeMobileNumber: string): this;
    organization(organization: string): this;
    create(): ContactShape;
}
