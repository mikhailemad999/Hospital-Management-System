import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication, MedicationBatch, StockMovement } from '../../entities';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Medication)
    private medRepo: Repository<Medication>,
    @InjectRepository(MedicationBatch)
    private batchRepo: Repository<MedicationBatch>,
    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,
  ) {}

  async getMedications() {
    return this.medRepo.find();
  }

  async getBatches(medicationId?: string) {
    if (medicationId) {
      return this.batchRepo.find({
        where: { medicationId },
        order: { expiryDate: 'ASC' }, // FEFO order!
      });
    }
    return this.batchRepo.find({ order: { expiryDate: 'ASC' } });
  }

  async getAlerts() {
    const batches = await this.batchRepo.find({ order: { expiryDate: 'ASC' } });
    const expiringSoon = batches.filter((b) => b.isExpiringSoon || b.daysToExpiry < 60);
    const lowStock = batches.filter((b) => b.isLowStock || b.quantity < 50);
    return { expiringSoon, lowStock };
  }

  /**
   * FEFO Dispense: First-Expired, First-Out
   * Automatically picks the batch with the earliest expiry date that has stock
   */
  async dispenseFEFO(medicationId: string, quantity: number, patientName: string, mrn: string, performedBy: string) {
    const batches = await this.batchRepo.find({
      where: { medicationId },
      order: { expiryDate: 'ASC' }, // Earliest expiry first
    });

    const candidate = batches.find((b) => b.quantity >= quantity);
    if (!candidate) {
      throw new BadRequestException('Insufficient stock available for this medication.');
    }

    candidate.quantity -= quantity;
    if (candidate.quantity < 30) candidate.isLowStock = true;
    await this.batchRepo.save(candidate);

    // Update total stock on parent medication
    const med = await this.medRepo.findOne({ where: { id: medicationId } });
    if (med) {
      med.totalStock -= quantity;
      await this.medRepo.save(med);
    }

    // Log immutable stock movement
    const movement = this.movementRepo.create({
      batchId: candidate.id,
      medicationName: candidate.name,
      batchNumber: candidate.batchNumber,
      movementType: 'PATIENT_DISPENSE',
      quantity: -quantity,
      unitCost: candidate.unitCost,
      patientName,
      mrn,
      reason: `FEFO Automated Dispensing for patient ${patientName} (${mrn})`,
      performedBy,
    });
    await this.movementRepo.save(movement);

    return {
      success: true,
      batchUsed: candidate.batchNumber,
      expiryDate: candidate.expiryDate,
      remainingBatchQuantity: candidate.quantity,
      dispensedQuantity: quantity,
    };
  }

  async receiveStock(data: Partial<MedicationBatch> & Record<string, any>) {
    if (!data.batchNumber) {
      data.batchNumber = `LOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!data.expiryDate) {
      data.expiryDate = '2027-12-31';
    }
    if (data.daysToExpiry === undefined) {
      data.daysToExpiry = 365;
    }
    if (!data.location) {
      data.location = 'Rack A-04';
    }

    // Lookup medication if medicationId is provided
    if (data.medicationId) {
      const med = await this.medRepo.findOne({ where: { id: data.medicationId } });
      if (med) {
        data.name = data.name || med.name;
        data.genericName = data.genericName || med.genericName;
        data.form = data.form || med.form;
        data.strength = data.strength || med.strength;
        data.unitCost = data.unitCost !== undefined ? data.unitCost : med.unitCost;
        data.sellingPrice = data.sellingPrice !== undefined ? data.sellingPrice : med.sellingPrice;

        med.totalStock += (data.quantity || 0);
        await this.medRepo.save(med);
      }
    }

    data.name = data.name || 'Generic Pharmaceutical';
    data.genericName = data.genericName || 'Active Chemical Ingredient';
    data.form = data.form || 'Tablet';
    data.strength = data.strength || '500mg';
    data.quantity = data.quantity !== undefined ? data.quantity : 100;
    data.unitCost = data.unitCost !== undefined ? data.unitCost : 12.50;
    data.sellingPrice = data.sellingPrice !== undefined ? data.sellingPrice : 22.00;

    const batch = this.batchRepo.create(data);
    const saved = await this.batchRepo.save(batch);

    return saved;
  }

  async getMovements() {
    return this.movementRepo.find({ order: { createdAt: 'DESC' } });
  }
}
