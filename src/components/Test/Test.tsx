'use client'

export function Test({crypto, buy}: {crypto: string, buy: string}) {
    return (
        <div>
            <h1>Test</h1>
            <p>Crypto: {crypto}</p>
            <p>Buy: {buy}</p>
        </div>
    );
}
