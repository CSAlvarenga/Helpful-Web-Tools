import { useState } from "react";
import Layout from "../../components/Layout";
import { Type } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { caseConverterContent } from "../../data/toolContent";

const CaseConverter = () => {
  const [text, setText] = useState('');

  const conversions = {
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    titleCase: text.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' '),
    sentenceCase: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    camelCase: text.split(/\s+/).map((word, index) => 
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(''),
    snakeCase: text.toLowerCase().split(/\s+/).join('_'),
    kebabCase: text.toLowerCase().split(/\s+/).join('-'),
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
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
              Case Converter
            </h1>
            <p className="text-muted-foreground text-lg">
              Convert text between different cases instantly
            </p>
          </div>

          <div className="space-y-6">
            {/* Input */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <label className="block text-sm font-medium mb-2">Enter Your Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={6}
                className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                data-testid="text-input"
              />
            </div>

            {/* Conversions */}
            {text && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(conversions).map(([name, converted]) => (
                  <div
                    key={name}
                    className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => copyToClipboard(converted)}
                    data-testid={`conversion-${name}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-heading font-bold uppercase tracking-wide text-primary">
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <Type className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-mono text-sm break-words">
                      {converted}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Click to copy</p>
                  </div>
                ))}
              </div>
            )}

            {!text && (
              <div className="text-center py-12">
                <Type className="w-16 h-16 mx-auto mb-4 text-primary/30" strokeWidth={1} />
                <p className="text-muted-foreground">
                  Enter text above to see conversions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={caseConverterContent} />
        </div>
      </div>
    </Layout>
  );
};

export default CaseConverter;
