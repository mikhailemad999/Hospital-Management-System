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

  async createTicket(data: Partial<Appointment> & Record<string, any>) {
    const count = await this.apptRepo.count();
    data.ticketNumber = data.ticketNumber || `T-${100 + count + 1 + Math.floor(Math.random() * 500)}`;
    data.queuePosition = data.queuePosition || (count + 1);
    data.status = data.status || 'WAITING';
    data.patientId = data.patientId || `pat-${Date.now().toString().slice(-6)}`;
    data.patientName = data.patientName || 'Walk-in Patient';
    data.mrn = data.mrn || `MRN-${90000 + count + 1}`;
    data.doctorName = data.doctorName || 'Dr. Marcus Brody, MD';
    data.departmentName = data.departmentName || data.department || 'General Practice';
    data.appointmentDate = data.appointmentDate || new Date().toISOString().substring(0, 10);
    data.timeSlot = data.timeSlot || '14:30 - 15:00';
    data.fee = data.fee !== undefined ? data.fee : 150.00;

    const appt = this.apptRepo.create(data);
    return this.apptRepo.save(appt);
  }

  async updateStatus(id: string, status: string) {
    await this.apptRepo.update(id, { status });
    return this.apptRepo.findOne({ where: { id } });
  }
}
