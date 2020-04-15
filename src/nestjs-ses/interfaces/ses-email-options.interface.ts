export interface SesEmailOptions {
    from: string;
    to: string;
    cc?: string;
    bcc?: string[];
    replyTo?: string;
    subject: string;
    html?: string;
    text?: string;
    convertHTMLToText?: boolean;
}