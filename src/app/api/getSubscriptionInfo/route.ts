export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const telegramId = searchParams.get('telegramId');

        if (!telegramId) {
            return new Response(
                JSON.stringify({ error: 'telegramId is required' }),
                { status: 400 }
            );
        }

        const baseUrl = process.env.REMNAWAVE_URL;
        const token = process.env.REMNAWAVE_TOKEN;
        const httpMode = process.env.REMNAWAVE_MODE === 'local' || process.env.REMNAWAVE_MODE === 'LOCAL' ? 'http' : 'https'
        const url = `${httpMode}://${baseUrl}/api/users/by-telegram-id/${telegramId}`

        const localHeadersParam = {
            'x-forwarded-for': '127.0.0.1',
            'x-forwarded-proto': 'https',
        };

        const headers = {
            Authorization: `Bearer ${token}`,
            ...(httpMode === 'http' ? localHeadersParam : {}),
        };

        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            const errorResponse = await res.json();

            if (res.status === 404) {
                console.error(`Error API: ${res.status} ${errorResponse.message}`);
                return new Response(
                    JSON.stringify({message: errorResponse.message}),
                    {status: 404}
                );
            }

            return new Response(
                JSON.stringify({ error: res.statusText }),
                { status: res.status }
            );
        }
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
    }
}
