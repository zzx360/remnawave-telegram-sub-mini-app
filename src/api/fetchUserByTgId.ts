import {subscriptionsResponse} from "@/types/types";

export async function fetchUserByTelegramId(telegramId: number) {

    try {
        const res = await fetch('/api/getSubscriptionInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramId }),
        });

        if (!res.ok) {
            throw new Error('Ошибка при запросе данных.');
        }

        const { response } : subscriptionsResponse = await res.json();
        return response[0]


    } catch (error) {
        console.error('Ошибка:', error);
    }
}
