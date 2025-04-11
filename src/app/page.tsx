'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Lottie from "lottie-react";
import noSubAnimate from "@public/assets/no-sub.json";
import {Box, Button, Center, Container, Group, Stack, Title} from '@mantine/core'
import { LocaleSwitcher } from '@/components/LocaleSwitcher/LocaleSwitcher';
import { SubscriptionInfoWidget } from '@/components/SubscriptionInfoWidget';
import { fetchUserByTelegramId } from '@/api/fetchUserByTgId'
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {Loading} from "@/components/Loading/Loading";
import {ofetch} from "ofetch";
import {IPlatformConfig} from "@/app/types/appList";
import {InstallationGuideWidget} from "@/components/InstallationGuideWidget";
import {IUserData} from "@/app/types/types";

import classes from './app.module.css'

export default function Home() {
    const t = useTranslations();

    const initDataState = useSignal(initData.state);
    const telegramId = initDataState?.user?.id
    const [subscription, setSubscription] = useState<IUserData | null>(null);
    const [subscriptionLoaded, setSubscriptionLoaded] = useState(false)
    const [appsConfig, setAppsConfig] = useState<IPlatformConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    const buyLink = process.env.NEXT_PUBLIC_BUY_LINK;

    useEffect(() => {

        if(telegramId) {
            const fetchSubscription = async () => {
                setIsLoading(true);
                try {
                    const user = await fetchUserByTelegramId(telegramId);
                    if(user) setSubscription(null);
                } catch (error) {
                    console.error('Failed to fetch subscription:', error)

                } finally {
                    setSubscriptionLoaded(true);
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



    if(isLoading || !appsConfig ) return (
        <Loading/>
    )

    if(subscriptionLoaded && !subscription) return (
                <Container className={classes.main}  my="xl" size="xl">
                    <Center>
                        <Stack gap="xl">
                        <Title style={{textAlign: 'center'}} order={4}>{t('main.page.component.no-sub')}</Title>
                        <Box w={200}>
                            <Lottie animationData={noSubAnimate} loop={true} />
                        </Box>
                            <Button component='a' href={buyLink}  target="_blank" color="grape" >{t('main.page.component.buy')}</Button>
                        </Stack>
                    </Center>
            </Container>
    )

    if(subscriptionLoaded && subscription) return (
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

    return null
}
