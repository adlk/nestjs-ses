export interface NodeSesEmail {
    from: string;
    to: string;
    cc?: string;
    bcc?: string[];
    replyTo?: string;
    subject: string;
    message?: string;
    altText?: string;
    configurationSet?: string;
    messageTags?: {
        name: string | number,
        value: string | number
    }[]
}