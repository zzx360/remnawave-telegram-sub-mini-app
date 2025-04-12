
export async function GET() {
    console.log('ПОЛУЧАЕМ ENV')
    const cryptoLink = process.env.CRYPTO_LINK
    const buyLink = process.env.BUY_LINK
    const config = {
        cryptoLink,
        buyLink
    };

    console.log('API CONFIG', config);
    return new Response(JSON.stringify(config), { status: 200 });}
