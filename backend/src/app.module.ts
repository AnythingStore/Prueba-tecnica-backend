import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UserModule, CardModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
