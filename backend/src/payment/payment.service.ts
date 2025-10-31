import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { CardService } from 'src/card/card.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const user = await this.userService.findOne(createPaymentDto.userId);
    const card = await this.cardService.findOne(createPaymentDto.cardId);
    await this.cardService.validateCardExpiration(createPaymentDto.cardId);

    if (card.userId !== user.id) {
      throw new BadRequestException('La tarjeta no pertenece al usuario');
    }

    return this.prisma.payment.create({
      data: {
        userId: createPaymentDto.userId,
        cardId: createPaymentDto.cardId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        status: createPaymentDto.status,
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
