import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { CardService } from 'src/card/card.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly cardService: CardService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const user = await this.userService.findOne(createPaymentDto.userId);
    const card = await this.cardService.findOne(createPaymentDto.cardId);
    await this.cardService.validateCardExpiration(createPaymentDto.cardId);

    if (card.userId !== user.id) {
      throw new BadRequestException('La tarjeta no pertenece al usuario');
    }

    const response = await firstValueFrom(
      this.httpService.post(this.configService.get('PAYMENT_SERVICE_API')!, {
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        user_id: createPaymentDto.userId,
        card_id: createPaymentDto.cardId,
      }),
    );

    const paymentResult = response.data;

    return this.prisma.payment.create({
      data: {
        userId: createPaymentDto.userId,
        cardId: createPaymentDto.cardId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        status: paymentResult.approved === true ? 'approved' : 'declined',
        reason: paymentResult.reason || null,
      },
    });
  }

  async findAllUserPayments(userId: number) {
    await this.userService.findOne(userId);

    return this.prisma.payment.findMany({
      where: {
        userId: userId,
      },
      include: {
        card: true,
        user: true,
      },
    });
  }
}
