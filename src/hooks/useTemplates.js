import { useContext } from 'react'
import { TemplatesContext } from '../context/templates-context'

export function useTemplates() {
  const context = useContext(TemplatesContext)

  if (!context) {
    throw new Error('useTemplates must be used inside TemplatesProvider.')
  }

  return context
}
