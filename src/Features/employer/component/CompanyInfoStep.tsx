import { useRef, useState } from 'react'
import { Upload, Facebook, Instagram, Plus, X, Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered } from 'lucide-react'
import type { FormData } from '../App'

interface CompanyInfoStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
}

const socialPlatforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube']

export function CompanyInfoStep({ formData, updateFormData, onNext }: CompanyInfoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      updateFormData({ logo: e.dataTransfer.files[0] })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ logo: e.target.files[0] })
    }
  }

  const addSocialLink = () => {
    updateFormData({
      socialLinks: [...formData.socialLinks, { platform: 'Facebook', url: '' }]
    })
  }

  const removeSocialLink = (index: number) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index)
    updateFormData({ socialLinks: newLinks })
  }

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...formData.socialLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    updateFormData({ socialLinks: newLinks })
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />
      default:
        return <Link className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Logo Upload */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Logo</h3>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              placeholder="Upload company logo"
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 font-medium hover:underline"
                >
                  Browse photo
                </button>
                {' '}or drop here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported format: JPEG, PNG. Max photo size 5 MB.
              </p>
              {formData.logo && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {formData.logo.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Social Link {index + 1}
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    className="appearance-none border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {socialPlatforms.map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {getPlatformIcon(link.platform)}
                  </div>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="url"
                    placeholder="Profile link/url..."
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSocialLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Social Link
          </button>
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Company name
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => updateFormData({ companyName: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* About Us */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          About Us
        </label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <textarea
            placeholder="Write down about your company here. Let the candidate know who we are..."
            value={formData.aboutUs}
            onChange={(e) => updateFormData({ aboutUs: e.target.value })}
            rows={4}
            className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none"
          />
          <div className="border-t border-gray-200 px-3 py-2 flex items-center gap-1 bg-gray-50">
            <button type="button" title="Bold" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Bold className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Italic" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Italic className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Underline" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Underline className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Strikethrough" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Strikethrough className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Add Link" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <Link className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Bullet List" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <List className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" title="Numbered List" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
              <ListOrdered className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
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
