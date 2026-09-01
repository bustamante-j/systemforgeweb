import { useEffect, useRef, useState } from 'react'

export default function Reveal({ as: Tag = 'div', children, className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8%' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      className={['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')}
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
