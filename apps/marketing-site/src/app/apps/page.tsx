import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Zap, Shield, Globe, Headphones, Package, CreditCard, MessageSquare, Video, ShoppingCart, TrendingUp, FileText, Calendar, Mail, Phone } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const appCategories = [
  {
    name: 'Business Management',
    apps: [
      {
        name: 'AuraCRM',
        description: 'Complete customer relationship management with sales pipeline, contact management, and analytics.',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        features: ['Lead Management', 'Sales Pipeline', 'Contact Tracking', 'Analytics Dashboard']
      },
      {
        name: 'AuraERP',
        description: 'Enterprise resource planning for inventory, manufacturing, and supply chain management.',
        icon: BarChart3,
        color: 'from-green-500 to-green-600',
        features: ['Inventory Management', 'Supply Chain', 'Manufacturing', 'Resource Planning']
      },
      {
        name: 'AuraPOS',
        description: 'Modern point-of-sale system with inventory integration and payment processing.',
        icon: Zap,
        color: 'from-yellow-500 to-yellow-600',
        features: ['Sales Processing', 'Inventory Sync', 'Payment Gateway', 'Receipt Management']
      }
    ]
  },
  {
    name: 'Communication',
    apps: [
      {
        name: 'AuraChat',
        description: 'Team messaging and collaboration platform with channels and direct messaging.',
        icon: MessageSquare,
        color: 'from-purple-500 to-purple-600',
        features: ['Team Channels', 'Direct Messages', 'File Sharing', 'Video Calls']
      },
      {
        name: 'AuraMeet',
        description: 'Video conferencing and meeting platform with screen sharing and recording.',
        icon: Video,
        color: 'from-indigo-500 to-indigo-600',
        features: ['HD Video Calls', 'Screen Sharing', 'Meeting Recording', 'Calendar Integration']
      },
      {
        name: 'AuraMail',
        description: 'Professional email system with advanced filtering and collaboration features.',
        icon: Mail,
        color: 'from-pink-500 to-pink-600',
        features: ['Smart Inbox', 'Email Templates', 'Team Collaboration', 'Advanced Filtering']
      }
    ]
  },
  {
    name: 'Finance & Operations',
    apps: [
      {
        name: 'AuraBooks',
        description: 'Complete accounting and bookkeeping system with invoicing and financial reporting.',
        icon: FileText,
        color: 'from-teal-500 to-teal-600',
        features: ['Double Entry Accounting', 'Invoicing', 'Financial Reports', 'Tax Management']
      },
      {
        name: 'AuraPay',
        description: 'Payment processing and billing system with multiple payment methods.',
        icon: CreditCard,
        color: 'from-orange-500 to-orange-600',
        features: ['Payment Processing', 'Subscription Billing', 'Multi-Currency', 'Recurring Payments']
      },
      {
        name: 'AuraHR',
        description: 'Human resources management with payroll, attendance, and performance tracking.',
        icon: Users,
        color: 'from-red-500 to-red-600',
        features: ['Payroll Management', 'Attendance Tracking', 'Performance Reviews', 'Employee Portal']
      }
    ]
  },
  {
    name: 'Productivity & Tools',
    apps: [
      {
        name: 'AuraWork',
        description: 'Project management and collaboration platform with task tracking.',
        icon: Package,
        color: 'from-cyan-500 to-cyan-600',
        features: ['Project Management', 'Task Tracking', 'Team Collaboration', 'Time Tracking']
      },
      {
        name: 'AuraShop',
        description: 'E-commerce platform with product catalog, orders, and customer management.',
        icon: ShoppingCart,
        color: 'from-emerald-500 to-emerald-600',
        features: ['Product Catalog', 'Order Management', 'Customer Portal', 'Inventory Sync']
      },
      {
        name: 'AuraAnalytics',
        description: 'Business intelligence and analytics platform with custom dashboards.',
        icon: TrendingUp,
        color: 'from-violet-500 to-violet-600',
        features: ['Custom Dashboards', 'Data Visualization', 'Report Builder', 'Real-time Analytics']
      }
    ]
  }
]

export default function AppsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              All Apps, One Platform
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Everything your business needs, built by us to work seamlessly together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/pricing" className="btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Categories */}
      <section className="py-20 px-4">
        <div className="container">
          {appCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-3xl font-bold text-secondary-900 mb-8">
                {category.name}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.apps.map((app, appIndex) => (
                  <div key={appIndex} className="card hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mr-4`}>
                        <app.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                          {app.name}
                        </h3>
                        <p className="text-secondary-600 text-sm">
                          Built by AuraTechIT
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-secondary-700 mb-6">
                      {app.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {app.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-secondary-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/signup" className="btn-primary w-full text-center">
                      Get Started with {app.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
              Why Choose AuraTechIT Apps?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Built to Work Together
                  </h3>
                  <p className="text-secondary-600">
                    All our apps are designed to integrate seamlessly, sharing data and workflows without complex setup.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Single Platform, Single Support
                  </h3>
                  <p className="text-secondary-600">
                    One vendor, one support team, one responsibility. No more finger-pointing between third-party providers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Headphones className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Customizable & Extensible
                  </h3>
                  <p className="text-secondary-600">
                    Built with your business in mind, with customization options and API access for unique workflows.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Future-Proof Technology
                  </h3>
                  <p className="text-secondary-600">
                    Regular updates, new features, and cutting-edge technology to keep your business ahead of the curve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Get access to all AuraTechIT apps with a single subscription. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Start 14-Day Free Trial
              </Link>
              <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
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
