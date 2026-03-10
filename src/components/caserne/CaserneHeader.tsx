import { MapPin } from "lucide-react"
import type { CaserneDetails } from "@/types/candidature"

type Props = {
  caserne: CaserneDetails
}

export function CaserneHeader({ caserne }: Props) {
  return (
    <div className="bg-[#EAF1F9] rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-[#132E49]">{caserne.name}</h2>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
          {caserne.label}
        </p>
        <div className="flex items-center gap-2 mt-4 text-[#132E49]">
          <MapPin size={16} />
          <span className="text-sm font-bold">{caserne.city}</span>
        </div>
      </div>
      <div className="bg-white/50 backdrop-blur-sm self-start md:self-center px-4 py-2 rounded-full">
        <span className="text-[#132E49] text-xs font-bold">
          À {caserne.distanceKm} Km du candidat
        </span>
      </div>
    </div>
  )
}
