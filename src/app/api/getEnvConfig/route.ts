import { NextResponse } from 'next/server';

export async function GET() {
    const config = {
        cryptoLink: process.env.CRYPTO_LINK === 'true',
        buyLink: process.env.BUY_LINK || ''
    };

    return NextResponse.json(config);
}
