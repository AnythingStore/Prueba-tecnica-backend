import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  cardId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string = 'USD';
}
