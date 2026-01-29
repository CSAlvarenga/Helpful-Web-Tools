import { useState } from "react";
import Layout from "../../components/Layout";
import { Calendar } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { dateCalculatorContent } from "../../data/toolContent";

const DateCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!startDate || !endDate) {
      setResult({ error: "Please select both dates" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setResult({ error: "Invalid date format" });
      return;
    }

    // Calculate difference in milliseconds
    const diffMs = Math.abs(end - start);
    
    // Convert to different units
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average month length
    const diffYears = Math.floor(diffDays / 365.25); // Account for leap years

    // Calculate detailed breakdown
    const years = Math.floor(diffDays / 365.25);
    const remainingDaysAfterYears = diffDays - (years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears - (months * 30.44));

    const direction = end > start ? "from" : "before";

    setResult({
      startDate: start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      endDate: end.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      direction,
      totalDays: diffDays,
      totalWeeks: diffWeeks,
      totalMonths: diffMonths,
      totalYears: diffYears,
      breakdown: { years, months, days },
      hours: diffHours,
      minutes: diffMinutes
    });
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
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
              Date Calculator
            </h1>
            <p className="text-muted-foreground text-lg">
              Calculate the difference between two dates
            </p>
          </div>

          <div className="space-y-6">
            {/* Date Inputs */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Select Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-3"
                    data-testid="start-date-input"
                  />
                  <button
                    onClick={setToday}
                    className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Set to Today
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-3"
                    data-testid="end-date-input"
                  />
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                data-testid="calculate-button"
              >
                <Calendar className="w-6 h-6" />
                Calculate Difference
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
                  <div>
                    {/* Date Range Display */}
                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                      <p className="text-sm text-muted-foreground mb-2">{result.startDate}</p>
                      <p className="text-primary text-2xl mb-2">↓</p>
                      <p className="text-sm text-muted-foreground">{result.endDate}</p>
                    </div>

                    {/* Main Result */}
                    <div className="text-center mb-6">
                      <p className="text-6xl font-heading font-bold text-primary mb-2" data-testid="total-days">
                        {result.totalDays.toLocaleString()}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        {result.totalDays === 1 ? 'Day' : 'Days'}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded">
                      <p className="text-center text-lg" data-testid="breakdown">
                        <span className="text-primary font-bold">{result.breakdown.years}</span> years, {' '}
                        <span className="text-primary font-bold">{result.breakdown.months}</span> months, {' '}
                        <span className="text-primary font-bold">{result.breakdown.days}</span> days
                      </p>
                    </div>

                    {/* Alternative Units */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-weeks">{result.totalWeeks}</p>
                        <p className="text-xs text-muted-foreground">Weeks</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-months">{result.totalMonths}</p>
                        <p className="text-xs text-muted-foreground">Months</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-hours">{result.hours.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Hours</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-minutes">{result.minutes.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Minutes</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Use Cases */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">Common Uses</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Calculate days until a special event or deadline</li>
                <li>• Find out how long ago something happened</li>
                <li>• Calculate project duration or time elapsed</li>
                <li>• Determine age in days, weeks, or months</li>
                <li>• Plan events or vacations with precise day counts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <ToolContent toolData={dateCalculatorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default DateCalculator;
