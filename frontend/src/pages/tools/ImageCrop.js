import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, ZoomIn, ZoomOut, RotateCw, Eye } from "lucide-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCrop = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCroppedUrl(null);
    }
  };

  const handleZoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(0.1);
    }
  };

  const handleZoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(-0.1);
    }
  };

  const handleRotate = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(90);
    }
  };

  const handlePreview = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        setCroppedUrl(url);
      }
    }
  };

  const handleDownload = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `cropped-${selectedFile.name}`;
          link.click();
          URL.revokeObjectURL(url);
        });
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedUrl(null);
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
              Image Crop
            </h1>
            <p className="text-muted-foreground text-lg">
              Crop and zoom your images with precision
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

          {/* Cropper & Controls */}
          {previewUrl && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Crop Controls</h3>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleZoomIn}
                    className="px-4 py-2 bg-accent text-accent-foreground border border-primary/50 rounded-sm hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
                    data-testid="zoom-in-button"
                  >
                    <ZoomIn className="w-5 h-5" />
                    Zoom In
                  </button>
                  
                  <button
                    onClick={handleZoomOut}
                    className="px-4 py-2 bg-accent text-accent-foreground border border-primary/50 rounded-sm hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
                    data-testid="zoom-out-button"
                  >
                    <ZoomOut className="w-5 h-5" />
                    Zoom Out
                  </button>
                  
                  <button
                    onClick={handleRotate}
                    className="px-4 py-2 bg-accent text-accent-foreground border border-primary/50 rounded-sm hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
                    data-testid="rotate-button"
                  >
                    <RotateCw className="w-5 h-5" />
                    Rotate
                  </button>
                  
                  <button
                    onClick={handlePreview}
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center gap-2"
                    style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                    data-testid="preview-button"
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center gap-2"
                    style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                    data-testid="download-button"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                    data-testid="reset-button"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Cropper */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Crop Area</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag the corners to adjust the crop area. Use the controls above to zoom and rotate.
                </p>
                <div className="bg-black/60 rounded border border-white/10 overflow-hidden">
                  <Cropper
                    ref={cropperRef}
                    src={previewUrl}
                    style={{ height: 500, width: "100%" }}
                    viewMode={1}
                    dragMode="move"
                    autoCropArea={0.8}
                    background={false}
                    responsive={true}
                    checkOrientation={false}
                    guides={true}
                    data-testid="cropper"
                  />
                </div>
              </div>

              {/* Preview */}
              {croppedUrl && (
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">Preview Result</h3>
                  <div className="bg-black/60 rounded border border-white/10 p-4 flex items-center justify-center">
                    <img 
                      src={croppedUrl} 
                      alt="Cropped preview" 
                      className="max-w-full rounded border border-white/10"
                      data-testid="cropped-preview"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ImageCrop;
