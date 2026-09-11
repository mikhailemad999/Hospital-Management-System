import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private apptRepo: Repository<Appointment>,
  ) {}

  async findAll() {
    return this.apptRepo.find({ order: { queuePosition: 'ASC' } });
  }

  async getQueue() {
    return this.apptRepo.find({
      where: [{ status: 'WAITING' }, { status: 'CALLED' }, { status: 'IN_CONSULTATION' }],
      order: { queuePosition: 'ASC' },
    });
  }

  async createTicket(data: Partial<Appointment>) {
    const count = await this.apptRepo.count();
    data.ticketNumber = `T-${100 + count + 1}`;
    data.queuePosition = count + 1;
    data.status = 'WAITING';
    const appt = this.apptRepo.create(data);
    return this.apptRepo.save(appt);
  }

  async updateStatus(id: string, status: string) {
    await this.apptRepo.update(id, { status });
    return this.apptRepo.findOne({ where: { id } });
  }
}
