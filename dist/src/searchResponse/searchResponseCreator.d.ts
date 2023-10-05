import { ContactShape, ISearchResponseCreator, IxBeesConnect } from '../types';
export declare class SearchResponseCreator implements ISearchResponseCreator {
    private connect;
    private contacts;
    private response;
    private hasNonValidContact;
    constructor(connect: IxBeesConnect);
    private createValidatedResponse;
    prepareResponse(contacts: ContactShape[]): this;
    sendResponse(): void;
    send(): void;
}
