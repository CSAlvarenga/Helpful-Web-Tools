import { useState } from "react";
import Layout from "../../components/Layout";
import { Calculator } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { wordCounterContent } from "../../data/toolContent";

const WordCounter = () => {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim().length > 0).length,
    readingTime: Math.ceil(text.trim().split(/\s+/).length / 200), // 200 words per minute
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
              Word & Character Counter
            </h1>
            <p className="text-muted-foreground text-lg">
              Count words, characters, sentences, and more
            </p>
          </div>

          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-primary" data-testid="char-count">
                  {stats.characters}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Characters
                </div>
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-primary" data-testid="char-no-space-count">
                  {stats.charactersNoSpaces}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  No Spaces
                </div>
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-secondary" data-testid="word-count">
                  {stats.words}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Words
                </div>
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-primary" data-testid="sentence-count">
                  {stats.sentences}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Sentences
                </div>
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-primary" data-testid="paragraph-count">
                  {stats.paragraphs}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Paragraphs
                </div>
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-center">
                <div className="text-3xl font-heading font-bold text-secondary" data-testid="reading-time">
                  {stats.readingTime}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Min Read
                </div>
              </div>
            </div>

            {/* Text Input */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <label className="block text-sm font-medium mb-2">Enter Your Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={12}
                className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-2"
                data-testid="text-input"
              />
            </div>

            {!text && (
              <div className="text-center py-8">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-primary/30" strokeWidth={1} />
                <p className="text-muted-foreground">
                  Start typing to see live statistics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={wordCounterContent} />
        </div>
      </div>
    </Layout>
  );
};

export default WordCounter;
