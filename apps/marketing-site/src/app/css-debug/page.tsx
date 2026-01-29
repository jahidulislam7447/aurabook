export default function CSSDebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          CSS Debugging Page
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tailwind Classes Test</h2>
          
          <div className="space-y-4">
            {/* Basic colors */}
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-red-500 rounded"></div>
              <div className="w-20 h-20 bg-green-500 rounded"></div>
              <div className="w-20 h-20 bg-blue-500 rounded"></div>
              <div className="w-20 h-20 bg-yellow-500 rounded"></div>
            </div>
            
            {/* Typography */}
            <div className="space-y-2">
              <p className="text-xs">Extra Small Text</p>
              <p className="text-sm">Small Text</p>
              <p className="text-base">Base Text</p>
              <p className="text-lg">Large Text</p>
              <p className="text-xl">Extra Large Text</p>
              <p className="text-2xl">2XL Text</p>
            </div>
            
            {/* Spacing */}
            <div className="space-y-2">
              <div className="p-2 bg-gray-200">Padding 2</div>
              <div className="p-4 bg-gray-200">Padding 4</div>
              <div className="p-6 bg-gray-200">Padding 6</div>
            </div>
            
            {/* Flexbox */}
            <div className="flex justify-between items-center bg-gray-100 p-4">
              <div className="w-16 h-16 bg-purple-500 rounded"></div>
              <div className="w-16 h-16 bg-indigo-500 rounded"></div>
              <div className="w-16 h-16 bg-pink-500 rounded"></div>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-teal-500 rounded"></div>
              <div className="h-20 bg-orange-500 rounded"></div>
              <div className="h-20 bg-cyan-500 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Custom Classes Test</h2>
          
          <div className="space-y-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-outline">Outline Button</button>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Card Component</h3>
              <p className="text-gray-600">This is a custom card class.</p>
            </div>
            
            <h3 className="gradient-text text-3xl font-bold">
              Gradient Text Test
            </h3>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Debugging Info:</h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>✓ If you see colored boxes, Tailwind is working</li>
            <li>✓ If buttons are styled, custom CSS is working</li>
            <li>✓ If gradient text appears, custom utilities are working</li>
            <li>✓ Check browser console for any CSS errors</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
