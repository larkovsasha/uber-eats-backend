import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { IEmailVar, MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  private async sendEmail(
    subject: string,
    template: string,
    emailVars: IEmailVar[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Aleksandr <mailgun@${this.options.domain}>`);
    form.append('to', 'LarkovAleksandr005@yandex.ru');
    form.append('subject', subject);
    form.append('template', 'template');

    try {
      const response = await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.APIKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      console.log(response);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
