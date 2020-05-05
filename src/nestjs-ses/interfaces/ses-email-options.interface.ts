type TemplateData = {
  [key: string]: string;
}

export interface SesEmailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  template?: string;
  templateData?: TemplateData;
}