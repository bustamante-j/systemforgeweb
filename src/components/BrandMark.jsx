// The SF symbol from the logo file, inlined so it can take currentColor and be
// animated on load. Geometry is unchanged — only the fills are now tokens
// instead of the baked gradients the standalone SVG carries.
export default function BrandMark({ className = 'brand-mark' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="8 2 116 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="brand-mark-s"
        d="M13 28 48 6l15 9-34 22 35 20v29L46 98 11 78l15-10 22 12V65L13 45z"
        fill="currentColor"
      />
      <path className="brand-mark-f" d="m53 29 16-12h52L108 37H72l-19 13z" fill="#5b95ff" />
      <path
        className="brand-mark-f"
        d="M66 52h43L96 71H83v17L66 99z"
        fill="#5b95ff"
        opacity="0.55"
      />
    </svg>
  )
}
