import {
    GetSubscriptionInfoByShortUuidCommand,
    GetUserByTelegramIdCommand
} from '@remnawave/backend-contract'
import axios, { AxiosError } from 'axios'

const baseUrl = process.env.REMNAWAVE_PANEL_URL
const isHappCryptoLinkEnabled = process.env.CRYPTO_LINK === 'true'

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${process.env.REMNAWAVE_TOKEN}`
    }
})

if (baseUrl ? baseUrl.startsWith('http://') : false) {
    instance.defaults.headers.common['x-forwarded-for'] = '127.0.0.1'
    instance.defaults.headers.common['x-forwarded-proto'] = 'https'
}

if (process.env.AUTH_API_KEY) {
    instance.defaults.headers.common['X-Api-Key'] = `${process.env.AUTH_API_KEY}`
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const telegramId = searchParams.get('telegramId')

        if (!telegramId) {
            return new Response(JSON.stringify({ error: 'telegramId is required' }), {
                status: 400
            })
        }

        const result = await instance.request<GetUserByTelegramIdCommand.Response>({
            method: GetUserByTelegramIdCommand.endpointDetails.REQUEST_METHOD,
            url: GetUserByTelegramIdCommand.url(telegramId)
        })

        if (result.status !== 200) {
            console.error(`Error API: ${result.status} ${result.data}`)
            return new Response(JSON.stringify({ error: result.data }), {
                status: result.status
            })
        }

        if (result.data.response.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404
            })
        }

        const shortUuid = result.data.response[0].shortUuid

        const subscriptionInfo =
            await instance.request<GetSubscriptionInfoByShortUuidCommand.Response>({
                method: GetSubscriptionInfoByShortUuidCommand.endpointDetails.REQUEST_METHOD,
                url: GetSubscriptionInfoByShortUuidCommand.url(shortUuid)
            })

        if (subscriptionInfo.status !== 200) {
            console.error('Error API:', subscriptionInfo.data)
            return new Response(JSON.stringify({ error: 'Failed to get subscription info' }), {
                status: 500
            })
        }

        const response = subscriptionInfo.data.response

        if (isHappCryptoLinkEnabled) {
            // we need to remove links, ssConfLinks and subscriptionUrl from response
            response.links = []
            response.ssConfLinks = {}
            response.subscriptionUrl = response.happ.cryptoLink
        }

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                console.error(
                    `Error API: ${error.response?.status} ${error.response?.data.message}`
                )
                return new Response(JSON.stringify({ message: 'User not found' }), {
                    status: 404
                })
            }

            console.error('Error:', error)

            return new Response(JSON.stringify({ error: 'Failed to get subscription info' }), {
                status: 500
            })
        }

        // Добавляем обработку для других типов ошибок
        console.error('Unexpected error:', error)
        return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
            status: 500
        })
    }
}
