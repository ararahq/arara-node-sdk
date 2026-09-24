import { AxiosInstance } from 'axios';

export abstract class BaseResource {
    protected client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }
}
