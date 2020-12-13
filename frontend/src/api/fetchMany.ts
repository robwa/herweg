import { request } from 'gaxios';

export type FetchManyOptions = { filter: any };
export function fetchMany(type: string, options: FetchManyOptions) {
    const url = `./api/v1/`;
    const { filter } = options ?? {};
    const params = { resource: type, filter };
    return request<any>({ method: 'GET', url, params });
}
