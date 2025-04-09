'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {Center, Container, Group, Stack, Title} from '@mantine/core'
import { LocaleSwitcher } from '@/components/LocaleSwitcher/LocaleSwitcher';
import { SubscriptionInfoWidget } from '@/components/SubscriptionInfoWidget';
import { fetchUserByTelegramId } from '@/api/fetchUserByTgId'
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {Loading} from "@/components/Loading/Loading";
import {ofetch} from "ofetch";
import {IPlatformConfig} from "@/app/types/appList";
import {InstallationGuideWidget} from "@/components/InstallationGuideWidget";
import {IUserData} from "@/app/types/types";

export default function Home() {
    const t = useTranslations();

    const initDataState = useSignal(initData.state);
    const telegramId = initDataState?.user?.id
    const [subscription, setSubscription] = useState<IUserData | null>(null);
    const [appsConfig, setAppsConfig] = useState<IPlatformConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if(telegramId) {
            const fetchSubscription = async () => {
                setIsLoading(true);
                try {
                    const data = await fetchUserByTelegramId(telegramId);
                    if(data) setSubscription(data);
                } catch (err: any) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSubscription();
        }


    }, [telegramId]);



    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await ofetch<IPlatformConfig>(
                    `/assets/app-config.json?v=${Date.now()}`,
                    {
                        parseResponse: JSON.parse
                    }
                )
                setAppsConfig(config)
            } catch (error) {
                console.error('Failed to fetch app config:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchConfig()
    }, [])

    if(isLoading || !subscription || !appsConfig ) return (
        <Loading/>
    )

    return (
        <Container my="xl" size="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Group gap="xs">
                        <Title order={4}>{t('main.page.component.podpiska')}</Title>
                    </Group>
                    <Group gap="xs">
                        <LocaleSwitcher />
                    </Group>
                </Group>

                <Stack gap="xl">
                    <SubscriptionInfoWidget user={subscription} />
                    <InstallationGuideWidget user={subscription}  appsConfig={appsConfig} />
                </Stack>

                <Center>
                </Center>
            </Stack>
        </Container>
    )

}
