export default function TestPage() {
  return (
    <div className="bg-red-500 p-8">
      <h1 className="text-white text-4xl font-bold">
        Tailwind CSS Test
      </h1>
      <p className="text-white mt-4">
        If this page has a red background and white text, Tailwind is working.
      </p>
      <div className="bg-blue-500 text-white p-4 mt-4 rounded">
        Blue box with white text
      </div>
      <div className="bg-green-500 text-white p-4 mt-4 rounded">
        Green box with white text
      </div>
    </div>
  )
}
