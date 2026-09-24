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
  onAddToBooking: () => void
}

export function ServiceModal({
  categoryLabel,
  name,
  description,
  disclaimer,
  priceRows,
  onClose,
  onAddToBooking,
}: ServiceModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card border border-subtle rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-9 relative my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-5 text-faint text-xl"
        >
          &times;
        </button>
        <div className="text-electric-light text-sm tracking-widest mb-2">{categoryLabel}</div>
        <h3 className="text-heading text-2xl sm:text-3xl font-extrabold mb-4 font-heading">{name}</h3>
        <p className="text-body text-base leading-relaxed mb-5">{description}</p>
        {disclaimer && <p className="text-faint text-sm leading-relaxed mb-5 italic">{disclaimer}</p>}
        {priceRows && priceRows.length > 0 ? (
          <div className="border-t border-subtle pt-4">
            {priceRows.map((row, index) => (
              <div
                key={row.label}
                className={`flex justify-between py-2.5 text-base text-nav ${
                  index > 0 ? "border-t border-subtle" : ""
                }`}
              >
                <span>{row.label}</span>
                <span className="text-electric font-bold">${row.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-subtle pt-4 text-base text-nav">Contact for Pricing</div>
        )}
        <NeonButton
          type="button"
          onClick={onAddToBooking}
          className="w-full rounded-lg py-3.5 mt-5 text-center text-base"
        >
          Add to Booking
        </NeonButton>
      </div>
    </div>
  )
}
