import { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';
import ToolContent from "../../components/ToolContent";
import { pdfToImageContent } from "../../data/toolContent";

const PDFToImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Setup PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a valid PDF file");
      return;
    }

    setSelectedFile(file);
    setError("");
    setPages([]);
    await convertPDF(file);
  };

  const convertPDF = async (file) => {
    setIsProcessing(true);
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;

      const convertedPages = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageData = await renderPage(pdf, pageNum);
        convertedPages.push(pageData);
      }

      setPages(convertedPages);
    } catch (err) {
      console.error("Error converting PDF:", err);
      setError("Failed to convert PDF. The file may be corrupted or password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const quality = format === 'image/jpeg' ? 0.9 : 1.0;
    const imgData = canvas.toDataURL(format, quality);

    return {
      pageNum,
      imgData,
      width: viewport.width,
      height: viewport.height
    };
  };

  const handleFormatChange = async (newFormat) => {
    setFormat(newFormat);
    if (selectedFile) {
      await convertPDF(selectedFile);
    }
  };

  const handleDownloadAll = () => {
    pages.forEach((page) => {
      const link = document.createElement('a');
      link.href = page.imgData;
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';
      link.download = `${selectedFile.name.replace('.pdf', '')}_page-${page.pageNum}.${ext}`;
      link.click();
    });
  };

  const handleDownloadSingle = (page) => {
    const link = document.createElement('a');
    link.href = page.imgData;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    link.download = `${selectedFile.name.replace('.pdf', '')}_page-${page.pageNum}.${ext}`;
    link.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPages([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              PDF to Image
            </h1>
            <p className="text-muted-foreground text-lg">
              Convert PDF pages to JPG or PNG images
            </p>
          </div>

          {/* Upload Area */}
          {!selectedFile && (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Select PDF File</h3>
              <p className="text-muted-foreground mb-4">
                Click to browse and select a PDF to convert
              </p>
              <p className="text-sm text-muted-foreground">
                Each page will be converted to a separate image
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

          {/* Format Selection & Controls */}
          {selectedFile && (
            <div className="space-y-6">
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Conversion Settings</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Output Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleFormatChange('image/png')}
                        className={`p-3 rounded-sm border-2 transition-all duration-300 ${
                          format === 'image/png'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                        }`}
                        data-testid="format-png"
                      >
                        <span className="font-bold">PNG</span>
                        <p className="text-xs mt-1 opacity-70">Best Quality</p>
                      </button>
                      <button
                        onClick={() => handleFormatChange('image/jpeg')}
                        className={`p-3 rounded-sm border-2 transition-all duration-300 ${
                          format === 'image/jpeg'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                        }`}
                        data-testid="format-jpg"
                      >
                        <span className="font-bold">JPG</span>
                        <p className="text-xs mt-1 opacity-70">Smaller Size</p>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    {pages.length > 0 && (
                      <button
                        onClick={handleDownloadAll}
                        className="px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center gap-2"
                        style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                        data-testid="download-all-button"
                      >
                        <Download className="w-5 h-5" />
                        Download All
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                      data-testid="reset-button"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-black/20 rounded border border-white/10">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">File:</span> {selectedFile.name}
                  </p>
                </div>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="p-8 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-lg text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-lg font-heading font-bold mb-2">Converting PDF Pages...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment for large files</p>
                </div>
              )}

              {/* Converted Pages Grid */}
              {pages.length > 0 && !isProcessing && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
                    <p className="text-lg font-heading font-bold text-primary">
                      ✅ Conversion Complete! {pages.length} page{pages.length !== 1 ? 's' : ''} converted
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page) => (
                      <div
                        key={page.pageNum}
                        className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg hover:border-primary/50 transition-all"
                        data-testid={`page-${page.pageNum}`}
                      >
                        <p className="text-sm font-heading font-bold text-muted-foreground uppercase tracking-wide mb-3">
                          Page {page.pageNum}
                        </p>
                        <div className="bg-black/60 rounded border border-white/10 mb-3 overflow-hidden">
                          <img 
                            src={page.imgData} 
                            alt={`Page ${page.pageNum}`}
                            className="w-full h-auto"
                          />
                        </div>
                        <button
                          onClick={() => handleDownloadSingle(page)}
                          className="w-full px-4 py-2 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
                          data-testid={`download-page-${page.pageNum}`}
                        >
                          <Download className="w-4 h-4" />
                          Download Page {page.pageNum}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-3">How It Works</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Upload any PDF file to convert</li>
                  <li>• Choose between PNG (best quality) or JPG (smaller file size)</li>
                  <li>• Each PDF page is converted to a separate image</li>
                  <li>• Download individual pages or all at once</li>
                  <li>• All processing happens in your browser - secure and private</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PDFToImage;
