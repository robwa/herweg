import { request } from 'gaxios';

type UpdateArgs = { type?: string, id?: string, [payloadKeys: string]: any };
export function update({ type, id, ...payload }: UpdateArgs) {
    const url = `./api/v1/`;
    const params = { resource: type, id };
    const body = JSON.stringify(payload);
    return request<any>({ method: 'PATCH', url, params, body });
}
