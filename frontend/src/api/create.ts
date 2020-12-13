import { request } from 'gaxios';

type CreateArgs = { type: string, [payloadKeys: string]: any };
export function create({ type, ...payload }: CreateArgs) {
    const url = `./api/v1/`;
    const params = { resource: type };
    const body = JSON.stringify(payload);
    return request<any>({ method: 'POST', url, params, body });
}
