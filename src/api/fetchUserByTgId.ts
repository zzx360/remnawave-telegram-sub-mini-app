import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'

export async function fetchUserByTelegramId(
    telegramId: number
): Promise<GetSubscriptionInfoByShortUuidCommand.Response['response']> {
    try {
        const res = await fetch(`/api/getSubscriptionInfo?telegramId=${telegramId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            if (res.status === 404) {
                const error = await res.json()
                throw new Error(error.message)
            }
        }
        return await res.json()
    } catch (error) {
        throw error
    }
}
