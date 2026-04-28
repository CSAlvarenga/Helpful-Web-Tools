import { useState, useRef, useCallback } from "react";
import Layout from "../../components/Layout";
import { jsPDF } from "jspdf";
import { Download, Plus, Trash2, Upload, X } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { invoiceGeneratorContent } from "../../data/toolContent";

const InvoiceGenerator = () => {
  const [logo, setLogo] = useState(null);
  const logoInputRef = useRef(null);
  
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toName, setToName] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const addItem = useCallback(() => {
    setItems(prev => [...prev, { description: '', quantity: 1, rate: 0 }]);
  }, []);

  const removeItem = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index, field, value) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  }, []);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;

    // Header section with logo
    if (logo) {
      try {
        doc.addImage(logo, 'AUTO', 20, yPos, 35, 35);
      } catch (error) {
        console.error('Error adding logo:', error);
      }
      // INVOICE title on the right when logo exists
      doc.setFontSize(28);
      doc.setTextColor(0, 150, 200);
      doc.text('INVOICE', pageWidth - 20, yPos + 15, { align: 'right' });
      
      // Invoice details below title
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - 20, yPos + 25, { align: 'right' });
      doc.text(`Date: ${invoiceDate}`, pageWidth - 20, yPos + 32, { align: 'right' });
      if (dueDate) {
        doc.text(`Due: ${dueDate}`, pageWidth - 20, yPos + 39, { align: 'right' });
      }
      yPos = 65;
    } else {
      // Centered INVOICE title when no logo
      doc.setFontSize(28);
      doc.setTextColor(0, 150, 200);
      doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${invoiceNumber}`, 20, yPos);
      doc.text(`Date: ${invoiceDate}`, pageWidth - 20, yPos, { align: 'right' });
      
      if (dueDate) {
        yPos += 6;
        doc.text(`Due Date: ${dueDate}`, pageWidth - 20, yPos, { align: 'right' });
      }
      yPos += 15;
    }

    // Horizontal line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // From/To Section
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('From:', 20, yPos);
    doc.text('Bill To:', pageWidth / 2 + 10, yPos);

    yPos += 7;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // From details
    let fromYPos = yPos;
    if (fromName) {
      doc.text(fromName, 20, fromYPos);
      fromYPos += 5;
    }
    if (fromEmail) {
      doc.text(fromEmail, 20, fromYPos);
      fromYPos += 5;
    }
    if (fromAddress) {
      const fromLines = doc.splitTextToSize(fromAddress, 70);
      doc.text(fromLines, 20, fromYPos);
      fromYPos += fromLines.length * 5;
    }

    // To details
    let toYPos = yPos;
    if (toName) {
      doc.text(toName, pageWidth / 2 + 10, toYPos);
      toYPos += 5;
    }
    if (toEmail) {
      doc.text(toEmail, pageWidth / 2 + 10, toYPos);
      toYPos += 5;
    }
    if (toAddress) {
      const toLines = doc.splitTextToSize(toAddress, 70);
      doc.text(toLines, pageWidth / 2 + 10, toYPos);
      toYPos += toLines.length * 5;
    }

    yPos = Math.max(fromYPos, toYPos) + 10;

    // Items Table Header
    doc.setFillColor(0, 150, 200);
    doc.rect(20, yPos, pageWidth - 40, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Description', 25, yPos + 7);
    doc.text('Qty', pageWidth - 75, yPos + 7, { align: 'center' });
    doc.text('Rate', pageWidth - 50, yPos + 7, { align: 'center' });
    doc.text('Amount', pageWidth - 25, yPos + 7, { align: 'right' });

    yPos += 15;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(50, 50, 50);
    
    // Items rows
    items.forEach((item) => {
      const amount = item.quantity * item.rate;
      const descText = item.description || 'Item';
      const descLines = doc.splitTextToSize(descText, 80);
      
      doc.text(descLines, 25, yPos);
      doc.text(item.quantity.toString(), pageWidth - 75, yPos, { align: 'center' });
      doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 50, yPos, { align: 'center' });
      doc.text(`$${amount.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
      
      yPos += Math.max(descLines.length * 5, 7) + 3;
    });

    // Total line
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);
    yPos += 8;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Total:', pageWidth - 55, yPos);
    doc.setTextColor(255, 100, 0);
    doc.text(`$${calculateTotal().toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });

    // Notes section
    if (notes) {
      yPos += 20;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text('Notes:', 20, yPos);
      yPos += 6;
      doc.setFont(undefined, 'normal');
      const notesLines = doc.splitTextToSize(notes, pageWidth - 40);
      doc.text(notesLines, 20, yPos);
    }

    doc.save(`invoice-${invoiceNumber}.pdf`);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              Invoice Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create professional invoices and download as PDF
            </p>
          </div>

          <div className="space-y-6">
            {/* Company Logo + Invoice Details Row */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload - Left Side */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company Logo (Optional)</label>
                  {!logo ? (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors h-32 flex flex-col items-center justify-center"
                      data-testid="logo-upload-area"
                    >
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload logo</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={logo}
                        alt="Company logo"
                        className="max-h-28 rounded border border-white/10"
                        data-testid="logo-preview"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
                        data-testid="remove-logo-button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleLogoUpload}
                    className="hidden"
                    data-testid="logo-input"
                  />
                </div>

                {/* Invoice Details - Right Side (Stacked) */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                      data-testid="invoice-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                        data-testid="invoice-date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                        data-testid="due-date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">From</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name / Company Name"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="from-name"
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="from-email"
                  />
                  <textarea
                    placeholder="Your Address"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="from-address"
                  />
                </div>
              </div>

              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Bill To</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="to-name"
                  />
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="to-email"
                  />
                  <textarea
                    placeholder="Client Address"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="to-address"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-heading font-bold">Items</h3>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
                  data-testid="add-item-button"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center" data-testid={`item-${index}`}>
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="col-span-5 bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="col-span-2 bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="col-span-2 bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    />
                    <div className="col-span-2 text-right font-mono">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="col-span-1 p-2 text-red-400 hover:text-red-300 transition-colors"
                      data-testid={`remove-item-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-lg font-heading font-bold">Total:</span>
                <span className="text-3xl font-heading font-bold text-secondary" data-testid="invoice-total">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Notes</h3>
              <textarea
                placeholder="Additional notes or terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                data-testid="invoice-notes"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePDF}
              className="w-full px-6 py-4 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center justify-center gap-3"
              style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
              data-testid="generate-pdf-button"
            >
              <Download className="w-6 h-6" />
              Generate & Download PDF
            </button>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={invoiceGeneratorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceGenerator;
