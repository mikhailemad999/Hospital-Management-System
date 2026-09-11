{
  "project": {
    "name": "Hospital Management System Pro",
    "type": "enterprise_healthcare_management_platform",
    "version": "1.0.0",
    "goal": "Build a complete modular hospital management platform covering outpatient appointments, ticketing, emergency, inpatient care, pharmacy and medical inventory, operating rooms, nursing, doctors, employees, payroll, finance, profitability, billing, reporting, audit logs and administration.",
    "engineering_standard": "Production-ready architecture designed by a senior engineering team with 10+ years experience. Prioritize security, auditability, data integrity, modularity, scalability, usability and deployment readiness.",
    "important_note": "This specification is a software product blueprint. Clinical workflows, medication safety rules, billing rules and legal/compliance requirements must be configured according to the hospital's actual policies and applicable local regulations before production use."
  },
  "recommended_stack": {
    "frontend": {
      "framework": "React + TypeScript",
      "ui": "Tailwind CSS + shadcn/ui",
      "state": "Redux Toolkit or TanStack Query",
      "forms": "React Hook Form + Zod",
      "charts": "Recharts",
      "tables": "TanStack Table",
      "i18n": ["Arabic", "English"],
      "rtl": true
    },
    "backend": {
      "framework": "Django + Django REST Framework",
      "language": "Python",
      "authentication": "JWT with refresh tokens",
      "background_jobs": "Celery",
      "scheduler": "Celery Beat",
      "api": "REST API with OpenAPI documentation"
    },
    "databases": {
      "primary": "PostgreSQL",
      "cache": "Redis",
      "files": "S3-compatible object storage",
      "search_optional": "OpenSearch or Elasticsearch"
    },
    "deployment": {
      "containers": "Docker + Docker Compose",
      "reverse_proxy": "Nginx",
      "server": "Linux",
      "ci_cd": "GitHub Actions",
      "monitoring": ["Application logs", "Audit logs", "Health checks", "Error monitoring", "Database backups"]
    }
  },
  "global_principles": [
    "Every person must have a unique internal ID.",
    "Every staff member must have a user account with role-based permissions.",
    "Do not hard-delete financial, clinical, medication or audit records; use controlled cancellation/void/archive workflows.",
    "Every important action must record who performed it, when, from which device/session and what changed.",
    "Use database transactions for billing, payments, medication dispensing, stock movements and operating-room consumption.",
    "Use optimistic locking or row-level locking for stock and financial balances where required.",
    "Never expose passwords or raw authentication secrets in logs.",
    "Support Arabic and English labels, reports and printable documents.",
    "Support configurable hospital branches, departments, rooms, beds, services, prices, taxes and currencies.",
    "Support configurable approval workflows for refunds, discounts, stock adjustments, payroll overrides and expense approvals."
  ],
  "roles_and_access": {
    "security_model": "RBAC + optional ABAC rules for department, branch, shift and record ownership.",
    "roles": [
      {
        "role": "super_admin",
        "access": "Everything including system configuration, role management, audit logs and security policies."
      },
      {
        "role": "hospital_admin",
        "access": "Hospital-wide dashboards, departments, staff, reports, finance, payroll, inventory, pricing and operational oversight."
      },
      {
        "role": "receptionist",
        "access": "Patient registration, appointments, queue/ticket management, check-in, basic billing and printing. No clinical editing."
      },
      {
        "role": "doctor",
        "access": "Own appointments, patient charts according to permissions, diagnosis, prescriptions, orders, operation records and own performance dashboard."
      },
      {
        "role": "senior_doctor",
        "access": "Doctor permissions plus approvals/reviews assigned by policy."
      },
      {
        "role": "nurse",
        "access": "Assigned ward/bed patients, vital signs, nursing notes, medication administration, care plans and nursing tasks."
      },
      {
        "role": "head_nurse",
        "access": "Nursing supervision, assignments, shifts, nursing reports and approvals."
      },
      {
        "role": "emergency_staff",
        "access": "Emergency triage, emergency registration, immediate treatment workflow and emergency queue."
      },
      {
        "role": "pharmacist",
        "access": "Medication inventory, dispensing, purchase receiving, batch/expiry management and pharmacy reports."
      },
      {
        "role": "inventory_manager",
        "access": "All medical supplies and non-drug inventory, stock transfers, receiving, adjustments and reorder management."
      },
      {
        "role": "operating_room_manager",
        "access": "OR schedules, rooms, consumables, equipment and operation cost records."
      },
      {
        "role": "accountant",
        "access": "Invoices, payments, expenses, refunds, doctor revenue shares, payroll inputs and financial reports."
      },
      {
        "role": "hr",
        "access": "Employee records, contracts, attendance inputs, salary structures, commissions and deductions."
      },
      {
        "role": "lab_technician",
        "access": "Laboratory orders, sample workflow, results entry and verification."
      },
      {
        "role": "radiology_staff",
        "access": "Radiology orders, scheduling, reports and result attachments."
      },
      {
        "role": "billing_clerk",
        "access": "Charges, invoices, collections, refunds and patient balances."
      },
      {
        "role": "auditor",
        "access": "Read-only financial, operational and audit reports."
      },
      {
        "role": "support_user",
        "access": "Technical support without access to unnecessary clinical content."
      }
    ],
    "permission_pattern": {
      "actions": ["view", "create", "edit", "delete_or_void", "approve", "print", "export", "refund", "adjust", "manage_settings"],
      "scope_examples": ["own", "assigned_patients", "department", "branch", "hospital_wide"]
    }
  },
  "authentication_and_security": {
    "features": [
      "Separate login screen for all users with role-aware landing page.",
      "Username/email/employee-code login configurable by hospital policy.",
      "Password hashing with Argon2 or strong framework default.",
      "JWT access and refresh tokens.",
      "Optional two-factor authentication.",
      "Session management with device/session list and revoke support.",
      "Automatic logout after configurable inactivity period.",
      "Brute-force protection and rate limiting.",
      "Role and permission enforcement on backend and frontend.",
      "Audit log for login success/failure, permission changes and security events.",
      "Password reset workflow with secure one-time tokens."
    ]
  },
  "core_entities": [
    "users",
    "roles",
    "permissions",
    "employees",
    "doctors",
    "nurses",
    "departments",
    "branches",
    "patients",
    "patient_contacts",
    "patient_insurance",
    "appointments",
    "queue_tickets",
    "visits",
    "encounters",
    "triage_records",
    "vitals",
    "clinical_notes",
    "diagnoses",
    "procedures",
    "prescriptions",
    "prescription_items",
    "medication_administrations",
    "medications",
    "medication_batches",
    "inventory_items",
    "inventory_locations",
    "stock_movements",
    "purchase_orders",
    "goods_receipts",
    "suppliers",
    "wards",
    "rooms",
    "beds",
    "admissions",
    "transfers",
    "discharges",
    "nursing_notes",
    "nursing_tasks",
    "operation_rooms",
    "operation_schedules",
    "operations",
    "operation_team_members",
    "operation_consumption",
    "operation_equipment_usage",
    "services",
    "service_prices",
    "invoices",
    "invoice_items",
    "payments",
    "refunds",
    "discounts",
    "expenses",
    "doctor_revenue_rules",
    "doctor_revenue_entries",
    "salary_structures",
    "payroll_periods",
    "payroll_records",
    "commissions",
    "deductions",
    "attendance",
    "shifts",
    "leave_requests",
    "notifications",
    "attachments",
    "audit_logs",
    "system_settings"
  ],
  "patient_module": {
    "pages": [
      "Patient Search",
      "New Patient Registration",
      "Patient Profile",
      "Medical Record",
      "Patient Timeline",
      "Insurance",
      "Documents and Attachments",
      "Patient Billing Summary"
    ],
    "features": [
      "Unique patient number / MRN.",
      "National identifier field configurable to local policy.",
      "Personal information, contacts and emergency contact.",
      "Allergies and alerts displayed prominently where clinically appropriate.",
      "Medical history, surgical history and chronic conditions.",
      "Previous visits, diagnoses, prescriptions, lab and radiology records.",
      "Admission/discharge history.",
      "Financial balance and invoice history.",
      "Patient document upload with access control.",
      "Full chronological patient timeline."
    ]
  },
  "outpatient_and_ticketing": {
    "pages": [
      "Appointment Calendar",
      "Doctor Schedule",
      "Specialty/Clinic Setup",
      "Ticket Issuing",
      "Queue Dashboard",
      "Reception Check-in",
      "Visit Billing"
    ],
    "workflow": [
      "Reception creates or finds patient.",
      "Select department, specialty and doctor.",
      "Select appointment date/time or walk-in queue.",
      "Generate ticket number.",
      "Patient is checked in.",
      "Queue display calls the next patient.",
      "Doctor opens encounter.",
      "Doctor records examination, diagnosis, treatment and prescription.",
      "Visit services are charged according to configured price list.",
      "Payment is collected and receipt printed.",
      "Visit is closed and included in doctor and department reports."
    ],
    "doctor_metrics": [
      "Check-in time",
      "Consultation start time",
      "Consultation end time",
      "Number of visits",
      "No-show count",
      "Cancelled visits",
      "Revenue generated",
      "Doctor share",
      "Average consultation duration"
    ]
  },
  "emergency_module": {
    "pages": [
      "Emergency Dashboard",
      "Rapid Registration",
      "Triage",
      "Emergency Queue",
      "Treatment Room Board",
      "Emergency Encounter",
      "Disposition / Admission / Transfer"
    ],
    "features": [
      "Fast patient registration or temporary emergency patient ID.",
      "Triage priority levels configurable by hospital policy.",
      "Vital signs and triage notes.",
      "Color-coded urgency dashboard.",
      "Track arrival time, triage time and physician assessment time.",
      "Emergency procedures, medications and supplies charged to encounter.",
      "Transfer to inpatient, operation, ICU, another facility or discharge.",
      "Emergency performance and waiting-time reports."
    ]
  },
  "inpatient_module": {
    "pages": [
      "Ward Dashboard",
      "Room Management",
      "Bed Management",
      "Admission",
      "Patient Transfer",
      "Bedside Chart",
      "Discharge"
    ],
    "features": [
      "Ward -> room -> bed hierarchy.",
      "Bed status: available, occupied, reserved, cleaning, maintenance.",
      "Admission order and admission date/time.",
      "Assign attending doctor and responsible nursing team.",
      "Bed transfer history.",
      "Daily room/bed charges.",
      "Daily service and consumable charges.",
      "Discharge summary and final bill.",
      "Length-of-stay calculation.",
      "Patient location shown on hospital dashboard according to permissions."
    ]
  },
  "nursing_module": {
    "pages": [
      "Nursing Dashboard",
      "My Assigned Patients",
      "Patient Bedside View",
      "Vitals",
      "Nursing Notes",
      "Medication Administration",
      "Care Tasks",
      "Shift Handover",
      "Nursing Reports"
    ],
    "features": [
      "Nurse-to-patient assignment.",
      "Record temperature, pulse, blood pressure, oxygen saturation, respiratory rate and configurable measurements.",
      "Record nursing observations and patient condition changes.",
      "Medication administration record with date/time, dose, route, status and nurse.",
      "Record consumed medical supplies with quantity and patient linkage.",
      "Create and complete nursing tasks.",
      "Shift handover notes.",
      "Escalation alert to doctor for abnormal configurable observations.",
      "Nursing activity timeline."
    ]
  },
  "pharmacy_and_inventory": {
    "pages": [
      "Inventory Dashboard",
      "Medication Catalog",
      "Batch Management",
      "Stock Levels",
      "Stock Movements",
      "Receive Purchase",
      "Dispensing",
      "Internal Transfer",
      "Stock Adjustment",
      "Low Stock Alerts",
      "Expiry Alerts",
      "Supplier Management",
      "Inventory Reports"
    ],
    "requirements": [
      "Track every medication and medical consumable by SKU/internal code.",
      "Track unit of measure and conversion rules.",
      "Track batch/lot number.",
      "Track expiry date.",
      "Track purchase cost and configurable valuation method.",
      "Track selling/service charge price separately from acquisition cost where appropriate.",
      "FEFO support for expiring medications.",
      "Prevent dispensing more than available quantity unless explicitly allowed by policy.",
      "Every stock movement must have reason, source, destination, user, timestamp and reference.",
      "Link every dispensed medication to patient, encounter/admission/prescription when applicable.",
      "Support pharmacy dispensing and ward/OR issue flows.",
      "Automatic reorder threshold and reorder quantity.",
      "Alerts for low stock, expired stock and near-expiry stock.",
      "Inventory reconciliation and controlled stock adjustments."
    ],
    "stock_movement_types": [
      "purchase_receipt",
      "patient_dispense",
      "ward_issue",
      "operating_room_issue",
      "return_from_patient",
      "return_from_ward",
      "supplier_return",
      "internal_transfer",
      "adjustment_increase",
      "adjustment_decrease",
      "expired_writeoff",
      "damaged_writeoff"
    ]
  },
  "operating_room_module": {
    "pages": [
      "Operating Room Dashboard",
      "Room Calendar",
      "Operation Booking",
      "Operation Pre-Op",
      "Intra-Op Record",
      "Operation Team",
      "Consumables Used",
      "Equipment Used",
      "Post-Op / Recovery",
      "Operation Billing",
      "Operation Profitability"
    ],
    "operation_record": {
      "identity": ["operation_id", "patient_id", "admission_id", "room_id"],
      "timing": ["scheduled_start", "actual_start", "actual_end", "recovery_start", "recovery_end"],
      "team": ["lead_surgeon", "assistant_surgeons", "anesthetist", "anesthesia_team", "nurses", "other_staff"],
      "clinical": ["pre_op_diagnosis", "procedure_name", "notes", "post_op_diagnosis", "outcome", "complications"],
      "financial": ["operation_price", "doctor_percentage", "doctor_fixed_fee", "anesthesia_fee", "room_fee", "equipment_fee", "consumables_cost", "other_costs", "gross_revenue", "gross_profit", "doctor_profit_share"]
    },
    "consumption_tracking": {
      "mandatory_fields": ["item_id", "batch_id", "quantity", "unit_cost", "total_cost", "issued_by", "used_by", "used_at", "patient_id", "operation_id", "reason"],
      "behavior": [
        "When a consumable is issued to an operation, decrease stock in a transaction.",
        "Record the exact item and batch used.",
        "Calculate actual operation consumable cost from recorded acquisition cost.",
        "Allow unused item return to inventory with separate return transaction.",
        "Allow approved correction workflow without deleting original movement.",
        "Add all consumed items to operation cost breakdown and patient invoice according to billing policy."
      ]
    },
    "doctor_profit": {
      "supported_models": [
        "percentage_of_operation_revenue",
        "fixed_fee",
        "percentage_after_defined_costs",
        "hybrid_fixed_plus_percentage"
      ],
      "calculation_fields": [
        "gross_operation_revenue",
        "hospital_costs",
        "doctor_share_basis",
        "doctor_percentage",
        "doctor_fixed_fee",
        "doctor_share",
        "hospital_gross_profit"
      ]
    }
  },
  "doctor_module": {
    "pages": [
      "Doctor Dashboard",
      "Today's Appointments",
      "Patient Encounters",
      "Clinical Notes",
      "Diagnoses",
      "Prescriptions",
      "Procedure Records",
      "Operation History",
      "Doctor Revenue",
      "Doctor Attendance",
      "Doctor Reports"
    ],
    "dashboard_kpis": [
      "Today's patients",
      "Completed consultations",
      "Operations completed",
      "Revenue generated",
      "Doctor revenue share",
      "Outstanding documentation",
      "Average consultation time"
    ]
  },
  "billing_and_finance": {
    "pages": [
      "Finance Dashboard",
      "Patient Charges",
      "Invoices",
      "Payments",
      "Refunds",
      "Discounts",
      "Expenses",
      "Doctor Revenue Shares",
      "Cashier Closing",
      "Daily Closing",
      "Financial Reports"
    ],
    "charge_sources": [
      "consultation",
      "emergency_visit",
      "room_charge",
      "bed_charge",
      "procedure",
      "operation",
      "medication",
      "medical_supply",
      "laboratory",
      "radiology",
      "nursing_service",
      "other_service"
    ],
    "rules": [
      "All financial transactions have immutable references and audit history.",
      "Support invoice status: draft, issued, partially_paid, paid, cancelled, refunded.",
      "Support partial payments and multiple payment methods.",
      "Support controlled discounts with reason and approver.",
      "Support refunds with mandatory reason and approval where configured.",
      "Separate hospital revenue from doctor share and direct costs.",
      "Generate daily cash and payment-method reconciliation.",
      "Track expenses by category, department, branch, supplier and period."
    ],
    "profitability": {
      "doctor": ["Revenue by consultation", "Revenue by procedure", "Revenue by operation", "Doctor commission", "Net doctor earnings"],
      "operation": ["Gross price", "Consumables cost", "Room cost", "Equipment cost", "Staff cost", "Other costs", "Doctor share", "Hospital profit"],
      "department": ["Revenue", "Direct costs", "Allocated costs if configured", "Gross margin", "Profit trend"]
    }
  },
  "hr_and_payroll": {
    "pages": [
      "Employee Directory",
      "Employee Profile",
      "Contracts",
      "Salary Setup",
      "Commission Rules",
      "Attendance",
      "Shifts",
      "Leave Requests",
      "Deductions",
      "Payroll Periods",
      "Payroll Processing",
      "Payslips",
      "Payroll Reports"
    ],
    "salary_components": [
      "base_salary",
      "housing_or_allowance",
      "transport_allowance",
      "overtime",
      "doctor_consultation_commission",
      "doctor_operation_commission",
      "nursing_allowance",
      "performance_bonus",
      "manual_bonus",
      "late_penalty",
      "absence_penalty",
      "mistake_penalty",
      "other_deductions",
      "advance_deduction"
    ],
    "payroll_workflow": [
      "Create payroll period.",
      "Load active employees and applicable salary structures.",
      "Import or calculate attendance and overtime.",
      "Calculate consultation and operation commissions.",
      "Apply approved bonuses and deductions.",
      "Validate anomalies and obtain approval.",
      "Lock payroll period.",
      "Generate payslips.",
      "Record accounting entries if accounting integration is enabled."
    ],
    "doctor_commission": {
      "configuration": [
        "Per consultation fixed amount",
        "Per consultation percentage",
        "Per procedure percentage",
        "Per operation percentage",
        "Fixed operation amount",
        "Tiered commission by monthly volume"
      ],
      "must_store": ["rule_id", "effective_from", "effective_to", "calculation_basis", "percentage_or_amount", "approval_status"]
    }
  },
  "attendance_and_time_tracking": {
    "pages": [
      "Attendance Dashboard",
      "Clock In/Out",
      "Shift Schedule",
      "Late and Absence Review",
      "Overtime Review"
    ],
    "features": [
      "Store clock-in and clock-out times.",
      "Link users to employee profiles.",
      "Calculate working hours, overtime, lateness and absence according to configurable rules.",
      "Optional biometric/device integration point.",
      "Attendance correction requires reason and approval."
    ]
  },
  "laboratory_and_radiology_extensions": {
    "laboratory": {
      "pages": ["Lab Orders", "Sample Collection", "Lab Worklist", "Results Entry", "Verification", "Lab Reports"],
      "features": ["Link tests to patient encounter", "Sample status tracking", "Reference ranges", "Result verification", "Printable results"]
    },
    "radiology": {
      "pages": ["Imaging Orders", "Radiology Worklist", "Report Entry", "Image/Document Attachments", "Radiology Reports"],
      "features": ["Schedule examination", "Track status", "Attach report", "Optional future PACS/DICOM integration"]
    }
  },
  "reporting_and_admin": {
    "admin_dashboard": {
      "kpis": [
        "Total patients",
        "Today's visits",
        "Emergency cases",
        "Current inpatients",
        "Operations today",
        "Revenue today",
        "Expenses today",
        "Net operating result",
        "Low-stock medications",
        "Near-expiry medications",
        "Outstanding patient balances"
      ],
      "real_time_widgets": [
        "Current emergency queue",
        "Operating rooms status",
        "Occupied beds",
        "Doctor attendance",
        "Nurse staffing status",
        "Cashier status"
      ]
    },
    "reports": {
      "patient": ["Patient registration report", "Visit history", "Admission/discharge report"],
      "doctor": ["Visits by doctor", "Revenue by doctor", "Operations by doctor", "Doctor attendance", "Doctor commissions", "Doctor profitability"],
      "nursing": ["Patients per nurse", "Nursing activity", "Medication administration", "Nursing consumables"],
      "inventory": ["Current stock", "Stock valuation", "Stock movement", "Low stock", "Expiry", "Consumption by patient", "Consumption by department"],
      "operation": ["Operations by date", "Operations by surgeon", "Room utilization", "Operation cost", "Operation revenue", "Operation profit", "Consumables used per operation"],
      "finance": ["Revenue", "Expenses", "Profitability", "Payments", "Refunds", "Discounts", "Cashier closing", "Department financial performance"],
      "hr": ["Headcount", "Attendance", "Payroll", "Commissions", "Deductions", "Overtime"],
      "system": ["Audit log", "User activity", "Login activity", "Failed login attempts", "Data changes"]
    },
    "export": ["PDF", "Excel", "CSV"],
    "filters": ["date range", "branch", "department", "doctor", "employee", "patient", "status", "payment method"]
  },
  "expenses_module": {
    "pages": [
      "Expense Dashboard",
      "New Expense",
      "Expense Categories",
      "Expense Approval",
      "Expense Reports"
    ],
    "fields": [
      "expense_id",
      "date",
      "category",
      "description",
      "amount",
      "vendor",
      "department",
      "branch",
      "payment_method",
      "reference_number",
      "attachment",
      "created_by",
      "approved_by",
      "status"
    ]
  },
  "discount_and_penalty_module": {
    "pages": ["Discount Rules", "Manual Discount", "Employee Deduction", "Doctor Adjustment", "Approval Queue"],
    "rules": [
      "Every manual discount requires a reason.",
      "Discount limits are role-configurable.",
      "Large discounts require approval.",
      "Employee deductions require reason, source record, amount and approver.",
      "Mistake/penalty adjustments must not overwrite original payroll transactions; create adjustment records."
    ]
  },
  "notifications": {
    "channels": ["in_app", "email_optional", "SMS_optional", "WhatsApp_optional"],
    "events": [
      "appointment_reminder",
      "queue_call",
      "doctor_schedule_change",
      "low_stock",
      "near_expiry",
      "critical_emergency_event",
      "nurse_task_due",
      "lab_result_ready",
      "radiology_result_ready",
      "operation_schedule_change",
      "approval_required",
      "payment_failure",
      "payroll_ready",
      "security_alert"
    ]
  },
  "audit_and_traceability": {
    "must_log": [
      "create/update/void of patient financial records",
      "medication dispensing",
      "stock adjustments",
      "operation consumption",
      "doctor revenue rules",
      "salary and commission changes",
      "discounts and refunds",
      "patient record access for sensitive modules",
      "login/logout/security events",
      "role/permission changes"
    ],
    "audit_fields": ["audit_id", "user_id", "role", "action", "entity", "entity_id", "timestamp", "ip_address", "device_info", "before_snapshot", "after_snapshot", "reason"]
  },
  "database_design": {
    "requirements": [
      "Use UUID or safe immutable primary identifiers where appropriate.",
      "Use foreign keys and database constraints for referential integrity.",
      "Add indexes for patient number, appointment time, doctor, department, stock item, batch, invoice, payment and audit queries.",
      "Use created_at, updated_at and created_by/updated_by consistently.",
      "Use soft-delete/archive only where business policy allows.",
      "Store currency and monetary amounts using Decimal/numeric, never floating point.",
      "Store dates and timestamps with timezone awareness."
    ],
    "key_relationships": [
      "patient -> many encounters",
      "patient -> many appointments",
      "patient -> many admissions",
      "admission -> one current bed assignment and many transfer records",
      "encounter -> many diagnoses/procedures/prescriptions/charges",
      "prescription -> many prescription items",
      "medication -> many batches",
      "stock movement -> item + batch + location + reference entity",
      "operation -> patient + room + team + consumption + billing + doctor revenue entry",
      "invoice -> many invoice items + many payments",
      "employee -> user + salary structure + attendance + payroll records",
      "doctor -> employee + doctor revenue rules + consultation/operation activity"
    ]
  },
  "api_design": {
    "base": "/api/v1",
    "modules": [
      "/auth",
      "/users",
      "/roles",
      "/patients",
      "/appointments",
      "/queues",
      "/visits",
      "/emergency",
      "/wards",
      "/beds",
      "/admissions",
      "/nursing",
      "/doctors",
      "/pharmacy",
      "/inventory",
      "/operations",
      "/laboratory",
      "/radiology",
      "/billing",
      "/finance",
      "/expenses",
      "/hr",
      "/payroll",
      "/attendance",
      "/reports",
      "/notifications",
      "/audit",
      "/settings"
    ],
    "requirements": [
      "OpenAPI/Swagger documentation",
      "Consistent pagination/filtering/sorting",
      "Consistent validation errors",
      "Permission checks on every protected endpoint",
      "Idempotency for sensitive financial or dispensing operations where appropriate",
      "Transactions for multi-record business actions"
    ]
  },
  "ui_requirements": {
    "layout": "Modern enterprise healthcare dashboard",
    "themes": ["light", "dark"],
    "responsive": true,
    "accessibility": "WCAG-oriented design",
    "components": [
      "sidebar navigation",
      "role-aware dashboard",
      "global search",
      "advanced filters",
      "data tables",
      "status badges",
      "confirmation dialogs",
      "approval dialogs",
      "timeline views",
      "patient header with alert area",
      "bed board",
      "operation room board",
      "queue display",
      "financial charts",
      "print-friendly documents"
    ],
    "navigation_rule": "Each user sees only modules and actions allowed by role and permissions."
  },
  "printing_and_documents": {
    "documents": [
      "patient registration form",
      "appointment ticket",
      "queue ticket",
      "invoice",
      "payment receipt",
      "refund receipt",
      "prescription",
      "discharge summary",
      "operation report",
      "operation cost sheet",
      "medication dispensing record",
      "inventory transfer document",
      "payroll payslip",
      "financial report"
    ],
    "requirements": [
      "Arabic and English templates.",
      "Hospital logo and branch information configurable.",
      "Print preview before printing.",
      "A4 and receipt-printer support where applicable.",
      "PDF generation on server for official documents."
    ]
  },
  "advanced_features": {
    "optional": [
      "Insurance and third-party payer management",
      "Corporate contracts and negotiated prices",
      "Patient portal",
      "Doctor mobile portal",
      "Nurse mobile interface",
      "Online appointment booking",
      "SMS/WhatsApp reminders",
      "QR/barcode scanning for medication and patient ID",
      "Biometric attendance integration",
      "Accounting software integration",
      "Payment gateway integration",
      "PACS/DICOM integration",
      "FHIR/HL7 integration",
      "Multi-branch and multi-company support",
      "Multi-currency support",
      "Advanced analytics warehouse",
      "AI-assisted operational analytics with strict permission boundaries"
    ]
  },
  "business_rules_examples": {
    "stock": [
      "Cannot dispense quantity greater than available stock unless emergency override is explicitly enabled.",
      "FEFO selects earliest expiry batch first where applicable.",
      "Every stock deduction stores patient/department/operation context when applicable.",
      "Low-stock alert is triggered when on-hand quantity <= reorder threshold."
    ],
    "operations": [
      "An operation cannot be finalized without a patient, operation record, lead surgeon and actual start/end times.",
      "Consumed items are linked to the exact operation.",
      "Doctor profit is calculated using the effective revenue rule applicable on operation date.",
      "Final operation financial record becomes locked after approval, with controlled amendment workflow."
    ],
    "payroll": [
      "Payroll uses the employee's effective salary structure for the period.",
      "Doctor consultation and operation commissions are generated from finalized billable activities.",
      "Manual deductions require reason and approval.",
      "Locked payroll periods cannot be silently changed."
    ]
  },
  "dashboards_by_role": {
    "hospital_admin": ["hospital KPIs", "financial overview", "department performance", "doctor performance", "inventory alerts", "operations summary"],
    "doctor": ["today queue", "appointments", "patients", "operations", "revenue share"],
    "nurse": ["assigned patients", "vitals due", "medications due", "care tasks", "shift handover"],
    "pharmacist": ["pending prescriptions", "low stock", "near expiry", "today dispensing", "stock value"],
    "inventory_manager": ["stock levels", "low stock", "expiring items", "purchase orders", "transfers"],
    "accountant": ["revenue", "collections", "expenses", "refunds", "doctor shares", "cashier closing"],
    "hr": ["headcount", "attendance", "payroll status", "commissions", "deductions"],
    "operating_room_manager": ["today operations", "room utilization", "pending supplies", "operation cost"],
    "receptionist": ["today appointments", "queue", "check-ins", "patient registration"]
  },
  "testing_strategy": {
    "required": [
      "Unit tests for calculations and business rules",
      "API integration tests",
      "Permission/role tests",
      "Database constraint tests",
      "Inventory concurrency tests",
      "Billing and payroll calculation tests",
      "End-to-end tests for critical workflows",
      "Security tests for authentication and authorization",
      "Backup and restore verification"
    ],
    "critical_scenarios": [
      "Two users attempt to dispense the same stock simultaneously.",
      "An operation consumes multiple batches and then returns unused items.",
      "A patient pays partially and receives a later refund.",
      "Doctor commission changes but historical operations retain the correct historical rule.",
      "Payroll correction after a period is locked.",
      "Unauthorized user tries to access another department's patient records.",
      "Emergency patient is registered rapidly and later merged into a permanent patient record."
    ]
  },
  "seed_data": {
    "include": [
      "demo hospital",
      "departments",
      "sample users for every role",
      "sample doctors and nurses",
      "sample clinics",
      "sample wards/rooms/beds",
      "sample medications and batches",
      "sample services and prices",
      "sample salary rules",
      "sample doctor commission rules"
    ],
    "security": "Demo credentials must be clearly marked as development-only and must never be used in production."
  },
  "deliverables": {
    "expected": [
      "Complete monorepo structure",
      "Frontend application",
      "Backend application",
      "PostgreSQL schema and migrations",
      "API documentation",
      "Role/permission system",
      "Docker Compose setup",
      "Environment variable example file",
      "Seed script",
      "Automated test suite",
      "Deployment documentation",
      "Backup and restore documentation",
      "Admin setup guide",
      "User manual for major roles"
    ]
  },
  "recommended_project_structure": {
    "root": [
      "apps/web",
      "apps/api",
      "packages/shared",
      "infra/nginx",
      "infra/docker",
      "docs",
      "scripts",
      "tests"
    ],
    "backend_apps": [
      "accounts",
      "patients",
      "appointments",
      "outpatient",
      "emergency",
      "inpatient",
      "nursing",
      "doctors",
      "pharmacy",
      "inventory",
      "operations",
      "laboratory",
      "radiology",
      "billing",
      "finance",
      "hr",
      "payroll",
      "attendance",
      "reports",
      "notifications",
      "audit",
      "settings"
    ],
    "frontend_modules": [
      "auth",
      "dashboard",
      "patients",
      "appointments",
      "queues",
      "emergency",
      "inpatient",
      "nursing",
      "doctors",
      "pharmacy",
      "inventory",
      "operations",
      "laboratory",
      "radiology",
      "billing",
      "finance",
      "hr",
      "payroll",
      "reports",
      "notifications",
      "settings"
    ]
  },
  "ai_coding_agent_instructions": {
    "mode": "senior_full_stack_engineer",
    "rules": [
      "Do not build a fake prototype; implement real CRUD, validation, permissions, calculations and database relationships.",
      "Do not place business rules only in the frontend; enforce them on the backend.",
      "Use service-layer/domain logic for complex calculations.",
      "Keep financial and inventory calculations deterministic and testable.",
      "Use transactions for critical multi-step operations.",
      "Create migrations for every schema change.",
      "Build role-aware routes and navigation.",
      "Use loading, empty, error and success states in every data-driven page.",
      "Use server-side pagination for large tables.",
      "Validate every API input.",
      "Never trust client-submitted prices, commissions, stock balances or permissions.",
      "Preserve an audit trail for critical mutations.",
      "Write tests before marking critical modules complete.",
      "Do not mark a feature complete until its UI, API, database, permissions, validation, audit behavior and tests are implemented.",
      "Build incrementally by module while keeping the whole system integrated."
    ],
    "implementation_order": [
      "1. Project foundation, authentication, users, roles and permissions",
      "2. Hospital, branch, department, room and bed configuration",
      "3. Patient registration and master patient index",
      "4. Appointments, ticketing and outpatient visits",
      "5. Emergency module",
      "6. Inpatient and nursing",
      "7. Pharmacy and inventory",
      "8. Operations and operating room consumption",
      "9. Billing, payments and expenses",
      "10. Doctor revenue and profitability",
      "11. HR, attendance and payroll",
      "12. Lab/radiology extensions",
      "13. Dashboards, reports, exports and notifications",
      "14. Audit, security hardening, testing and deployment"
    ]
  },
  "acceptance_criteria": [
    "A receptionist can register a patient, issue a ticket, check in the patient and complete billing.",
    "A doctor can open the encounter, document the consultation and prescribe medication.",
    "Emergency staff can triage and track emergency patients without bypassing audit requirements.",
    "A nurse can see assigned patients, record vitals, nursing notes and medication administration.",
    "A pharmacist can dispense a medication and the exact stock batch quantity is deducted and linked to the patient.",
    "An inventory manager can see current quantity, batches, expiry and all stock movements.",
    "An operation can be scheduled, assigned to a room/team, have consumables recorded and calculate actual cost.",
    "The system can calculate the surgeon's revenue share using the configured historical rule.",
    "An accountant can invoice, receive payments, issue approved refunds and record expenses.",
    "HR can configure salary, commission and deduction rules and generate payroll.",
    "A hospital admin can view department, doctor, operation, inventory, finance and payroll reports according to permissions.",
    "Every critical action is auditable.",
    "The application is deployable with Docker and documented environment configuration."
  ]
}
make the project with   my sql port:3305 password:1234 and nestjs 