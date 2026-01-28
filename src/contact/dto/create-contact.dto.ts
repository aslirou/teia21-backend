import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no maximo 255 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email invalido' })
  @MaxLength(255, { message: 'Email deve ter no maximo 255 caracteres' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Telefone deve ter no maximo 20 caracteres' })
  phone?: string;

  @IsString()
  @MinLength(2, { message: 'Assunto deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'Assunto deve ter no maximo 255 caracteres' })
  subject: string;

  @IsString()
  @MinLength(10, { message: 'Mensagem deve ter pelo menos 10 caracteres' })
  message: string;
}
