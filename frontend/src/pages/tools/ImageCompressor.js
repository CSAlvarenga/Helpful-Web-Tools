import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download } from "lucide-react";
import imageCompression from 'browser-image-compression';
import ToolContent from "../../components/ToolContent";
import { imageCompressorContent } from "../../data/toolContent";

const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      setCompressedUrl(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: quality / 100
      };

      const compressedFile = await imageCompression(selectedFile, options);
      const url = URL.createObjectURL(compressedFile);
      setCompressedUrl(url);
      setCompressedSize(compressedFile.size);
    } catch (error) {
      console.error('Compression failed:', error);
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed-${selectedFile.name}`;
    link.click();
  };

  const savingsPercent = originalSize && compressedSize 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

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
              Image Compressor
            </h1>
            <p className="text-muted-foreground text-lg">
              Reduce image file size without losing quality
            </p>
          </div>

          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Upload Image</h3>
              <p className="text-muted-foreground">Click to browse or drag and drop</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                data-testid="file-input"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Compression Settings</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="quality-slider"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher quality = larger file size
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-black/20 rounded border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">Original Size</p>
                    <p className="text-2xl font-heading font-bold text-primary" data-testid="original-size">
                      {formatFileSize(originalSize)}
                    </p>
                  </div>
                  {compressedSize > 0 && (
                    <div className="p-4 bg-black/20 rounded border border-white/10">
                      <p className="text-sm text-muted-foreground mb-1">Compressed Size</p>
                      <p className="text-2xl font-heading font-bold text-secondary" data-testid="compressed-size">
                        {formatFileSize(compressedSize)}
                      </p>
                      <p className="text-sm text-green-400 mt-1">
                        {savingsPercent}% smaller
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
                    style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                    data-testid="compress-button"
                  >
                    {isProcessing ? 'Processing...' : 'Compress Image'}
                  </button>
                  {compressedUrl && (
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90"
                      style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                      data-testid="download-button"
                    >
                      <Download className="inline-block w-5 h-5 mr-2" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ImageCompressor;
