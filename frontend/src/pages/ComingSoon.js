import { Link } from "react-router-dom";
import Layout from "./components/Layout";
import { Construction } from "lucide-react";

const ComingSoon = ({ toolName }) => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg"
            style={{ boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)' }}
          >
            <Construction 
              className="w-24 h-24 mx-auto mb-6 text-primary" 
              strokeWidth={1}
            />
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="coming-soon-title"
            >
              {toolName}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              This tool is under development and will be available soon!
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90"
              style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' }}
              data-testid="back-home-button"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComingSoon;
