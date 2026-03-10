import { FileIcon } from "lucide-react"
import type { RecentDocument } from "@/types/candidature"

type Props = {
  documents: RecentDocument[]
}

/* Icône SVG de téléchargement inline pour rester Server Component */
function DownloadIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Télécharger"
    >
      <path
        d="M10 12.5V3.33334"
        stroke="#132E49"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66663 9.16666L9.99996 12.5L13.3333 9.16666"
        stroke="#132E49"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6666 13.3333V15.8333C16.6666 16.2754 16.491 16.6993 16.1785 17.0118C15.8659 17.3244 15.442 17.5 15 17.5H5C4.55794 17.5 4.13402 17.3244 3.82145 17.0118C3.50889 16.6993 3.3333 16.2754 3.3333 15.8333V13.3333"
        stroke="#132E49"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DocumentList({ documents }: Props) {
  return (
    <div className="space-y-4">
      {documents.map((doc, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <FileIcon className="text-[#132E49]" size={20} />
            </div>
            <div>
              <p className="font-bold text-[#132E49] text-sm">{doc.name}</p>
              <p className="text-xs text-gray-400">
                {doc.size} • {doc.date}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={`Télécharger ${doc.name}`}
          >
            <DownloadIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
