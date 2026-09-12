export default function PriceTag({ price }) {
  return <span className="badge badge-price">₱{price.toLocaleString('en-PH')}</span>
}
