import { Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, Calendar, Globe, ChevronDown } from 'lucide-react'
import type { FormData } from '../App'

interface DetailStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const organizationTypes = ['Private', 'Public', 'Non-Profit', 'Government']
const industryTypes = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail']
const teamSizes = ['1-10', '11-50', '51-200', '201-500', '500+']

export function DetailStep({ formData, updateFormData, onNext, onPrevious }: DetailStepProps) {
  return (
    <div className="space-y-6">
      {/* Dropdowns Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Organization Type
          </label>
          <div className="relative">
            <select
              value={formData.organizationType}
              onChange={(e) => updateFormData({ organizationType: e.target.value })}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="">Select...</option>
              {organizationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Industry Types
          </label>
          <div className="relative">
            <select
              value={formData.industryTypes}
              onChange={(e) => updateFormData({ industryTypes: e.target.value })}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="">Select...</option>
              {industryTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Team Size
          </label>
          <div className="relative">
            <select
              value={formData.teamSize}
              onChange={(e) => updateFormData({ teamSize: e.target.value })}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="">Select...</option>
              {teamSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Year and Website Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Year of Establishment
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={formData.yearOfEstablishment}
              onChange={(e) => updateFormData({ yearOfEstablishment: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Company Website
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="Website url..."
              value={formData.companyWebsite}
              onChange={(e) => updateFormData({ companyWebsite: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-9"
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Company Vision */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Company Vision
        </label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <textarea
            placeholder="Tell us about your company vision..."
            value={formData.companyVision}
            onChange={(e) => updateFormData({ companyVision: e.target.value })}
            rows={4}
            className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none"
          />
          <div className="border-t border-gray-200 px-3 py-2 flex items-center gap-1 bg-gray-50">
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Bold className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Italic className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Underline className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Strikethrough className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Link className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <List className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <ListOrdered className="w-4 h-4 text-gray-500" />
            </button>
          </div>
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
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          Save & Next
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
