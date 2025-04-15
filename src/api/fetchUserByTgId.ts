import { subscriptionsResponse } from "@/types/subscriptionData";

export async function fetchUserByTelegramId(telegramId: number) {
    try {
        const res = await fetch(`/api/getSubscriptionInfo?telegramId=${telegramId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            if (res.status === 404) return
            throw new Error('from the remote API.');
        }

        const { response }: subscriptionsResponse = await res.json();
        return response[0];
    } catch (error) {
        throw error
    }
}
