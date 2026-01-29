export default function SimpleTestPage() {
  return (
    <div style={{ backgroundColor: 'red', padding: '20px' }}>
      <h1 style={{ color: 'white', fontSize: '24px' }}>Inline CSS Test</h1>
      <div className="bg-blue-500 text-white p-4 mt-4">
        <h2 className="text-xl font-bold">Tailwind Test</h2>
        <p>If this is blue with white text, Tailwind is working</p>
      </div>
      <div className="bg-green-500 text-white p-4 mt-4">
        <h2 className="text-xl font-bold">Another Tailwind Test</h2>
        <p>If this is green with white text, Tailwind is working</p>
      </div>
    </div>
  )
}
