'use client'

import { useApp } from '@/hooks/use-apps'
import VideosView from './components/VideosView'

interface VideoPageProps {
  params: {
    platform: string;
    appId: string;
  };
}

export default function VideoPage({ params }: VideoPageProps) {
  const { data: app, isLoading } = useApp(params.appId)

  if (isLoading || !app) {
    return null
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-semibold text-zinc-900">Видео</h2>
      {app.videos && app.videos.length > 0 ? (
        <VideosView videos={app.videos} appName={app.name} />
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-500">Видео отсутствуют</p>
        </div>
      )}
    </div>
  )
}
