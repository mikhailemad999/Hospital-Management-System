import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabOrder, LabResult, RadiologyOrder, AuditLog } from '../../entities';

@Injectable()
export class DiagnosticsService {
  constructor(
    @InjectRepository(LabOrder)
    private labOrderRepo: Repository<LabOrder>,
    @InjectRepository(LabResult)
    private labResultRepo: Repository<LabResult>,
    @InjectRepository(RadiologyOrder)
    private radiologyRepo: Repository<RadiologyOrder>,
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  // ================= LAB ORDERS =================
  async findLabOrders() {
    const orders = await this.labOrderRepo.find({
      order: { createdAt: 'DESC' },
    });
    const results = await this.labResultRepo.find();
    return orders.map((order) => ({
      ...order,
      results: results.filter((r) => r.orderId === order.id),
    }));
  }

  async createLabOrder(data: Partial<LabOrder> & { results?: Partial<LabResult>[] }) {
    const count = await this.labOrderRepo.count();
    const orderNumber = data.orderNumber || `LAB-${new Date().getFullYear()}-${4400 + count + 1}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} EST`;

    const order = this.labOrderRepo.create({
      orderNumber,
      patientName: data.patientName || 'Walk-in Patient',
      mrn: data.mrn || 'MRN-PENDING',
      testName: data.testName || 'Comprehensive Metabolic Panel',
      priority: data.priority || 'ROUTINE',
      status: data.status || 'PENDING',
      orderedBy: data.orderedBy || 'Attending Physician',
      orderedAt: data.orderedAt || timeStr,
    });

    const savedOrder = await this.labOrderRepo.save(order);

    if (data.results && data.results.length > 0) {
      for (const res of data.results) {
        await this.labResultRepo.save(
          this.labResultRepo.create({
            orderId: savedOrder.id,
            parameter: res.parameter || 'General Analyte',
            value: res.value || 'Normal',
            referenceRange: res.referenceRange || 'Reference normal',
            unit: res.unit || '',
            isAbnormal: !!res.isAbnormal,
          }),
        );
      }
    }

    // Audit log
    await this.auditRepo.save(
      this.auditRepo.create({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: data.orderedBy || 'Medical Staff',
        role: 'doctor',
        action: 'LAB_ORDER_DISPATCHED',
        entity: 'LAB_ORDER',
        entityId: savedOrder.orderNumber,
        ipAddress: '127.0.0.1',
        details: `Dispatched Lab Test ${savedOrder.testName} (${savedOrder.priority}) for ${savedOrder.patientName} (${savedOrder.mrn})`,
        severity: savedOrder.priority === 'STAT' ? 'CRITICAL' : 'INFO',
      }),
    );

    return savedOrder;
  }

  async updateLabOrderStatus(id: string, status: string) {
    const order = await this.labOrderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Lab order not found');

    order.status = status;
    await this.labOrderRepo.save(order);

    await this.auditRepo.save(
      this.auditRepo.create({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: 'Laboratory Diagnostics Staff',
        role: 'lab_technician',
        action: 'LAB_STATUS_UPDATED',
        entity: 'LAB_ORDER',
        entityId: order.orderNumber,
        ipAddress: '127.0.0.1',
        details: `Lab Order ${order.orderNumber} status advanced to ${status}`,
        severity: 'INFO',
      }),
    );

    return order;
  }

  async addLabResult(orderId: string, resultData: Partial<LabResult>) {
    const order = await this.labOrderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Lab order not found');

    const result = this.labResultRepo.create({
      orderId,
      parameter: resultData.parameter || 'Test Parameter',
      value: resultData.value || 'Within Normal Limits',
      referenceRange: resultData.referenceRange || 'Standard',
      unit: resultData.unit || '',
      isAbnormal: !!resultData.isAbnormal,
    });

    const savedResult = await this.labResultRepo.save(result);

    order.status = 'COMPLETED';
    await this.labOrderRepo.save(order);

    return savedResult;
  }

  // ================= RADIOLOGY / PACS =================
  async findRadiologyOrders() {
    return this.radiologyRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createRadiologyOrder(data: Partial<RadiologyOrder>) {
    const count = await this.radiologyRepo.count();
    const orderNumber = data.orderNumber || `RAD-${new Date().getFullYear()}-${1080 + count + 1}`;

    const order = this.radiologyRepo.create({
      orderNumber,
      patientName: data.patientName || 'Emergency Patient',
      mrn: data.mrn || 'MRN-PENDING',
      modality: data.modality || 'CT',
      studyDescription: data.studyDescription || 'Diagnostic Imaging Study',
      priority: data.priority || 'ROUTINE',
      status: data.status || 'SCHEDULED',
      orderedBy: data.orderedBy || 'Attending Physician',
      findings: data.findings || null,
      impression: data.impression || null,
      radiologist: data.radiologist || null,
    });

    const savedOrder = await this.radiologyRepo.save(order);

    await this.auditRepo.save(
      this.auditRepo.create({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: data.orderedBy || 'Medical Staff',
        role: 'doctor',
        action: 'RADIOLOGY_STUDY_ORDERED',
        entity: 'RADIOLOGY_ORDER',
        entityId: savedOrder.orderNumber,
        ipAddress: '127.0.0.1',
        details: `Ordered ${savedOrder.modality} Study: ${savedOrder.studyDescription} (${savedOrder.priority}) for ${savedOrder.patientName}`,
        severity: savedOrder.priority === 'STAT' ? 'CRITICAL' : 'INFO',
      }),
    );

    return savedOrder;
  }

  async updateRadiologyReport(id: string, data: Partial<RadiologyOrder>) {
    const order = await this.radiologyRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Radiology order not found');

    if (data.findings) order.findings = data.findings;
    if (data.impression) order.impression = data.impression;
    if (data.radiologist) order.radiologist = data.radiologist;
    if (data.status) order.status = data.status;
    else order.status = 'REPORTED';

    const saved = await this.radiologyRepo.save(order);

    await this.auditRepo.save(
      this.auditRepo.create({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: order.radiologist || 'Radiologist On-Call',
        role: 'doctor',
        action: 'RADIOLOGY_REPORT_SIGNED',
        entity: 'RADIOLOGY_ORDER',
        entityId: order.orderNumber,
        ipAddress: '127.0.0.1',
        details: `Signed diagnostic radiology report for ${order.orderNumber} (${order.modality})`,
        severity: 'INFO',
      }),
    );

    return saved;
  }
}
