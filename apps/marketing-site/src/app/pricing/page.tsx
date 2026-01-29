import Link from 'next/link'
import { Check, ArrowRight, Star, Zap, Shield, Headphones } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small businesses getting started',
    features: [
      'Up to 5 users',
      'CRM & Basic Apps',
      '1GB Storage',
      'Email Support',
      'Mobile App Access',
      'Basic Analytics'
    ],
    notIncluded: [
      'Advanced Reporting',
      'API Access',
      'Custom Integrations',
      'Priority Support'
    ],
    popular: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: 79,
    description: 'Ideal for growing businesses',
    features: [
      'Up to 25 users',
      'All Apps Included',
      '10GB Storage',
      'Priority Email Support',
      'Advanced Analytics',
      'API Access',
      'Custom Reports',
      'Integrations'
    ],
    notIncluded: [
      'Dedicated Account Manager',
      'Custom Development'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited Users',
      'All Apps & Features',
      'Unlimited Storage',
      '24/7 Phone Support',
      'Dedicated Account Manager',
      'Custom Development',
      'SLA Guarantee',
      'Advanced Security',
      'White-label Options'
    ],
    notIncluded: [],
    popular: false,
    cta: 'Contact Sales'
  }
]

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and wire transfers for enterprise customers.'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No, there are no setup fees for any of our plans. You only pay the monthly subscription.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel anytime. Your access continues until the end of your billing period.'
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes, save 20% when you choose annual billing for any plan.'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Choose the perfect plan for your business. Start with a free trial and scale as you grow.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-secondary-600">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                No hidden fees
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white border-2 border-primary-600 transform scale-105'
                    : 'bg-white border border-secondary-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-4 ${plan.popular ? 'text-primary-100' : 'text-secondary-600'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-primary-100' : 'text-secondary-600'}`}>
                      /month
                    </span>
                  </div>
                  <Link
                    href="/signup"
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-white text-primary-600 hover:bg-gray-100'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-primary-200' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${plan.popular ? 'text-primary-100' : 'text-secondary-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start opacity-60">
                      <div className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-primary-300' : 'text-secondary-400'
                      }`}>
                        ×
                      </div>
                      <span className={`text-sm line-through ${
                        plan.popular ? 'text-primary-200' : 'text-secondary-500'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
              Compare Features
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-secondary-900">Feature</th>
                    <th className="text-center p-4 font-medium text-secondary-900">Starter</th>
                    <th className="text-center p-4 font-medium text-secondary-900">Professional</th>
                    <th className="text-center p-4 font-medium text-secondary-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  <tr>
                    <td className="p-4 text-secondary-700">Users</td>
                    <td className="p-4 text-center">5</td>
                    <td className="p-4 text-center">25</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-secondary-700">Storage</td>
                    <td className="p-4 text-center">1GB</td>
                    <td className="p-4 text-center">10GB</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-secondary-700">API Access</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center">✓</td>
                    <td className="p-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-secondary-700">Priority Support</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center">✓</td>
                    <td className="p-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-secondary-700">Custom Development</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-secondary-200 p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-secondary-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of businesses already using AuraTechIT to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Start 14-Day Free Trial
              </Link>
              <Link href="/demo" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
