'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@auratechit.com', 'sales@auratechit.com'],
      description: 'Get in touch with our team'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri from 9am to 6pm EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Tech Street', 'San Francisco, CA 94105'],
      description: 'Schedule a meeting at our office'
    }
  ]

  const officeLocations = [
    {
      city: 'San Francisco',
      address: '123 Tech Street, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@auratechit.com'
    },
    {
      city: 'New York',
      address: '456 Broadway, New York, NY 10013',
      phone: '+1 (555) 234-5678',
      email: 'ny@auratechit.com'
    },
    {
      city: 'London',
      address: '789 Oxford Street, London W1C 1DX',
      phone: '+44 20 7123 4567',
      email: 'uk@auratechit.com'
    },
    {
      city: 'Singapore',
      address: '321 Orchard Road, Singapore 238897',
      phone: '+65 6234 5678',
      email: 'asia@auratechit.com'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xs border-b border-secondary-200 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              AuraTechIT
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-secondary-600 hover:text-secondary-900 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-secondary-600 hover:text-secondary-900 transition-colors">
                Pricing
              </Link>
              <Link href="/#apps" className="text-secondary-600 hover:text-secondary-900 transition-colors">
                Apps
              </Link>
              <Link href="/about" className="text-secondary-600 hover:text-secondary-900 transition-colors">
                About
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-outline">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Have questions about AuraTechIT? Our team is here to help you find the perfect solution for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-secondary-600 mb-3">
                  {info.description}
                </p>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-secondary-700 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Send Us a Message
              </h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Acme Corp"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone
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
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Support Options */}
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Support Options
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-secondary-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        24/7 Live Chat Support
                      </h3>
                      <p className="text-secondary-600 mb-3">
                        Get instant help from our support team via live chat.
                      </p>
                      <button className="text-primary-600 font-medium hover:text-primary-700">
                        Start Live Chat →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-secondary-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        Business Hours Support
                      </h3>
                      <p className="text-secondary-600 mb-3">
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                      </p>
                      <p className="text-secondary-600">
                        Average response time: 2 hours during business hours
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                    Self-Service Resources
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        📚 Comprehensive Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        🎥 Video Tutorials & Webinars
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        💬 Community Forum
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary-600 hover:text-primary-700">
                        📋 FAQ Section
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Our Global Offices
              </h2>
              <p className="text-xl text-secondary-600">
                Find us around the world
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {officeLocations.map((office, index) => (
                <div key={index} className="bg-white rounded-lg border border-secondary-200 p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {office.city}
                  </h3>
                  <div className="space-y-2 text-secondary-600">
                    <p>{office.address}</p>
                    <p>📞 {office.phone}</p>
                    <p>✉️ {office.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
