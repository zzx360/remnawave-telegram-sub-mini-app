require('dotenv').config()

import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Box, Button, Group, Select, Text } from '@mantine/core'
import { useOs } from '@mantine/hooks'
import {
    IconBrandAndroid,
    IconBrandApple,
    IconDeviceDesktop,
    IconExternalLink
} from '@tabler/icons-react'

import { IAppConfig, IPlatformConfig } from '@/types/appList'
import { BaseInstallationGuideWidget } from '@/components/BaseInstallationGuideWidget/BaseInstallationGuideWidget'
import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'

export const InstallationGuideWidget = ({
    appsConfig,
    user,
    isCryptoLinkEnabled,
    redirectLink
}: {
    appsConfig: IPlatformConfig
    user: GetSubscriptionInfoByShortUuidCommand.Response['response']
    isCryptoLinkEnabled: boolean | undefined
    redirectLink: string | undefined
}) => {
    const t = useTranslations()
    const lang = useLocale()

    const os = useOs()

    const [currentLang, setCurrentLang] = useState<'en' | 'fa' | 'ru'>('en')
    const [defaultTab, setDefaultTab] = useState('pc')

    useEffect(() => {
        if (lang) {
            if (lang.startsWith('en')) {
                setCurrentLang('en')
            } else if (lang.startsWith('fa')) {
                setCurrentLang('fa')
            } else if (lang.startsWith('ru')) {
                setCurrentLang('ru')
            } else {
                setCurrentLang('en')
            }
        }
    }, [lang])

    useLayoutEffect(() => {
        switch (os) {
            case 'android':
                setDefaultTab('android')
                break
            case 'ios':
                setDefaultTab('ios')
                break
            case 'linux':
            case 'macos':
            case 'windows':
                setDefaultTab('pc')
                break
            default:
                setDefaultTab('pc')
                break
        }
    }, [os])

    if (!user) return null

    const hasPlatformApps = {
        ios: appsConfig.ios && appsConfig.ios.length > 0,
        android: appsConfig.android && appsConfig.android.length > 0,
        pc: appsConfig.pc && appsConfig.pc.length > 0
    }

    if (!hasPlatformApps.ios && !hasPlatformApps.android && !hasPlatformApps.pc) {
        return null
    }

    const { subscriptionUrl } = user

    const openDeepLink = (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => {
        if (isNeedBase64Encoding) {
            const encoded = btoa(`${subscriptionUrl}`)
            const encodedUrl = `${urlScheme}${encoded}`
            window.open(encodedUrl, '_blank')
        } else if (urlScheme.startsWith('happ') && isCryptoLinkEnabled) {
            return os === 'windows'
                ? window.open(`${redirectLink}${user.happ.cryptoLink}`, '_blank')
                : window.open(user.happ.cryptoLink, '_blank')
        } else {
            return os === 'windows'
                ? window.open(`${redirectLink}${urlScheme}${subscriptionUrl}`, '_blank')
                : window.open(`${urlScheme}${subscriptionUrl}`)
        }
    }

    const availablePlatforms = [
        hasPlatformApps.android && {
            value: 'android',
            label: 'Android',
            icon: <IconBrandAndroid />
        },
        hasPlatformApps.ios && {
            value: 'ios',
            label: 'iOS',
            icon: <IconBrandApple />
        },
        hasPlatformApps.pc && {
            value: 'pc',
            label: t('installation-guide.widget.pc'),
            icon: <IconDeviceDesktop />
        }
    ].filter(Boolean) as {
        icon: React.ReactNode
        label: string
        value: string
    }[]

    if (
        !hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] &&
        availablePlatforms.length > 0
    ) {
        setDefaultTab(availablePlatforms[0].value)
    }

    const getAppsForPlatform = (platform: 'android' | 'ios' | 'pc') => {
        return appsConfig[platform] || []
    }

    const getSelectedAppForPlatform = (platform: 'android' | 'ios' | 'pc') => {
        const apps = getAppsForPlatform(platform)
        if (apps.length === 0) return null
        return apps[0]
    }

    const renderFirstStepButton = (app: IAppConfig) => {
        if (app.installationStep.buttons.length > 0) {
            return (
                <Group>
                    {app.installationStep.buttons.map((button, index) => {
                        const buttonText = button.buttonText[currentLang] || button.buttonText.en

                        return (
                            <Button
                                component="a"
                                href={button.buttonLink}
                                key={index}
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
                            >
                                {buttonText}
                            </Button>
                        )
                    })}
                </Group>
            )
        }

        return null
    }

    const getPlatformTitle = (platform: 'android' | 'ios' | 'pc') => {
        if (platform === 'android') {
            return t('installation-guide.android.widget.install-and-open-app', {
                appName: '{appName}'
            })
        }
        if (platform === 'ios') {
            return t('installation-guide.ios.widget.install-and-open-app', {
                appName: '{appName}'
            })
        }
        return t('installation-guide.pc.widget.download-app', {
            appName: '{appName}'
        })
    }

    return (
        <Box>
            <Group justify="space-between" mb="md">
                <Text fw={700} size="xl">
                    {t('installation-guide.widget.installation')}
                </Text>

                {availablePlatforms.length > 1 && (
                    <Select
                        allowDeselect={false}
                        data={availablePlatforms.map((opt) => ({
                            value: opt.value,
                            label: opt.label
                        }))}
                        leftSection={
                            availablePlatforms.find((opt) => opt.value === defaultTab)?.icon
                        }
                        onChange={(value) => setDefaultTab(value || '')}
                        placeholder={t('installation-guide.widget.select-device')}
                        radius="md"
                        size="sm"
                        style={{ width: 130 }}
                        value={defaultTab}
                    />
                )}
            </Group>

            {hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] && (
                <BaseInstallationGuideWidget
                    appsConfig={appsConfig}
                    currentLang={currentLang}
                    firstStepTitle={getPlatformTitle(defaultTab as 'android' | 'ios' | 'pc')}
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                    platform={defaultTab as 'android' | 'ios' | 'pc'}
                    renderFirstStepButton={renderFirstStepButton}
                />
            )}
        </Box>
    )
}
