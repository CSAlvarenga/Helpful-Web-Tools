import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, Wand2, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [processingStats, setProcessingStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 25000000) {
        setError("File size must be less than 25MB");
        return;
      }
      
      setSelectedFile(file);
      setError("");
      setProcessedUrl(null);
      setProcessingStats(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError("");
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await axios.post(`${API}/remove-background`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.processed_image) {
        const imageUrl = `data:image/png;base64,${response.data.processed_image}`;
        setProcessedUrl(imageUrl);
        setProcessingStats({
          originalSize: (response.data.original_size / 1024).toFixed(2),
          processedSize: (response.data.processed_size / 1024).toFixed(2),
        });
      }
    } catch (err) {
      console.error("Error removing background:", err);
      if (err.response?.status === 429) {
        setError("Rate limit exceeded. Please try again in a few moments.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to remove background. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `no-bg-${selectedFile.name.replace(/\.[^/.]+$/, '')}.png`;
    link.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError("");
    setProcessingStats(null);
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
              Background Remover
            </h1>
            <p className="text-muted-foreground text-lg">
              Remove image backgrounds instantly using AI-powered technology
            </p>
          </div>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-black/20 backdrop-blur-xl hover:border-secondary/50 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area"
            >
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-secondary" strokeWidth={1.5} />
              <h3 className="text-xl font-heading font-bold mb-2">Upload Image</h3>
              <p className="text-muted-foreground mb-4">
                Click to browse or drag and drop your image here
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: JPG, PNG, WEBP (Max 25MB)
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Processing Interface */}
          {previewUrl && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Processing Controls</h3>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                    data-testid="remove-bg-button"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Remove Background
                      </>
                    )}
                  </button>
                  
                  {processedUrl && (
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center gap-2"
                      style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                      data-testid="download-button"
                    >
                      <Download className="w-5 h-5" />
                      Download PNG
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

                {processingStats && (
                  <div className="mt-4 p-3 bg-black/20 rounded border border-white/10">
                    <p className="text-sm text-muted-foreground">
                      Original: {processingStats.originalSize} KB | Processed: {processingStats.processedSize} KB
                    </p>
                  </div>
                )}
              </div>

              {/* Image Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">Original Image</h3>
                  <div className="bg-black/60 rounded border border-white/10 p-4">
                    <img 
                      src={previewUrl} 
                      alt="Original" 
                      className="w-full rounded"
                      data-testid="original-preview"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {selectedFile.name}
                    </p>
                  )}
                </div>

                {/* Processed Image */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">
                    {processedUrl ? "Background Removed" : "Preview"}
                  </h3>
                  <div 
                    className="bg-black/60 rounded border border-white/10 p-4 min-h-[300px] flex items-center justify-center"
                    style={processedUrl ? {
                      backgroundImage: `
                        linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
                        linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
                        linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    } : {}}
                  >
                    {processedUrl ? (
                      <img 
                        src={processedUrl} 
                        alt="Processed" 
                        className="w-full rounded"
                        data-testid="processed-preview"
                      />
                    ) : (
                      <div className="text-center">
                        <Wand2 className="w-16 h-16 mx-auto mb-4 text-secondary/30" strokeWidth={1} />
                        <p className="text-muted-foreground">
                          {isProcessing ? "Processing your image..." : "Click 'Remove Background' to start"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-3">How It Works</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• AI-powered background removal using advanced algorithms</li>
                  <li>• Supports JPG, PNG, and WEBP formats</li>
                  <li>• Maximum file size: 25MB</li>
                  <li>• Processed images are returned as PNG with transparent background</li>
                  <li>• No data is stored on our servers - all processing is instant</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BackgroundRemover;
