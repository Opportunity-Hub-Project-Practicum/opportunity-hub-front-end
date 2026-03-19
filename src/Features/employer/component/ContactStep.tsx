import { Mail } from 'lucide-react'
import { FormData } from '../App'

interface ContactStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onPrevious: () => void
  onFinish: () => void
}

export function ContactStep({ formData, updateFormData, onPrevious, onFinish }: ContactStepProps) {
  return (
    <div className="space-y-6">
      {/* Map Location */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Map Location
        </label>
        <input
          type="text"
          value={formData.mapLocation}
          onChange={(e) => updateFormData({ mapLocation: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Phone
        </label>
        <input
          type="tel"
          placeholder="Phone number.."
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-9"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          Finish Editing
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
