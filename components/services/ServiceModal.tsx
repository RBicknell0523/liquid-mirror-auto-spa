import { NeonButton } from "@/components/ui/NeonButton"

interface PriceRow {
  label: string
  value: number
}

interface ServiceModalProps {
  categoryLabel: string
  name: string
  description: string
  disclaimer?: string
  priceRows: PriceRow[] | null
  onClose: () => void
}

export function ServiceModal({
  categoryLabel,
  name,
  description,
  disclaimer,
  priceRows,
  onClose,
}: ServiceModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border border-subtle rounded-2xl max-w-lg w-full p-8 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-5 text-faint text-lg"
        >
          &times;
        </button>
        <div className="text-electric-light text-xs tracking-widest mb-2">{categoryLabel}</div>
        <h3 className="text-heading text-2xl font-extrabold mb-3 font-heading">{name}</h3>
        <p className="text-body text-sm leading-relaxed mb-5">{description}</p>
        {disclaimer && <p className="text-faint text-xs leading-relaxed mb-5 italic">{disclaimer}</p>}
        {priceRows && priceRows.length > 0 ? (
          <div className="border-t border-subtle pt-4">
            {priceRows.map((row, index) => (
              <div
                key={row.label}
                className={`flex justify-between py-2 text-sm text-nav ${
                  index > 0 ? "border-t border-subtle" : ""
                }`}
              >
                <span>{row.label}</span>
                <span className="text-electric font-bold">${row.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-subtle pt-4 text-sm text-nav">Contact for Pricing</div>
        )}
        <NeonButton type="button" className="w-full rounded-lg py-3 mt-5 text-center">
          Book This Service
        </NeonButton>
      </div>
    </div>
  )
}
