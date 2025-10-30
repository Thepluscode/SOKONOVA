export declare class SmsAdapter {
    private readonly logger;
    private readonly enabled;
    private readonly at;
    private readonly shortCode;
    constructor();
    send(toPhone: string, message: string): Promise<{
        sent: boolean;
        channel: string;
    }>;
    sendWhatsApp(toPhone: string, message: string): Promise<{
        sent: boolean;
        channel: string;
    }>;
    private formatPhoneNumber;
}
