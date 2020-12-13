import { request } from 'gaxios';

type RemoveArgs = { type: string, id?: string, uuid?: string };
export function remove({ type, id, uuid }: RemoveArgs) {
    const url = `./api/v1/`;
    const params = { resource: type, id, uuid };
    return request<any>({ method: 'DELETE', url, params });
}
