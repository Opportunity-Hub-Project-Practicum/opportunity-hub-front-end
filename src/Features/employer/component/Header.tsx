import { Briefcase } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-gray-100 px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">MyJob</span>
      </div>
    </header>
  )
}
