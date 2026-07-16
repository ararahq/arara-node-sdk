import { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Escape hatch pra chamar qualquer endpoint da API que ainda não tem
 * recurso tipado no SDK (ex: campaigns, wallet, contacts).
 *
 * Herda auth, baseUrl, timeout, retry e Idempotency-Key do cliente configurado.
 * Retorna o corpo da resposta já desserializado.
 *
 * ```ts
 * await sdk.api.post('/v1/campaigns', { name: '...', templateName: '...' });
 * ```
 */
export class RawApi {
    private client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    async get<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(path, config);
        return response.data;
    }

    async post<T = unknown>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(path, body, config);
        return response.data;
    }

    async put<T = unknown>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(path, body, config);
        return response.data;
    }

    async patch<T = unknown>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(path, body, config);
        return response.data;
    }

    async delete<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(path, config);
        return response.data;
    }
}
