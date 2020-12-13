import { request } from 'gaxios';

type FetchOneOptions = { id: string };
export function fetchOne(type: string, options: FetchOneOptions) {
    const { id } = options;
    const url = `./api/v1/`;
    const params = { resource: type, id };
    return request<any>({ method: 'GET', url, params });
}
