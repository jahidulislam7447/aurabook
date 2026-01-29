export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          CSS Test Page
        </h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Tailwind CSS Test
          </h2>
          <p className="text-gray-600 mb-6">
            If you can see this styled content, Tailwind CSS is working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 text-center">
              <div className="text-blue-600 font-bold text-lg mb-2">Card 1</div>
              <div className="text-blue-800">Blue Theme</div>
            </div>
            
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
              <div className="text-green-600 font-bold text-lg mb-2">Card 2</div>
              <div className="text-green-800">Green Theme</div>
            </div>
            
            <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-6 text-center">
              <div className="text-purple-600 font-bold text-lg mb-2">Card 3</div>
              <div className="text-purple-800">Purple Theme</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Custom CSS Classes Test
          </h2>
          
          <div className="space-y-4">
            <button className="btn-primary">
              Primary Button
            </button>
            
            <button className="btn-secondary">
              Secondary Button
            </button>
            
            <button className="btn-outline">
              Outline Button
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="gradient-text text-3xl font-bold">
              Gradient Text Test
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}
