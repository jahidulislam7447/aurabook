import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, Users, BarChart3, Globe, Star, TrendingUp, Award, Headphones } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const features = [
  {
    icon: Users,
    title: 'CRM',
    description: 'Manage customer relationships, track interactions, and boost sales with our comprehensive CRM system.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: BarChart3,
    title: 'ERP',
    description: 'Streamline operations, manage resources, and optimize business processes with enterprise-grade ERP.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Zap,
    title: 'POS',
    description: 'Modern point-of-sale system with inventory management, payment processing, and real-time analytics.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Shield,
    title: 'HR Management',
    description: 'Complete HR solution with payroll, attendance, performance management, and employee engagement.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Globe,
    title: 'Multi-Tenant',
    description: 'Scale from small business to enterprise with our multi-tenant architecture and role-based access.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: CheckCircle,
    title: 'App Marketplace',
    description: 'Extend functionality with our growing marketplace of business apps and integrations.',
    color: 'from-pink-500 to-pink-600'
  }
]

const benefits = [
  {
    title: 'Increase Productivity',
    description: 'Automate repetitive tasks and streamline workflows to boost team efficiency by up to 40%.',
    icon: TrendingUp,
    stat: '40%',
    statLabel: 'Productivity Boost'
  },
  {
    title: 'Reduce Costs',
    description: 'Replace multiple expensive tools with one integrated platform and save thousands annually.',
    icon: Award,
    stat: '60%',
    statLabel: 'Cost Reduction'
  },
  {
    title: 'Better Insights',
    description: 'Get real-time analytics and reporting to make data-driven decisions with confidence.',
    icon: BarChart3,
    stat: '24/7',
    statLabel: 'Real-time Data'
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO at TechStart Inc.',
    company: 'Technology Startup',
    content: 'AuraTechIT transformed how we manage our business. Everything we need is in one place, and our team productivity has skyrocketed.',
    rating: 5,
    avatar: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    company: 'Manufacturing Co.',
    content: 'The ERP module alone saved us thousands in operational costs. The ROI was visible within the first month.',
    rating: 5,
    avatar: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Sales Manager',
    company: 'Retail Solutions',
    content: 'Best CRM we\'ve ever used. The integration with our POS system is seamless and the support is amazing.',
    rating: 5,
    avatar: 'ER'
  }
]

const integrations = [
  { name: 'AuraBooks', category: 'Accounting' },
  { name: 'AuraChat', category: 'Communication' },
  { name: 'AuraWork', category: 'Productivity' },
  { name: 'AuraPay', category: 'Payments' },
  { name: 'AuraMail', category: 'Marketing' },
  { name: 'AuraMeet', category: 'Communication' },
  { name: 'AuraShop', category: 'E-commerce' },
  { name: 'AuraCRM', category: 'CRM' }
]

const stats = [
  { value: '10,000+', label: 'Businesses Trust Us' },
  { value: '50+', label: 'Countries Served' },
  { value: '100+', label: 'Apps Available' },
  { value: '98%', label: 'Customer Satisfaction' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              #1 All-in-One Business Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              One Platform,
              <span className="gradient-text"> Multiple Solutions</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Transform your business with our all-in-one SaaS platform. CRM, ERP, POS, HR, and more - 
              everything you need to run your business efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#demo" className="btn-secondary text-lg px-8 py-4">
                Request Demo
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-secondary-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your business operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card group hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-secondary-900 mb-4">
                Why Businesses Choose AuraTechIT
              </h2>
              <p className="text-xl text-secondary-600">
                Real results that drive business growth
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="h-10 w-10 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {benefit.stat}
                  </div>
                  <div className="text-sm text-primary-600 font-medium mb-3">
                    {benefit.statLabel}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-secondary-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Loved by Thousands of Businesses
            </h2>
            <p className="text-xl text-secondary-600">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps & Modules */}
      <section id="apps" className="py-20 px-4 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Built-In Business Apps
            </h2>
            <p className="text-xl text-secondary-600">
              Everything you need, built by us for your business
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded"></div>
                </div>
                <div className="font-medium text-secondary-900 text-sm">
                  {integration.name}
                </div>
                <div className="text-xs text-secondary-500 mt-1">
                  {integration.category}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/apps" className="btn-outline">
              Explore All Apps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of businesses already using AuraTechIT to streamline their operations and boost growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                <Headphones className="inline h-5 w-5 mr-2" />
                Schedule Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-primary-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Free migration support
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
