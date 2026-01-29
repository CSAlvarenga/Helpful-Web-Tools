import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { jsPDF } from "jspdf";
import { Download, Plus, Trash2, Upload, X } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { invoiceGeneratorContent } from "../../data/toolContent";

const InvoiceGenerator = () => {
  const [logo, setLogo] = useState(null);
  const logoInputRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: ''
  });

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

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;

    // Add logo if uploaded
    if (logo) {
      try {
        doc.addImage(logo, 'AUTO', 20, yPos, 40, 40);
        yPos += 45;
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // Header
    doc.setFontSize(24);
    doc.setTextColor(0, 240, 255);
    doc.text('INVOICE', logo ? pageWidth - 20 : pageWidth / 2, logo ? 35 : yPos, { align: logo ? 'right' : 'center' });
    
    if (!logo) {
      yPos += 15;
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, yPos);
    doc.text(`Date: ${invoiceData.date}`, pageWidth - 20, yPos, { align: 'right' });
    
    yPos += 6;
    if (invoiceData.dueDate) {
      doc.text(`Due Date: ${invoiceData.dueDate}`, pageWidth - 20, yPos, { align: 'right' });
    }

    // From/To Section
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('From:', 20, yPos);
    doc.text('Bill To:', pageWidth / 2 + 10, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.text(invoiceData.fromName || 'N/A', 20, yPos);
    doc.text(invoiceData.toName || 'N/A', pageWidth / 2 + 10, yPos);

    yPos += 5;
    if (invoiceData.fromEmail) {
      doc.text(invoiceData.fromEmail, 20, yPos);
    }
    if (invoiceData.toEmail) {
      doc.text(invoiceData.toEmail, pageWidth / 2 + 10, yPos);
    }

    yPos += 5;
    if (invoiceData.fromAddress) {
      doc.text(invoiceData.fromAddress, 20, yPos);
    }
    if (invoiceData.toAddress) {
      doc.text(invoiceData.toAddress, pageWidth / 2 + 10, yPos);
    }

    // Items Table
    yPos += 15;
    doc.setFillColor(0, 240, 255);
    doc.rect(20, yPos, pageWidth - 40, 8, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Description', 25, yPos + 5);
    doc.text('Qty', pageWidth - 80, yPos + 5);
    doc.text('Rate', pageWidth - 60, yPos + 5);
    doc.text('Amount', pageWidth - 30, yPos + 5);

    yPos += 10;
    doc.setTextColor(50, 50, 50);
    invoiceData.items.forEach((item, index) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description || 'Item', 25, yPos);
      doc.text(item.quantity.toString(), pageWidth - 80, yPos);
      doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 60, yPos);
      doc.text(`$${amount.toFixed(2)}`, pageWidth - 30, yPos);
      yPos += 7;
    });

    // Total
    yPos += 5;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Total:', pageWidth - 60, yPos);
    doc.setTextColor(255, 95, 0);
    doc.text(`$${calculateTotal().toFixed(2)}`, pageWidth - 30, yPos);

    // Notes
    if (invoiceData.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Notes:', 20, yPos);
      yPos += 6;
      doc.text(invoiceData.notes, 20, yPos);
    }

    doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
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
            {/* Invoice Details */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                    data-testid="invoice-number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                    data-testid="invoice-date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-2"
                    data-testid="due-date"
                  />
                </div>
              </div>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">From</h3>
                <div className="space-y-4">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Logo (Optional)</label>
                    {!logo ? (
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        data-testid="logo-upload-area"
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload logo</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={logo}
                          alt="Company logo"
                          className="max-h-20 rounded border border-white/10"
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

                  <input
                    type="text"
                    placeholder="Your Name / Company Name"
                    value={invoiceData.fromName}
                    onChange={(e) => setInvoiceData({...invoiceData, fromName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="from-name"
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={invoiceData.fromEmail}
                    onChange={(e) => setInvoiceData({...invoiceData, fromEmail: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="from-email"
                  />
                  <textarea
                    placeholder="Your Address"
                    value={invoiceData.fromAddress}
                    onChange={(e) => setInvoiceData({...invoiceData, fromAddress: e.target.value})}
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
                    value={invoiceData.toName}
                    onChange={(e) => setInvoiceData({...invoiceData, toName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="to-name"
                  />
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={invoiceData.toEmail}
                    onChange={(e) => setInvoiceData({...invoiceData, toEmail: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                    data-testid="to-email"
                  />
                  <textarea
                    placeholder="Client Address"
                    value={invoiceData.toAddress}
                    onChange={(e) => setInvoiceData({...invoiceData, toAddress: e.target.value})}
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
                {invoiceData.items.map((item, index) => (
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
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
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
