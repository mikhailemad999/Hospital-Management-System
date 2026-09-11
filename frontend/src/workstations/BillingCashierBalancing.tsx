import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { Invoice } from '../types';

export const BillingCashierBalancing: React.FC = () => {
  const { invoices, recordPayment } = useHospitalStore();
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('CREDIT_CARD');
  const [receiptPrint, setReceiptPrint] = useState<any | null>(null);

  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + Number(inv.paid), 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + Number(inv.balance), 0);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || payAmount <= 0) return;
    await recordPayment(paymentModalInvoice.id, payAmount, payMethod);

    setReceiptPrint({
      receiptNumber: `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: paymentModalInvoice.invoiceNumber,
      patientName: paymentModalInvoice.patientName,
      mrn: paymentModalInvoice.mrn,
      amount: payAmount,
      method: payMethod,
      date: new Date().toLocaleString(),
    });

    setPaymentModalInvoice(null);
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Revenue Cycle & Cashier Shift Balancing
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">SHIFT 1 BALANCED</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Patient Billing & Cashier Shift Reconciliation
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Cashier shift closing report exported to official financial ledger.')}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            <span>Close Shift & Reconcile Drawer</span>
          </button>
        </div>
      </div>

      {/* Cashier Shift Drawer Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-secondary font-bold">OPENING CASH FLOAT</span>
          <p className="text-xl font-bold font-mono text-on-surface mt-1">$500.00</p>
          <span className="text-[11px] text-secondary">Verified by Supervisor</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-secondary font-bold">TOTAL BILLED TODAY</span>
          <p className="text-xl font-bold font-mono text-primary mt-1">${totalInvoiced.toFixed(2)}</p>
          <span className="text-[11px] text-secondary">{invoices.length} Registered Invoices</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">SETTLED COLLECTIONS</span>
          <p className="text-xl font-bold font-mono text-emerald-950 mt-1">${totalCollected.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-800">Cash, Card & Copayments</span>
        </div>

        <div className="p-4 rounded-xl bg-error-container/30 border border-error/20">
          <span className="text-[10px] font-mono uppercase text-error font-bold">OUTSTANDING BALANCE</span>
          <p className="text-xl font-bold font-mono text-error mt-1">${totalOutstanding.toFixed(2)}</p>
          <span className="text-[11px] text-on-surface-variant">Pending Payer / Patient Settlement</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
            <h3 className="font-bold text-sm text-on-surface">Patient Financial Encounters & Charge Invoices</h3>
          </div>
          <span className="text-xs font-mono text-secondary">Compliant with Hospital Billing Policy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Invoice # & Date</th>
                <th className="py-2.5 px-3">Patient & MRN</th>
                <th className="py-2.5 px-3">Subtotal</th>
                <th className="py-2.5 px-3">Tax / Discount</th>
                <th className="py-2.5 px-3">Gross Total</th>
                <th className="py-2.5 px-3">Paid</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface font-mono">{inv.invoiceNumber}</p>
                    <span className="text-[10px] text-secondary font-mono">{inv.date}</span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-on-surface">{inv.patientName}</p>
                    <span className="text-[10px] font-mono text-primary font-semibold">{inv.mrn}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">${Number(inv.subtotal).toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono text-secondary">
                    +${Number(inv.tax).toFixed(2)} / -${Number(inv.discount).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-on-surface">
                    ${Number(inv.total).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">
                    ${Number(inv.paid).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    {Number(inv.balance) > 0 ? (
                      <span className="text-error">${Number(inv.balance).toFixed(2)}</span>
                    ) : (
                      <span className="text-secondary">$0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-950'
                          : inv.status === 'PARTIAL'
                          ? 'bg-amber-100 text-amber-950'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {Number(inv.balance) > 0 ? (
                      <button
                        onClick={() => {
                          setPaymentModalInvoice(inv);
                          setPayAmount(Number(inv.balance));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-xs"
                      >
                        Accept Payment
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-mono text-xs font-bold">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">Process Patient Payment</h3>
            <div className="p-3 bg-surface rounded-lg border border-outline-variant/30 space-y-1">
              <p className="font-bold text-on-surface">{paymentModalInvoice.patientName} ({paymentModalInvoice.mrn})</p>
              <p className="text-secondary">Invoice: <strong className="font-mono text-on-surface">{paymentModalInvoice.invoiceNumber}</strong></p>
              <p className="text-secondary">Outstanding Balance: <strong className="font-mono text-error">${Number(paymentModalInvoice.balance).toFixed(2)}</strong></p>
            </div>

            <form onSubmit={handlePay} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Amount to Pay ($)</label>
                <input
                  type="number"
                  step="0.01"
                  max={Number(paymentModalInvoice.balance)}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono font-bold text-base"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface font-semibold"
                >
                  <option value="CREDIT_CARD">Credit Card (Visa / Mastercard)</option>
                  <option value="DEBIT_CARD">Debit Card / POS Terminal</option>
                  <option value="CASH">Cash (Cashier Drawer)</option>
                  <option value="INSURANCE">Insurance Claim Copay</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Collect ${payAmount.toFixed(2)} & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Printable Preview Modal */}
      {receiptPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-4 text-xs font-mono text-black border border-neutral-300">
            <div className="text-center border-b pb-3">
              <h2 className="font-bold text-sm">METRO CENTRAL HOSPITAL</h2>
              <p className="text-[10px] text-neutral-600">Official Patient Payment Receipt</p>
              <p className="text-[10px] text-neutral-600">{receiptPrint.date}</p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Receipt Number:</span>
                <strong>{receiptPrint.receiptNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <span>{receiptPrint.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Patient Name:</span>
                <span>{receiptPrint.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>MRN:</span>
                <span>{receiptPrint.mrn}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{receiptPrint.method}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>TOTAL PAID:</span>
                <span>${receiptPrint.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-neutral-500 border-t">
              Thank you for trusting Metro Central Healthcare.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-1.5 bg-black text-white rounded font-sans font-bold"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setReceiptPrint(null)}
                className="px-3 py-1.5 border rounded font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
