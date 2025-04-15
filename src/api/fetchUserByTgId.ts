import { subscriptionsResponse } from "@/types/types";

export async function fetchUserByTelegramId(telegramId: number) {
    try {
        const res = await fetch(`/api/getSubscriptionInfo?telegramId=${telegramId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Error while fetching data from the remote API.');
        }

        const { response }: subscriptionsResponse = await res.json();
        return response[0];
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
