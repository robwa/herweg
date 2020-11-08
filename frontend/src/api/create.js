import { request } from 'gaxios';

export function create({ type, ...payload }) {
    const url = `/api/v1/${type}`;
    const body = JSON.stringify(payload);
    return request({ method: 'POST', url, body });
}
