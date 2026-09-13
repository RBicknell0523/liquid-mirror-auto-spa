import { contactInfo } from "@/data/contactInfo"

const ROWS = [
  { icon: "☎", label: contactInfo.phone, note: contactInfo.phoneNote },
  { icon: "✉", label: contactInfo.email, note: contactInfo.emailNote },
  { icon: "●", label: contactInfo.serviceArea, note: contactInfo.serviceAreaNote },
  { icon: "⏰", label: contactInfo.hours, note: contactInfo.hoursNote },
]

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      {ROWS.map((row) => (
        <div key={row.label} className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-lg border border-default flex items-center justify-center text-electric shrink-0">
            {row.icon}
          </div>
          <div>
            <div className="text-heading text-sm font-semibold">{row.label}</div>
            <div className="text-faint text-xs">{row.note}</div>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        {contactInfo.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="w-9 h-9 rounded-full border border-default flex items-center justify-center text-nav text-xs"
          >
            {social.label}
          </a>
        ))}
      </div>
    </div>
  )
}
