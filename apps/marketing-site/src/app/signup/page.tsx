'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, ArrowRight, Shield, CreditCard, Users } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companySize: '',
    phone: '',
    agreeToTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ]

  const plans = [
    {
      name: 'Starter',
      price: '$29/month',
      features: ['Up to 5 users', 'Basic CRM', 'Email support', '1GB storage'],
      recommended: false
    },
    {
      name: 'Professional',
      price: '$79/month',
      features: ['Up to 25 users', 'All apps included', 'Priority support', '10GB storage'],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited users', 'Custom features', 'Dedicated support', 'Unlimited storage'],
      recommended: false
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xs border-b border-secondary-200">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              AuraTechIT
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">Already have an account?</span>
              <Link href="/login" className="btn-outline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= stepNumber
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 ${
                      step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-8 text-sm">
              <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                Account Info
              </span>
              <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                Company Details
              </span>
              <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>
                Choose Plan
              </span>
            </div>
          </div>

          {/* Step 1: Account Information */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                  Create Your Account
                </h1>
                <p className="text-secondary-600">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-secondary-600">
                    I agree to the <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Company Information */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                  Tell Us About Your Company
                </h1>
                <p className="text-secondary-600">
                  Help us personalize your experience
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Size *
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    required
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 btn-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Choose Plan */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                  Choose Your Plan
                </h1>
                <p className="text-secondary-600">
                  Start with a 14-day free trial. No credit card required.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.recommended
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-2xl font-bold text-secondary-900 mb-4">
                      {plan.price}
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-secondary-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, plan: plan.name }))
                        handleSubmit(new Event('submit') as any)
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.recommended
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                      }`}
                    >
                      Start Free Trial
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Secure payment
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Cancel anytime
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 btn-outline"
                >
                  Back
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 btn-outline"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
