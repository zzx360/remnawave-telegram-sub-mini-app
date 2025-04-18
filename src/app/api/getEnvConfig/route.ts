export async function POST() {
    try {
        const cryptoLink = process.env.CRYPTO_LINK
        const buyLink = process.env.BUY_LINK
        const redirectLink = process.env.REDIRECT_LINK || 'https://maposia.github.io/redirect-page/?redirect_to='


        return new Response(JSON.stringify({cryptoLink, buyLink, redirectLink}), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
    }
}
