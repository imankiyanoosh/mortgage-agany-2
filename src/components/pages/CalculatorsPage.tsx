import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator as CalcIcon, TrendingUp, Sparkles, Star, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculators } from '../../data/calculators';
import * as Icons from 'lucide-react';

const CalculatorsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('purchase');
  const calculatorGridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.title = 'Mortgage Calculators | Helen Mehrshahi Mortgage Solutions';
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || CalcIcon;
  };

  const categories = [
    { 
      id: 'purchase', 
      label: 'Purchase', 
      color: 'emerald', 
      description: 'Home buying calculators',
      icon: 'Home'
    },
    { 
      id: 'refinance', 
      label: 'Refinance', 
      color: 'blue', 
      description: 'Refinancing tools',
      icon: 'RefreshCw'
    },
    { 
      id: 'investment', 
      label: 'Investment', 
      color: 'purple', 
      description: 'Investment property tools',
      icon: 'TrendingUp'
    },
    { 
      id: 'alternative', 
      label: 'Alternative Documentation', 
      color: 'amber', 
      description: 'No W2 / No Tax Return',
      icon: 'FileText'
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      color: 'indigo', 
      description: 'Business property loans',
      icon: 'Building2'
    },
    { 
      id: 'construction', 
      label: 'Construction', 
      color: 'rose', 
      description: 'Building & renovation',
      icon: 'Hammer'
    },
    { 
      id: 'jumbo', 
      label: 'Jumbo', 
      color: 'cyan', 
      description: 'High-value properties',
      icon: 'Building'
    },
    { 
      id: 'va', 
      label: 'VA Loans', 
      color: 'teal', 
      description: 'Veterans & service members',
      icon: 'Shield'
    }
  ];

  const getFeaturedCalculator = (category: string) => {
    const categoryCalculators = calculators.filter(calc => calc.category === category);
    return categoryCalculators[0]; // Return first calculator of the category as featured
  };

  const featuredCalculator = getFeaturedCalculator(activeCategory);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 text-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-400 mr-3" />
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                Free Financial Tools
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mortgage Calculator Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Make informed decisions with our comprehensive suite of mortgage calculators. 
              Get instant results for payments, affordability, refinancing, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold-600 hover:bg-gold-700">
                Start Calculating
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900">
                Get Expert Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator Hub Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    // Smooth scroll to calculator grid
                    calculatorGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`relative p-6 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                    activeCategory === category.id
                      ? `bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-white/20 backdrop-blur-sm">
                      {React.createElement((Icons as any)[category.icon], { className: `w-6 h-6 ${activeCategory === category.id ? 'text-white' : `text-${category.color}-500`}` })}
                    </div>
                    <div className="font-semibold text-lg mb-1">{category.label}</div>
                    <div className={`text-sm ${activeCategory === category.id ? 'text-white/80' : 'text-gray-500'}`}>{category.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            {/* Featured Calculator - Large Card */}
            {featuredCalculator && (
              <div className="lg:col-span-8">
                <Card 
                  className={`h-full bg-gradient-to-br from-${categories.find(cat => cat.id === activeCategory)?.color}-600 
                    to-${categories.find(cat => cat.id === activeCategory)?.color}-700 
                    text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                          <CalcIcon className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                          Most Popular
                        </span>
                      </div>
                      <TrendingUp className="w-6 h-6 text-blue-200" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{featuredCalculator.title}</h3>
                    <p className="text-blue-100 text-lg">{featuredCalculator.description}</p>
                  </CardHeader>

                  <CardContent>
                    {/* Quick Calculator Preview */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                      <h4 className="text-lg font-semibold mb-4">Quick Calculate</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-blue-100">
                            Loan Amount
                          </label>
                          <input
                            type="text"
                            placeholder="$600,000"
                            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-blue-100">
                            Interest Rate
                          </label>
                          <input
                            type="text"
                            placeholder="6.875%"
                            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-blue-100">
                            Loan Term
                          </label>
                          <select className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent">
                            <option className="text-gray-900">30 years</option>
                            <option className="text-gray-900">15 years</option>
                            <option className="text-gray-900">20 years</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/20">
                        <span className="text-blue-100">Monthly Payment:</span>
                        <span className="text-2xl font-bold">$3,956</span>
                      </div>
                    </div>
                    <Link to={`/calculators/${featuredCalculator.slug}`}>
                      <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                        Use Full Calculator
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Category Calculators - Right Column */}
            <div className="lg:col-span-4">
              <div className="space-y-4">
                {calculators
                  .filter(calc => calc.category === activeCategory)
                  .slice(1, 4) // Skip the featured calculator
                  .map((calculator) => {
                    const IconComponent = getIcon(calculator.icon);
                    const category = categories.find(cat => cat.id === activeCategory);
                    
                    return (
                      <Card 
                        key={calculator.id} 
                        className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                      >
                        <Link to={`/calculators/${calculator.slug}`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${category?.color}-100 group-hover:bg-${category?.color}-200 transition-colors`}>
                                <IconComponent className={`w-6 h-6 text-${category?.color}-600`} />
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {calculator.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {calculator.description}
                            </p>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* All Calculators Grid */}
          <div className="mb-16" ref={calculatorGridRef}>
            <h3 className="text-2xl font-bold text-navy-900 mb-8 text-center">
              All {categories.find(cat => cat.id === activeCategory)?.label} Calculators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
              {/* Bento Grid Layout */}
              {calculators
                .filter(calc => calc.category === activeCategory)
                .map((calculator, index) => {
                  const IconComponent = getIcon(calculator.icon);
                  const category = categories.find(cat => cat.id === activeCategory);
                  
                  return (
                    <Card 
                      key={calculator.id} 
                      className={`hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group calculator-card
                        ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                        ${index % 7 === 3 ? 'md:col-span-2' : ''}
                      `}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards'
                      }}
                    >
                      <Link to={`/calculators/${calculator.slug}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${category?.color}-100 group-hover:bg-${category?.color}-200 transition-colors`}>
                              <IconComponent className={`w-7 h-7 text-${category?.color}-600`} />
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${category?.color}-100 text-${category?.color}-800`}>
                              {category?.label}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {calculator.title}
                          </h4>
                          <p className="text-sm text-gray-600">{calculator.description}</p>
                        </CardHeader>
                        <CardContent>
                          <Button fullWidth variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                            Use Calculator
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .calculator-card {
              animation: fadeIn 0.5s ease-out forwards;
            }
          `}</style>

          {/* Enhanced Bottom CTA Section */}
          <div className="bg-gradient-to-r from-navy-900 to-blue-900 rounded-2xl p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Calculator?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Our mortgage experts can guide you through the calculations and help you understand your options.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Free Consultation
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
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
                    <span className="text-sm">Instant accurate calculations</span>
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-3" />
                    <span className="text-sm">Compare different scenarios</span>
                  </li>
                  <li className="flex items-center">
                    <CalcIcon className="w-4 h-4 text-blue-400 mr-3" />
                    <span className="text-sm">Professional-grade tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalculatorsPage;