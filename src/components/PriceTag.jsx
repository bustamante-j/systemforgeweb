import { Tag } from 'lucide-react'

export default function PriceTag({ price }) {
  return (
    <span className="price-tag">
      <Tag aria-hidden="true" size={12} strokeWidth={2} />
      ₱{price.toLocaleString('en-PH')}
    </span>
  )
}
