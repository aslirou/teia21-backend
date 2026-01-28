import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // POST - Rate limited (3 requests per minute per IP)
  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ contact: { ttl: 60000, limit: 3 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactService.create(createContactDto);
    return {
      success: true,
      message: 'Mensagem enviada com sucesso!',
      data: { id: contact.id },
    };
  }

  // GET all - Requires API Key
  @Get()
  @UseGuards(ApiKeyGuard)
  async findAll() {
    const contacts = await this.contactService.findAll();
    return {
      success: true,
      data: contacts,
    };
  }

  // GET stats - Requires API Key
  @Get('stats')
  @UseGuards(ApiKeyGuard)
  async getStats() {
    const stats = await this.contactService.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  // GET unread - Requires API Key
  @Get('unread')
  @UseGuards(ApiKeyGuard)
  async findUnread() {
    const contacts = await this.contactService.findUnread();
    return {
      success: true,
      data: contacts,
    };
  }

  // GET one - Requires API Key
  @Get(':id')
  @UseGuards(ApiKeyGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const contact = await this.contactService.findOne(id);
    return {
      success: true,
      data: contact,
    };
  }

  // PATCH update - Requires API Key
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const contact = await this.contactService.update(id, updateContactDto);
    return {
      success: true,
      message: 'Contato atualizado com sucesso!',
      data: contact,
    };
  }

  // PATCH mark as read - Requires API Key
  @Patch(':id/read')
  @UseGuards(ApiKeyGuard)
  async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    const contact = await this.contactService.markAsRead(id);
    return {
      success: true,
      message: 'Contato marcado como lido!',
      data: contact,
    };
  }

  // PATCH mark as responded - Requires API Key
  @Patch(':id/responded')
  @UseGuards(ApiKeyGuard)
  async markAsResponded(@Param('id', ParseUUIDPipe) id: string) {
    const contact = await this.contactService.markAsResponded(id);
    return {
      success: true,
      message: 'Contato marcado como respondido!',
      data: contact,
    };
  }

  // DELETE - Requires API Key
  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactService.remove(id);
  }
}
