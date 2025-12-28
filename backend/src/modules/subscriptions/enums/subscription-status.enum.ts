export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    TRIAL = 'TRIAL',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    SUSPENDED = 'SUSPENDED',
    CANCELED = 'CANCELED',
    PAST_DUE = 'PAST_DUE', // Payment failed
    EXPIRED = 'EXPIRED',   // Trial ended
}
