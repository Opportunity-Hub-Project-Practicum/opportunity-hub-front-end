import { CheckCheck } from 'lucide-react'

export function CompletionScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 max-w-xl w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <CheckCheck className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          🎉 Congratulations, Your profile is 100% complete!
        </h1>
        
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Donec hendrerit, ante mattis pellentesque eleifend, tortor urna
          malesuada ante, eget aliquam nulla augue hendrerit ligula. Nunc
          mauris arcu, mattis sed sem vitae.
        </p>
        
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-wide flex items-center gap-2 mx-auto transition-colors"
        >
          Let Get Started
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
