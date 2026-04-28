import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const ToolContent = ({ toolData }) => {
  const [activeTab, setActiveTab] = useState("how-to");

  const tabs = [
    { id: "how-to", label: "How to Use" },
    { id: "features", label: "Features & Benefits" },
    { id: "faq", label: "FAQ" },
    { id: "tips", label: "Tips & Tricks" },
  ];

  return (
    <div className="mt-12 space-y-6">
      {/* Tab Navigation */}
      <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-sm font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-black/20 text-muted-foreground hover:bg-black/40'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="prose prose-invert max-w-none">
          {activeTab === "how-to" && (
            <div data-testid="content-how-to">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {toolData.howTo.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                {toolData.howTo.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {toolData.howTo.steps && (
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    {toolData.howTo.steps.map((step, index) => (
                      <li key={index} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div data-testid="content-features">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {toolData.features.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                {toolData.features.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {toolData.features.list && (
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {toolData.features.list.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div data-testid="content-faq">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {toolData.faq.map((item, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="text-lg font-bold text-primary mb-2">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div data-testid="content-tips">
              <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {toolData.tips.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                {toolData.tips.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {toolData.tips.list && (
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {toolData.tips.list.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Tools */}
      {toolData.relatedTools && toolData.relatedTools.length > 0 && (
        <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
          <h3 className="text-xl font-heading font-bold mb-4">Related Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {toolData.relatedTools.map((tool, index) => (
              <Link
                key={index}
                to={tool.path}
                className="p-3 bg-black/20 border border-white/10 hover:border-primary/50 rounded-sm transition-all text-center group"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolContent;
