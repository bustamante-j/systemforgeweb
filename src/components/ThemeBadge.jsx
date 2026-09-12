import { Moon, Sun } from 'lucide-react'

export default function ThemeBadge({ theme }) {
  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <span className={theme === 'dark' ? 'badge badge-theme-dark' : 'badge'}>
      <Icon aria-hidden="true" size={11} strokeWidth={1.5} />
      {theme === 'dark' ? 'Dark' : 'Light'}
    </span>
  )
}
