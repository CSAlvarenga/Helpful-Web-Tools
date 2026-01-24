import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, Scissors, Loader2, Info } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

const PDFSplit = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadedPdf, setLoadedPdf] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a valid PDF file");
      return;
    }

    try {
      setError("");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      setSelectedFile(file);
      setLoadedPdf(pdf);
      setPageCount(pdf.getPageCount());
      setSplitPdfUrl(null);
    } catch (err) {
      setError("Failed to load PDF. Please ensure the file is valid.");
      console.error(err);
    }
  };

  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',');

    parts.forEach(part => {
      const range = part.trim().split('-');
      if (range.length === 2) {
        // It's a range (e.g. 1-5)
        let start = parseInt(range[0]);
        let end = parseInt(range[1]);
        
        if (!isNaN(start) && !isNaN(end)) {
          // Ensure correct order (min to max)
          if (start > end) [start, end] = [end, start]; 
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= maxPages) pages.add(i - 1); // -1 for 0-based index
          }
        }
      } else {
        // It's a single number (e.g. 5)
        const num = parseInt(part);
        if (!isNaN(num) && num > 0 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    });

    // Return sorted array of indices
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!loadedPdf || !pageRange.trim()) {
      setError("Please enter page numbers");
      return;
    }

    setIsSplitting(true);
    setError("");

    try {
      const pageIndices = parsePageRange(pageRange, pageCount);
      
      if (pageIndices.length === 0) {
        setError("No valid pages selected. Please check your input.");
        setIsSplitting(false);
        return;
      }

      // Create new PDF with selected pages
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(loadedPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Save and create download URL
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSplitPdfUrl(url);
    } catch (err) {
      console.error("Error splitting PDF:", err);
      setError("Failed to split PDF. Please check your page range format.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = () => {
    if (!splitPdfUrl) return;
    const link = document.createElement('a');
    link.href = splitPdfUrl;
    const fileName = selectedFile.name.replace('.pdf', '');
    link.download = `${fileName}_split.pdf`;
    link.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setLoadedPdf(null);
    setPageCount(0);
    setPageRange("");
    setSplitPdfUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              Split PDF
            </h1>
            <p className="text-muted-foreground text-lg">
              Extract specific pages from your PDF document
            </p>
          </div>

          {/* Upload Area */}
          {!selectedFile && (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-secondary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <Scissors className="w-16 h-16 mx-auto mb-4 text-secondary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Select PDF to Split</h3>
              <p className="text-muted-foreground mb-4">
                Click to browse and select a PDF file
              </p>
              <p className="text-sm text-muted-foreground">
                Choose which pages to keep from your document
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                data-testid="file-input"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Processing Interface */}
          {selectedFile && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">File Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/20 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Selected File</p>
                    <p className="text-base font-medium truncate" data-testid="file-name">{selectedFile.name}</p>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Pages</p>
                    <p className="text-2xl font-heading font-bold text-primary" data-testid="page-count">{pageCount}</p>
                  </div>
                </div>
              </div>

              {/* Page Selection */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Select Pages to Keep</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Page Range
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g., 1-5, 8, 10-15"
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-3"
                    data-testid="page-range-input"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter page numbers separated by commas. Use dashes for ranges (e.g., "1-3, 5, 7-10")
                  </p>
                </div>

                {/* Examples Box */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• <span className="text-primary font-mono">1-5</span> → Extract pages 1 through 5</li>
                        <li>• <span className="text-primary font-mono">2, 4, 6</span> → Extract pages 2, 4, and 6</li>
                        <li>• <span className="text-primary font-mono">1-3, 7, 10-12</span> → Extract pages 1-3, 7, and 10-12</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSplit}
                  disabled={isSplitting || !pageRange.trim()}
                  className="flex-1 px-6 py-4 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
                  data-testid="split-button"
                >
                  {isSplitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Splitting PDF...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-6 h-6" />
                      Split PDF
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-4 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                  data-testid="reset-button"
                >
                  Reset
                </button>
              </div>

              {/* Success & Download */}
              {splitPdfUrl && (
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2">Split Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your PDF has been split successfully
                    </p>
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3 mx-auto"
                      style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                      data-testid="download-button"
                    >
                      <Download className="w-6 h-6" />
                      Download Split PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-3">How It Works</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Upload a PDF file to split</li>
                  <li>• Enter the page numbers you want to keep</li>
                  <li>• Use ranges (1-5) or individual pages (2, 4, 6)</li>
                  <li>• Click "Split PDF" to create a new document</li>
                  <li>• Download your extracted pages instantly</li>
                  <li>• All processing happens in your browser - no server uploads</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PDFSplit;
