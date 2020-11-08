import { request } from 'gaxios';

export function fetchOne(resource, { id, ...options }) {
    const url = `/api/v1/${resource}/${id}`;
    const params = {};
    return request({ method: 'GET', url, params });
}
