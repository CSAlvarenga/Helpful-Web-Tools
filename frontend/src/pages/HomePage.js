import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { 
  Image, Scissors, FileDown, Crop, Wand2, 
  FileText, FilePlus, FileSignature, Receipt,
  Code, QrCode, Palette, Hash,
  Type, AlignLeft, Calculator, GitCompare,
  Lock, Gauge, Timer, Scale, Percent, DollarSign, Calendar, Cake
} from "lucide-react";

const HomePage = () => {
  const toolCategories = [
    {
      id: "image-tools",
      title: "Image & Visual Tools",
      description: "Edit, resize, and transform images instantly",
      bgImage: "https://images.unsplash.com/photo-1764258560730-d167e5deda65",
      tools: [
        { name: "Image Resize", icon: Image, path: "/tools/image-resize", color: "primary" },
        { name: "Image Crop", icon: Crop, path: "/tools/image-crop", color: "primary" },
        { name: "Image Compressor", icon: FileDown, path: "/tools/image-compressor", color: "primary" },
        { name: "Format Converter", icon: Scissors, path: "/tools/format-converter", color: "primary" },
        { name: "Background Remover", icon: Wand2, path: "/tools/background-remover", color: "secondary" },
      ]
    },
    {
      id: "pdf-tools",
      title: "PDF & Document Utilities",
      description: "Merge, split, and convert PDFs with ease",
      bgImage: "https://images.unsplash.com/photo-1766258959691-3aea033fda2c",
      tools: [
        { name: "Merge PDF", icon: FilePlus, path: "/tools/pdf-merge", color: "primary" },
        { name: "Split PDF", icon: FileText, path: "/tools/pdf-split", color: "primary" },
        { name: "PDF to Image", icon: Image, path: "/tools/pdf-to-image", color: "primary" },
        { name: "Invoice Generator", icon: Receipt, path: "/tools/invoice-generator", color: "secondary" },
        { name: "e-Signature", icon: FileSignature, path: "/tools/e-signature", color: "primary" },
      ]
    },
    {
      id: "dev-tools",
      title: "Developer & Designer Tools",
      description: "Essential utilities for developers",
      bgImage: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7",
      tools: [
        { name: "QR Code Generator", icon: QrCode, path: "/tools/qr-generator", color: "primary" },
        { name: "CSS Gradient", icon: Palette, path: "/tools/css-gradient", color: "primary" },
        { name: "JSON Formatter", icon: Code, path: "/tools/json-formatter", color: "primary" },
        { name: "Contrast Checker", icon: Hash, path: "/tools/contrast-checker", color: "primary" },
      ]
    },
    {
      id: "text-tools",
      title: "Text & String Tools",
      description: "Manipulate and analyze text effortlessly",
      bgImage: "https://images.unsplash.com/photo-1589178208772-6f239b7652e9",
      tools: [
        { name: "Case Converter", icon: Type, path: "/tools/case-converter", color: "primary" },
        { name: "Lorem Ipsum", icon: AlignLeft, path: "/tools/lorem-ipsum", color: "primary" },
        { name: "Word Counter", icon: Calculator, path: "/tools/word-counter", color: "primary" },
        { name: "Diff Checker", icon: GitCompare, path: "/tools/diff-checker", color: "primary" },
      ]
    },
    {
      id: "math-finance",
      title: "Math & Finance Calculators",
      description: "Calculate percentages, discounts, dates, and loans",
      bgImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      tools: [
        { name: "Percentage Calculator", icon: Percent, path: "/tools/percentage-calculator", color: "secondary" },
        { name: "Discount Calculator", icon: DollarSign, path: "/tools/discount-calculator", color: "secondary" },
        { name: "Date Calculator", icon: Calendar, path: "/tools/date-calculator", color: "primary" },
        { name: "Age Calculator", icon: Cake, path: "/tools/age-calculator", color: "primary" },
        { name: "Loan Calculator", icon: Calculator, path: "/tools/loan-calculator", color: "secondary" },
      ]
    },
    {
      id: "utilities",
      title: "Daily Utilities",
      description: "Everyday tools for productivity",
      bgImage: "https://images.unsplash.com/photo-1768330187404-59e46cf222c9",
      tools: [
        { name: "Password Generator", icon: Lock, path: "/tools/password-generator", color: "secondary" },
        { name: "Unit Converter", icon: Scale, path: "/tools/unit-converter", color: "primary" },
        { name: "Stopwatch & Timer", icon: Timer, path: "/tools/stopwatch-timer", color: "primary" },
        { name: "Speed Test", icon: Gauge, path: "/tools/speed-test", color: "primary" },
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6"
            style={{
              textShadow: '0 0 40px rgba(0, 240, 255, 0.3)'
            }}
            data-testid="hero-title"
          >
            Helpful Web Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 uppercase tracking-widest font-medium" data-testid="hero-slogan">
            Your Swiss Army Knife Online
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
            Powerful, free, and instant web-based tools for images, PDFs, code, text, and more. 
            All processing happens in your browser—no uploads, no signup required.
          </p>
          
          {/* Tech Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="text-3xl font-heading font-bold text-primary" data-testid="stat-tools">30+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Tools</div>
            </div>
            <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="text-3xl font-heading font-bold text-secondary" data-testid="stat-free">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Free</div>
            </div>
            <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="text-3xl font-heading font-bold text-primary" data-testid="stat-private">Private</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {toolCategories.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-20">
              {/* Category Header */}
              <div className="mb-8">
                <h2 
                  className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
                  style={{
                    textShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
                  }}
                  data-testid={`category-title-${category.id}`}
                >
                  {category.title}
                </h2>
                <p className="text-muted-foreground text-lg" data-testid={`category-desc-${category.id}`}>
                  {category.description}
                </p>
              </div>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.path}
                      className="group relative p-6 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-primary/50 rounded-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      style={{
                        boxShadow: '0 0 0 rgba(0, 240, 255, 0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 240, 255, 0)';
                      }}
                      data-testid={`tool-card-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {/* Gradient Overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: tool.color === 'primary' 
                            ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, transparent 100%)'
                            : 'linear-gradient(135deg, rgba(255, 95, 0, 0.05) 0%, transparent 100%)'
                        }}
                      />
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <div 
                          className={`p-3 rounded-sm ${
                            tool.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                          }`}
                        >
                          <Icon 
                            className={`w-6 h-6 ${
                              tool.color === 'primary' ? 'text-primary' : 'text-secondary'
                            }`} 
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Click to use this tool →
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg relative overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)'
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                How Technology Helps Your Daily Tasks
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                No installations. No signups. No data stored on our servers. 
                All tools process files directly in your browser using cutting-edge web technologies.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#image-tools"
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
                  }}
                  data-testid="cta-get-started"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
