import Link from 'next/link'
import { ArrowRight, Users, Target, Lightbulb, Shield, Award, Globe } from 'lucide-react'

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Founder',
    image: '/team/sarah.jpg',
    bio: 'Former VP of Engineering at Fortune 500 company with 15+ years in enterprise software.'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO',
    image: '/team/michael.jpg',
    bio: 'Cloud architecture expert with experience scaling SaaS platforms to millions of users.'
  },
  {
    name: 'Emily Johnson',
    role: 'Head of Product',
    image: '/team/emily.jpg',
    bio: 'Product visionary focused on creating intuitive business solutions that drive results.'
  },
  {
    name: 'David Kim',
    role: 'VP of Engineering',
    image: '/team/david.jpg',
    bio: 'Full-stack specialist with expertise in microservices and real-time systems.'
  }
]

const values = [
  {
    icon: Target,
    title: 'Customer First',
    description: 'We build solutions that solve real business problems and deliver measurable value.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Constantly pushing boundaries to bring cutting-edge technology to businesses of all sizes.'
  },
  {
    icon: Shield,
    title: 'Security Focused',
    description: 'Enterprise-grade security and compliance built into every layer of our platform.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Fostering a culture of collaboration, learning, and continuous improvement.'
  }
]

const stats = [
  { label: 'Businesses Trust Us', value: '10,000+' },
  { label: 'Countries Served', value: '50+' },
  { label: 'Apps Available', value: '100+' },
  { label: 'Customer Satisfaction', value: '98%' }
]

const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'AuraTechIT founded with a mission to democratize enterprise software.'
  },
  {
    year: '2021',
    title: 'First Product Launch',
    description: 'Released our CRM module to initial beta customers.'
  },
  {
    year: '2022',
    title: 'Series A Funding',
    description: 'Raised $5M to expand our platform and team.'
  },
  {
    year: '2023',
    title: 'Platform Expansion',
    description: 'Launched complete suite including ERP, POS, and HR modules.'
  },
  {
    year: '2024',
    title: 'Global Reach',
    description: 'Expanded to serve customers in 50+ countries worldwide.'
  }
]

export default function AboutPage() {
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
              <Link href="/about" className="text-secondary-900 font-medium">
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
              Empowering Businesses to
              <span className="gradient-text"> Achieve More</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              We're on a mission to make enterprise-grade software accessible to businesses of all sizes. 
              Our all-in-one platform helps companies streamline operations, boost productivity, and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
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

      {/* Mission Section */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Our Mission & Vision
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Mission</h3>
                <p className="text-secondary-600">
                  To democratize enterprise software by providing affordable, comprehensive business solutions 
                  that help small and medium businesses compete with larger organizations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Vision</h3>
                <p className="text-secondary-600">
                  To become the global platform of choice for businesses seeking integrated solutions, 
                  enabling digital transformation across industries worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-secondary-600">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-secondary-600">
                Key milestones in our growth story
              </p>
            </div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      {milestone.year} - {milestone.title}
                    </h3>
                    <p className="text-secondary-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-xl text-secondary-600">
                The experts behind AuraTechIT's success
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-secondary-600 text-sm">
                    {member.bio}
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
              Join Us on Our Journey
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Be part of the thousands of businesses transforming their operations with AuraTechIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Start Free Trial
              </Link>
              <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
