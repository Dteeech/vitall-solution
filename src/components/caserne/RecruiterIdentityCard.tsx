import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Recruiter } from "@/types/candidature"

type Props = {
  recruiter: Pick<
    Recruiter,
    "firstName" | "lastName" | "email" | "caserne" | "avatarSrc" | "initials"
  >
}

export function RecruiterIdentityCard({ recruiter }: Props) {
  const recruiterInfoRows = [
    { label: "Nom", value: recruiter.lastName || "-" },
    { label: "Prénom", value: recruiter.firstName || "-" },
    { label: "Adresse email", value: recruiter.email || "-" },
    { label: "Caserne", value: recruiter.caserne || "-" },
  ]

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="rounded-[40px] overflow-hidden bg-[#FFF0E4] shadow-sm border border-gray-100 h-full">
        <div className="p-8 pb-4 flex flex-col items-center">
          <h2 className="text-base font-bold text-[#132E49] mb-8">Votre recruteur</h2>
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4">
            <Avatar className="w-full h-full">
              <AvatarImage src={recruiter.avatarSrc} />
              <AvatarFallback className="bg-[#132E49] text-white font-bold">
                {recruiter.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Bloc info sur fond orange */}
        <div className="bg-[#EA8B48] p-6 m-3 rounded-[32px] space-y-4 text-white">
          {recruiterInfoRows.map((info) => (
            <div key={info.label} className="text-sm">
              <span className="font-bold">{info.label} : </span>
              <span className="font-medium opacity-90">{info.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
