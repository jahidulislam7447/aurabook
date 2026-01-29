'use client'

import { useState } from 'react'
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, DollarSign, Smartphone, Package, Filter, Download } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  quantity?: number
}

const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Pro 15"', sku: 'LP-001', category: 'Electronics', price: 1299.99, stock: 45 },
  { id: '2', name: 'Wireless Mouse', sku: 'WM-002', category: 'Accessories', price: 29.99, stock: 120 },
  { id: '3', name: 'USB-C Hub', sku: 'UH-003', category: 'Accessories', price: 49.99, stock: 78 },
  { id: '4', name: 'Mechanical Keyboard', sku: 'KB-004', category: 'Accessories', price: 89.99, stock: 32 },
  { id: '5', name: 'Monitor 27"', sku: 'MN-005', category: 'Electronics', price: 399.99, stock: 18 }
]

const categories = ['All', 'Electronics', 'Accessories', 'Software', 'Office Supplies']

export default function POSPage() {
  const [activeTab, setActiveTab] = useState('sale')
  const [cart, setCart] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const cartTotals = cart.reduce((acc, item) => {
    const itemTotal = item.price * (item.quantity || 1)
    const itemTax = itemTotal * 0.08
    return {
      subtotal: acc.subtotal + itemTotal,
      tax: acc.tax + itemTax,
      total: acc.total + itemTotal + itemTax
    }
  }, { subtotal: 0, tax: 0, total: 0 })

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + change
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
      }
      return item
    }).filter((item): item is Product => item !== null))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setShowPaymentModal(false)
    setSelectedPaymentMethod('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AuraPOS</h1>
            <p className="text-gray-600">Point of Sale System</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Session Open
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {['sale', 'products', 'sales', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'sale' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Shopping Cart
                  </h2>
                </div>
                
                {cart.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-600 hover:text-gray-900">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity || 1}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-600 hover:text-gray-900">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {cart.length > 0 && (
                  <div className="p-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${cartTotals.total.toFixed(2)}</span>
                    </div>
                    <button onClick={() => setShowPaymentModal(true)} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
                      Process Payment
                    </button>
                    <button onClick={clearCart} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium">
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Product Inventory</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 20 ? 'bg-green-100 text-green-800' : 
                          product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-gray-600 hover:text-gray-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales History</h2>
            <p className="text-gray-600">Sales history and transaction records will appear here.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h2>
            <p className="text-gray-600">Sales analytics and reports will appear here.</p>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Payment</h3>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">${cartTotals.total.toFixed(2)}</p>
              <p className="text-gray-600">Total Amount</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { method: 'credit_card', icon: CreditCard, label: 'Credit Card' },
                { method: 'cash', icon: DollarSign, label: 'Cash' },
                { method: 'mobile', icon: Smartphone, label: 'Mobile Payment' }
              ].map(({ method, icon: Icon, label }) => (
                <button
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`w-full p-4 rounded-lg border-2 flex items-center justify-center space-x-3 ${
                    selectedPaymentMethod === method 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
              <button onClick={clearCart} disabled={!selectedPaymentMethod} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50">
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
