import { Clock } from 'lucide-react'

export default function ComingSoonBadge() {
  return (
    <span className="status-badge">
      <Clock aria-hidden="true" size={12} strokeWidth={2} />
      Coming soon
    </span>
  )
}
