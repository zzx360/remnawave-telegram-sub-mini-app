export async function fetchAppEnv() {
    try {
        const res = await fetch('/api/getEnvConfig', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('from the remote API.');
        }

        const response: { cryptoLink: boolean; buyLink: string } = await res.json();
        return response;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
