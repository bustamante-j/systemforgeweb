import { Sparkles } from 'lucide-react'

export default function PremiumBadge() {
  return (
    <span className="premium-badge">
      <Sparkles aria-hidden="true" size={12} strokeWidth={2} />
      Premium
    </span>
  )
}
