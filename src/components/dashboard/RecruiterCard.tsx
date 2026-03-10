import { Mail, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/Card"
import type { Recruiter } from "@/types/candidature"

type Props = {
  recruiter: Recruiter
}

export function RecruiterCard({ recruiter }: Props) {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-[#EA8B48] text-white">
      <h2 className="text-lg font-bold mb-6">Votre recruteur</h2>
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full border-4 border-white/20 p-1 mb-4 overflow-hidden">
          <Avatar className="w-full h-full">
            <AvatarImage src={recruiter.avatarSrc} />
            <AvatarFallback className="bg-white/10 text-xl font-bold">
              {recruiter.initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <h3 className="text-xl font-bold mb-1">
          {recruiter.lastName} {recruiter.firstName}
        </h3>
        {recruiter.grade && (
          <p className="text-white/80 text-sm mb-6">{recruiter.grade}</p>
        )}

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <Mail size={18} className="shrink-0" />
            <span className="text-sm truncate">{recruiter.email}</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <MapPin size={18} className="shrink-0" />
            <span className="text-sm truncate">{recruiter.caserne}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
