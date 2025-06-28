import { Module } from '@nestjs/common';
import { MailjetModule } from 'nest-mailjet';
import { emailServerConfig } from '../common/config';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    MailjetModule.registerAsync({
      useFactory: async () => emailServerConfig(),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
