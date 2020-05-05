import { Injectable, Inject, Logger } from '@nestjs/common';
import * as SES from 'aws-sdk/clients/ses';

import { SES_CONFIG } from '../../tokens/tokens';
import { SesEmailOptions } from '../../interfaces/ses-email-options.interface';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class SesService {
  private readonly ses;
  constructor(
    @Inject(SES_CONFIG) private readonly sesConfig,
    private readonly utils: UtilsService
  ) {
    this.ses = new SES({
      region: sesConfig.REGION,
    });
  }

  public async sendFromTemplate(to: string, template: string, templateData: any, replyTo: string) {
    const eParams = {
      Destination: {
        ToAddresses: [to],
      },
      Source: 'Franz Team <servus@meetfranz.com>',
      Template: template,
      TemplateData: JSON.stringify(templateData),
      ReplyToAddresses: [replyTo],
    };

    try {
      await this.ses.sendTemplatedEmail(eParams).promise();
    } catch (err) {
      Logger.error(err);
    }
  }

  public async send({
    from,
    to,
    cc = [],
    bcc = [],
    replyTo,
    subject,
    html,
    text,
    template,
    templateData,
  }: SesEmailOptions) {
    let sendTemplatedEmail = false;

    const params = {
      Destination: {
        BccAddresses: this.mapValuesToArray(bcc),
        CcAddresses: this.mapValuesToArray(cc),
        ToAddresses: this.mapValuesToArray(to)
      },
      Source: from,
      ReplyToAddresses: this.mapValuesToArray(replyTo),
    };

    if (template && templateData) {
      sendTemplatedEmail = true;

      Object.assign(params, {
        Template: template,
        TemplateData: templateData ? JSON.stringify(templateData) : null,
      });
    } else if (html) {
      if (!subject) {
        throw new Error('Subject is missing');
      }

      Object.assign(params, {
        Message: {
          Body: {
            Html: {
              Data: html,
            },
            Text: {
              Data: text || this.utils.stripHtmlTags(html),
            }
          },
          Subject: {
            Data: subject,
          },
        },
      });
    } else {
      throw new Error('Neither `html` or `template` & `templateData` provided.');
    }

    try {
      return this.ses[sendTemplatedEmail ? 'sendTemplatedEmail' : 'sendEmail'](params).promise();
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  private mapValuesToArray(data: string | string[]): string[] {
    return Array.isArray(data) ? data : [data];
  }
}
