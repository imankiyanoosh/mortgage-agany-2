import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Calculator as CalcIcon, Sparkles, ChevronDown, ChevronUp, Home, RefreshCw, Building, FileText, Scale, Briefcase, Hammer, Settings, Phone, Calendar, Star, Shield } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculators } from '../../data/calculators';

const CalculatorHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('purchase');
  const calculatorSectionRef = useRef<HTMLDivElement>(null);

  
  // State for calculator inputs and results
  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, string>>({
    // Purchase inputs
    loanAmount: '',
    downPayment: '',
    loanTerm: '',
    interestRate: '',
    
    // Refinance inputs
    currentLoanBalance: '',
    newInterestRate: '',
    remainingTerm: '',
    closingCosts: '',
    
    // Investment inputs
    propertyPrice: '',
    rentalIncome: '',
    
    // Alt-Doc inputs
    bankStatementIncome: '',
    
    // Credit & Prequalification inputs
    creditScore: '',
    annualIncome: '',
    monthlyDebts: '',
    
    // Commercial inputs
    propertyType: '',
    
    // Renovation inputs
    renovationBudget: '',
  });

  const [calculatorResults, setCalculatorResults] = useState<Record<string, string>>({
  monthlyPayment: '',
  monthlySavings: '',
  estimatedROI: '',
  loanApprovalRange: '',
  loanLimit: '',
  debtServiceCoverageRatio: '',
  newMonthlyPayment: '',
  investmentMonthlyPayment: '',
  dscrRatio: ''
});



  const categories = [
    { 
      id: 'purchase', 
      label: 'Purchase', 
      icon: Home,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      description: 'First-time & returning buyers',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    { 
      id: 'refinance', 
      label: 'Refinance', 
      icon: RefreshCw,
      color: 'blue',
      bgColor: 'bg-blue-500',
      description: 'Lower rates & cash-out options',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'investment', 
      label: 'Investment', 
      icon: Building,
      color: 'purple',
      bgColor: 'bg-purple-500',
      description: 'Rental & flip properties',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'alt-doc', 
      label: 'Alternative Documentation', 
      icon: FileText,
      color: 'orange',
      bgColor: 'bg-orange-500',
      description: 'Self-employed & business owners',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'credit', 
      label: 'Credit & Prequalification', 
      icon: Scale,
      color: 'lime',
      bgColor: 'bg-lime-500',
      description: 'Assess readiness & improve profile',
      gradient: 'from-lime-500 to-lime-600'
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      icon: Briefcase,
      color: 'pink',
      bgColor: 'bg-pink-500',
      description: 'Commercial real estate & business loans',
      gradient: 'from-pink-500 to-pink-600'
    },
    { 
      id: 'renovation', 
      label: 'Renovation', 
      icon: Hammer,
      color: 'amber',
      bgColor: 'bg-amber-500',
      description: 'Home improvements & ROI',
      gradient: 'from-amber-500 to-amber-600'
    },
    { 
      id: 'advanced', 
      label: 'Advanced Tools', 
      icon: Settings,
      color: 'sky',
      bgColor: 'bg-sky-500',
      description: 'Advanced strategies & analysis',
      gradient: 'from-sky-500 to-sky-600'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Smooth scroll to calculator section with a slight delay
    setTimeout(() => {
      calculatorSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, 200);
  };

  const getFeaturedCalculator = () => {
    const categoryCalculators = calculators.filter(calc => calc.category === activeCategory);
    return categoryCalculators[0] || null; // First calculator as featured, or null if none found
  };
  
  const handleInputChange = (field: string, value: string) => {
    // Validate numeric inputs (allow numbers, decimal points, and backspace)
    if (value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    
    // Limit decimal places to 2 for currency fields
    if (value.includes('.') && value.split('.')[1]?.length > 2) {
      return;
    }
    
    // Limit decimal places to 3 for interest rates
    if ((field === 'interestRate' || field === 'newInterestRate') && 
        value.includes('.') && value.split('.')[1]?.length > 3) {
      return;
    }
    
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Trigger calculation when inputs change (debounced)
    const debounceTimer = setTimeout(() => {
      calculateResults();
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  };
  
  const calculateResults = () => {
    if (activeCategory === 'alt-doc') {
      // Calculate monthly payment for alt-doc loans
      const principal = Number(calculatorInputs.altDocLoanAmount) || 0;
      const rate = (Number(calculatorInputs.altDocInterestRate) || 0) / 100 / 12;
      const term = Number(calculatorInputs.altDocLoanTerm) * 12 || 0;
      
      const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
      
      // Calculate DTI ratio
      const monthlyIncome = Number(calculatorInputs.estimatedMonthlyIncome) || 1;
      const dti = (monthlyPayment / monthlyIncome) * 100;
      
      setCalculatorResults({
        ...calculatorResults,
        monthlyPayment: monthlyPayment.toFixed(2),
        dtiRatio: dti.toFixed(2)
      });
    } else if (activeCategory === 'credit') {
      // Estimate loan amount based on credit score and DTI
      const monthlyIncome = Number(calculatorInputs.monthlyIncome) || 0;
      const estimatedDebt = Number(calculatorInputs.estimatedDebt) || 0;
      const creditScore = calculatorInputs.creditScore;
      
      // Determine max DTI based on credit score
      let maxDti = 0.36; // Default for good credit
      if (creditScore === 'excellent') maxDti = 0.43;
      else if (creditScore === 'fair') maxDti = 0.36;
      else if (creditScore === 'poor') maxDti = 0.30;
      
      // Calculate max monthly payment
      const maxMonthlyPayment = (monthlyIncome * maxDti) - estimatedDebt;
      
      // Estimate loan amount (simplified)
      const rate = 0.06 / 12; // Assume 6% interest
      const term = 30 * 12; // Assume 30 year term
      const loanAmount = maxMonthlyPayment * (Math.pow(1 + rate, term) - 1) / (rate * Math.pow(1 + rate, term));
      
      setCalculatorResults({
        ...calculatorResults,
        estimatedLoanAmount: loanAmount > 0 ? loanAmount.toFixed(2) : '0'
      });
    } else if (activeCategory === 'commercial') {
      // Calculate DSCR for commercial loans
      const noi = Number(calculatorInputs.noi) || 0;
      const principal = Number(calculatorInputs.commercialPropertyValue || 0) - Number(calculatorInputs.commercialDownPayment || 0);
      const rate = Number(calculatorInputs.commercialInterestRate || 0) / 100 / 12;
      const term = Number(calculatorInputs.commercialLoanTerm || 0) * 12;
      
      const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
      const dscr = noi / (monthlyPayment * 12);
      
      setCalculatorResults({
        ...calculatorResults,
        dscrRatio: dscr.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2)
      });
    } else if (activeCategory === 'renovation') {
      // Calculate ROI for renovation projects
      const afterValue = Number(calculatorInputs.afterRenovationValue) || 0;
      const beforeValue = afterValue - Number(calculatorInputs.renovationBudget || 0);
      const roi = ((afterValue - beforeValue) / Number(calculatorInputs.renovationBudget || 1)) * 100;
      
      // Calculate monthly payment
      const principal = Number(calculatorInputs.renovationBudget) || 0;
      const rate = Number(calculatorInputs.renovationInterestRate || 0) / 100 / 12;
      const term = Number(calculatorInputs.renovationLoanTerm || 0) * 12;
      
      const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
      
      setCalculatorResults({
        ...calculatorResults,
        roi: roi.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2)
      });
    } else if (activeCategory === 'advanced') {
      // Calculate payment scenarios for advanced tools
      const principal = Number(calculatorInputs.advancedLoanAmount) || 0;
      const rate = Number(calculatorInputs.initialInterestRate || 0) / 100 / 12;
      const term = Number(calculatorInputs.advancedTerm || 30) * 12;
      
      const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
      
      setCalculatorResults({
        ...calculatorResults,
        monthlyPayment: monthlyPayment.toFixed(2)
      });
    }
    if (activeCategory === 'purchase') {
      const principal = Number(calculatorInputs.propertyPrice || 0) - Number(calculatorInputs.downPayment || 0);
      const monthlyRate = Number(calculatorInputs.interestRate || 0) / 100 / 12;
      const payments = Number(calculatorInputs.loanTerm || 0) * 12;
      
      if (principal > 0 && monthlyRate > 0 && payments > 0) {
        const monthlyPayment = principal * 
          (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
          (Math.pow(1 + monthlyRate, payments) - 1);
          
        setCalculatorResults({
          ...calculatorResults,
          monthlyPayment: monthlyPayment.toFixed(2)
        });
      }
    } else if (activeCategory === 'refinance') {
      const principal = Number(calculatorInputs.currentBalance || 0);
      const monthlyRate = Number(calculatorInputs.newInterestRate || 0) / 100 / 12;
      const payments = Number(calculatorInputs.newLoanTerm || 0) * 12;
      
      if (principal > 0 && monthlyRate > 0 && payments > 0) {
        const newMonthlyPayment = principal * 
          (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
          (Math.pow(1 + monthlyRate, payments) - 1);
          
        // Placeholder for old monthly payment - would need to store this
        const oldMonthlyPayment = 0;
        const monthlySavings = oldMonthlyPayment - newMonthlyPayment;
        
        setCalculatorResults({
          ...calculatorResults,
          newMonthlyPayment: newMonthlyPayment.toFixed(2),
          monthlySavings: monthlySavings > 0 ? monthlySavings.toFixed(2) : '0.00'
        });
      }
    } else if (activeCategory === 'investment') {
      // Calculate monthly payment
      const principal = Number(calculatorInputs.investmentPropertyPrice || 0) - 
        Number(calculatorInputs.investmentDownPayment || 0);
      const monthlyRate = Number(calculatorInputs.investmentInterestRate || 0) / 100 / 12;
      const payments = Number(calculatorInputs.investmentLoanTerm || 0) * 12;
      
      if (principal > 0 && monthlyRate > 0 && payments > 0) {
        const monthlyPayment = principal * 
          (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
          (Math.pow(1 + monthlyRate, payments) - 1);
          
        // Calculate DSCR (Debt Service Coverage Ratio)
        const monthlyRent = Number(calculatorInputs.monthlyRent || 0);
        const dscrRatio = monthlyRent > 0 ? monthlyRent / monthlyPayment : 0;
        
        setCalculatorResults({
          ...calculatorResults,
          investmentMonthlyPayment: monthlyPayment.toFixed(2),
          dscrRatio: dscrRatio.toFixed(2)
        });
      }
    }
  };

  // Derived variables
  const featuredCalculator = getFeaturedCalculator();
  const activeTab = categories.find(cat => cat.id === activeCategory);
  const hasCalculators = calculators.some(calc => calc.category === activeCategory);

  return (
    <section id="calculators" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" aria-label="Mortgage calculators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Free Financial Tools
            </span>
          </div>
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            Mortgage Calculator Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make informed decisions with our comprehensive suite of mortgage calculators. 
            Get instant results for payments, affordability, refinancing, and more.
          </p>
        </div>

        {/* Category Bento Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Choose Your Calculator Category</h3>
            <p className="text-lg text-gray-600">Select a category to explore specialized mortgage calculators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group rounded-xl border-2 ${
                    isActive 
                      ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg border-transparent transform scale-[1.02]` 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-navy-900 hover:scale-[1.02]'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="text-center p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-white/30 backdrop-blur-sm shadow-inner text-white' : `bg-${category.color}-100 text-${category.color}-600 group-hover:bg-${category.color}-200`}`}>
                      <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : ''}`} />
                    </div>
                    
                    <h4 className={`text-lg font-bold mb-2 ${isActive ? 'text-white' : 'text-navy-900'}`}>
                      {category.label}
                    </h4>
                    
                    <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                    
                    <div className={`mt-4 text-xs font-medium ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {calculators.filter(calc => calc.category === category.id).length} calculators
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Calculator - Dynamic based on active category */}
        {calculators && calculators.length > 0 ? (
          <div className="mb-16" ref={calculatorSectionRef} key={`featured-${activeCategory}`}>
            <Card className={`bg-gradient-to-br ${activeTab?.gradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-white opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]`}>
              <div className="flex flex-col gap-8 p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <CalcIcon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                      Most Popular in {activeTab?.label}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{featuredCalculator.title}</h3>
                  <p className="text-white/90 text-lg mb-6 mx-auto max-w-2xl">{featuredCalculator.description}</p>
                  
                  <Link to={`/calculators/${featuredCalculator.slug}`}>
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 border border-white/30 text-white mx-auto">
                      Use Full Calculator
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mx-auto w-full max-w-2xl">
                  <h4 className="text-lg font-semibold mb-4">Quick Preview</h4>
                  <div className="grid grid-cols-1 gap-4 mb-4">

                        {activeCategory === 'investment' && (
                            <>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Property Price</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.investmentPropertyPrice}
                                  onChange={(e) => handleInputChange('investmentPropertyPrice', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="$500,000"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Estimated Monthly Rent</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.monthlyRent}
                                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="$2,500"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Loan Term (Years)</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.investmentLoanTerm}
                                  onChange={(e) => handleInputChange('investmentLoanTerm', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="30"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Interest Rate</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.investmentInterestRate}
                                  onChange={(e) => handleInputChange('investmentInterestRate', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="6.5%"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Down Payment</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.investmentDownPayment}
                                  onChange={(e) => handleInputChange('investmentDownPayment', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="$100,000"
                                />
                              </div>
                            </>
                          )}
                        
                        {activeCategory === 'alt-doc' && (
                          <>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Loan Amount</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.altDocLoanAmount}
                                  onChange={(e) => handleInputChange('altDocLoanAmount', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="$300,000"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Estimated Monthly Income</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.estimatedMonthlyIncome}
                                  onChange={(e) => handleInputChange('estimatedMonthlyIncome', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="$5,000"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Loan Term (Years)</label>
                                <input
                                  type="number"
                                  value={calculatorInputs.altDocLoanTerm}
                                  onChange={(e) => handleInputChange('altDocLoanTerm', e.target.value)}
                                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                  placeholder="30"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white/90">Interest Rate</label>
                              <input
                                type="number"
                                value={calculatorInputs.altDocInterestRate}
                                onChange={(e) => handleInputChange('altDocInterestRate', e.target.value)}
                                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="7.5%"
                              />
                            </div>
                          </>
                        )}
                        
                        {activeCategory === 'credit' && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Monthly Income</label>
                              <input
                                type="number"
                                value={calculatorInputs.monthlyIncome}
                                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="$5,000"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Estimated Monthly Debt</label>
                              <input
                                type="number"
                                value={calculatorInputs.estimatedDebt}
                                onChange={(e) => handleInputChange('estimatedDebt', e.target.value)}
                                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                placeholder="$1,500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Credit Score</label>
                              <select
                                value={calculatorInputs.creditScore}
                                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                              >
                                <option value="excellent">Excellent (740+)</option>
                                <option value="good">Good (700-739)</option>
                                <option value="fair">Fair (640-699)</option>
                                <option value="poor">Poor (639 or below)</option>
                              </select>
                            </div>
                          </>
                        )}
                        
                        {activeCategory === 'commercial' && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Property Value</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.commercialPropertyValue}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('commercialPropertyValue', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter value"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Down Payment</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.commercialDownPayment}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('commercialDownPayment', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Interest Rate</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={calculatorInputs.commercialInterestRate}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('commercialInterestRate', e.target.value)}
                                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter rate"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Loan Term (Years)</label>
                              <input
                                type="number"
                                value={calculatorInputs.commercialLoanTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('commercialLoanTerm', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                placeholder="Enter years"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">NOI (Net Operating Income)</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.noi}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('noi', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>
                          </>
                        )}
                        
                        {activeCategory === 'renovation' && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Renovation Budget</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.renovationBudget}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('renovationBudget', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Estimated Property Value After Renovation</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.afterRenovationValue}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('afterRenovationValue', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter value"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Loan Term (Years)</label>
                              <input
                                type="number"
                                value={calculatorInputs.renovationLoanTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('renovationLoanTerm', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                placeholder="Enter years"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Interest Rate</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={calculatorInputs.renovationInterestRate}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('renovationInterestRate', e.target.value)}
                                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter rate"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {activeCategory === 'advanced' && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Loan Amount</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.advancedLoanAmount}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('advancedLoanAmount', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>
                            <select
                              name="rateType"
                              aria-label="Rate Type"
                              value={calculatorInputs.rateType}
                              onChange={(e) => handleInputChange('rateType', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="fixed">Fixed Rate</option>
                              <option value="arm">Adjustable Rate (ARM)</option>
                            </select>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Initial Interest Rate</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={calculatorInputs.initialInterestRate}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('initialInterestRate', e.target.value)}
                                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter rate"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Adjustment Cap (%)\</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={calculatorInputs.adjustmentCap}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('adjustmentCap', e.target.value)}
                                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter cap"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Term</label>
                              <input
                                type="number"
                                value={calculatorInputs.advancedTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('advancedTerm', e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                placeholder="Enter term"
                              />
                            </div>
                          </>
                        )}
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Property Price</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.investmentPropertyPrice}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('investmentPropertyPrice', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter price"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Estimated Monthly Rent</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={calculatorInputs.monthlyRent}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('monthlyRent', e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                                  placeholder="Enter rent"
                                />
                              </div>
                            </div>
                            <input
                              aria-label="Loan Term (Years)"
                              type="number"
                              value={calculatorInputs.investmentLoanTerm}
                              onChange={(e) => handleInputChange('investmentLoanTerm', e.target.value)}
                            />
                            <input
                              aria-label="Interest Rate"
                              type="number"
                              value={calculatorInputs.investmentInterestRate}
                              onChange={(e) => handleInputChange('investmentInterestRate', e.target.value)}
                              placeholder="Enter interest rate"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2 text-white/90">Down Payment</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
                                <input
                                  type="number"
                                  className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={calculatorInputs.investmentDownPayment}
                                  onChange={(e) => handleInputChange('investmentDownPayment', e.target.value)}
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="results">
                            <h3>Monthly Payment</h3>
                            <p>${calculatorResults.monthlyPayment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                    {activeCategory === 'purchase' && (
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-medium text-white">Monthly Payment</h3>
                        <p className="text-3xl font-bold text-white mt-2">
                          {calculatorResults.monthlyPayment ? `$${parseFloat(calculatorResults.monthlyPayment.replace(/[^0-9.]/g, '')).toFixed(2)}` : '$0.00'}
                        </p>
                      </div>
                    )}
                    
                    {activeCategory === 'refinance' && (
                      <>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-medium text-white">New Monthly Payment</h3>
                          <p className="text-3xl font-bold text-white mt-2">
                            {calculatorResults.newMonthlyPayment ? `$${parseFloat(calculatorResults.newMonthlyPayment).toFixed(2)}` : '$0.00'}
                          </p>
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-white">Monthly Savings</h3>
                          <p className="text-3xl font-bold text-green-400 mt-2">
                            {calculatorResults.monthlySavings ? `$${parseFloat(calculatorResults.monthlySavings).toFixed(2)}` : '$0.00'}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {activeCategory === 'investment' && (
                      <>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-medium text-white">Monthly Mortgage</h3>
                          <p className="text-3xl font-bold text-white mt-2">
                            {calculatorResults.investmentMonthlyPayment ? `$${parseFloat(calculatorResults.investmentMonthlyPayment).toFixed(2)}` : '$0.00'}
                          </p>
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-white">DSCR Ratio</h3>
                          <p className="text-3xl font-bold text-white mt-2">
                            {calculatorResults.dscrRatio ? parseFloat(calculatorResults.dscrRatio).toFixed(2) : '0.00'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Active Category Calculators - Enhanced Bento Grid */}
        {hasCalculators ? (
          <div className="mb-16" key={`grid-${activeCategory}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-navy-900">
                {activeTab?.label} Calculators
              </h3>
              <div className="text-sm text-gray-600">
                {calculators.filter(calc => calc.category === activeCategory).length} calculators available
              </div>
            </div>
          </div>

          {/* Enhanced Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.filter(calc => calc.category === activeCategory).map((calculator) => {
              const getIcon = (iconName: string) => {
                const IconComp = (Icons as any)[iconName];
                return IconComp || ArrowRight;
              };

              const IconComponent = (getIcon(calculator.icon) || ArrowRight) as React.ComponentType<React.SVGProps<SVGSVGElement>>;
              const category = { id: calculator.category, label: calculator.category, color: 'blue' };

              return (
                <Card 
                  key={calculator.id} 
                  className={`hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group calculator-card bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white rounded-xl animate-fade-in-up`}
                >
                  <Link to={`/calculators/${calculator.slug}`}>
                    <CardHeader className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-sm bg-${category?.color}-100 text-${category?.color}-600 group-hover:bg-${category?.color}-200`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <div className="flex items-center">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {calculator.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{calculator.description}</p>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
    category?.color === 'emerald' && 'bg-emerald-100 text-emerald-800'
  } ${
    category?.color === 'blue' && 'bg-blue-100 text-blue-800'
  } ${
    category?.color === 'purple' && 'bg-purple-100 text-purple-800'
  } ${
    category?.color === 'orange' && 'bg-orange-100 text-orange-800'
  } ${
    category?.color === 'lime' && 'bg-lime-100 text-lime-800'
  } ${
    category?.color === 'pink' && 'bg-pink-100 text-pink-800'
  } ${
    category?.color === 'amber' && 'bg-amber-100 text-amber-800'
  } ${
    category?.color === 'sky' && 'bg-sky-100 text-sky-800'
  }`}>
                          {category?.label}
                        </span>
                        <Button variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                          Use Calculator
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })} 
          </div>

          {/* Load More Button */}
          {calculators.length > 5 && (
            <div className="text-center mt-8">
              <Button
                onClick={() => {}}
                variant="outline"
                size="lg"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                {false ? (
                  <>
                    Show Less
                    <ChevronUp className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Load More Calculators
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-16" ref={calculatorSectionRef}>
          <Card className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Calculators Found</h3>
              <p className="text-gray-600 mb-4">We couldn't find any calculators in this category. Please try selecting a different category.</p>
            </div>
          </Card>
        </div>
      )}

        {/* Enhanced Bottom CTA */}
        <div className="bg-gradient-to-r from-navy-900 to-blue-900 rounded-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Calculator?</h3>
              <p className="text-lg mb-6 opacity-90">
                Our mortgage experts can guide you through the calculations and help you understand your options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (818) 555-0123
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Calculator Benefits</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-gold-400 mr-3" />
                    <span className="text-sm">Accurate Real-Time Calculations</span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 text-gold-400 mr-3" />
                    <span className="text-sm">Secure and Private</span>
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-gold-400 mr-3" />
                    <span className="text-sm">Updated Market Rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </>
    );

export default CalculatorHub;