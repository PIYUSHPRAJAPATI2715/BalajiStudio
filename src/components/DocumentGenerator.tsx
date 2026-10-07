'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Printer, FileText, Send, Plus, Trash2, Download, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type BookingItem = {
  description: string;
  qty: number;
  rate: number;
  amount: number;
};

type Booking = {
  _id: string;
  clientName: string;
  clientPhone?: string;
  programName: string;
  date: string;
  venue?: string;
  location: string;
  branch?: 'Jaipur' | 'Shahpura' | 'Neem Ka Thana';
  assignedTo?: 'Piyush' | 'Vishnu' | 'Manoj';
  eventType: string;
  paymentMode?: string;
  totalAmount: number;
  receivedAmount: number;
  status: string;
  notes?: string;
  items?: BookingItem[];
};

type DocumentGeneratorProps = {
  booking: Booking;
  onClose: () => void;
};

// Indian Numbering Word Converter
function numberToWords(num: number): string {
  if (!num || num === 0) return 'Rupees Zero Only';
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

// Format Date to "03 October 2026"
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
  const [docType, setDocType] = useState<'bill' | 'confirmation'>('bill');
  const [owner, setOwner] = useState<'piyush' | 'vishnu' | 'manoj'>(
    (booking.assignedTo?.toLowerCase() as any) || 'piyush'
  );
  const [billNo, setBillNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  
  // Dynamic form overrides
  const [clientName, setClientName] = useState(booking.clientName || '');
  const [clientPhone, setClientPhone] = useState(booking.clientPhone || '');
  const [eventType, setEventType] = useState(booking.eventType || booking.programName || '');
  const [eventDate, setEventDate] = useState(booking.date ? booking.date.split('T')[0] : '');
  const [venue, setVenue] = useState(booking.venue || '');
  const [location, setLocation] = useState(booking.location || '');
  const [branch, setBranch] = useState<'Jaipur' | 'Shahpura' | 'Neem Ka Thana'>(booking.branch || 'Jaipur');
  const [paymentMode, setPaymentMode] = useState(booking.paymentMode || 'Cash/UPI');
  const [notes, setNotes] = useState(booking.notes || '');

  // Line items for description table
  const [items, setItems] = useState<BookingItem[]>(
    booking.items && booking.items.length > 0
      ? booking.items
      : [
          {
            description: `${booking.eventType || booking.programName || 'Event'} Package`,
            qty: 1,
            rate: booking.totalAmount || 0,
            amount: booking.totalAmount || 0,
          },
        ]
  );
  
  const [advanceReceived, setAdvanceReceived] = useState(booking.receivedAmount || 0);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingJPG, setDownloadingJPG] = useState(false);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate dynamic Bill No on load
  useEffect(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setBillNo(`SVE/26-27/${randomNum}`);
    setIssueDate(new Date().toISOString().split('T')[0]);
  }, [booking]);

  // Responsive scale calculator
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth;
      if (parentWidth < 1040) {
        setScale((parentWidth - 32) / 1000);
      } else {
        setScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    const t = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t);
    };
  }, []);

  // Total calculation from items
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingAmount = Math.max(0, totalAmount - advanceReceived);

  const ownerDetails = {
    piyush: { name: 'Piyush', phone: '9549348495' },
    vishnu: { name: 'Vishnu', phone: '7891766624' },
    manoj: { name: 'Manoj', phone: '9782130139' }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BookingItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      item.amount = (Number(item.qty) || 0) * (Number(item.rate) || 0);
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleSendWhatsApp = async () => {
    const phoneClean = clientPhone.replace(/\D/g, '');
    const msg = `🎉 *${docType === 'bill' ? 'BILL INVOICE' : 'BOOKING CONFIRMATION'} - Sidhi Vinayak Events*
---------------------------------------------
Dear *${clientName}*,
We are pleased to share your ${docType === 'bill' ? 'invoice bill' : 'booking confirmation'}!

📅 *Event Date:* ${formatDateLong(eventDate)}
🎉 *Event Type:* ${eventType}
📍 *Venue:* ${venue || 'N/A'}
📍 *Location:* ${location} (${branch})
💰 *Total Amount:* ₹${totalAmount.toLocaleString('en-IN')}/-
💵 *Advance Received:* ₹${advanceReceived.toLocaleString('en-IN')}/-
🔴 *Remaining Balance:* ₹${remainingAmount.toLocaleString('en-IN')}/-

👤 *Assigned Manager:* ${ownerDetails[owner].name} (${ownerDetails[owner].phone})
${notes ? `\n📝 *Notes:* ${notes}` : ''}

✨ *Your Dream, We Create Memories*
🌐 Website: https://www.sidhivinayakevents.in`;

    const element = document.getElementById('print-area-container');
    const cleanFileName = clientName ? clientName.trim().replace(/\s+/g, '_') : 'Client';
    const jpgFileName = `${docType === 'bill' ? 'Invoice' : 'Booking_Confirmation'}_SVE_${cleanFileName}.jpg`;

    if (element) {
      try {
        setDownloadingJPG(true);
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const res = await fetch(imgData);
        const blob = await res.blob();
        const jpgFile = new File([blob], jpgFileName, { type: 'image/jpeg' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [jpgFile] })) {
          await navigator.share({
            files: [jpgFile],
            title: `${docType === 'bill' ? 'Invoice' : 'Booking Confirmation'} - ${clientName}`,
            text: msg,
          });
          setDownloadingJPG(false);
          return;
        }

        const a = document.createElement('a');
        a.href = imgData;
        a.download = jpgFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error('Error generating JPG for WhatsApp:', e);
      } finally {
        setDownloadingJPG(false);
      }
    }

    const url = phoneClean 
      ? `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
  };

  const handleDownloadJPG = async () => {
    const element = document.getElementById('print-area-container');
    if (!element) return;
    setDownloadingJPG(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const cleanFileName = clientName ? clientName.trim().replace(/\s+/g, '_') : 'Client';
      const fileName = `${docType === 'bill' ? 'Invoice' : 'Booking_Confirmation'}_SVE_${cleanFileName}.jpg`;

      const a = document.createElement('a');
      a.href = imgData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Direct JPG error:', err);
    } finally {
      setDownloadingJPG(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('print-area-container');
    if (!element) return;
    setDownloadingPDF(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      // Guarantee exact 1 Single Page A4 PDF (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      const cleanFileName = clientName ? clientName.trim().replace(/\s+/g, '_') : 'Client';
      const fileName = `${docType === 'bill' ? 'Invoice' : 'Booking_Confirmation'}_SVE_${cleanFileName}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error('Direct PDF error:', err);
      handlePrint();
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1100,height=850');
    if (!printWindow) {
      alert('Please allow popups to print / save PDF invoices.');
      return;
    }

    const printContent = document.getElementById('print-area-container')?.innerHTML || '';

    printWindow.document.write(`
      <html>
        <head>
          <title>${docType === 'bill' ? 'Invoice Bill' : 'Booking Confirmation'} - ${clientName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    signature: ['Great Vibes', 'cursive'],
                    luxurySerif: ['Cinzel', 'serif'],
                    luxuryOutfit: ['Outfit', 'sans-serif'],
                  }
                }
              }
            }
          </script>
          <style>
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

            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-container {
                width: 210mm !important;
                height: 297mm !important;
                padding: 24px !important;
                box-sizing: border-box !important;
                border: 6px solid #d4af37 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
              }
            }
            body {
              background: #09090b;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .print-container {
              width: 1000px;
              min-height: 1250px;
              background: #ffffff;
              border: 6px solid #d4af37;
              padding: 32px;
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
            }
          </style>
        </head>
        <body>
          <div class="print-container text-black select-none">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
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
      `}} />

      {/* Editor Controls Pane (Sidebar) */}
      <div className="w-full lg:w-[420px] bg-zinc-900 border-r border-white/10 p-5 flex flex-col justify-between overflow-y-auto no-print">
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
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
                onClick={() => setDocType('bill')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === 'bill' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Bill / Invoice
              </button>
              <button
                onClick={() => setDocType('confirmation')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === 'confirmation' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Booking Confirmation
              </button>
            </div>
          </div>

          {/* Dropdown Signature */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Assigned Manager</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value as any)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="piyush">Piyush</option>
                <option value="vishnu">Vishnu</option>
                <option value="manoj">Manoj</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as any)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="Jaipur">Jaipur</option>
                <option value="Shahpura">Shahpura</option>
                <option value="Neem Ka Thana">Neem Ka Thana</option>
              </select>
            </div>
          </div>

          {/* Core Booking Fields */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact No.</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="98290XXXXX"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Event Type</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Narayandash ji Mansir"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location / Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Line Items Table Builder */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill Line Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={idx} className="bg-black/40 p-2.5 rounded-xl space-y-2 border border-white/5">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Qty</span>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Rate (₹)</span>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Amount (₹)</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Advance & Payment Details */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  value={advanceReceived}
                  onChange={(e) => setAdvanceReceived(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Mode</label>
                <input
                  type="text"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  placeholder="Cash/UPI"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Booking Notes (Included in Bill)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requirement, custom packages, timing notes..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none h-16 resize-none placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          <button
            onClick={handleDownloadJPG}
            disabled={downloadingJPG}
            className="w-full py-3.5 bg-gradient-gold hover:bg-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {downloadingJPG ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Image (JPG)...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download JPG Image (1-Click)
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-amber-500/30 transition-all disabled:opacity-50"
          >
            {downloadingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" /> Download PDF (1 Page Only)
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
          >
            <Send className="w-4 h-4" /> Send Invoice to Client (WhatsApp)
          </button>
          
          <button
            onClick={handlePrint}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Browser Dialog
          </button>
        </div>
      </div>

      {/* Preview Area Panel */}
      <div ref={containerRef} className="flex-1 bg-zinc-950 p-4 overflow-y-auto flex justify-center items-start">
        <div 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            minWidth: '1000px',
            maxWidth: '1000px',
            marginBottom: `${(1 - scale) * -1250}px`
          }}
          className="transition-transform duration-100"
        >
          {/* Exact Template Card Matching Image - Fixed A4 Ratio (1000px x 1414px) */}
          <div id="print-area-container" className="print-area w-[1000px] h-[1414px] bg-[#ffffff] border-[6px] border-[#c49838] p-8 text-black relative flex flex-col justify-between font-luxury-outfit select-none shadow-2xl overflow-hidden">
            
            {/* Inner Gold Frame Border */}
            <div className="absolute inset-2 border border-[#c49838]/30 pointer-events-none" />

            {/* Background Subtle Luxury Floral Decor */}
            <div className="absolute right-[-40px] bottom-[-40px] w-[450px] h-[450px] opacity-10 pointer-events-none select-none">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#9b7625]" fill="currentColor">
                <path d="M90,80 C80,60 50,70 40,50 C30,30 20,40 10,20 C15,25 25,35 40,40 C55,45 75,55 90,80 Z" />
                <circle cx="40" cy="50" r="3" />
                <circle cx="10" cy="20" r="2" />
                <path d="M40,50 C45,35 60,30 70,20 C60,25 50,35 40,50 Z" />
                <path d="M40,50 C55,55 65,70 75,85 C65,75 55,65 40,50 Z" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex items-start justify-between relative z-10">
                {/* Logo & Company Details */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border-2 border-[#c49838] rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#fff8e7] shadow-md ring-4 ring-[#c49838]/20">
                    {/* Standard img tag for 100% reliable canvas rendering */}
                    {/* eslint-disable-next-html-element-for-to-js-call */}
                    <img
                      src="/logo.png"
                      alt="Sidhi Vinayak Events Logo"
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-black font-luxury-serif text-[#9b7625] tracking-wide leading-none">
                      SIDHI VINAYAK
                    </h1>
                    <div className="flex items-center justify-center gap-1.5 my-1.5">
                      <span className="h-[1.5px] bg-[#c49838] flex-1" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-800">EVENTS</span>
                      <span className="h-[1.5px] bg-[#c49838] flex-1" />
                    </div>
                    <p className="text-xs font-semibold italic text-zinc-600 font-signature text-sm">Your Dream, We Create Memories</p>
                  </div>
                </div>

                {/* Right Top Curved Crescent Black Banner */}
                <div className="w-[340px] h-[165px] bg-[#0c0c0e] rounded-bl-[160px] border-l-[3px] border-b-[3px] border-[#c49838] text-white p-5 pl-14 pt-4 flex flex-col gap-1.5 font-luxury-outfit text-[11px] shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c49838] text-[11px]">📞</span>
                    <span className="font-semibold">Vishnu - 7891766624</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#c49838] text-[11px]">📞</span>
                    <span className="font-semibold">Piyush - 9549348495</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#c49838] text-[11px]">📸</span>
                    <span className="text-amber-200">@sidhinivayak_eventsjaipur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#c49838] text-[11px]">🌐</span>
                    <span className="text-amber-200 font-mono text-[10px]">www.sidhivinayakevents.in</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                    <span className="text-[#c49838]">📍</span>
                    <span>Niwaru Road, Jaipur | Shahpura | Neem ka Thana</span>
                  </div>
                </div>
              </div>

              {/* 5 Icons Row Bar */}
              <div className="my-5 py-2.5 px-4 border border-[#c49838]/60 rounded-full flex items-center justify-around bg-amber-500/5 relative z-10 shadow-xs">
                {[
                  { label: 'Wedding Decoration', icon: '💍' },
                  { label: 'Birthday Party', icon: '🎂' },
                  { label: 'Pre Wedding Shoot', icon: '📸' },
                  { label: 'House Opening Ceremony', icon: '🏠' },
                  { label: 'Corporate Events', icon: '👥' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-center">
                    <span className="w-8 h-8 rounded-full border border-[#c49838] bg-white flex items-center justify-center text-sm shadow-xs">
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-extrabold text-zinc-800 uppercase tracking-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Center Ribbon Header */}
              <div className="text-center my-4 relative z-10 flex justify-center">
                <div className="relative bg-gradient-to-r from-[#8c641c] via-[#c49838] to-[#8c641c] text-white px-20 py-2.5 rounded-xl shadow-lg border-2 border-[#f5d77f]">
                  <h2 className="text-2xl font-black font-luxury-serif tracking-[0.25em] text-white leading-none uppercase drop-shadow-md">
                    {docType === 'bill' ? 'BILL / INVOICE' : 'BOOKING CONFIRMATION'}
                  </h2>
                </div>
              </div>

              {/* Top Info Grid Details */}
              <div className="border border-[#c49838]/50 rounded-2xl p-5 bg-[#faf8f5] space-y-2.5 relative z-10 text-sm shadow-xs">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📄</span> Bill No.
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-extrabold text-[#9b7625] border-b border-zinc-300/80 pb-0.5">{billNo}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📅</span> Date
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{formatDateLong(issueDate)}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">👤</span> Client Name
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-extrabold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{clientName || '-'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📞</span> Contact No.
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{clientPhone || '-'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">🎉</span> Event Type
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-bold text-[#9b7625] border-b border-zinc-300/80 pb-0.5">{eventType}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📅</span> Event Date
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{formatDateLong(eventDate)}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📍</span> Venue
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{venue || '-'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-32 font-bold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[#9b7625]">📍</span> Location
                    </span>
                    <span className="w-4 text-zinc-500 font-bold">:</span>
                    <span className="flex-1 font-semibold text-zinc-900 border-b border-zinc-300/80 pb-0.5">{location} ({branch})</span>
                  </div>
                </div>
              </div>

              {/* Description & Rate Table */}
              <div className="mt-5 border-2 border-[#c49838] rounded-xl overflow-hidden shadow-xs relative z-10">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#8c641c] via-[#c49838] to-[#8c641c] text-white font-bold text-xs uppercase tracking-wider">
                      <th className="py-3 px-3 border-r border-white/20 text-center w-16">S.No.</th>
                      <th className="py-3 px-4 border-r border-white/20">Description / Package Details</th>
                      <th className="py-3 px-3 border-r border-white/20 text-center w-20">Qty.</th>
                      <th className="py-3 px-4 border-r border-white/20 text-right w-28">Rate (₹)</th>
                      <th className="py-3 px-4 text-right w-32">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c49838]/20 bg-white">
                    {items.map((item, idx) => (
                      <tr key={idx} className="text-zinc-800 text-sm">
                        <td className="py-3.5 px-3 border-r border-[#c49838]/20 text-center font-bold text-zinc-600">{idx + 1}</td>
                        <td className="py-3.5 px-4 border-r border-[#c49838]/20 font-bold text-zinc-900">
                          {item.description}
                        </td>
                        <td className="py-3.5 px-3 border-r border-[#c49838]/20 text-center font-bold text-zinc-700">{item.qty}</td>
                        <td className="py-3.5 px-4 border-r border-[#c49838]/20 text-right font-medium">₹{Number(item.rate).toLocaleString('en-IN')}/-</td>
                        <td className="py-3.5 px-4 text-right font-black text-zinc-900 text-base">₹{Number(item.amount).toLocaleString('en-IN')}/-</td>
                      </tr>
                    ))}

                    {/* Booking Notes as dynamic line item if present */}
                    {notes && (
                      <tr className="text-zinc-700 text-xs bg-amber-500/5">
                        <td className="py-2.5 px-3 border-r border-[#c49838]/20 text-center font-bold text-[#9b7625]">Note</td>
                        <td colSpan={4} className="py-2.5 px-4 italic text-zinc-700 font-medium">
                          📝 {notes}
                        </td>
                      </tr>
                    )}

                    {/* Min 2 Rows Filler */}
                    {items.length < 2 && !notes && (
                      <tr className="h-10">
                        <td className="border-r border-[#c49838]/20"></td>
                        <td className="border-r border-[#c49838]/20"></td>
                        <td className="border-r border-[#c49838]/20"></td>
                        <td className="border-r border-[#c49838]/20"></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#fff9ea] border-t-2 border-[#c49838] font-black text-base">
                      <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider text-zinc-900 font-luxury-serif">
                        Total Amount
                      </td>
                      <td className="py-3 px-4 text-right text-[#9b7625] font-black text-xl">
                        ₹{totalAmount.toLocaleString('en-IN')}/-
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom Payment Details & Summary Grid */}
              <div className="grid grid-cols-12 gap-5 mt-5 items-stretch relative z-10">
                
                {/* Left: Payment Details Box */}
                <div className="col-span-7 border-2 border-[#c49838]/60 rounded-xl overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="bg-[#0c0c0e] text-white py-2 px-4 font-bold text-xs uppercase tracking-wider text-center font-luxury-serif">
                      PAYMENT TRANSACTION DETAILS
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#faf8f5] border-b border-[#c49838]/30 font-bold text-zinc-700">
                          <th className="py-2 px-2 text-center border-r border-[#c49838]/20">S.No.</th>
                          <th className="py-2 px-2 border-r border-[#c49838]/20">Date</th>
                          <th className="py-2 px-2 border-r border-[#c49838]/20">Mode</th>
                          <th className="py-2 px-2 text-right border-r border-[#c49838]/20">Amount (₹)</th>
                          <th className="py-2 px-2">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#c49838]/20 text-zinc-800">
                          <td className="py-2.5 px-2 text-center border-r border-[#c49838]/20 font-bold">1</td>
                          <td className="py-2.5 px-2 border-r border-[#c49838]/20 font-semibold">{formatDateLong(eventDate)}</td>
                          <td className="py-2.5 px-2 border-r border-[#c49838]/20 font-semibold">{paymentMode}</td>
                          <td className="py-2.5 px-2 text-right border-r border-[#c49838]/20 font-extrabold text-emerald-700">₹{advanceReceived.toLocaleString('en-IN')}/-</td>
                          <td className="py-2.5 px-2 text-zinc-600 font-medium">Advance Received</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-[#fff9ea] border-t border-[#c49838]/40 p-2.5 flex justify-between items-center text-sm font-bold">
                    <span className="text-zinc-800 uppercase tracking-wider font-luxury-serif">Total Received</span>
                    <span className="text-emerald-700 font-black text-base">₹{advanceReceived.toLocaleString('en-IN')}/-</span>
                  </div>
                </div>

                {/* Right: Summary Badges */}
                <div className="col-span-5 space-y-2 flex flex-col justify-between">
                  <div className="bg-[#faf8f5] border border-[#c49838]/60 rounded-xl p-3 flex justify-between items-center shadow-xs">
                    <span className="text-xs font-bold text-zinc-700 uppercase">Total Amount</span>
                    <span className="text-base font-black text-zinc-900">₹{totalAmount.toLocaleString('en-IN')}/-</span>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 flex justify-between items-center shadow-xs">
                    <span className="text-xs font-extrabold text-emerald-900 uppercase">Amount Received</span>
                    <span className="text-lg font-black text-emerald-700">₹{advanceReceived.toLocaleString('en-IN')}/-</span>
                  </div>

                  <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 flex justify-between items-center shadow-xs">
                    <span className="text-xs font-extrabold text-rose-900 uppercase">Remaining Balance</span>
                    <span className="text-lg font-black text-rose-700">₹{remainingAmount.toLocaleString('en-IN')}/-</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footer Section: T&C + Signature */}
            <div className="grid grid-cols-12 gap-6 items-end border-t-2 border-[#c49838]/40 pt-5 mt-6 relative z-10">
              
              {/* Left: Terms & Conditions */}
              <div className="col-span-7 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c49838] text-white flex items-center justify-center shrink-0 shadow-md text-lg">
                  📋
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold text-[#9b7625] uppercase tracking-wider font-luxury-serif">
                    TERMS & CONDITIONS
                  </h3>
                  <ul className="text-[10px] text-zinc-600 space-y-0.5 list-disc pl-3.5 font-medium leading-relaxed">
                    <li>Advance amount is strictly non-refundable.</li>
                    <li>Balance amount (if any) must be cleared on or before event date.</li>
                    <li>Date once booked will be reserved exclusively for your event.</li>
                    <li>Any additional setup requirements will be charged separately.</li>
                    <li>This is a computer generated document from Sidhi Vinayak Events.</li>
                  </ul>
                </div>
              </div>

              {/* Right: Official Stamp & Signature */}
              <div className="col-span-5 flex flex-col items-center text-center relative">
                
                {/* Official Verification Stamp Graphic */}
                <div className="absolute top-[-25px] right-2 w-20 h-20 border-2 border-dashed border-[#c49838] rounded-full flex flex-col items-center justify-center p-1 rotate-[-12deg] opacity-80 pointer-events-none select-none bg-amber-500/5">
                  <span className="text-[7px] font-black uppercase text-[#9b7625] tracking-tighter">SIDHI VINAYAK</span>
                  <span className="text-[9px] font-black uppercase text-[#8c641c] border-y border-[#c49838] py-0.5 my-0.5 w-full text-center">VERIFIED</span>
                  <span className="text-[6px] font-bold uppercase text-[#9b7625]">EVENTS JAIPUR</span>
                </div>

                <div className="mb-2">
                  <p className="text-2xl font-signature text-[#9b7625] font-medium leading-none">Thank You! ♡</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">for trusting Sidhi Vinayak Events</p>
                </div>

                <span className="text-4xl font-signature text-[#9b7625] tracking-wide rotate-[-3deg] select-none pointer-events-none capitalize">
                  {ownerDetails[owner].name}
                </span>
                <span className="w-40 h-[1.5px] bg-zinc-800 my-1" />
                <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider font-luxury-serif">AUTHORIZED SIGNATURE</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">SIDHI VINAYAK EVENTS</span>
                <span className="text-[9px] text-[#9b7625] font-bold mt-0.5">📞 {ownerDetails[owner].phone}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
