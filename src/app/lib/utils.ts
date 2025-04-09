import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';
import prettyBytes from "pretty-bytes";


export const calculateDaysLeft = (expireAt: string): number => {
    const now = dayjs();
    const expirationDate = dayjs(expireAt);
    const diffInDays = expirationDate.diff(now, 'day');

    return diffInDays > 0 ? diffInDays : 0;
};

dayjs.extend(relativeTime);
export function getExpirationTextUtil(
    expireAt: Date | null | string,
    t: ReturnType<typeof useTranslations>
): string {
    if (!expireAt) {
        return t('get-expiration-text.util.unknown');
    }

    const expiration = dayjs(expireAt);
    const now = dayjs();
    if (expiration.isBefore(now)) {
        return t('get-expiration-text.util.expired', {
            expiration: expiration.fromNow(false),
        });
    }

    return t('get-expiration-text.util.expires-in', {
        expiration: expiration.fromNow(false),
    });
}

export function bytesToGigabytes(bytes: number, decimals: number = 2): string {
    if (bytes < 0) {
        throw new Error('Количество байтов не может быть отрицательным');
    }
    return prettyBytes(bytes, {maximumFractionDigits: 2});
}


