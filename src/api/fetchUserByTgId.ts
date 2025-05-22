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
                // const error = await res.json()
                const text = await res.text()
                // console.log('Message', error)
                console.log('TEXT', text)
                // throw new Error(error.message)
            }
            if(res.status ===500) {
                throw new Error('Connect to server')
            }
        }
        return await res.json()
    } catch (error) {
        throw error
    }
}
