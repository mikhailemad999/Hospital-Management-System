import * as http from 'http';

function request(path: string, method: string = 'GET', data?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request(
      {
        host: '127.0.0.1',
        port: 4000,
        path: '/api/v1' + path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 500, body: raw ? JSON.parse(raw) : null });
          } catch {
            resolve({ status: res.statusCode || 500, body: raw });
          }
        });
      },
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runE2ETests() {
  console.log('====================================================');
  console.log('  HOSPITAL PRO E2E API VERIFICATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function assertTest(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✔ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name} -> ${err.message || err}`);
      failed++;
    }
  }

  // 1. Auth Module
  await assertTest('Auth: login with administrative credentials', async () => {
    const res = await request('/auth/login', 'POST', { username: 'admin', password: 'Admin123!' });
    if (res.status !== 201 || !res.body?.accessToken) throw new Error(`Unexpected response: ${res.status}`);
  });

  await assertTest('Auth: retrieve user list', async () => {
    const res = await request('/auth/users', 'GET');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Unexpected status: ${res.status}`);
  });

  // 2. Telemetry & Command Center
  await assertTest('Telemetry: executive command center overview', async () => {
    const res = await request('/telemetry/command-center', 'GET');
    if (res.status !== 200 || !res.body?.kpis) throw new Error(`Telemetry failed`);
  });

  // 3. Hospital Infrastructure
  let bedId = '';
  await assertTest('Hospital: branches, departments and beds query', async () => {
    const branches = await request('/hospital/branches');
    const departments = await request('/hospital/departments');
    const beds = await request('/hospital/beds');
    if (branches.status !== 200 || departments.status !== 200 || beds.status !== 200) throw new Error('Hospital query failed');
    bedId = beds.body[0]?.id;
  });

  await assertTest('Hospital: update bed status', async () => {
    if (!bedId) throw new Error('No bed id found');
    const res = await request(`/hospital/beds/${bedId}/status`, 'PATCH', {
      status: 'occupied',
      patientName: 'Test Automation Bed Patient',
      mrn: 'MRN-AUTO-BED',
    });
    if (res.status !== 200) throw new Error(`Failed bed status update: ${res.status}`);
  });

  // 4. Patients
  let patientId = '';
  await assertTest('Patients: register new patient record', async () => {
    const res = await request('/patients', 'POST', {
      fullName: 'Dr. Jane Automated Doe',
      dateOfBirth: '1988-03-22',
      gender: 'F',
      bloodType: 'A+',
      contactPhone: '+1 (555) 998-0011',
      allergies: ['Amoxicillin', 'Latex'],
      chronicConditions: ['Mild Asthma'],
      insurance: { provider: 'Blue Cross Blue Shield', policyNumber: 'BCBS-102938', coveragePct: 85 },
      status: 'Outpatient',
    });
    if (res.status !== 201 || !res.body?.id) throw new Error(`Failed to create patient: ${res.status}`);
    patientId = res.body.id;
  });

  await assertTest('Patients: retrieve patient by ID and update', async () => {
    const resGet = await request(`/patients/${patientId}`);
    if (resGet.status !== 200) throw new Error('Failed to retrieve patient');
    const resPut = await request(`/patients/${patientId}`, 'PUT', {
      allergies: 'Latex only',
    });
    if (resPut.status !== 200) throw new Error('Failed to update patient');
  });

  // 5. Appointments & OPD Queue
  let appointmentId = '';
  await assertTest('Appointments: issue OPD ticket and queue advancement', async () => {
    const ticketRes = await request('/appointments/ticket', 'POST', {
      patientName: 'Dr. Jane Automated Doe',
      department: 'Cardiology',
      doctorName: 'Dr. Marcus Brody, MD',
    });
    if (ticketRes.status !== 201 || !ticketRes.body?.id) throw new Error('Failed ticket creation');
    appointmentId = ticketRes.body.id;

    const advanceRes = await request(`/appointments/${appointmentId}/status`, 'PATCH', { status: 'CALLED' });
    if (advanceRes.status !== 200) throw new Error('Failed to update appointment status');
  });

  // 6. Emergency & ED Trauma Board
  let emergencyCaseId = '';
  await assertTest('Emergency: rapid trauma intake & triage', async () => {
    const res = await request('/emergency/intake', 'POST', {
      patientName: 'Trauma Rapid Intake Patient',
      esiLevel: 1,
      chiefComplaint: 'Multiple blunt trauma / Motor vehicle accident',
      bay: 'Trauma Bay 01',
      vitals: { hr: 130, bp: '85/55', spo2: 90, temp: 36.4, rr: 28 },
    });
    if (res.status !== 201 || !res.body?.id) throw new Error('Failed emergency intake');
    emergencyCaseId = res.body.id;

    const patchRes = await request(`/emergency/cases/${emergencyCaseId}/status`, 'PATCH', {
      status: 'In Surgery',
      bay: 'OR Suite 3',
    });
    if (patchRes.status !== 200) throw new Error('Failed emergency status update');
  });

  // 7. Nursing, MAR & Vitals
  await assertTest('Nursing: record bedside vitals and nursing handover notes', async () => {
    const vitalsRes = await request('/nursing/vitals', 'POST', {
      patientId,
      bloodPressure: '122/82',
      heartRate: 74,
      temperature: 36.8,
      spo2: 99,
      recordedBy: 'Nurse Emily Chen, RN',
    });
    if (vitalsRes.status !== 201) throw new Error('Failed vitals recording');

    const noteRes = await request('/nursing/notes', 'POST', {
      patientId,
      shift: 'Day Shift',
      nurseName: 'Nurse Emily Chen, RN',
      content: 'Patient resting comfortably. Post-medication review completed.',
    });
    if (noteRes.status !== 201) throw new Error('Failed nursing note creation');

    const marList = await request('/nursing/mar');
    if (marList.body?.length) {
      const marId = marList.body[0].id;
      const marAdminRes = await request(`/nursing/mar/${marId}/administer`, 'POST', {
        nurseName: 'Nurse Emily Chen, RN',
        notes: 'Administered on schedule',
      });
      if (marAdminRes.status !== 201 && marAdminRes.status !== 200) throw new Error('Failed MAR administration');
    }
  });

  // 8. Pharmacy & FEFO Inventory
  await assertTest('Pharmacy: receive medication batch and FEFO dispense', async () => {
    const meds = await request('/pharmacy/medications');
    const targetMed = meds.body?.[0];
    if (!targetMed) throw new Error('No medications found in database');

    const receiveRes = await request('/pharmacy/receive', 'POST', {
      medicationId: targetMed.id,
      quantity: 50,
      unitCost: targetMed.unitCost,
      expiryDate: '2028-06-30',
    });
    if (receiveRes.status !== 201) throw new Error('Failed pharmacy stock receipt');

    const dispenseRes = await request('/pharmacy/dispense', 'POST', {
      medicationId: targetMed.id,
      quantity: 2,
      patientName: 'Dr. Jane Automated Doe',
      mrn: 'MRN-AUTO-99',
      performedBy: 'Pharm. Tariq Al-Mansoor',
    });
    if (dispenseRes.status !== 201) throw new Error('Failed FEFO dispense');
  });

  // 9. Surgical Theaters & OR Matrix
  await assertTest('Operations: schedule surgery and log consumables', async () => {
    const opRes = await request('/operations/schedules', 'POST', {
      patientName: 'Trauma Rapid Intake Patient',
      procedureName: 'Emergency Exploratory Laparotomy',
      leadSurgeon: 'Dr. Elena Rostova, MD',
      orRoom: 'OR Suite 3',
    });
    if (opRes.status !== 201 || !opRes.body?.id) throw new Error('Failed surgery scheduling');
    const opId = opRes.body.id;

    const consumableRes = await request('/operations/consumables', 'POST', {
      operationId: opId,
      itemName: 'Hemostatic Matrix Gel',
      quantity: 2,
      unitCost: 85.0,
    });
    if (consumableRes.status !== 201) throw new Error('Failed consumable logging');
  });

  // 10. Billing, Invoices & Payments
  await assertTest('Billing: generate patient invoice and process cashier payment', async () => {
    const invRes = await request('/billing/invoices', 'POST', {
      patientName: 'Dr. Jane Automated Doe',
      totalAmount: 480.0,
      items: [{ description: 'ER Consultation & Imaging Diagnostics', qty: 1, unitPrice: 480.0, total: 480.0 }],
    });
    if (invRes.status !== 201 || !invRes.body?.id) throw new Error('Failed invoice creation');
    const invId = invRes.body.id;

    const payRes = await request('/billing/payments', 'POST', {
      invoiceId: invId,
      amount: 480.0,
      method: 'credit_card',
      cashierName: 'David Keller, CPA',
    });
    if (payRes.status !== 201) throw new Error('Failed payment processing');
  });

  // 11. Inpatient Ward Census, Bed Transfers & Discharges
  await assertTest('Inpatient: admit patient, transfer ward bed, and discharge', async () => {
    const admitRes = await request('/inpatient/admissions', 'POST', {
      patientName: 'Admitted Inpatient Candidate',
      ward: 'ICU',
      bedNumber: 'ICU-Bed-02',
      diagnosis: 'Severe Community Acquired Pneumonia',
    });
    if (admitRes.status !== 201 || !admitRes.body?.id) throw new Error('Failed inpatient admission');
    const admId = admitRes.body.id;

    const transferRes = await request('/inpatient/transfer', 'POST', {
      admissionId: admId,
      toBedNumber: 'ICU-Bed-05',
      reason: 'Step-down monitoring suite',
      staffName: 'Dr. Sarah Vance, MD',
    });
    if (transferRes.status !== 201) throw new Error('Failed bed transfer');

    const dischargeRes = await request(`/inpatient/discharge/${admId}`, 'POST', {
      summary: 'Patient clinically stable, normal respiratory parameters on room air.',
    });
    if (dischargeRes.status !== 201 && dischargeRes.status !== 200) throw new Error('Failed patient discharge');
  });

  // 12. Payroll, Attendance & Biometric Clock
  await assertTest('Payroll: biometric clock-in and payroll period calculation', async () => {
    const clockRes = await request('/payroll/clock', 'POST', {
      employeeCode: 'EMP-DOC-01',
      shiftType: 'Day',
    });
    if (clockRes.status !== 201) throw new Error('Failed biometric clock');

    const payrollRes = await request('/payroll/generate', 'POST', {
      period: 'September 2026',
    });
    if (payrollRes.status !== 201) throw new Error('Failed payroll calculation');
  });

  // 13. Security Audit Trail
  await assertTest('Audit: emit immutable compliance audit trail entry', async () => {
    const auditRes = await request('/audit/logs', 'POST', {
      userId: 'admin',
      userRole: 'super_admin',
      action: 'SYSTEM_E2E_VERIFICATION_COMPLETE',
      resource: 'ALL_MODULES',
      details: 'Full end-to-end multi-workstation test verification completed successfully',
    });
    if (auditRes.status !== 201) throw new Error('Failed audit logging');
  });

  console.log('\n----------------------------------------------------');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests();
