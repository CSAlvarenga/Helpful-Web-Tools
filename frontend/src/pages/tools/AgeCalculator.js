import { useState } from "react";
import Layout from "../../components/Layout";
import { Cake } from "lucide-react";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!birthDate) {
      setResult({ error: "Please select your birth date" });
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      setResult({ error: "Invalid date format" });
      return;
    }

    if (birth > target) {
      setResult({ error: "Birth date cannot be in the future" });
      return;
    }

    // Calculate age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - target) / (1000 * 60 * 60 * 24));

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornOnDay = daysOfWeek[birth.getDay()];

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks,
      totalHours,
      daysToNextBirthday,
      bornOnDay,
      birthDate: birth.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      targetDate: target.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    });
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
              Age Calculator
            </h1>
            <p className="text-muted-foreground text-lg">
              Calculate your exact age in years, months, days, and more
            </p>
          </div>

          <div className="space-y-6">
            {/* Date Inputs */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Enter Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-3"
                    data-testid="birth-date-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Calculate Age On
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white rounded-sm px-4 py-3"
                    data-testid="target-date-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default is today
                  </p>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
                data-testid="calculate-button"
              >
                <Cake className="w-6 h-6" />
                Calculate Age
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
                    {/* Main Age Display */}
                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                      <p className="text-sm text-muted-foreground mb-4">You are</p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div>
                          <p className="text-5xl font-heading font-bold text-primary" data-testid="age-years">{result.years}</p>
                          <p className="text-sm text-muted-foreground">Years</p>
                        </div>
                        <div>
                          <p className="text-5xl font-heading font-bold text-primary" data-testid="age-months">{result.months}</p>
                          <p className="text-sm text-muted-foreground">Months</p>
                        </div>
                        <div>
                          <p className="text-5xl font-heading font-bold text-primary" data-testid="age-days">{result.days}</p>
                          <p className="text-sm text-muted-foreground">Days</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Born on {result.birthDate}
                      </p>
                    </div>

                    {/* Total Values */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-months">{result.totalMonths}</p>
                        <p className="text-xs text-muted-foreground">Total Months</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-weeks">{result.totalWeeks.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Weeks</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-days">{result.totalDays.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Days</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded text-center">
                        <p className="text-2xl font-heading font-bold" data-testid="total-hours">{result.totalHours.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Hours</p>
                      </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/10 border border-secondary/30 rounded">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Born On</p>
                        <p className="text-lg font-bold text-secondary" data-testid="born-on-day">{result.bornOnDay}</p>
                      </div>
                      <div className="p-4 bg-primary/10 border border-primary/30 rounded">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Next Birthday In</p>
                        <p className="text-lg font-bold text-primary" data-testid="days-to-birthday">
                          {result.daysToNextBirthday} {result.daysToNextBirthday === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">Did You Know?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• You can calculate your age on any future date</li>
                <li>• Find out which day of the week you were born</li>
                <li>• See exactly how many days until your next birthday</li>
                <li>• Perfect for planning milestone celebrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgeCalculator;
