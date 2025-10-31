import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  async create(createCardDto: CreateCardDto) {
    this._validateCardExpiration(
      createCardDto.expirationYear,
      createCardDto.expirationMonth,
    );
    // Confirm if user exists
    await this.userService.findOne(createCardDto.userId);
    const card = await this.prisma.card.findFirst({
      where: {
        cardNumber: createCardDto.cardNumber,
      },
    });
    if (card) {
      throw new ConflictException(
        `Ya existe una tarjeta con este número ${createCardDto.cardNumber}`,
      );
    }
    return await this.prisma.card.create({ data: createCardDto });
  }

  async findAll() {
    return await this.prisma.card.findMany();
  }

  async findOne(id: number) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Tarjeta con id ${id} no encontrada`);
    }

    return card;
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.card.delete({ where: { id } });
  }

  async validateCardExpiration(id: number) {
    const card = await this.findOne(id);
    this._validateCardExpiration(card.expirationYear, card.expirationMonth);
  }

  private _validateCardExpiration(
    expirationYear: number,
    expirationMonth: number,
  ) {
    // Validate time of expiration
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (
      expirationYear < currentYear ||
      (expirationYear === currentYear && expirationMonth < currentMonth)
    ) {
      throw new BadRequestException('La tarjeta ya está expirada');
    }
  }
}
