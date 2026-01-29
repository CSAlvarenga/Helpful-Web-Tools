import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, RefreshCw } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { formatConverterContent } from "../../data/toolContent";

const FormatConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('image/jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);
  const originalImageRef = useRef(new Image());

  const formats = [
    { value: 'image/jpeg', label: 'JPG', extension: 'jpg' },
    { value: 'image/png', label: 'PNG', extension: 'png' },
    { value: 'image/webp', label: 'WEBP', extension: 'webp' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setConvertedUrl(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
        originalImageRef.current.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = () => {
    if (!originalImageRef.current.src) return;
    
    setIsConverting(true);
    
    // Wait for image to load before converting
    originalImageRef.current.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = originalImageRef.current.width;
      canvas.height = originalImageRef.current.height;

      // Add white background for JPEG (handles transparency)
      if (selectedFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(originalImageRef.current, 0, 0);

      const quality = selectedFormat === 'image/jpeg' ? 0.9 : 1.0;
      const dataUrl = canvas.toDataURL(selectedFormat, quality);
      
      setConvertedUrl(dataUrl);
      setIsConverting(false);
    };

    // Trigger load if already loaded
    if (originalImageRef.current.complete) {
      originalImageRef.current.onload();
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;
    
    const format = formats.find(f => f.value === selectedFormat);
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `converted.${format.extension}`;
    link.click();
  };

  const getFormatLabel = () => {
    return formats.find(f => f.value === selectedFormat)?.label || 'Format';
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
              Format Converter
            </h1>
            <p className="text-muted-foreground text-lg">
              Convert images between JPG, PNG, and WEBP formats instantly
            </p>
          </div>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Upload Image</h3>
              <p className="text-muted-foreground mb-4">
                Click to browse or drag and drop your image here
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: JPG, PNG, WEBP, GIF
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                data-testid="file-input"
              />
            </div>
          )}

          {/* Converter Interface */}
          {previewUrl && (
            <div className="space-y-6">
              {/* Format Selection & Convert */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Conversion Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Output Format</label>
                    <div className="grid grid-cols-3 gap-3">
                      {formats.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setSelectedFormat(format.value)}
                          className={`p-4 rounded-sm border-2 transition-all duration-300 font-heading font-bold ${
                            selectedFormat === format.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                          }`}
                          data-testid={`format-${format.label.toLowerCase()}`}
                        >
                          {format.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                      data-testid="convert-button"
                    >
                      <RefreshCw className={`w-5 h-5 ${isConverting ? 'animate-spin' : ''}`} />
                      {isConverting ? 'Converting...' : `Convert to ${getFormatLabel()}`}
                    </button>
                    
                    {convertedUrl && (
                      <button
                        onClick={handleDownload}
                        className="px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center gap-2"
                        style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                        data-testid="download-button"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setConvertedUrl(null);
                      }}
                      className="px-6 py-3 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                      data-testid="reset-button"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Original Image Preview */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Original Image</h3>
                <div className="bg-black/60 rounded border border-white/10 p-4 flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-w-full max-h-96 rounded border border-white/10"
                    data-testid="original-preview"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-3">
                    File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Converted Image Preview */}
              {convertedUrl && (
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">
                    Converted to {getFormatLabel()}
                  </h3>
                  <div className="bg-black/60 rounded border border-white/10 p-4 flex items-center justify-center">
                    <img 
                      src={convertedUrl} 
                      alt="Converted" 
                      className="max-w-full max-h-96 rounded border border-white/10"
                      data-testid="converted-preview"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Conversion complete! Click Download to save.
                    </p>
                    <span className="px-3 py-1 bg-primary/20 border border-primary/50 rounded text-primary text-sm font-bold uppercase">
                      {getFormatLabel()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={formatConverterContent} />
        </div>
      </div>
    </Layout>
  );
};

export default FormatConverter;
