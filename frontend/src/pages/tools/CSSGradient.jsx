import { useState, useRef, useCallback, useEffect } from "react";
import Layout from "../../components/Layout";
import { Copy, Shuffle, Trash2, Plus } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { cssGradientContent } from "../../data/toolContent";

const CSSGradient = () => {
  const [stops, setStops] = useState([
    { id: 's1', r: 0, g: 240, b: 255, a: 1, pos: 0 },    // Cyan (primary)
    { id: 's2', r: 255, g: 95, b: 0, a: 1, pos: 100 }    // Orange (secondary)
  ]);
  const [activeId, setActiveId] = useState('s1');
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState('linear');
  const [copied, setCopied] = useState(false);
  
  const stripRef = useRef(null);
  const isDragging = useRef(false);

  const presets = [
    [{ r: 0, g: 240, b: 255 }, { r: 255, g: 95, b: 0 }],           // Cyan to Orange
    [{ r: 65, g: 88, b: 208 }, { r: 200, g: 80, b: 192 }, { r: 255, g: 204, b: 112 }],
    [{ r: 0, g: 147, b: 233 }, { r: 128, g: 208, b: 199 }],
    [{ r: 142, g: 197, b: 252 }, { r: 224, g: 195, b: 252 }],
    [{ r: 250, g: 112, b: 154 }, { r: 254, g: 225, b: 64 }],
    [{ r: 67, g: 206, b: 162 }, { r: 24, g: 90, b: 157 }],
  ];

  // Get active stop
  const activeStop = stops.find(s => s.id === activeId) || stops[0];

  // Generate CSS string
  const generateCSS = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.pos - b.pos);
    const stopStrings = sortedStops.map(s => 
      `rgba(${s.r}, ${s.g}, ${s.b}, ${s.a}) ${Math.round(s.pos)}%`
    );
    
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopStrings.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${stopStrings.join(', ')})`;
    }
  }, [stops, angle, gradientType]);

  // Generate strip CSS (always linear for display)
  const generateStripCSS = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.pos - b.pos);
    const stopStrings = sortedStops.map(s => 
      `rgba(${s.r}, ${s.g}, ${s.b}, ${s.a}) ${Math.round(s.pos)}%`
    );
    return `linear-gradient(90deg, ${stopStrings.join(', ')})`;
  }, [stops]);

  const cssOutput = `background: ${generateCSS()};`;

  // Update active stop
  const updateActiveStop = useCallback((updates) => {
    setStops(prev => prev.map(s => 
      s.id === activeId ? { ...s, ...updates } : s
    ));
  }, [activeId]);

  // Add new stop
  const addStop = (pos) => {
    const newId = 's' + Date.now();
    const newStop = {
      id: newId,
      r: activeStop.r,
      g: activeStop.g,
      b: activeStop.b,
      a: activeStop.a,
      pos: pos
    };
    setStops(prev => [...prev, newStop]);
    setActiveId(newId);
  };

  // Delete stop
  const deleteStop = () => {
    if (stops.length <= 2) {
      alert("Minimum 2 colors required!");
      return;
    }
    const newStops = stops.filter(s => s.id !== activeId);
    setStops(newStops);
    setActiveId(newStops[0].id);
  };

  // Randomize colors
  const randomize = () => {
    setStops(prev => prev.map(s => ({
      ...s,
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    })));
    setAngle(Math.floor(Math.random() * 360));
  };

  // Load preset
  const loadPreset = (colors) => {
    const newStops = colors.map((c, i) => ({
      id: 'p' + i,
      r: c.r,
      g: c.g,
      b: c.b,
      a: 1,
      pos: (i / (colors.length - 1)) * 100
    }));
    setStops(newStops);
    setActiveId(newStops[0].id);
  };

  // Copy CSS
  const copyCSS = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // RGB to Hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Handle strip click to add stop
  const handleStripClick = (e) => {
    if (e.target !== stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    addStop(pos);
  };

  // Handle drag
  const handleDrag = useCallback((e) => {
    if (!isDragging.current || !stripRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = stripRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    updateActiveStop({ pos });
  }, [updateActiveStop]);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('touchend', stopDrag);
    
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [handleDrag, stopDrag]);

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              CSS Gradient Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create beautiful gradients and copy the CSS code
            </p>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Quick Presets</label>
            <div className="flex gap-3 flex-wrap">
              {presets.map((colors, i) => (
                <button
                  key={i}
                  onClick={() => loadPreset(colors)}
                  className="w-12 h-12 rounded-full border-2 border-white/20 hover:border-white/60 transition-all hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${colors.map((c, j) => 
                      `rgb(${c.r}, ${c.g}, ${c.b}) ${(j / (colors.length - 1)) * 100}%`
                    ).join(', ')})`
                  }}
                  data-testid={`preset-${i}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                {/* Gradient Preview */}
                <div 
                  className="h-64 md:h-80 rounded-lg relative overflow-hidden"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #333 25%, transparent 25%),
                      linear-gradient(-45deg, #333 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #333 75%),
                      linear-gradient(-45deg, transparent 75%, #333 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundColor: '#222'
                  }}
                  data-testid="gradient-preview"
                >
                  <div 
                    className="absolute inset-0"
                    style={{ background: generateCSS() }}
                  />
                </div>

                {/* Gradient Strip with Handles */}
                <div className="mt-6 relative h-12">
                  <div
                    ref={stripRef}
                    onClick={handleStripClick}
                    className="h-full w-full rounded cursor-copy border-2 border-dashed border-white/20 relative"
                    style={{ background: generateStripCSS() }}
                    data-testid="gradient-strip"
                  >
                    {/* Handles */}
                    {stops.map(stop => (
                      <div
                        key={stop.id}
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-8 rounded cursor-grab transition-transform ${
                          stop.id === activeId ? 'scale-110 z-20' : 'z-10'
                        }`}
                        style={{
                          left: `${stop.pos}%`,
                          transform: `translateX(-50%) translateY(-50%) ${stop.id === activeId ? 'scale(1.1)' : ''}`,
                          backgroundColor: `rgb(${stop.r}, ${stop.g}, ${stop.b})`,
                          border: stop.id === activeId ? '3px solid #00F0FF' : '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          isDragging.current = true;
                          setActiveId(stop.id);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          isDragging.current = true;
                          setActiveId(stop.id);
                        }}
                        data-testid={`handle-${stop.id}`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Click strip to add color • Drag handles to adjust position
                  </p>
                </div>

                {/* CSS Output */}
                <div className="mt-6 p-4 bg-black rounded-lg font-mono text-sm text-primary break-all">
                  {cssOutput}
                </div>
                <button
                  onClick={copyCSS}
                  className={`mt-3 w-full px-4 py-3 font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  data-testid="copy-button"
                >
                  <Copy className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Copy CSS to Clipboard'}
                </button>
              </div>
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-4">
              {/* Global Settings */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-4">Settings</h3>
                
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setGradientType(gradientType === 'linear' ? 'radial' : 'linear')}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm font-medium transition-colors"
                    data-testid="type-toggle"
                  >
                    {gradientType === 'linear' ? 'Linear' : 'Radial'}
                  </button>
                  <button
                    onClick={randomize}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
                    data-testid="random-button"
                  >
                    <Shuffle className="w-4 h-4" />
                    Random
                  </button>
                </div>

                {gradientType === 'linear' && (
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-2">
                      <span>Angle</span>
                      <span className="text-muted-foreground">{angle}°</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                      data-testid="angle-slider"
                    />
                  </div>
                )}
              </div>

              {/* Selected Stop Controls */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <h3 className="text-lg font-heading font-bold mb-4">Selected Color</h3>
                
                {/* Color Picker */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-3">
                    <div 
                      className="w-12 h-12 rounded border border-white/20 relative overflow-hidden"
                      style={{ backgroundColor: `rgba(${activeStop.r}, ${activeStop.g}, ${activeStop.b}, ${activeStop.a})` }}
                    >
                      <input
                        type="color"
                        value={rgbToHex(activeStop.r, activeStop.g, activeStop.b)}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target.value);
                          if (rgb) updateActiveStop(rgb);
                        }}
                        className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
                        data-testid="color-picker"
                      />
                    </div>
                    <input
                      type="text"
                      value={rgbToHex(activeStop.r, activeStop.g, activeStop.b).toUpperCase()}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target.value);
                        if (rgb) updateActiveStop(rgb);
                      }}
                      className="flex-1 bg-black/50 border border-white/10 rounded-sm px-3 py-2 font-mono uppercase"
                      maxLength={7}
                      data-testid="hex-input"
                    />
                  </div>
                </div>

                {/* Opacity */}
                <div className="mb-4">
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span>Opacity</span>
                    <span className="text-muted-foreground">{Math.round(activeStop.a * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeStop.a * 100}
                    onChange={(e) => updateActiveStop({ a: parseInt(e.target.value) / 100 })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    data-testid="opacity-slider"
                  />
                </div>

                {/* Position */}
                <div className="mb-4">
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span>Position</span>
                    <span className="text-muted-foreground">{Math.round(activeStop.pos)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeStop.pos}
                    onChange={(e) => updateActiveStop({ pos: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    data-testid="position-slider"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={deleteStop}
                  disabled={stops.length <= 2}
                  className="w-full px-4 py-3 bg-red-500/80 hover:bg-red-500 disabled:bg-red-500/30 disabled:cursor-not-allowed text-white font-bold rounded-sm transition-colors flex items-center justify-center gap-2"
                  data-testid="delete-button"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Stop
                </button>
              </div>

              {/* Color Stops List */}
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-heading font-bold">Color Stops</h3>
                  <button
                    onClick={() => addStop(50)}
                    className="p-2 bg-primary/20 hover:bg-primary/30 rounded transition-colors"
                    data-testid="add-stop-button"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>
                <div className="space-y-2">
                  {[...stops].sort((a, b) => a.pos - b.pos).map(stop => (
                    <div
                      key={stop.id}
                      onClick={() => setActiveId(stop.id)}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        stop.id === activeId ? 'bg-white/10 border border-primary/50' : 'hover:bg-white/5'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded border border-white/20"
                        style={{ backgroundColor: `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a})` }}
                      />
                      <div className="flex-1">
                        <p className="font-mono text-sm">{rgbToHex(stop.r, stop.g, stop.b).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(stop.pos)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-6xl mx-auto">
          <ToolContent toolData={cssGradientContent} />
        </div>
      </div>
    </Layout>
  );
};

export default CSSGradient;
