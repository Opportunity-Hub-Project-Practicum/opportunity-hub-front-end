import { User, FileText, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepTabsProps {
  steps: string[]
  currentStep: number
  onStepClick: (step: number) => void
}

const stepIcons = [User, FileText, Phone]

export function StepTabs({ steps, currentStep, onStepClick }: StepTabsProps) {
  return (
    <div className="flex items-center justify-center gap-8 border-b border-gray-200">
      {steps.map((step, index) => {
        const Icon = stepIcons[index]
        const isActive = currentStep === index
        const isCompleted = currentStep > index

        return (
          <button
            key={step}
            onClick={() => onStepClick(index)}
            className={cn(
              'flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-colors relative',
              isActive
                ? 'text-blue-500'
                : isCompleted
                ? 'text-gray-700'
                : 'text-gray-400'
            )}
          >
            <Icon className="w-4 h-4" />
            {step}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        )
      })}
    </div>
  )
}
