import { contactInfo } from "@/data/contactInfo"
import { NeonButton } from "@/components/ui/NeonButton"

const ROWS = [
  { icon: "☎", label: contactInfo.phone, note: contactInfo.phoneNote },
  { icon: "✉", label: contactInfo.email, note: contactInfo.emailNote },
  { icon: "⏰", label: contactInfo.hours, note: contactInfo.hoursNote },
]

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      {ROWS.map((row) => (
        <div key={row.label} className="flex gap-4 items-start">
          <div className="w-11 h-11 rounded-lg border border-default flex items-center justify-center text-electric text-lg shrink-0">
            {row.icon}
          </div>
          <div>
            <div className="text-heading text-base font-semibold">{row.label}</div>
            <div className="text-faint text-sm">{row.note}</div>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        {contactInfo.socials.map((social) => (
          <NeonButton
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="rounded-full w-14 h-14 p-0 text-base shrink-0"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {social.label}
          </NeonButton>
        ))}
      </div>
    </div>
  )
}
