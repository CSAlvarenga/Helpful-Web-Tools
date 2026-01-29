import { useState, useRef, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import { Download, Trash2, Pen } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { eSignatureContent } from "../../data/toolContent";

const ESignature = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [strokeColor, setStrokeColor] = useState('#FFFFFF');
  const [hasSignature, setHasSignature] = useState(false);

  const colors = [
    { color: '#FFFFFF', name: 'White' },
    { color: '#00F0FF', name: 'Cyan' },
    { color: '#FF5F00', name: 'Orange' },
    { color: '#3B82F6', name: 'Blue' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Update stroke color when changed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
  }, [strokeColor]);

  const getCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoords(e);
    setLastPos(coords);
  }, [getCoords]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPos(coords);
    setHasSignature(true);
  }, [isDrawing, lastPos, getCoords]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
  };

  const downloadSignature = () => {
    if (!hasSignature) {
      alert('Please draw your signature before downloading.');
      return;
    }

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              E-Signature Pad
            </h1>
            <p className="text-muted-foreground text-lg">
              Create your digital signature and download as transparent PNG
            </p>
          </div>

          <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3">Signature Color</label>
              <div className="flex gap-3 items-center">
                {colors.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setStrokeColor(c.color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      strokeColor === c.color 
                        ? 'border-white scale-110 ring-2 ring-white/30' 
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                    data-testid={`color-${c.name.toLowerCase()}`}
                  />
                ))}
              </div>
            </div>

            {/* Signature Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-64 md:h-80 rounded-lg cursor-crosshair touch-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
                  backgroundImage: `
                    linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%),
                    radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '100% 100%, 20px 20px',
                  border: '2px dashed rgba(255,255,255,0.2)'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                data-testid="signature-canvas"
              />
              
              {!hasSignature && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <Pen className="w-12 h-12 text-white/20 mb-2" />
                  <p className="text-white/30 text-sm">Draw your signature here</p>
                </div>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-3">
              Use your mouse or finger to sign above
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={clearCanvas}
                className="flex-1 px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
                data-testid="clear-button"
              >
                <Trash2 className="w-5 h-5" />
                Clear
              </button>
              <button
                onClick={downloadSignature}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
                style={{ boxShadow: hasSignature ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none' }}
                data-testid="download-button"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-6 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
            <h3 className="text-lg font-heading font-bold mb-3">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Transparent PNG output - perfect for documents</li>
              <li>• Multiple signature colors available</li>
              <li>• Works on desktop (mouse) and mobile (touch)</li>
              <li>• High-resolution output for professional use</li>
              <li>• No data stored - your signature stays private</li>
            </ul>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-3xl mx-auto">
          <ToolContent toolData={eSignatureContent} />
        </div>
      </div>
    </Layout>
  );
};

export default ESignature;
