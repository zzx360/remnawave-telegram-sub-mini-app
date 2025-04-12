export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { telegramId } = body;


        const baseUrl = process.env.REMNAWAVE_URL
        const token = process.env.REMNAWAVE_TOKEN
        const httpMode  = process.env.REMNAWAVE_MODE === 'local' ? 'http' : 'https'
        const cryptoLink = process.env.CRYPTO_LINK
        const buyLink = process.env.BUY_LINK

        const url = `${httpMode}://${baseUrl}/api/users/tg/${telegramId}`
        const localHeadersParam = {
            'x-forwarded-for': '127.0.0.1',
            'x-forwarded-proto': 'https'
        }
        const headers = {
            Authorization: `Bearer ${token}`,
            ...(httpMode === 'http' ? localHeadersParam : {}),
        }

        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            console.error(`Error API: ${res.status} ${res.statusText}`);
            return new Response(
                JSON.stringify({ error: 'Error while fetching data from the remote API' }),
                { status: res.status }
            );
        }

        const data = await res.json();
        return new Response(JSON.stringify({cryptoLink, buyLink}), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
    }
}
