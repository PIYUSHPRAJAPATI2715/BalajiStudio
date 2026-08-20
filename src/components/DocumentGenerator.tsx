'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Printer, RefreshCw, FileText } from 'lucide-react';

type Booking = {
  _id: string;
  clientName: string;
  programName: string;
  date: string;
  location: string;
  eventType: string;
  totalAmount: number;
  receivedAmount: number;
  status: string;
};

type DocumentGeneratorProps = {
  booking: Booking;
  onClose: () => void;
};

// Indian Numbering Word Converter
function numberToWords(num: number): string {
  if (num === 0) return 'Rupees Zero Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWordsHelper = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + numToWordsHelper(n % 100) : '');
    if (n < 100000) return numToWordsHelper(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + numToWordsHelper(n % 1000) : '');
    if (n < 10000000) return numToWordsHelper(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + numToWordsHelper(n % 100000) : '');
    return numToWordsHelper(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + numToWordsHelper(n % 10000000) : '');
  };

  return `Rupees ${numToWordsHelper(num)} Only`;
}

// Format Date to "19 August 2025"
function formatDateLong(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export default function DocumentGenerator({ booking, onClose }: DocumentGeneratorProps) {
  const [docType, setDocType] = useState<'bill' | 'confirmation'>('confirmation');
  const [owner, setOwner] = useState<'piyush' | 'vishnu' | 'manoj'>('piyush');
  const [billNo, setBillNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  
  // Dynamic form overrides
  const [clientName, setClientName] = useState(booking.clientName);
  const [eventType, setEventType] = useState(booking.eventType || booking.programName);
  const [eventDate, setEventDate] = useState(booking.date ? booking.date.split('T')[0] : '');
  const [location, setLocation] = useState(booking.location);
  const [packagePrice, setPackagePrice] = useState(booking.totalAmount);
  
  // Bill-specific details
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  
  // Confirmation-specific details
  const [advanceReceived, setAdvanceReceived] = useState(booking.receivedAmount);

  // Generate dynamic Bill No on load
  useEffect(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setBillNo(`SVE/26-27/${randomNum}`);
    setIssueDate(new Date().toISOString().split('T')[0]);
  }, [booking]);

  // Calculations
  const billTotalAmount = packagePrice + additionalCharges - discount;
  const confirmationRemainingAmount = packagePrice - advanceReceived;

  const ownerDetails = {
    piyush: { name: 'Piyush', phone: '9549348495' },
    vishnu: { name: 'Vishnu', phone: '7891766624' },
    manoj: { name: 'Manoj', phone: '9782130139' }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden text-white font-sans">
      
      {/* Dynamic Font Styling Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .font-signature {
          font-family: 'Great Vibes', cursive;
        }
        .font-luxury-serif {
          font-family: 'Cinzel', serif;
        }
        .font-luxury-outfit {
          font-family: 'Outfit', sans-serif;
        }

        /* Print Media Overrides */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm; /* Full width for high-res landscape A4 */
            height: 210mm;
            margin: 0;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Editor Controls Pane (Sidebar) */}
      <div className="w-full lg:w-[400px] bg-zinc-900 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto no-print">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-500">
              <FileText className="w-5 h-5" /> Document Studio
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Document Type</label>
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl">
              <button
                onClick={() => setDocType('confirmation')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === 'confirmation' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Booking Confirmation
              </button>
              <button
                onClick={() => setDocType('bill')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === 'bill' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Bill Invoice
              </button>
            </div>
          </div>

          {/* Dropdown Signature */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Authorized Signatory (Owner)</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value as any)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all"
            >
              <option value="piyush">Piyush (Creative & Production Lead)</option>
              <option value="vishnu">Vishnu (Event Manager)</option>
              <option value="manoj">Manoj (Finance Manager)</option>
            </select>
          </div>

          {/* Core Booking Overrides */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Event Title / Type</label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Package Price</label>
                <input
                  type="number"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Venue Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>

            {/* Document Specific Fields */}
            {docType === 'bill' ? (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Add. Charges</label>
                  <input
                    type="number"
                    value={additionalCharges}
                    onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Discount</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Advance Received</label>
                <input
                  type="number"
                  value={advanceReceived}
                  onChange={(e) => setAdvanceReceived(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            )}

            {docType === 'bill' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Bill Number</label>
                  <input
                    type="text"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-4 bg-gradient-gold hover:bg-amber-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2 mt-6 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
        >
          <Printer className="w-5 h-5" /> Print / Save as PDF
        </button>
      </div>

      {/* Preview Area Panel */}
      <div className="flex-1 bg-zinc-900 p-4 sm:p-8 overflow-y-auto flex justify-center items-start no-print">
        <div className="print-area w-[1000px] h-[800px] bg-white border-[6px] border-[#d4af37] p-8 text-black relative flex flex-col justify-between font-luxury-outfit select-none shadow-2xl">
          
          {/* Header Curved Ribbon details */}
          <div className="absolute top-0 right-0 w-[330px] h-[160px] bg-zinc-950 rounded-bl-[160px] border-l-[3px] border-b-[3px] border-[#d4af37] text-white p-5 pl-14 pt-4 flex flex-col gap-1 font-luxury-outfit text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-[10px]">📞</span>
              <span>Vishnu – 7891766624</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-[10px]">📞</span>
              <span>Piyush – 9549348495</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-[10px]">📸</span>
              <span>@siddhivinayak_eventsjaipur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-[10px]">🌐</span>
              <span>www.sidhivinayakevents.in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-[10px]">📍</span>
              <span>Niwaru Road, Jaipur</span>
            </div>
          </div>

          {/* Logo & Company details */}
          <div className="flex items-center gap-4 max-w-[600px]">
            <div className="relative w-24 h-24 border border-[#d4af37]/60 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
              <Image
                src="/logo.png"
                alt="Sidhi Vinayak Events Logo"
                fill
                priority
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold font-luxury-serif text-[#9b7625] tracking-tight leading-none">
                SIDHI VINAYAK
              </h1>
              <div className="flex items-center justify-center gap-1.5 my-1.5">
                <span className="h-[1px] bg-[#d4af37] flex-1" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-700">EVENTS</span>
                <span className="h-[1px] bg-[#d4af37] flex-1" />
              </div>
              <p className="text-xs font-medium italic text-zinc-500">Your Dream, We Create Memories</p>
            </div>
          </div>

          {/* Form Header Title */}
          <div className="text-center mt-6 mb-4 flex flex-col items-center">
            <h2 className="text-6xl font-black font-luxury-serif tracking-widest text-[#9b7625] leading-none">
              {docType === 'bill' ? 'BILL' : 'BOOKING CONFIRMATION'}
            </h2>
            <div className="flex items-center gap-2.5 my-2">
              <span className="text-xs italic text-zinc-600">
                {docType === 'bill' ? 'Thank you for choosing Sidhi Vinayak Events ♡' : 'We are pleased to confirm your booking with us.'}
              </span>
            </div>
            <span className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>

          {/* Content Columns: Info block Left & Amount box Right */}
          <div className="grid grid-cols-12 gap-8 items-stretch my-2">
            
            {/* Left Columns Fields */}
            <div className="col-span-7 space-y-3.5 pr-4 border-r border-[#d4af37]/20">
              {docType === 'bill' && (
                <>
                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-800 text-sm">Bill No.</span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{billNo}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-800 text-sm">Date</span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{formatDateLong(issueDate)}</span>
                  </div>
                </>
              )}
              <div className="flex items-baseline">
                <span className="w-32 font-bold text-zinc-800 text-sm">Client Name</span>
                <span className="w-4 text-zinc-500 font-bold">:</span>
                <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{clientName}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 font-bold text-zinc-800 text-sm">Event Type</span>
                <span className="w-4 text-zinc-500 font-bold">:</span>
                <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{eventType}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 font-bold text-zinc-800 text-sm">Event Date</span>
                <span className="w-4 text-zinc-500 font-bold">:</span>
                <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{formatDateLong(eventDate)}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 font-bold text-zinc-800 text-sm">Location</span>
                <span className="w-4 text-zinc-500 font-bold">:</span>
                <span className="flex-1 font-semibold text-zinc-800 border-b border-dashed border-zinc-300 pb-0.5 text-sm">{location}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-32 font-bold text-zinc-800 text-sm">Package Price</span>
                <span className="w-4 text-zinc-500 font-bold">:</span>
                <span className="flex-1 font-bold text-[#9b7625] border-b border-dashed border-zinc-300 pb-0.5 text-sm">
                  ₹{packagePrice.toLocaleString('en-IN')}/-
                </span>
              </div>
            </div>

            {/* Right Columns Amount Details Card */}
            <div className="col-span-5 flex flex-col justify-between">
              <div className="border border-[#d4af37] rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col justify-between bg-amber-500/5">
                {/* Gold header */}
                <div className="bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-white py-2.5 px-4 font-bold text-sm tracking-wider uppercase text-center font-luxury-serif">
                  {docType === 'bill' ? 'AMOUNT DETAILS' : 'PAYMENT DETAILS'}
                </div>

                <div className="p-4 space-y-2.5 text-sm flex-1 flex flex-col justify-center">
                  {docType === 'bill' ? (
                    <>
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                        <span className="text-zinc-600 font-medium">Package Price</span>
                        <span className="font-bold text-zinc-800">₹{packagePrice.toLocaleString('en-IN')}/-</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                        <span className="text-zinc-600 font-medium">Additional Charges</span>
                        <span className="font-bold text-zinc-800">₹{additionalCharges.toLocaleString('en-IN')}/-</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5 text-red-600">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold">- ₹{discount.toLocaleString('en-IN')}/-</span>
                      </div>
                      <div className="flex justify-between pt-1 font-extrabold text-[#9b7625] text-base">
                        <span>TOTAL AMOUNT</span>
                        <span>₹{billTotalAmount.toLocaleString('en-IN')}/-</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                        <span className="text-zinc-600 font-medium">Total Amount</span>
                        <span className="font-bold text-zinc-800">₹{packagePrice.toLocaleString('en-IN')}/-</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                        <span className="text-zinc-600 font-medium">Advance Received</span>
                        <span className="font-bold text-[#9b7625]">₹{advanceReceived.toLocaleString('en-IN')}/-</span>
                      </div>
                      <div className="flex justify-between pt-1 font-extrabold text-zinc-800 text-base">
                        <span>Remaining Amount</span>
                        <span className="text-red-600">₹{confirmationRemainingAmount.toLocaleString('en-IN')}/-</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Received Highlight Box */}
                <div className="bg-zinc-950 text-white p-3.5 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                    {docType === 'bill' ? 'TOTAL AMOUNT RECEIVED' : 'ADVANCE RECEIVED'}
                  </span>
                  <span className="text-lg font-black text-[#d4af37] font-luxury-serif mt-0.5">
                    ₹{(docType === 'bill' ? billTotalAmount : advanceReceived).toLocaleString('en-IN')}/-
                  </span>
                  <span className="text-[10px] italic text-zinc-400 font-light mt-0.5 leading-none">
                    ({numberToWords(docType === 'bill' ? billTotalAmount : advanceReceived)})
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Terms & Conditions / Sign Panel */}
          <div className="grid grid-cols-12 gap-8 items-end border-t border-zinc-200 pt-5 mt-4">
            
            {/* Left T&C */}
            <div className="col-span-8 space-y-2">
              <span className="text-xs font-bold text-[#9b7625] uppercase tracking-wider flex items-center gap-1.5">
                📝 TERMS & CONDITIONS
              </span>
              <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-4 leading-tight font-medium">
                <li>Advance once paid is non-refundable.</li>
                {docType === 'bill' ? (
                  <li>Balance amount (if any) must be cleared before or on the event date.</li>
                ) : (
                  <li>Remaining payment to be completed before or on the event date.</li>
                )}
                <li>Date once booked will be reserved exclusively for you.</li>
              </ul>
            </div>

            {/* Right Sign Block */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <span className="text-3xl font-signature text-[#9b7625] tracking-wide rotate-[-3deg] select-none pointer-events-none capitalize">
                {ownerDetails[owner].name}
              </span>
              <span className="w-36 h-[1.5px] bg-zinc-800 my-1" />
              <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Authorized Signature</span>
              <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">Sidhi Vinayak Events</span>
              <span className="text-[9px] text-[#9b7625] font-bold mt-0.5">📞 {ownerDetails[owner].phone}</span>
            </div>

          </div>

          {/* Bottom Footer Decoration badges & category icons */}
          <div className="flex items-center justify-between border-t border-[#d4af37]/30 pt-4 mt-6 text-zinc-400">
            <div className="border border-[#d4af37]/40 rounded-xl px-3 py-1 flex flex-col items-center justify-center bg-amber-500/5 select-none shrink-0">
              <span className="text-[8px] font-bold text-[#9b7625] tracking-[0.2em]">YOUR DREAM</span>
              <span className="h-[1px] w-12 bg-[#d4af37] my-0.5" />
              <span className="text-[7px] text-zinc-700 tracking-[0.3em] font-semibold">OUR COMMITMENT</span>
            </div>

            <div className="flex items-center justify-end gap-3.5 text-zinc-400 select-none">
              {[
                { label: 'WEDDINGS', icon: '💍' },
                { label: 'PRE WEDDING', icon: '📸' },
                { label: 'BRIDE ENTRY', icon: '👰' },
                { label: 'BIRTHDAY PARTIES', icon: '🎂' },
                { label: 'CORPORATE EVENTS', icon: '👥' },
                { label: 'HOUSE OPENING', icon: '🏠' },
                { label: 'DECORATION', icon: '🌸' }
              ].map((ic, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-sm">{ic.icon}</span>
                  <span className="text-[7px] font-bold text-zinc-500 scale-90 whitespace-nowrap tracking-wider">{ic.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
