import { useState } from "react";
import Layout from "../../components/Layout";
import { AlignLeft, Copy } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { loremIpsumContent } from "../../data/toolContent";

const LoremIpsum = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [generatedText, setGeneratedText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
    'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
    'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 5;
    let sentence = [];
    for (let i = 0; i < length; i++) {
      sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(' ') + '.';
  };

  const generateParagraph = () => {
    const sentences = Math.floor(Math.random() * 3) + 4;
    let paragraph = [];
    for (let i = 0; i < sentences; i++) {
      paragraph.push(generateSentence());
    }
    return paragraph.join(' ');
  };

  const generateText = () => {
    let text = [];
    for (let i = 0; i < paragraphs; i++) {
      text.push(generateParagraph());
    }
    setGeneratedText(text.join('\n\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
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
              Lorem Ipsum Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate placeholder text for your designs
            </p>
          </div>

          <div className="space-y-6">
            {/* Controls */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Number of Paragraphs: {paragraphs}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="paragraph-slider"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateText}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90"
                  style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
                  data-testid="generate-button"
                >
                  Generate Text
                </button>
                {generatedText && (
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center gap-2"
                    style={{ boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
                    data-testid="copy-button"
                  >
                    <Copy className="w-5 h-5" />
                    Copy
                  </button>
                )}
              </div>
            </div>

            {/* Generated Text */}
            {generatedText ? (
              <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                <label className="block text-sm font-medium mb-4">Generated Text</label>
                <div 
                  className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                  data-testid="generated-text"
                >
                  {generatedText}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlignLeft className="w-16 h-16 mx-auto mb-4 text-primary/30" strokeWidth={1} />
                <p className="text-muted-foreground">
                  Click generate to create Lorem Ipsum text
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={loremIpsumContent} />
        </div>
      </div>
    </Layout>
  );
};

export default LoremIpsum;
