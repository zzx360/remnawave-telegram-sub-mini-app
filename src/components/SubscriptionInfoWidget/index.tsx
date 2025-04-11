import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconUser,
    IconX
} from '@tabler/icons-react'
import { Accordion, rgba, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import {useLocale, useTranslations} from "next-intl";
import {InfoBlock } from "@/components/InfoBlock/InfoBlock";
import {IUserData} from "@/app/types/types";
import {bytesToGigabytes, calculateDaysLeft, getExpirationTextUtil} from "@/app/lib/utils";

dayjs.extend(relativeTime)

export const SubscriptionInfoWidget = ({ user }: { user: IUserData }) => {

    const t = useTranslations();
    const lang = useLocale();

    if (!user) return null

    const daysLeft = calculateDaysLeft(user.expireAt)

    const formatDate = (dateStr: Date | string) => {
        return dayjs(dateStr).format('DD.MM.YYYY')
    }

    const getStatusAndIcon = (): {
        color: string
        icon: React.ReactNode
        status: string
    } => {
        if (user.status === 'ACTIVE' && daysLeft > 0) {
            return {
                color: 'teal',
                icon: <IconCheck size={20} />,
                status: t('subscription-info.widget.active')
            }
        }
        if (
            (user.status === 'ACTIVE' && daysLeft=== 0) ||
            (daysLeft >= 0 && daysLeft <= 3)
        ) {
            return {
                color: 'orange',
                icon: <IconAlertCircle size={20} />,
                status: t('subscription-info.widget.active')
            }
        }

        return {
            color: 'red',
            icon: <IconX size={20} />,
            status: t('subscription-info.widget.inactive')
        }
    }

    return (
        <Accordion
            styles={(theme) => ({
                item: {
                    boxShadow: `0 4px 12px ${rgba(theme.colors.gray[5], 0.1)}`
                }
            })}
            variant="separated"
        >
            <Accordion.Item value="subscription-info">
                <Accordion.Control
                    icon={
                        <ThemeIcon color={getStatusAndIcon().color} size="lg" variant="light">
                            {getStatusAndIcon().icon}
                        </ThemeIcon>
                    }
                >
                    <Stack gap={3}>
                        <Text fw={500} size="md" truncate>
                            {user.username}
                        </Text>
                        <Text c={daysLeft === 0 ? 'red' : 'dimmed'} size="xs">
                            {getExpirationTextUtil(user.expireAt, t, lang)}
                        </Text>
                    </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                    <SimpleGrid cols={{ base: 1, sm: 2, xs: 2 }} spacing="xs" verticalSpacing="sm">
                        <InfoBlock
                            color="blue"
                            icon={<IconUser size={20} />}
                            title={t('subscription-info.widget.name')}
                            value={user.username}
                        />

                        <InfoBlock
                            color={user.status === 'ACTIVE' ? 'green' : 'red'}
                            icon={
                                user.status === 'ACTIVE' ? (
                                    <IconCheck size={20} />
                                ) : (
                                    <IconX size={20} />
                                )
                            }
                            title={t('subscription-info.widget.status')}
                            value={
                                user.status === 'ACTIVE'
                                    ? t('subscription-info.widget.active')
                                    : t('subscription-info.widget.inactive')
                            }
                        />

                        <InfoBlock
                            color="red"
                            icon={<IconCalendar size={20} />}
                            title={t('subscription-info.widget.expires')}
                            value={formatDate(user.expireAt)}
                        />

                        <InfoBlock
                            color="yellow"
                            icon={<IconArrowsUpDown size={20} />}
                            title={t('subscription-info.widget.bandwidth')}
                            value={`${bytesToGigabytes(user.usedTrafficBytes)} / ${user.trafficLimitBytes === 0 ? '∞' : user.trafficLimitBytes}`}
                        />
                    </SimpleGrid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
