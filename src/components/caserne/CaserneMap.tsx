import { Card } from "@/components/ui/Card"
import type { CaserneDetails } from "@/types/candidature"

type Props = {
  caserne: CaserneDetails
}

export function CaserneMap({ caserne }: Props) {
  return (
    <Card className="rounded-[32px] p-8 border border-gray-100 shadow-sm bg-white overflow-hidden">
      <h3 className="text-lg font-bold text-[#132E49] mb-8">Localisation</h3>
      <div className="relative rounded-2xl overflow-hidden border border-gray-100">
        <div className="aspect-[16/9] w-full bg-[#E5E7EB]">
          <iframe
            src={caserne.mapEmbedUrl}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            title={`Carte — ${caserne.name}`}
          />
        </div>

        {/* Overlays de noms de quartiers */}
        {caserne.mapLabels?.top && (
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            {caserne.mapLabels.top.map((label) => (
              <span
                key={label}
                className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-500 uppercase"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {caserne.mapLabels?.watermark && (
          <div className="absolute bottom-8 right-8 pointer-events-none text-right">
            <p className="text-4xl font-black text-[#132E49]/10 uppercase select-none">
              {caserne.mapLabels.watermark}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
