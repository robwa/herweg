import { request } from 'gaxios';

export function fetchOne(type, { id, ...options }) {
    const url = `./api/v1/`;
    const params = { resource: type, id };
    return request({ method: 'GET', url, params });
}
