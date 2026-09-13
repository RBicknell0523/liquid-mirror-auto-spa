interface ServiceCardProps {
  name: string
  teaser: string
  priceLabel: string
  popular: boolean
  onViewDetails: () => void
}

// Placeholder card design — pending a replacement the user is sourcing separately.
export function ServiceCard({ name, teaser, priceLabel, popular, onViewDetails }: ServiceCardProps) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-6 bg-card border relative ${
        popular ? "border-electric glow-electric" : "border-subtle"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 bg-electric-gradient text-void text-xs font-extrabold tracking-wide px-3 py-1 rounded-md">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-heading text-lg font-bold mb-1.5 font-heading">{name}</h3>
      <p className="text-muted text-sm leading-relaxed mb-4 flex-1">{teaser}</p>
      <div className="text-electric text-xl font-extrabold mb-4">{priceLabel}</div>
      <button
        type="button"
        onClick={onViewDetails}
        className={`text-sm font-semibold text-center py-2.5 rounded-lg ${
          popular ? "bg-electric-gradient text-white" : "border border-default text-heading"
        }`}
      >
        View Details
      </button>
    </div>
  )
}
