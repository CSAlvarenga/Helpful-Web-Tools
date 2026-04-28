import { useState } from "react";
import Layout from "../../components/Layout";
import { Calculator } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { percentageCalculatorContent } from "../../data/toolContent";

const PercentageCalculator = () => {
  const [calcType, setCalcType] = useState("whatIs"); // whatIs, isWhatPercent, percentChange
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    let calculatedResult;
    let explanation;

    switch (calcType) {
      case "whatIs":
        // What is X% of Y?
        calculatedResult = (num1 / 100) * num2;
        explanation = `${num1}% of ${num2} = ${calculatedResult.toFixed(2)}`;
        break;
      case "isWhatPercent":
        // X is what % of Y?
        calculatedResult = (num1 / num2) * 100;
        explanation = `${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`;
        break;
      case "percentChange":
        // % change from X to Y
        calculatedResult = ((num2 - num1) / num1) * 100;
        const direction = calculatedResult > 0 ? "increase" : "decrease";
        explanation = `${Math.abs(calculatedResult).toFixed(2)}% ${direction} from ${num1} to ${num2}`;
        break;
      default:
        calculatedResult = 0;
    }

    setResult({ value: calculatedResult, explanation });
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
              Percentage Calculator
            </h1>
            <p className="text-muted-foreground text-lg">
              Calculate percentages, ratios, and percentage changes
            </p>
          </div>

          <div className="space-y-6">
            {/* Calculator Type Selection */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Select Calculation Type</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setCalcType("whatIs")}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left ${
                    calcType === "whatIs"
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                  }`}
                  data-testid="type-what-is"
                >
                  <div className="font-bold">What is X% of Y?</div>
                  <div className="text-sm opacity-70">Example: What is 20% of 150?</div>
                </button>

                <button
                  onClick={() => setCalcType("isWhatPercent")}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left ${
                    calcType === "isWhatPercent"
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                  }`}
                  data-testid="type-is-what-percent"
                >
                  <div className="font-bold">X is what % of Y?</div>
                  <div className="text-sm opacity-70">Example: 50 is what % of 200?</div>
                </button>

                <button
                  onClick={() => setCalcType("percentChange")}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left ${
                    calcType === "percentChange"
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-black/20 text-muted-foreground hover:border-primary/50'
                  }`}
                  data-testid="type-percent-change"
                >
                  <div className="font-bold">Percent change from X to Y</div>
                  <div className="text-sm opacity-70">Example: Change from 100 to 150</div>
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Enter Values</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {calcType === "whatIs" ? "Percentage (%)" : calcType === "isWhatPercent" ? "Value (X)" : "Original Value"}
                  </label>
                  <input
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    placeholder="Enter number"
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-3 text-lg"
                    data-testid="value1-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {calcType === "whatIs" ? "Of Value" : calcType === "isWhatPercent" ? "Total (Y)" : "New Value"}
                  </label>
                  <input
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    placeholder="Enter number"
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm px-4 py-3 text-lg"
                    data-testid="value2-input"
                  />
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                data-testid="calculate-button"
              >
                <Calculator className="w-6 h-6" />
                Calculate
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-6 backdrop-blur-xl border rounded-lg ${
                result.error ? 'bg-red-500/10 border-red-500/50' : 'bg-black/40 border-primary/50'
              }`}>
                {result.error ? (
                  <p className="text-red-400 text-center">{result.error}</p>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Result</p>
                    <p className="text-5xl font-heading font-bold text-primary mb-4" data-testid="result-value">
                      {result.value.toFixed(2)}
                    </p>
                    <p className="text-lg text-muted-foreground" data-testid="result-explanation">
                      {result.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Reference */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">Quick Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-black/20 rounded">
                  <p className="text-primary font-bold mb-1">25% of 200</p>
                  <p className="text-muted-foreground">= 50</p>
                </div>
                <div className="p-3 bg-black/20 rounded">
                  <p className="text-primary font-bold mb-1">15 is ? % of 60</p>
                  <p className="text-muted-foreground">= 25%</p>
                </div>
                <div className="p-3 bg-black/20 rounded">
                  <p className="text-primary font-bold mb-1">50 → 75</p>
                  <p className="text-muted-foreground">= 50% increase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-3xl mx-auto">
          <ToolContent toolData={percentageCalculatorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default PercentageCalculator;
