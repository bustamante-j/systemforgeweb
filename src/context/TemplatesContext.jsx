import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchPublishedTemplates } from '../services/templates'
import { TemplatesContext } from './templates-context'

export function TemplatesProvider({ children }) {
  const [templates, setTemplates] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    fetchPublishedTemplates()
      .then((nextTemplates) => {
        if (!isActive) return
        setTemplates(nextTemplates)
        setStatus('success')
      })
      .catch((loadError) => {
        if (!isActive) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load templates.')
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [])

  const retry = useCallback(async () => {
    setStatus('loading')
    setError('')

    try {
      const nextTemplates = await fetchPublishedTemplates()
      setTemplates(nextTemplates)
      setStatus('success')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load templates.')
      setStatus('error')
    }
  }, [])

  const value = useMemo(
    () => ({ error, retry, status, templates }),
    [error, retry, status, templates],
  )

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}
