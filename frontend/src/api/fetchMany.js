import { request } from 'gaxios';

export function fetchMany(resource, options) {
    const url = `/api/v1/${resource}`;
    const { filter } = options ?? {};
    const params = { filter };
    return request({ method: 'GET', url, params });
}
