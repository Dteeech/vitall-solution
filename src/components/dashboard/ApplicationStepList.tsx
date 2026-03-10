import { CheckCircle2, Clock } from "lucide-react"
import type { ApplicationStep } from "@/types/candidature"

type Props = {
  steps: ApplicationStep[]
}

export function ApplicationStepList({ steps }: Props) {
  return (
    <div className="relative space-y-6">
      {/* Ligne verticale */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4 relative">
          <div
            className={`z-10 w-6 h-6 rounded-half flex items-center justify-center ${step.status === "completed"
                ? "bg-[#132E49] text-white"
                : step.status === "current"
                  ? "bg-orange-100 text-[#EA8B48] border-2 border-[#EA8B48]"
                  : "bg-white border-2 border-gray-200"
              }`}
          >
            {step.status === "completed" ? (
              <CheckCircle2 size={14} />
            ) : step.status === "current" ? (
              <Clock size={14} />
            ) : null}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3
                className={`font-bold ${step.status === "current" ? "text-[#132E49]" : "text-gray-900"
                  }`}
              >
                {step.title}
              </h3>
              <span
                className={`text-sm ${step.status === "completed"
                    ? "text-green-500 font-medium"
                    : "text-gray-400"
                  }`}
              >
                {step.date}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
