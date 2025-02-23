export const plain = <T>(data: T): T => JSON.parse(JSON.stringify(data));
