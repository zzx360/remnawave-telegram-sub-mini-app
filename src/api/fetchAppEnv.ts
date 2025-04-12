
export async function fetchAppEnv() {
    console.log('ДЕЛАЕМ ЗАПРОС К АПИ')
    try {
        const res = await fetch('/api/getEnvConfig');
        console.log('RES', res)

        if (!res.ok) {
            throw new Error('Ошибка при запросе данных.');
        }

        const response = await res.json();
        console.log('RESPONSE', response)
        return response;


    } catch (error) {
        console.error('Ошибка:', error);
    }
}
