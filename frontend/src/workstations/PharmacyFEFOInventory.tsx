import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import api from '../services/api';

export const PharmacyFEFOInventory: React.FC = () => {
  const { batches, dispenseMedication, fetchInitialData } = useHospitalStore();
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);

  // Dispense Form
  const [selectedMedId, setSelectedMedId] = useState('');
  const [dispenseQty, setDispenseQty] = useState(2);
  const [dispensePatient, setDispensePatient] = useState('Johnathan Miller');
  const [dispenseMrn, setDispenseMrn] = useState('MRN-92810');

  // Receive Form
  const [newMedName, setNewMedName] = useState('Ceftriaxone Sodium 1g Injection');
  const [newGeneric, setNewGeneric] = useState('Ceftriaxone');
  const [newLot, setNewLot] = useState(`LOT-2027-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newExpiry, setNewExpiry] = useState('2027-12-31');
  const [newQty, setNewQty] = useState(100);
  const [newCost, setNewCost] = useState(8.50);
  const [newPrice, setNewPrice] = useState(22.00);

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId) return;
    const success = await dispenseMedication(selectedMedId, dispenseQty, dispensePatient, dispenseMrn);
    if (success) {
      alert(`FEFO Algorithm verified: Dispensed ${dispenseQty} units from earliest expiration lot!`);
      setDispenseModalOpen(false);
    }
  };

  const handleReceiveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pharmacy/receive', {
        medicationId: batches[0]?.medicationId || 'med-1',
        name: newMedName,
        genericName: newGeneric,
        form: 'Vial',
        strength: '1g',
        batchNumber: newLot,
        expiryDate: newExpiry,
        daysToExpiry: 365,
        quantity: newQty,
        unitCost: newCost,
        sellingPrice: newPrice,
        location: 'Central Pharmacy - Aisle 2',
      });
      await fetchInitialData();
      alert('Stock receipt registered and added to FEFO inventory rotation.');
      setReceiveModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Pharmacy & FEFO Batch Rotation
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">AUTOMATED LOT DEDUCTION</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Pharmacy Dispensing & FEFO Batch Inventory
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setReceiveModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Receive Purchase Shipment</span>
          </button>
          <button
            onClick={() => {
              if (batches.length > 0) setSelectedMedId(batches[0].medicationId);
              setDispenseModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">prescriptions</span>
            <span>Dispense FEFO Medication</span>
          </button>
        </div>
      </div>

      {/* FEFO Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">NEAR-EXPIRY ALERT (&lt;60 DAYS)</span>
            <p className="text-xl font-bold text-amber-950 font-mono mt-0.5">
              {batches.filter((b) => b.isExpiringSoon || b.daysToExpiry < 60).length} Lots
            </p>
            <span className="text-[11px] text-amber-800">Priority FEFO dispatch required</span>
          </div>
          <span className="material-symbols-outlined text-[32px] text-amber-600">notification_important</span>
        </div>

        <div className="p-4 rounded-xl bg-error-container/30 border border-error/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-error font-bold">LOW STOCK REORDER LEVEL</span>
            <p className="text-xl font-bold text-error font-mono mt-0.5">
              {batches.filter((b) => b.isLowStock || b.quantity < 50).length} Items
            </p>
            <span className="text-[11px] text-on-surface-variant">Below critical hospital threshold</span>
          </div>
          <span className="material-symbols-outlined text-[32px] text-error">production_quantity_limits</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-mono uppercase text-secondary font-bold">VALUATION BASIS</span>
            <p className="text-xl font-bold text-on-surface font-mono mt-0.5">$384,210.00</p>
            <span className="text-[11px] text-secondary">First-Expired-First-Out (FEFO)</span>
          </div>
          <span className="material-symbols-outlined text-[32px] text-primary">account_balance_wallet</span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">shelves</span>
            <h3 className="font-bold text-sm text-on-surface">Medication Lots & Expiration Countdown Matrix</h3>
          </div>
          <span className="text-xs font-mono text-secondary">
            FEFO Sort: Earliest Expiry Ranked First
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Medication & Strength</th>
                <th className="py-2.5 px-3">Batch / Lot Number</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Shelf Life Remaining</th>
                <th className="py-2.5 px-3">Storage Location</th>
                <th className="py-2.5 px-3">Unit Cost / Price</th>
                <th className="py-2.5 px-3 text-right">Available Qty</th>
                <th className="py-2.5 px-4 text-right">Dispense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {batches.map((batch) => {
                const isUrgentExpiry = batch.isExpiringSoon || batch.daysToExpiry < 60;
                return (
                  <tr key={batch.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-on-surface text-xs">{batch.name}</p>
                      <span className="text-[10px] text-secondary">{batch.genericName} • {batch.form}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {batch.batchNumber}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {batch.expiryDate}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isUrgentExpiry
                            ? 'bg-amber-100 text-amber-950 animate-pulse'
                            : 'bg-emerald-100 text-emerald-950'
                        }`}
                      >
                        {batch.daysToExpiry} Days Remaining
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-secondary text-[11px]">
                      {batch.location}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      ${Number(batch.unitCost).toFixed(2)} / <strong className="text-on-surface">${Number(batch.sellingPrice).toFixed(2)}</strong>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-xs">
                      <span className={batch.quantity < 50 ? 'text-error' : 'text-on-surface'}>
                        {batch.quantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedMedId(batch.medicationId);
                          setDispenseModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors"
                      >
                        Dispense
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispense Modal */}
      {dispenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">Automated FEFO Medication Dispensing</h3>
            <p className="text-secondary">
              The FEFO algorithm will automatically deduce quantities from the earliest expiration batch.
            </p>

            <form onSubmit={handleDispense} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Medication Selection</label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.medicationId}>
                      {b.name} (Exp: {b.expiryDate} - Qty: {b.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quantity to Dispense</label>
                  <input
                    type="number"
                    min="1"
                    value={dispenseQty}
                    onChange={(e) => setDispenseQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Patient MRN</label>
                  <input
                    value={dispenseMrn}
                    onChange={(e) => setDispenseMrn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Patient Full Name</label>
                <input
                  value={dispensePatient}
                  onChange={(e) => setDispensePatient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setDispenseModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Confirm FEFO Dispense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Receive Modal */}
      {receiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">Receive Purchase Delivery Batch</h3>

            <form onSubmit={handleReceiveStock} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Medication Name</label>
                <input
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Batch / Lot Number</label>
                  <input
                    value={newLot}
                    onChange={(e) => setNewLot(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quantity Received</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Acquisition Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setReceiveModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Process Receipt into FEFO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
