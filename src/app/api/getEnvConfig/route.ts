export async function POST() {
    try {
        const cryptoLink = process.env.CRYPTO_LINK
        const buyLink = process.env.BUY_LINK

        return new Response(JSON.stringify({cryptoLink, buyLink}), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
    }
}
