import { useState } from "react";
import Layout from "../../components/Layout";
import { Youtube, Download, Link as LinkIcon } from "lucide-react";

const YoutubeThumbnail = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGetThumbnail = () => {
    setError("");
    setVideoId(null);

    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const id = extractVideoId(videoUrl);
    
    if (!id) {
      setError("Invalid YouTube URL. Please check and try again.");
      return;
    }

    setVideoId(id);
  };

  const handleDownload = async (quality) => {
    if (!videoId) return;

    const qualityMap = {
      'maxres': `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      'hq': `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      'mq': `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      'sd': `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    };

    const url = qualityMap[quality];
    
    // Open in new tab (cross-origin download restriction workaround)
    window.open(url, '_blank');
  };

  const handleReset = () => {
    setVideoUrl("");
    setVideoId(null);
    setError("");
  };

  const thumbnailUrls = videoId ? {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
  } : null;

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
              YouTube Thumbnail Downloader
            </h1>
            <p className="text-muted-foreground text-lg">
              Download high-quality thumbnails from any YouTube video
            </p>
          </div>

          <div className="space-y-6">
            {/* Input Section */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Enter YouTube URL</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGetThumbnail()}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm pl-12 pr-4 py-3"
                    data-testid="url-input"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleGetThumbnail}
                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center justify-center gap-2"
                    style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
                    data-testid="fetch-button"
                  >
                    <Youtube className="w-5 h-5" />
                    Get Thumbnails
                  </button>
                  
                  {videoId && (
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 border border-white/20 text-foreground font-bold uppercase tracking-wider rounded-sm hover:bg-white/5 transition-all duration-300"
                      data-testid="reset-button"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Example URLs */}
              <div className="mt-4 p-3 bg-black/20 rounded border border-white/10">
                <p className="text-xs text-muted-foreground mb-2">Example formats:</p>
                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <p>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
                  <p>• https://youtu.be/dQw4w9WgXcQ</p>
                </div>
              </div>
            </div>

            {/* Results */}
            {videoId && thumbnailUrls && (
              <div className="space-y-6">
                {/* Preview */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">Thumbnail Preview</h3>
                  <div className="bg-black/60 rounded border border-white/10 overflow-hidden">
                    <img 
                      src={thumbnailUrls.maxres}
                      alt="YouTube Thumbnail"
                      className="w-full h-auto"
                      onError={(e) => {
                        // Fallback to HQ if maxres doesn't exist
                        e.target.src = thumbnailUrls.hq;
                      }}
                      data-testid="thumbnail-preview"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Video ID: {videoId}
                  </p>
                </div>

                {/* Download Options */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">Download Quality Options</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleDownload('maxres')}
                      className="p-4 bg-black/20 border border-white/10 hover:border-secondary/50 rounded-sm transition-all text-left group"
                      data-testid="download-maxres"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-lg text-secondary">Max Resolution</span>
                        <Download className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">1280 × 720 px</p>
                      <p className="text-xs text-muted-foreground">Best quality (may not exist for all videos)</p>
                    </button>

                    <button
                      onClick={() => handleDownload('hq')}
                      className="p-4 bg-black/20 border border-white/10 hover:border-primary/50 rounded-sm transition-all text-left group"
                      data-testid="download-hq"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-lg text-primary">High Quality</span>
                        <Download className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">480 × 360 px</p>
                      <p className="text-xs text-muted-foreground">Standard HD quality</p>
                    </button>

                    <button
                      onClick={() => handleDownload('mq')}
                      className="p-4 bg-black/20 border border-white/10 hover:border-primary/50 rounded-sm transition-all text-left group"
                      data-testid="download-mq"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-lg">Medium Quality</span>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">320 × 180 px</p>
                      <p className="text-xs text-muted-foreground">Medium resolution</p>
                    </button>

                    <button
                      onClick={() => handleDownload('sd')}
                      className="p-4 bg-black/20 border border-white/10 hover:border-primary/50 rounded-sm transition-all text-left group"
                      data-testid="download-sd"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-lg">Standard</span>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">640 × 480 px</p>
                      <p className="text-xs text-muted-foreground">Standard quality</p>
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Click any option to open and download the thumbnail in a new tab
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">Why Use This Tool?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Perfect for content creators analyzing competitor thumbnails</li>
                <li>• Download thumbnails for presentations or archives</li>
                <li>• Get inspiration for your own video designs</li>
                <li>• Extract high-resolution images without screenshots</li>
                <li>• Works with any public YouTube video URL</li>
                <li>• Multiple quality options available instantly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YoutubeThumbnail;
