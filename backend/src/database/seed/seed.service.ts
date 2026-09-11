import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as entities from '../../entities';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}

  async seed() {
    this.logger.log('Checking database seed state...');

    const userRepo = this.dataSource.getRepository(entities.User);
    const existingUser = await userRepo.findOne({ where: { username: 'admin' } });
    if (existingUser) {
      this.logger.log('Database already seeded. Skipping initial seeding.');
      return;
    }

    this.logger.log('Starting full enterprise hospital database seeding...');

    // 1. SEED USERS
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    const usersData = [
      { username: 'admin', email: 'sarah.vance@medcore.health', fullName: 'Dr. Sarah Vance, MD', role: 'super_admin', department: 'Trauma Unit A', badgeNumber: 'TRAUMA-DIR-01', phone: '+1 (555) 019-2831' },
      { username: 'doctor', email: 'marcus.brody@medcore.health', fullName: 'Dr. Marcus Brody, MD', role: 'doctor', department: 'Cardiology', badgeNumber: 'CARD-DOC-04', phone: '+1 (555) 019-4422' },
      { username: 'surgeon', email: 'elena.rostova@medcore.health', fullName: 'Dr. Elena Rostova, MD', role: 'surgeon', department: 'General Surgery', badgeNumber: 'SURG-LEAD-02', phone: '+1 (555) 019-8811' },
      { username: 'nurse', email: 'emily.chen@medcore.health', fullName: 'Nurse Emily Chen, BSN, RN', role: 'nurse', department: 'Trauma Unit A', badgeNumber: 'NURSE-CHG-12', phone: '+1 (555) 019-3399' },
      { username: 'emergency', email: 'robert.hayes@medcore.health', fullName: 'Dr. Robert Hayes, MD', role: 'emergency_staff', department: 'Emergency & ED', badgeNumber: 'EMERG-DIR-07', phone: '+1 (555) 019-1100' },
      { username: 'pharmacist', email: 'tariq.mansoor@medcore.health', fullName: 'Pharm. Tariq Al-Mansoor', role: 'pharmacist', department: 'Central Pharmacy', badgeNumber: 'PHARM-CHIEF-01', phone: '+1 (555) 019-5566' },
      { username: 'accountant', email: 'david.keller@medcore.health', fullName: 'David Keller, CPA', role: 'accountant', department: 'Finance & Billing', badgeNumber: 'FIN-CTRL-09', phone: '+1 (555) 019-7722' },
      { username: 'receptionist', email: 'maya.lin@medcore.health', fullName: 'Maya Lin', role: 'receptionist', department: 'Admissions & Reception', badgeNumber: 'ADMIT-CLERK-05', phone: '+1 (555) 019-9944' },
      { username: 'hr', email: 'jessica.alba@medcore.health', fullName: 'Jessica Alba, SHRM-SCP', role: 'hr', department: 'Human Resources', badgeNumber: 'HR-DIR-03', phone: '+1 (555) 019-2233' },
    ];

    for (const u of usersData) {
      await userRepo.save(userRepo.create({ ...u, passwordHash }));
    }

    // 2. SEED HOSPITAL STRUCTURE
    const branchRepo = this.dataSource.getRepository(entities.Branch);
    await branchRepo.save([
      { code: 'MAIN', name: 'Metro Central - Main Hospital', address: '742 Healthcare Boulevard, Medical District', phone: '+1 (555) 100-2000' },
      { code: 'EAST', name: 'East Wing Specialty Pavilion', address: '120 Innovation Parkway, East Bay', phone: '+1 (555) 100-3000' },
    ]);

    const deptRepo = this.dataSource.getRepository(entities.Department);
    await deptRepo.save([
      { code: 'EMERG', name: 'Emergency & Trauma Department', headStaff: 'Dr. Robert Hayes, MD' },
      { code: 'CARD', name: 'Cardiology & Catheterization Suite', headStaff: 'Dr. Marcus Brody, MD' },
      { code: 'SURG', name: 'General & Trauma Surgery', headStaff: 'Dr. Elena Rostova, MD' },
      { code: 'ICU', name: 'Intensive Critical Care Unit', headStaff: 'Dr. Sarah Vance, MD' },
      { code: 'PHARM', name: 'Pharmacy & Clinical Therapeutics', headStaff: 'Pharm. Tariq Al-Mansoor' },
      { code: 'RAD', name: 'Diagnostic Imaging & Radiology', headStaff: 'Dr. Nathan Drake, MD' },
      { code: 'LAB', name: 'Pathology & Clinical Laboratory', headStaff: 'Dr. Lisa Wong, PhD' },
      { code: 'FIN', name: 'Patient Billing & Finance', headStaff: 'David Keller, CPA' },
    ]);

    const bedRepo = this.dataSource.getRepository(entities.Bed);
    const sampleBeds = [
      { bedNumber: 'ICU-B01', roomNumber: 'RM-101', wardName: 'Intensive Critical Care (ICU)', wardType: 'ICU', status: 'occupied', patientName: 'Johnathan Miller', mrn: 'MRN-92810', admitTime: '2026-09-10 14:20', attendingDoctor: 'Dr. Sarah Vance, MD', nurseInCharge: 'Nurse Emily Chen, RN', o2Telemetry: '4.32 bar', dailyRate: 650.00 },
      { bedNumber: 'ICU-B02', roomNumber: 'RM-101', wardName: 'Intensive Critical Care (ICU)', wardType: 'ICU', status: 'occupied', patientName: 'Fatima Al-Sayed', mrn: 'MRN-84729', admitTime: '2026-09-11 02:15', attendingDoctor: 'Dr. Robert Hayes, MD', nurseInCharge: 'Nurse Emily Chen, RN', o2Telemetry: '4.28 bar', dailyRate: 650.00 },
      { bedNumber: 'ICU-B03', roomNumber: 'RM-102', wardName: 'Intensive Critical Care (ICU)', wardType: 'ICU', status: 'available', o2Telemetry: '4.35 bar', dailyRate: 650.00 },
      { bedNumber: 'ICU-B04', roomNumber: 'RM-102', wardName: 'Intensive Critical Care (ICU)', wardType: 'ICU', status: 'cleaning', o2Telemetry: '4.30 bar', dailyRate: 650.00 },
      { bedNumber: 'CARD-B01', roomNumber: 'RM-201', wardName: 'Cardiology Telemetry Ward', wardType: 'CARDIOLOGY', status: 'occupied', patientName: 'Robert Martinez', mrn: 'MRN-55214', admitTime: '2026-09-09 11:00', attendingDoctor: 'Dr. Marcus Brody, MD', nurseInCharge: 'Nurse David Kim, RN', o2Telemetry: '4.20 bar', dailyRate: 350.00 },
      { bedNumber: 'CARD-B02', roomNumber: 'RM-201', wardName: 'Cardiology Telemetry Ward', wardType: 'CARDIOLOGY', status: 'available', o2Telemetry: '4.30 bar', dailyRate: 350.00 },
      { bedNumber: 'CARD-B03', roomNumber: 'RM-202', wardName: 'Cardiology Telemetry Ward', wardType: 'CARDIOLOGY', status: 'reserved', o2Telemetry: '4.32 bar', dailyRate: 350.00 },
      { bedNumber: 'SURG-B01', roomNumber: 'RM-301', wardName: 'Post-Surgical Inpatient Ward', wardType: 'SURGERY', status: 'occupied', patientName: 'Sophia Reynolds', mrn: 'MRN-33108', admitTime: '2026-09-08 09:30', attendingDoctor: 'Dr. Elena Rostova, MD', nurseInCharge: 'Nurse Emily Chen, RN', o2Telemetry: '4.31 bar', dailyRate: 300.00 },
      { bedNumber: 'SURG-B02', roomNumber: 'RM-301', wardName: 'Post-Surgical Inpatient Ward', wardType: 'SURGERY', status: 'occupied', patientName: 'Khalid Mansour', mrn: 'MRN-77491', admitTime: '2026-09-11 08:00', attendingDoctor: 'Dr. Elena Rostova, MD', nurseInCharge: 'Nurse Lisa Adams, RN', o2Telemetry: '4.29 bar', dailyRate: 300.00 },
      { bedNumber: 'SURG-B03', roomNumber: 'RM-302', wardName: 'Post-Surgical Inpatient Ward', wardType: 'SURGERY', status: 'available', o2Telemetry: '4.33 bar', dailyRate: 300.00 },
      { bedNumber: 'PED-B01', roomNumber: 'RM-401', wardName: 'Pediatric Care Pavilion', wardType: 'PEDIATRICS', status: 'occupied', patientName: 'Noah Bennett', mrn: 'MRN-19482', admitTime: '2026-09-10 16:45', attendingDoctor: 'Dr. Robert Hayes, MD', nurseInCharge: 'Nurse Jessica Alba, RN', o2Telemetry: '4.30 bar', dailyRate: 220.00 },
      { bedNumber: 'PED-B02', roomNumber: 'RM-401', wardName: 'Pediatric Care Pavilion', wardType: 'PEDIATRICS', status: 'available', o2Telemetry: '4.32 bar', dailyRate: 220.00 },
    ];
    for (const b of sampleBeds) {
      await bedRepo.save(bedRepo.create(b));
    }

    // 3. SEED PATIENTS
    const patientRepo = this.dataSource.getRepository(entities.Patient);
    const samplePatients = [
      {
        mrn: 'MRN-92810',
        nationalId: 'NAT-998811223',
        firstName: 'Johnathan',
        lastName: 'Miller',
        gender: 'M',
        dateOfBirth: '1976-04-12',
        age: 50,
        bloodType: 'O+',
        phone: '+1 (555) 234-8901',
        address: '45 Lakeview Dr, Metro City',
        emergencyContactName: 'Clara Miller',
        emergencyContactRelationship: 'Spouse',
        emergencyContactPhone: '+1 (555) 234-8902',
        allergies: 'Penicillin, Sulfa Drugs, Cephalosporins',
        chronicConditions: 'Severe Hypertension, Coronary Artery Disease, Hyperlipidemia',
        insuranceProvider: 'MetLife Healthcare Platinum',
        insurancePolicyNumber: 'ML-99281-POL',
        insuranceCoveragePct: 85.00,
        balance: 450.00,
        status: 'Inpatient',
        assignedBed: 'ICU-B01',
        admissionDate: '2026-09-10 14:20',
      },
      {
        mrn: 'MRN-84729',
        nationalId: 'NAT-445566778',
        firstName: 'Fatima',
        lastName: 'Al-Sayed',
        gender: 'F',
        dateOfBirth: '1989-11-03',
        age: 36,
        bloodType: 'A+',
        phone: '+1 (555) 678-1234',
        address: '12 Al-Noor District, Metro City',
        emergencyContactName: 'Ahmed Al-Sayed',
        emergencyContactRelationship: 'Brother',
        emergencyContactPhone: '+1 (555) 678-1235',
        allergies: 'Latex, Iodine Contrast',
        chronicConditions: 'Type 1 Diabetes Mellitus, Asthma',
        insuranceProvider: 'Bupa Global Gold',
        insurancePolicyNumber: 'BUPA-4482-A',
        insuranceCoveragePct: 90.00,
        balance: 120.00,
        status: 'Inpatient',
        assignedBed: 'ICU-B02',
        admissionDate: '2026-09-11 02:15',
      },
      {
        mrn: 'MRN-55214',
        nationalId: 'NAT-332211990',
        firstName: 'Robert',
        lastName: 'Martinez',
        gender: 'M',
        dateOfBirth: '1962-07-21',
        age: 64,
        bloodType: 'B+',
        phone: '+1 (555) 901-4433',
        address: '88 Hillcrest Ave, Metro City',
        emergencyContactName: 'Maria Martinez',
        emergencyContactRelationship: 'Daughter',
        emergencyContactPhone: '+1 (555) 901-4434',
        allergies: 'Aspirin, NSAIDs',
        chronicConditions: 'Atrial Fibrillation, Chronic Heart Failure NYHA II',
        insuranceProvider: 'Aetna Senior Health',
        insurancePolicyNumber: 'AET-5521-SR',
        insuranceCoveragePct: 80.00,
        balance: 280.00,
        status: 'Inpatient',
        assignedBed: 'CARD-B01',
        admissionDate: '2026-09-09 11:00',
      },
      {
        mrn: 'MRN-33108',
        nationalId: 'NAT-778899001',
        firstName: 'Sophia',
        lastName: 'Reynolds',
        gender: 'F',
        dateOfBirth: '1995-02-14',
        age: 31,
        bloodType: 'AB-',
        phone: '+1 (555) 432-8765',
        address: '304 Downtown Plaza, Metro City',
        emergencyContactName: 'David Reynolds',
        emergencyContactRelationship: 'Father',
        emergencyContactPhone: '+1 (555) 432-8766',
        allergies: 'None Known (NKDA)',
        chronicConditions: 'Post-Appendectomy Recovery',
        insuranceProvider: 'Blue Cross Premier',
        insurancePolicyNumber: 'BC-3310-PR',
        insuranceCoveragePct: 80.00,
        balance: 0.00,
        status: 'Inpatient',
        assignedBed: 'SURG-B01',
        admissionDate: '2026-09-08 09:30',
      },
      {
        mrn: 'MRN-11094',
        nationalId: 'NAT-556677889',
        firstName: 'Tariq',
        lastName: 'Khoury',
        gender: 'M',
        dateOfBirth: '1984-09-18',
        age: 42,
        bloodType: 'O-',
        phone: '+1 (555) 876-5432',
        address: '15 Cedar Boulevard, Metro City',
        emergencyContactName: 'Leila Khoury',
        emergencyContactRelationship: 'Wife',
        emergencyContactPhone: '+1 (555) 876-5433',
        allergies: 'Morphine',
        chronicConditions: 'Migraine, GERD',
        insuranceProvider: 'Cigna Corporate Plan',
        insurancePolicyNumber: 'CIG-1109-CORP',
        insuranceCoveragePct: 85.00,
        balance: 50.00,
        status: 'Outpatient',
      },
    ];

    for (const p of samplePatients) {
      await patientRepo.save(patientRepo.create(p));
    }

    // 4. SEED EMERGENCY CASES (L1-L5 urgent spectrum matching Stitch design)
    const emergRepo = this.dataSource.getRepository(entities.EmergencyCase);
    const sampleEmerg = [
      {
        caseNumber: 'ED-2026-0891',
        patientName: 'Unidentified Trauma Male (MedEvac)',
        age: 38,
        gender: 'M',
        arrivalTime: '14:24 EST',
        acuityLevel: 1,
        acuityLabel: 'RESUS',
        chiefComplaint: 'High-speed motor vehicle collision, blunt thoracic trauma, paradoxical breathing, severe hemorrhagic shock',
        bay: 'Resuscitation Bay 2',
        vitalsHr: 142,
        vitalsBp: '74/48',
        vitalsSpo2: 84,
        vitalsTemp: 35.8,
        vitalsRr: 32,
        status: 'OR Bypass',
        doorToTriageMin: 1.2,
        doorToDocMin: 2.5,
        attendingPhysician: 'Dr. Sarah Vance, MD',
      },
      {
        caseNumber: 'ED-2026-0892',
        patientName: 'Fatima Al-Sayed',
        age: 36,
        gender: 'F',
        arrivalTime: '14:10 EST',
        acuityLevel: 1,
        acuityLabel: 'RESUS',
        chiefComplaint: 'Severe Diabetic Ketoacidosis with Kussmaul respirations, altered mental status, pH 6.9',
        bay: 'Resuscitation Bay 1',
        vitalsHr: 128,
        vitalsBp: '90/60',
        vitalsSpo2: 95,
        vitalsTemp: 38.4,
        vitalsRr: 28,
        status: 'Physician Exam',
        doorToTriageMin: 2.1,
        doorToDocMin: 4.8,
        attendingPhysician: 'Dr. Robert Hayes, MD',
      },
      {
        caseNumber: 'ED-2026-0893',
        patientName: 'Marcus Aurelius Vance',
        age: 58,
        gender: 'M',
        arrivalTime: '13:50 EST',
        acuityLevel: 2,
        acuityLabel: 'EMERG',
        chiefComplaint: 'Acute substernal chest pressure radiating to left mandible, diaphoresis, ECG shows 2mm ST-elevation in V2-V4',
        bay: 'Trauma Bay 4',
        vitalsHr: 104,
        vitalsBp: '162/98',
        vitalsSpo2: 93,
        vitalsTemp: 36.9,
        vitalsRr: 22,
        status: 'Diagnostics',
        doorToTriageMin: 3.5,
        doorToDocMin: 8.0,
        attendingPhysician: 'Dr. Marcus Brody, MD',
      },
      {
        caseNumber: 'ED-2026-0894',
        patientName: 'Elena Petrova',
        age: 29,
        gender: 'F',
        arrivalTime: '13:30 EST',
        acuityLevel: 3,
        acuityLabel: 'URG',
        chiefComplaint: 'Right lower quadrant abdominal pain with rebound tenderness, vomiting, fever x 18 hours',
        bay: 'Acute Bed 7',
        vitalsHr: 96,
        vitalsBp: '118/74',
        vitalsSpo2: 99,
        vitalsTemp: 38.6,
        vitalsRr: 18,
        status: 'Physician Exam',
        doorToTriageMin: 4.2,
        doorToDocMin: 14.5,
        attendingPhysician: 'Dr. Elena Rostova, MD',
      },
      {
        caseNumber: 'ED-2026-0895',
        patientName: 'David Lee',
        age: 44,
        gender: 'M',
        arrivalTime: '13:15 EST',
        acuityLevel: 4,
        acuityLabel: 'LESS',
        chiefComplaint: 'Closed Colles fracture of left distal radius following fall on outstretched hand. Neurovascularly intact.',
        bay: 'Minor Care 3',
        vitalsHr: 82,
        vitalsBp: '130/80',
        vitalsSpo2: 98,
        vitalsTemp: 36.8,
        vitalsRr: 16,
        status: 'Diagnostics',
        doorToTriageMin: 6.0,
        doorToDocMin: 24.0,
        attendingPhysician: 'Dr. Robert Hayes, MD',
      },
      {
        caseNumber: 'ED-2026-0896',
        patientName: 'Amira Hassan',
        age: 22,
        gender: 'F',
        arrivalTime: '12:55 EST',
        acuityLevel: 5,
        acuityLabel: 'NON',
        chiefComplaint: 'Suture removal from healed laceration, renewal of prescription inhaler',
        bay: 'Fast Track 1',
        vitalsHr: 72,
        vitalsBp: '115/72',
        vitalsSpo2: 100,
        vitalsTemp: 36.6,
        vitalsRr: 14,
        status: 'Awaiting Triage',
        doorToTriageMin: 8.5,
        doorToDocMin: 35.0,
        attendingPhysician: 'Dr. Robert Hayes, MD',
      },
    ];
    for (const ec of sampleEmerg) {
      await emergRepo.save(emergRepo.create(ec));
    }

    // 5. SEED PHARMACY & FEFO BATCHES
    const medRepo = this.dataSource.getRepository(entities.Medication);
    const batchRepo = this.dataSource.getRepository(entities.MedicationBatch);

    const medsData = [
      { code: 'MED-CEFT-1G', name: 'Ceftriaxone Sodium 1g Injection', genericName: 'Ceftriaxone', category: 'Antibiotic', form: 'Vial', strength: '1g', reorderLevel: 50, unitCost: 8.50, sellingPrice: 22.00, totalStock: 480 },
      { code: 'MED-PROP-200', name: 'Propofol 1% 20ml Emulsion', genericName: 'Propofol', category: 'Anesthetic', form: 'Ampoule', strength: '10mg/mL', reorderLevel: 30, unitCost: 14.20, sellingPrice: 38.00, totalStock: 145 },
      { code: 'MED-EPIN-1MG', name: 'Epinephrine 1:1000 Injection', genericName: 'Epinephrine', category: 'Emergency Resuscitation', form: 'Ampoule', strength: '1mg/mL', reorderLevel: 40, unitCost: 4.80, sellingPrice: 15.00, totalStock: 220 },
      { code: 'MED-ATOR-20', name: 'Atorvastatin Calcium 20mg Tablets', genericName: 'Atorvastatin', category: 'Cardiovascular', form: 'Tablet', strength: '20mg', reorderLevel: 100, unitCost: 0.45, sellingPrice: 1.80, totalStock: 1200 },
      { code: 'MED-METF-500', name: 'Metformin HCl 500mg Tablets', genericName: 'Metformin', category: 'Antidiabetic', form: 'Tablet', strength: '500mg', reorderLevel: 80, unitCost: 0.25, sellingPrice: 1.10, totalStock: 950 },
      { code: 'MED-ENOX-40', name: 'Enoxaparin Sodium 40mg/0.4mL Syringe', genericName: 'Enoxaparin', category: 'Anticoagulant', form: 'Prefilled Syringe', strength: '40mg', reorderLevel: 40, unitCost: 18.00, sellingPrice: 45.00, totalStock: 85 },
      { code: 'MED-MORPH-10', name: 'Morphine Sulfate 10mg/mL Injection', genericName: 'Morphine', category: 'Controlled Opioid Analgesic', form: 'Ampoule', strength: '10mg/mL', reorderLevel: 25, unitCost: 6.20, sellingPrice: 25.00, totalStock: 60 },
    ];

    for (const m of medsData) {
      const savedMed = await medRepo.save(medRepo.create(m));

      // Create 2 batches for FEFO demonstration
      await batchRepo.save([
        {
          medicationId: savedMed.id,
          name: savedMed.name,
          genericName: savedMed.genericName,
          form: savedMed.form,
          strength: savedMed.strength,
          batchNumber: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          expiryDate: '2026-10-15', // Expiring in ~34 days (triggers FEFO priority & near-expiry warning)
          daysToExpiry: 34,
          quantity: 45,
          unitCost: savedMed.unitCost,
          sellingPrice: savedMed.sellingPrice,
          location: 'Cold Storage Vault - Bay 1',
          isLowStock: false,
          isExpiringSoon: true,
        },
        {
          medicationId: savedMed.id,
          name: savedMed.name,
          genericName: savedMed.genericName,
          form: savedMed.form,
          strength: savedMed.strength,
          batchNumber: `LOT-2027-${Math.floor(1000 + Math.random() * 9000)}`,
          expiryDate: '2027-08-30', // Fresh batch
          daysToExpiry: 353,
          quantity: 200,
          unitCost: savedMed.unitCost,
          sellingPrice: savedMed.sellingPrice,
          location: 'Central Pharmacy - Aisle 3B',
          isLowStock: false,
          isExpiringSoon: false,
        },
      ]);
    }

    // 6. SEED SURGERY / OPERATING ROOM SUITES
    const opRepo = this.dataSource.getRepository(entities.Operation);
    await opRepo.save([
      {
        operationNumber: 'OR-2026-0412',
        patientName: 'Unidentified Trauma Male (MedEvac)',
        mrn: 'MRN-ED-TEMP-01',
        procedureName: 'Emergency Exploratory Laparotomy & Splenectomy with Hemorrhage Control',
        orRoom: 'OR-3 (Trauma Suite)',
        leadSurgeon: 'Dr. Elena Rostova, MD',
        anesthetist: 'Dr. Nathan Vance, MD',
        circulatingNurse: 'Nurse Lisa Adams, RN',
        scheduledTime: '14:35 EST (STAT Bypassed)',
        actualDuration: '01h 45m',
        status: 'IN_SURGERY',
        preOpDiagnosis: 'Hemoperitoneum secondary to grade IV splenic rupture and pelvic fracture',
        postOpDiagnosis: 'Splenectomy completed, packed retroperitoneum, temporary abdominal closure',
        consumablesCost: 1420.00,
        surgeonShare: 1850.00,
        grossRevenue: 6800.00,
      },
      {
        operationNumber: 'OR-2026-0410',
        patientName: 'Sophia Reynolds',
        mrn: 'MRN-33108',
        procedureName: 'Laparoscopic Appendectomy',
        orRoom: 'OR-1 (Minimally Invasive)',
        leadSurgeon: 'Dr. Elena Rostova, MD',
        anesthetist: 'Dr. Paul Simon, MD',
        circulatingNurse: 'Nurse Emily Chen, RN',
        scheduledTime: '2026-09-08 10:00',
        actualDuration: '48m',
        status: 'COMPLETED',
        preOpDiagnosis: 'Acute suppurative appendicitis',
        postOpDiagnosis: 'Uncomplicated laparoscopic appendectomy',
        consumablesCost: 480.00,
        surgeonShare: 750.00,
        grossRevenue: 3200.00,
      },
    ]);

    // 7. SEED NURSING VITALS & MAR
    const vitalsRepo = this.dataSource.getRepository(entities.VitalSign);
    await vitalsRepo.save([
      {
        patientId: 'patient-jm',
        admissionId: 'adm-01',
        recordedAt: '14:00 EST',
        recordedBy: 'Nurse Emily Chen, RN',
        temperature: 38.6,
        pulse: 114,
        systolicBP: 168,
        diastolicBP: 104,
        respiratoryRate: 24,
        oxygenSaturation: 91, // Critical abnormal warning
        bloodGlucose: 185.0,
        notes: 'Patient restless, diaphoretic, increased work of breathing. Escalated to Dr. Sarah Vance.',
        isAbnormal: true,
      },
      {
        patientId: 'patient-fas',
        admissionId: 'adm-02',
        recordedAt: '13:45 EST',
        recordedBy: 'Nurse Emily Chen, RN',
        temperature: 37.1,
        pulse: 78,
        systolicBP: 124,
        diastolicBP: 80,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        bloodGlucose: 110.0,
        notes: 'Vitals stable on 2L O2 via nasal cannula. Blood glucose stabilized post IV insulin infusion.',
        isAbnormal: false,
      },
    ]);

    const marRepo = this.dataSource.getRepository(entities.MARRecord);
    await marRepo.save([
      {
        patientId: 'patient-jm',
        patientName: 'Johnathan Miller',
        bedNumber: 'ICU-B01',
        medication: 'Ceftriaxone Sodium 1g IV',
        dose: '1g',
        route: 'IV',
        scheduledTime: '14:00 EST',
        status: 'ADMINISTERED',
        administeredBy: 'Nurse Emily Chen, RN',
        administeredAt: '14:05 EST',
        notes: 'Infused over 30 minutes. No allergic cutaneous reactions observed.',
      },
      {
        patientId: 'patient-jm',
        patientName: 'Johnathan Miller',
        bedNumber: 'ICU-B01',
        medication: 'Enoxaparin Sodium 40mg SC',
        dose: '40mg',
        route: 'SC',
        scheduledTime: '16:00 EST',
        status: 'DUE',
        notes: 'DVT prophylaxis daily dose.',
      },
      {
        patientId: 'patient-fas',
        patientName: 'Fatima Al-Sayed',
        bedNumber: 'ICU-B02',
        medication: 'Regular Insulin IV Infusion (100u/100mL NS)',
        dose: '4 units/hr',
        route: 'IV',
        scheduledTime: 'Continuous Titration',
        status: 'ADMINISTERED',
        administeredBy: 'Nurse Emily Chen, RN',
        administeredAt: '13:00 EST',
        notes: 'Titrate hourly based on blood glucose checks target 140-180 mg/dL.',
      },
    ]);

    // 8. SEED BILLING INVOICES & PAYMENTS
    const invoiceRepo = this.dataSource.getRepository(entities.Invoice);
    await invoiceRepo.save([
      {
        invoiceNumber: 'INV-2026-9812',
        patientName: 'Johnathan Miller',
        mrn: 'MRN-92810',
        date: '2026-09-11',
        itemsJson: JSON.stringify([
          { description: 'ICU High-Acuity Bed Daily Rate (Day 1)', category: 'Bed Charge', qty: 1, unitPrice: 650.00, total: 650.00 },
          { description: 'Critical Care Consultation - Initial', category: 'Physician', qty: 1, unitPrice: 350.00, total: 350.00 },
          { description: 'Ceftriaxone Sodium 1g IVPB', category: 'Medication', qty: 2, unitPrice: 22.00, total: 44.00 },
          { description: 'Arterial Blood Gas (ABG) Analysis STAT', category: 'Laboratory', qty: 2, unitPrice: 85.00, total: 170.00 },
        ]),
        subtotal: 1214.00,
        discount: 0.00,
        tax: 60.70,
        total: 1274.70,
        paid: 824.70,
        balance: 450.00,
        status: 'PARTIAL',
      },
      {
        invoiceNumber: 'INV-2026-9811',
        patientName: 'Sophia Reynolds',
        mrn: 'MRN-33108',
        date: '2026-09-08',
        itemsJson: JSON.stringify([
          { description: 'Laparoscopic Appendectomy Procedure', category: 'Surgery', qty: 1, unitPrice: 3200.00, total: 3200.00 },
          { description: 'Post-Op Surgical Bed - 2 Days', category: 'Bed Charge', qty: 2, unitPrice: 300.00, total: 600.00 },
        ]),
        subtotal: 3800.00,
        discount: 100.00,
        tax: 185.00,
        total: 3885.00,
        paid: 3885.00,
        balance: 0.00,
        status: 'PAID',
      },
    ]);

    // 9. SEED PAYROLL & DOCTOR COMMISSIONS
    const empRepo = this.dataSource.getRepository(entities.Employee);
    await empRepo.save([
      { employeeCode: 'EMP-001', fullName: 'Dr. Sarah Vance, MD', department: 'Trauma Unit A', jobTitle: 'Director of Trauma & Critical Care', basicSalary: 18500.00, housingAllowance: 2500.00, transportAllowance: 800.00 },
      { employeeCode: 'EMP-002', fullName: 'Dr. Elena Rostova, MD', department: 'General Surgery', jobTitle: 'Chief Trauma Surgeon', basicSalary: 17000.00, housingAllowance: 2500.00, transportAllowance: 800.00 },
      { employeeCode: 'EMP-003', fullName: 'Dr. Marcus Brody, MD', department: 'Cardiology', jobTitle: 'Attending Cardiologist', basicSalary: 16500.00, housingAllowance: 2200.00, transportAllowance: 800.00 },
      { employeeCode: 'EMP-004', fullName: 'Nurse Emily Chen, RN', department: 'Trauma Unit A', jobTitle: 'Charge Nurse BSN', basicSalary: 6800.00, housingAllowance: 1200.00, transportAllowance: 500.00 },
      { employeeCode: 'EMP-005', fullName: 'Pharm. Tariq Al-Mansoor', department: 'Central Pharmacy', jobTitle: 'Chief Clinical Pharmacist', basicSalary: 8200.00, housingAllowance: 1500.00, transportAllowance: 600.00 },
    ]);

    const payrollRecordRepo = this.dataSource.getRepository(entities.PayrollRecord);
    await payrollRecordRepo.save([
      {
        period: 'September 2026',
        employeeCode: 'EMP-002',
        employeeName: 'Dr. Elena Rostova, MD',
        jobTitle: 'Chief Trauma Surgeon',
        basicSalary: 17000.00,
        allowances: 3300.00,
        doctorCommissions: 4850.00, // Surgical revenue shares
        overtimeBonus: 0.00,
        deductions: 850.00,
        netPayable: 24300.00,
        status: 'APPROVED',
      },
      {
        period: 'September 2026',
        employeeCode: 'EMP-004',
        employeeName: 'Nurse Emily Chen, RN',
        jobTitle: 'Charge Nurse BSN',
        basicSalary: 6800.00,
        allowances: 1700.00,
        doctorCommissions: 0.00,
        overtimeBonus: 640.00,
        deductions: 320.00,
        netPayable: 8820.00,
        status: 'APPROVED',
      },
    ]);

    // 10. SEED AUDIT LOGS
    const auditRepo = this.dataSource.getRepository(entities.AuditLog);
    await auditRepo.save([
      { timestamp: '2026-09-11 14:24:18', user: 'Dr. Sarah Vance, MD', role: 'super_admin', action: 'CODE_RED_ACTIVATED', entity: 'TRAUMA_SYSTEM', entityId: 'OR-3', ipAddress: '192.168.10.12', details: 'Activated Trauma Code Red for MedEvac inflow. OR-3 on active bypass standby.', severity: 'CRITICAL' },
      { timestamp: '2026-09-11 14:05:22', user: 'Nurse Emily Chen, RN', role: 'nurse', action: 'DISPENSED_AND_ADMINISTERED', entity: 'MEDICATION', entityId: 'MED-CEFT-1G', ipAddress: '192.168.10.45', details: 'Administered Ceftriaxone 1g IVPB (Lot LOT-2026-1940) to patient Johnathan Miller (MRN-92810)', severity: 'INFO' },
      { timestamp: '2026-09-11 13:45:10', user: 'David Keller, CPA', role: 'accountant', action: 'INVOICE_PARTIAL_PAYMENT', entity: 'INVOICE', entityId: 'INV-2026-9812', ipAddress: '192.168.10.88', details: 'Processed partial payment of $824.70 via Credit Card for MRN-92810. Balance: $450.00', severity: 'INFO' },
      { timestamp: '2026-09-11 11:15:00', user: 'Pharm. Tariq Al-Mansoor', role: 'pharmacist', action: 'FEFO_BATCH_DEDUCTION', entity: 'INVENTORY_BATCH', entityId: 'LOT-2026-1940', ipAddress: '192.168.10.33', details: 'Selected earliest expiration lot for automated dispensing. Stock updated from 480 to 478.', severity: 'INFO' },
    ]);

    this.logger.log('Enterprise Hospital Database seeded successfully!');
  }
}
