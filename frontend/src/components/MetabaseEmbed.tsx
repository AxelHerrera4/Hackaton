import { useEffect, useState } from 'react'

interface MetabaseEmbedProps {
  dashboardId?: number;
  questionId?: number;
  type: 'dashboard' | 'question';
  params?: Record<string, any>;
}

export default function MetabaseEmbed({ dashboardId, questionId, type, params = {} }: MetabaseEmbedProps) {
  const [iframeUrl, setIframeUrl] = useState<string>('')

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_METABASE_URL || 'http://localhost:3030'
    const paramString = new URLSearchParams(params).toString()
    
    if (type === 'dashboard' && dashboardId) {
      setIframeUrl(`${baseUrl}/embed/dashboard/${dashboardId}?${paramString}`)
    } else if (type === 'question' && questionId) {
      setIframeUrl(`${baseUrl}/embed/question/${questionId}?${paramString}`)
    }
  }, [dashboardId, questionId, type, params])

  if (!iframeUrl) {
    return (
      <div className="metabase-placeholder">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando gráficos de Metabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="metabase-embed">
      <iframe
        src={iframeUrl}
        frameBorder="0"
        width="100%"
        height="600"
        allowTransparency
        title="Metabase Dashboard"
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      />
      <div className="metabase-footer">
        <p className="text-sm text-gray">
          📊 Dashboard powered by Metabase | 
          <a 
            href={iframeUrl.replace('/embed/', '/dashboard/')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="metabase-link"
          >
            Ver en pantalla completa
          </a>
        </p>
      </div>
    </div>
  )
}