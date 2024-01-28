import { ConfigurationModule } from '@configuration/configuration.module'
import { ConfigurationService } from '@configuration/configuration.service'
import { IMailServices } from '@core/abstracts/mail-services.abstract'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { join } from 'path'
import { GmailService } from './gmail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (config: ConfigurationService) => ({
        transport: {
          host: config.get('gmail.host'),
          secure: false,
          auth: {
            user: config.get('gmail.user'),
            pass: config.get('gmail.password'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('gmail.mail_from')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigurationService],
    }),
  ],
  providers: [
    {
      provide: IMailServices,
      useClass: GmailService,
    },
  ],
  exports: [IMailServices],
})
export class GMailModule {}
