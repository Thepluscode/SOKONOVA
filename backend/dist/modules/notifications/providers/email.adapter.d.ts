export declare class EmailAdapter {
    private readonly logger;
    private readonly enabled;
    constructor();
    send(toEmail: string, subject: string, body: string, data?: any): Promise<{
        sent: boolean;
        channel: string;
    }>;
    private createEmailHtml;
}
