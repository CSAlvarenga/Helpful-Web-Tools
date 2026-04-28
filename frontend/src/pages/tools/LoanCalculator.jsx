import { useState } from "react";
import Layout from "../../components/Layout";
import { DollarSign, Percent, Calendar } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { loanCalculatorContent } from "../../data/toolContent";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(250000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [years, setYears] = useState(30);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(years) * 12; // Total months

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || interestRate < 0 || years <= 0) {
      setResult({ error: "Please enter valid positive values" });
      return;
    }

    // Calculate monthly payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyPayment = r === 0 
      ? p / n  // If no interest
      : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    // Create payment schedule (simplified - first few payments)
    const schedule = [];
    let balance = p;
    for (let i = 1; i <= Math.min(12, n); i++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal: p,
      interestRate: parseFloat(interestRate),
      years: parseFloat(years),
      totalMonths: n,
      schedule
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Auto-calculate on input change
  useState(() => {
    calculate();
  }, [principal, interestRate, years]);

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-3"
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
              data-testid="page-title"
            >
              Loan Calculator
            </h1>
            <p className="text-muted-foreground text-lg">
              Calculate monthly payments for loans and mortgages
            </p>
          </div>

          <div className="space-y-6">
            {/* Sliders */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-6">Loan Parameters</h3>
              
              <div className="space-y-6">
                {/* Principal */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Loan Amount (Principal)
                    </label>
                    <span className="text-lg font-bold text-primary">{formatCurrency(principal)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="principal-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$10K</span>
                    <span>$1M</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Percent className="w-4 h-4 text-secondary" />
                      Annual Interest Rate
                    </label>
                    <span className="text-lg font-bold text-secondary">{interestRate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full"
                    data-testid="interest-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Loan Term
                    </label>
                    <span className="text-lg font-bold text-primary">{years} years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="years-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 year</span>
                    <span>40 years</span>
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full mt-6 px-6 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                data-testid="calculate-button"
              >
                <DollarSign className="w-6 h-6" />
                Calculate Payment
              </button>
            </div>

            {/* Results */}
            {result && !result.error && (
              <>
                {/* Monthly Payment - Main Result */}
                <div className="p-8 bg-black/40 backdrop-blur-xl border border-primary/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Monthly Payment</p>
                    <p className="text-6xl font-heading font-bold text-primary mb-6" data-testid="monthly-payment">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                    
                    {/* Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-black/20 rounded">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Paid</p>
                        <p className="text-xl font-heading font-bold" data-testid="total-payment">
                          {formatCurrency(result.totalPayment)}
                        </p>
                      </div>
                      <div className="p-4 bg-black/20 rounded">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Interest</p>
                        <p className="text-xl font-heading font-bold text-secondary" data-testid="total-interest">
                          {formatCurrency(result.totalInterest)}
                        </p>
                      </div>
                      <div className="p-4 bg-black/20 rounded">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Payments</p>
                        <p className="text-xl font-heading font-bold" data-testid="total-months">
                          {result.totalMonths}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                  <h3 className="text-xl font-heading font-bold mb-4">First Year Payment Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-muted-foreground">Month</th>
                          <th className="text-right py-2 px-3 text-muted-foreground">Payment</th>
                          <th className="text-right py-2 px-3 text-muted-foreground">Principal</th>
                          <th className="text-right py-2 px-3 text-muted-foreground">Interest</th>
                          <th className="text-right py-2 px-3 text-muted-foreground">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row) => (
                          <tr key={row.month} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2 px-3">{row.month}</td>
                            <td className="text-right py-2 px-3">{formatCurrency(row.payment)}</td>
                            <td className="text-right py-2 px-3 text-primary">{formatCurrency(row.principal)}</td>
                            <td className="text-right py-2 px-3 text-secondary">{formatCurrency(row.interest)}</td>
                            <td className="text-right py-2 px-3 font-mono">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {result && result.error && (
              <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-center">{result.error}</p>
              </div>
            )}

            {/* Info */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">About This Calculator</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Calculate monthly payments for mortgages, auto loans, or personal loans</li>
                <li>• Adjust sliders to see how different terms affect your payment</li>
                <li>• View the breakdown between principal and interest</li>
                <li>• See the first year's payment schedule in detail</li>
                <li>• Formula used: M = P[r(1+r)^n]/[(1+r)^n-1]</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-5xl mx-auto">
          <ToolContent toolData={loanCalculatorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
