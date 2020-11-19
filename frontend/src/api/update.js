import { request } from 'gaxios';

export function update({ type, id, ...payload }) {
    const url = `./api/v1/`;
    const params = { resource: type, id };
    const body = JSON.stringify(payload);
    return request({ method: 'PATCH', url, params, body });
}
