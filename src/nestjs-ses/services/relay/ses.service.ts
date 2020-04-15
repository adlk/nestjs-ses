import { Injectable, Inject } from '@nestjs/common';
import { SES_CONFIG } from '../../tokens/tokens';
import * as ses from 'node-ses';
import { SesEmailOptions } from '../../interfaces/ses-email-options.interface';
import { NodeSesEmail } from '../../interfaces/node-ses-email.interface';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class SesService {
  private readonly ses;
  constructor(
    @Inject(SES_CONFIG) private readonly sesConfig,
    private readonly utils: UtilsService
  ) {
    this.ses = ses.createClient({
      key: sesConfig.AKI_KEY,
      amazon: `https://email.${sesConfig.region}.amazonaws.com`,
      secret: sesConfig.SECRET,
    });
  }

  public sendEmail(emailOptions: SesEmailOptions): Promise<boolean> {
    const { html, text, convertHTMLToText, ...data } = emailOptions
    const email: NodeSesEmail = {
      ...data
    }
    if (html) {
      email.message = html
    }
    if (text) {
      email.altText = text
    } else if (convertHTMLToText && html) {
      email.altText = this.utils.stripHtmlTags(html);
    }
    return new Promise((resolve, reject) => {
      this.ses.sendEmail(email, (err, data, res) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
}
