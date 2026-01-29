import { useState } from "react";
import Layout from "../../components/Layout";
import { Lock, Copy } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { passwordGeneratorContent } from "../../data/toolContent";

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const getStrength = () => {
    if (length < 8) return { text: 'Weak', color: 'text-red-400' };
    if (length < 12) return { text: 'Medium', color: 'text-yellow-400' };
    if (length < 16) return { text: 'Strong', color: 'text-green-400' };
    return { text: 'Very Strong', color: 'text-primary' };
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
              Password Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate secure, random passwords
            </p>
          </div>

          <div className="space-y-6">
            {/* Password Display */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Your Password</label>
                {password && (
                  <span className={`text-sm font-bold ${getStrength().color}`}>
                    {getStrength().text}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-black/50 border border-white/10 rounded-sm px-4 py-3 font-mono text-lg text-foreground break-all" data-testid="password-display">
                  {password || 'Click generate to create password'}
                </div>
                {password && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all"
                    data-testid="copy-button"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password Length: {length}
                </label>
                <input
                  type="range"
                  min="6"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full"
                  data-testid="length-slider"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
                    data-testid="uppercase-checkbox"
                  />
                  <span className="text-sm text-muted-foreground">Include Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
                    data-testid="lowercase-checkbox"
                  />
                  <span className="text-sm text-muted-foreground">Include Lowercase (a-z)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
                    data-testid="numbers-checkbox"
                  />
                  <span className="text-sm text-muted-foreground">Include Numbers (0-9)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary"
                    data-testid="symbols-checkbox"
                  />
                  <span className="text-sm text-muted-foreground">Include Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePassword}
              className="w-full px-6 py-4 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center justify-center gap-3"
              style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
              data-testid="generate-button"
            >
              <Lock className="w-6 h-6" />
              Generate Password
            </button>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-3xl mx-auto">
          <ToolContent toolData={passwordGeneratorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default PasswordGenerator;
