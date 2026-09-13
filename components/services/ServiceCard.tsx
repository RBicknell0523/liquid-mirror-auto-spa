import { NeonButton } from "@/components/ui/NeonButton"

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
      className={`flex flex-col rounded-2xl p-7 bg-card border relative ${
        popular ? "border-electric glow-electric" : "border-subtle"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 bg-electric-gradient text-void text-xs font-extrabold tracking-wide px-3 py-1 rounded-md">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-heading text-xl font-bold mb-2 font-heading">{name}</h3>
      <p className="text-muted text-base leading-relaxed mb-5 flex-1">{teaser}</p>
      <div className="text-electric text-2xl font-extrabold mb-5">{priceLabel}</div>
      <NeonButton type="button" onClick={onViewDetails} className="rounded-lg py-3 text-center text-base">
        View Details
      </NeonButton>
    </div>
  )
}
