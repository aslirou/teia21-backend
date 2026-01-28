import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contato com ID ${id} nao encontrado`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    Object.assign(contact, updateContactDto);
    return await this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
  }

  async findUnread(): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { read: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Contact> {
    return await this.update(id, { read: true });
  }

  async markAsResponded(id: string): Promise<Contact> {
    return await this.update(id, { responded: true });
  }

  async getStats(): Promise<{
    total: number;
    unread: number;
    responded: number;
  }> {
    const total = await this.contactRepository.count();
    const unread = await this.contactRepository.count({ where: { read: false } });
    const responded = await this.contactRepository.count({ where: { responded: true } });

    return { total, unread, responded };
  }
}
