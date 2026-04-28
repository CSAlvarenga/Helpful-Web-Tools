import { useState } from "react";
import Layout from "../../components/Layout";
import { Tag, DollarSign } from "lucide-react";
import ToolContent from "../../components/ToolContent";
import { discountCalculatorContent } from "../../data/toolContent";

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100) {
      setResult({ error: "Please enter valid values (discount must be 0-100%)" });
      return;
    }

    const discountAmount = (price * discount) / 100;
    const finalPrice = price - discountAmount;
    const savings = discountAmount;

    setResult({
      originalPrice: price,
      discountPercent: discount,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      savings: savings
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
              Discount Calculator
            </h1>
            <p className="text-muted-foreground text-lg">
              Calculate sale prices and savings from discounts
            </p>
          </div>

          <div className="space-y-6">
            {/* Input Fields */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-xl font-heading font-bold mb-4">Enter Details</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="100.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm pl-12 pr-4 py-3 text-lg"
                      data-testid="price-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Percentage (%)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="25"
                      step="1"
                      min="0"
                      max="100"
                      className="w-full bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30 rounded-sm pl-12 pr-4 py-3 text-lg"
                      data-testid="discount-input"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full px-6 py-4 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-secondary/90 flex items-center justify-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(255, 95, 0, 0.5)' }}
                data-testid="calculate-button"
              >
                <Tag className="w-6 h-6" />
                Calculate Discount
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
                    {/* Final Price - Main Result */}
                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                      <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Final Price</p>
                      <p className="text-6xl font-heading font-bold text-primary" data-testid="final-price">
                        {formatCurrency(result.finalPrice)}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-black/20 rounded text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Original Price</p>
                        <p className="text-xl font-heading font-bold" data-testid="original-price">
                          {formatCurrency(result.originalPrice)}
                        </p>
                      </div>

                      <div className="p-4 bg-black/20 rounded text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Discount</p>
                        <p className="text-xl font-heading font-bold text-secondary" data-testid="discount-amount">
                          -{formatCurrency(result.discountAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">({result.discountPercent}% off)</p>
                      </div>

                      <div className="p-4 bg-black/20 rounded text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">You Save</p>
                        <p className="text-xl font-heading font-bold text-green-400" data-testid="savings">
                          {formatCurrency(result.savings)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Examples */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
              <h3 className="text-lg font-heading font-bold mb-3">Common Discounts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <button
                  onClick={() => {
                    setOriginalPrice("100");
                    setDiscountPercent("10");
                  }}
                  className="p-3 bg-black/20 rounded hover:bg-black/40 transition-colors text-left"
                >
                  <p className="text-secondary font-bold">10% off</p>
                  <p className="text-muted-foreground text-xs">$100 → $90</p>
                </button>
                <button
                  onClick={() => {
                    setOriginalPrice("100");
                    setDiscountPercent("25");
                  }}
                  className="p-3 bg-black/20 rounded hover:bg-black/40 transition-colors text-left"
                >
                  <p className="text-secondary font-bold">25% off</p>
                  <p className="text-muted-foreground text-xs">$100 → $75</p>
                </button>
                <button
                  onClick={() => {
                    setOriginalPrice("100");
                    setDiscountPercent("50");
                  }}
                  className="p-3 bg-black/20 rounded hover:bg-black/40 transition-colors text-left"
                >
                  <p className="text-secondary font-bold">50% off</p>
                  <p className="text-muted-foreground text-xs">$100 → $50</p>
                </button>
                <button
                  onClick={() => {
                    setOriginalPrice("100");
                    setDiscountPercent("75");
                  }}
                  className="p-3 bg-black/20 rounded hover:bg-black/40 transition-colors text-left"
                >
                  <p className="text-secondary font-bold">75% off</p>
                  <p className="text-muted-foreground text-xs">$100 → $25</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-3xl mx-auto">
          <ToolContent toolData={discountCalculatorContent} />
        </div>
      </div>
    </Layout>
  );
};

export default DiscountCalculator;
