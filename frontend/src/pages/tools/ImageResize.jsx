import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { imageResizeContent } from "../../data/toolContent";

const ImageResize = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resizedUrl, setResizedUrl] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResizedUrl(null);

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  const handleResize = () => {
    if (!selectedFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setResizedUrl(url);
      }, selectedFile.type);
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `resized-${selectedFile.name}`;
    link.click();
  };

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
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
              Image Resize
            </h1>
            <p className="text-muted-foreground text-lg">
              Resize images to custom dimensions instantly in your browser
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

          {/* Image Preview & Controls */}
          {previewUrl && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-xl font-heading font-bold mb-4">Resize Settings</h3>
                
                {originalDimensions && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Original: {originalDimensions.width} × {originalDimensions.height} px
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                      data-testid="width-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                      data-testid="height-input"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <input
                    type="checkbox"
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
                    data-testid="aspect-ratio-checkbox"
                  />
                  <label htmlFor="aspect-ratio" className="text-sm text-muted-foreground">
                    Maintain aspect ratio
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleResize}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90"
                    style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                    data-testid="resize-button"
                  >
                    <ImageIcon className="inline-block w-5 h-5 mr-2" />
                    Resize Image
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setResizedUrl(null);
                    }}
                    className="px-6 py-3 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                    data-testid="reset-button"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h4 className="text-lg font-heading font-bold mb-4">Original</h4>
                  <img src={previewUrl} alt="Original" className="w-full rounded border border-white/10" />
                </div>
                
                {resizedUrl && (
                  <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                    <h4 className="text-lg font-heading font-bold mb-4">Resized</h4>
                    <img src={resizedUrl} alt="Resized" className="w-full rounded border border-white/10" />
                    <button
                      onClick={handleDownload}
                      className="w-full mt-4 px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90"
                      style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                      data-testid="download-button"
                    >
                      <Download className="inline-block w-5 h-5 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <ToolContent toolData={imageResizeContent} />
      </div>
    </Layout>
  );
};

export default ImageResize;
