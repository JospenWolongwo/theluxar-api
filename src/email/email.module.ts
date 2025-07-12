import { Module } from '@nestjs/common';
import { MailjetModule } from 'nest-mailjet';
import { emailServerConfig } from '../common/config';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    // Type casting to handle module version incompatibilities
    MailjetModule.registerAsync({
      useFactory: async () => emailServerConfig(),
    }) as any,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
