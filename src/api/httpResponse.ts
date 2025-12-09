export const HTTP_RESPONSES = {
    badRequest: (msg: string) => ({ statusCode: 400, body: JSON.stringify({ error: msg }) }),
    unauthorized: { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) },
    forbidden: { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) },
    notFound: { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) },
    noContent: { statusCode: 204, body: '' },
};
