import { request } from 'gaxios';

export function remove({ type, id, uuid }) {
    const url = `./api/v1/`;
    const params = { resource: type, id, uuid };
    return request({ method: 'DELETE', url, params });
}
