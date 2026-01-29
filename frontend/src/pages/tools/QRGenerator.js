import { useState, useRef } from "react";
import Layout from "../../components/Layout";
import { QrCode as QrCodeIcon } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import ToolContent from "../../components/ToolContent";
import { qrGeneratorContent } from "../../data/toolContent";

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const qrRef = useRef(null);

  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      link.click();
    }
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
              QR Code Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create QR codes for URLs, text, WiFi, and more
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter URL, text, or data..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                  data-testid="text-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="64"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="size-slider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Foreground</label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full h-10 rounded-sm cursor-pointer"
                    data-testid="fg-color-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded-sm cursor-pointer"
                    data-testid="bg-color-input"
                  />
                </div>
              </div>

              {text && (
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90"
                  style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                  data-testid="download-button"
                >
                  Download QR Code
                </button>
              )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg flex items-center justify-center">
              {text ? (
                <div className="text-center" data-testid="qr-preview">
                  <QRCodeCanvas
                    id="qr-canvas"
                    value={text}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    Your QR Code
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCodeIcon className="w-24 h-24 mx-auto mb-4 text-primary/30" strokeWidth={1} />
                  <p className="text-muted-foreground">
                    Enter content to generate QR code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QRGenerator;
