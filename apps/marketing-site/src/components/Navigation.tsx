'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-secondary-200 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              AuraTechIT
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#apps" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium">
              Apps
            </Link>
            <Link href="/about" className="text-secondary-600 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login" className="btn-outline text-sm px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm px-4 py-2 flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-secondary-600 hover:text-primary-600 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200">
            <div className="py-4 space-y-2">
              <Link
                href="#features"
                onClick={closeMenu}
                className="block px-4 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={closeMenu}
                className="block px-4 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link
                href="#apps"
                onClick={closeMenu}
                className="block px-4 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                Apps
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="block px-4 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                About
              </Link>
              <div className="border-t border-secondary-200 mt-4 pt-4 space-y-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block mx-4 btn-outline text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="block mx-4 btn-primary text-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
