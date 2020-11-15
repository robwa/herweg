import { request } from 'gaxios';

export function fetchMany(type, options) {
    const url = `./api/v1/`;
    const { filter } = options ?? {};
    const params = { resource: type, filter };
    return request({ method: 'GET', url, params });
}
