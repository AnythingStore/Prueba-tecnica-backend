import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateCardDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Length(13, 19)
  @Matches(/^[0-9]+$/, { message: 'cardNumber debe contener solo dígitos' })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(12)
  expirationMonth: number;

  @IsInt()
  @IsPositive()
  expirationYear: number;
}
