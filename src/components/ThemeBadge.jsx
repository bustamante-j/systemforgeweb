import { Moon, Sun } from 'lucide-react'

export default function ThemeBadge({ theme }) {
  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <span className={theme === 'dark' ? 'theme-badge theme-badge-dark' : 'theme-badge'}>
      <Icon aria-hidden="true" size={12} strokeWidth={2} />
      {theme === 'dark' ? 'Dark' : 'Light'}
    </span>
  )
}
