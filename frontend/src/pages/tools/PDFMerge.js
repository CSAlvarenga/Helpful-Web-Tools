import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, FilePlus, X, Loader2 } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

const PDFMerge = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      setError("Only PDF files are allowed");
      return;
    }
    
    if (pdfFiles.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }
    
    setSelectedFiles(pdfFiles);
    setError("");
    setMergedPdfUrl(null);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length < 2) {
      setError("Please select at least 2 PDF files to merge");
    }
  };

  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...selectedFiles];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setSelectedFiles(newFiles);
  };

  const moveFileDown = (index) => {
    if (index === selectedFiles.length - 1) return;
    const newFiles = [...selectedFiles];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setSelectedFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (selectedFiles.length < 2) {
      setError("Please select at least 2 PDF files");
      return;
    }

    setIsMerging(true);
    setError("");

    try {
      // Create a new blank PDF
      const mergedPdf = await PDFDocument.create();

      // Loop through every file
      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
    } catch (err) {
      console.error("Error merging PDFs:", err);
      setError("Failed to merge PDFs. Please ensure all files are valid PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdfUrl) return;
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged_document.pdf';
    link.click();
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setMergedPdfUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024).toFixed(1) + ' KB';
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
              Merge PDF
            </h1>
            <p className="text-muted-foreground text-lg">
              Combine multiple PDF files into a single document
            </p>
          </div>

          {/* Upload Area */}
          {selectedFiles.length === 0 && (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-secondary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <FilePlus className="w-16 h-16 mx-auto mb-4 text-secondary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Select PDF Files</h3>
              <p className="text-muted-foreground mb-4">
                Click to browse and select multiple PDF files
              </p>
              <p className="text-sm text-muted-foreground">
                Hold Ctrl/Cmd to select multiple files (Minimum 2 files)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
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

          {/* File List & Controls */}
          {selectedFiles.length > 0 && (
            <div className="space-y-6">
              {/* File List */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading font-bold">Selected Files ({selectedFiles.length})</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-primary/50 text-primary rounded-sm hover:bg-primary/10 transition-all duration-300 text-sm font-bold uppercase"
                    data-testid="add-more-button"
                  >
                    Add More
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-black/20 rounded border border-white/10 hover:border-primary/30 transition-all"
                      data-testid={`file-item-${index}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                          className="p-2 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                          data-testid={`move-up-${index}`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveFileDown(index)}
                          disabled={index === selectedFiles.length - 1}
                          className="p-2 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                          data-testid={`move-down-${index}`}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove"
                          data-testid={`remove-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Tip: Use the arrow buttons to reorder files before merging
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={mergePDFs}
                  disabled={isMerging || selectedFiles.length < 2}
                  className="flex-1 px-6 py-4 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
                  data-testid="merge-button"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-6 h-6" />
                      Merge {selectedFiles.length} PDFs
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
              {mergedPdfUrl && (
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2">Merge Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your PDFs have been successfully merged into one document
                    </p>
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3 mx-auto"
                      style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                      data-testid="download-button"
                    >
                      <Download className="w-6 h-6" />
                      Download Merged PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-3">How It Works</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Select multiple PDF files (minimum 2)</li>
                  <li>• Reorder files using arrow buttons if needed</li>
                  <li>• Click "Merge PDFs" to combine all files</li>
                  <li>• Download your merged document instantly</li>
                  <li>• All processing happens in your browser - no uploads to servers</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PDFMerge;
