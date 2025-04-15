export interface IUserData {
    uuid: string;
    subscriptionUuid: string;
    shortUuid: string;
    username: string;
    status: "ACTIVE" | "DISABLED" | "LIMITED" | "EXPIRED";
    usedTrafficBytes: number;
    lifetimeUsedTrafficBytes: number;
    trafficLimitBytes: number;
    trafficLimitStrategy: "NO_RESET" | "DAY" | "WEEK" | "MONTH";
    subLastUserAgent: string | null;
    subLastOpenedAt: string | null;
    expireAt: string;
    onlineAt: string | null;
    subRevokedAt: string | null;
    lastTrafficResetAt: string | null;
    trojanPassword: string;
    vlessUuid: string;
    ssPassword: string;
    description: string | null;
    telegramId: number | null;
    email: string | null;
    createdAt: string;
    updatedAt: string;
    activeUserInbounds: Array<{
        uuid: string;
        tag: string;
        type: string;
        network: string | null;
        security: string | null;
    }>;
    subscriptionUrl: string;
    lastConnectedNode: {
        connectedAt: string;
        nodeName: string;
    } | null;
    happ: {
        cryptoLink: string;
    };
}

export interface subscriptionsResponse {
    response: IUserData[];
}
