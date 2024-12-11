import { getAppById } from '@/lib/contentful';
import { Container } from '@/components/ui/container';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AppTabs } from './components/AppTabs';
import { TabContent } from './components/TabContent';

interface AppPageProps {
  params: {
    platform: string;
    appId: string;
  };
  searchParams: {
    tab?: string;
  };
}

interface App {
  name: string;
  screens: any[];
  flowTypes?: Array<{ name: string }>;
  // другие поля...
}

export default async function AppPage({ params, searchParams }: AppPageProps) {
  const app = await getAppById(params.appId);
  
  const currentTab = searchParams.tab || 'flows';

  // Check if the app matches the current platform
  if (app?.screens && app.screens.length > 0) {
    const isPlatformMatch = app.screens.some(screen =>
      screen.platform?.some(p => {
        if (params.platform === 'mobile') {
          return ['ios', 'android'].includes(p.name.toLowerCase());
        } else if (params.platform === 'desktop') {
          return ['web', 'desktop'].includes(p.name.toLowerCase());
        }
        return false;
      })
    );

    if (!isPlatformMatch) {
      notFound();
    }
  }

  if (!app) {
    notFound();
  }

  // Получаем уникальные платформы
  const platforms = Array.from(new Set(
    app.screens.flatMap(screen => 
      screen.platform?.map(p => p.name) || []
    )
  ));

  return (
    <Container size="xl">
      <div className="flex flex-col md:flex-row gap-6 pt-8 min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-44 shrink-0">
          
          <div className="md:sticky md:top-[64px] flex flex-col min-h-[calc(100vh-64px)] pb-16">
            <div className="space-y-6">
              {/* App Info */}
              <div className="flex flex-col gap-4">
                {/* Mobile Back Button */}
                <div className="md:hidden flex items-center gap-4">
                  <Link 
                    href={`/browse/${params.platform}`}
                    className="flex items-center text-zinc-500 hover:text-zinc-500"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-semibold">{app.name}</h1>
                    <div className="text-sm text-zinc-500 -mt-1">{app.category}</div>
                  </div>
                </div>

                {app.logo?.url && (
                  <div className="rounded-3xl w-full aspect-square flex-shrink-0 bg-zinc-100 flex items-center justify-center">
                    <Image
                      src={app.logo.url}
                      alt={`${app.name} logo`}
                      width={140}
                      height={140}
                      className="object-contain max-w-full max-h-full rounded-3xl"
                    />
                  </div>
                )}
                <div>
                  <h1 className="hidden md:block text-2xl font-semibold">{app.name}</h1>
                  <div className="hidden md:block text-sm text-zinc-500 mt-1">{app.category}</div>
                </div>

                {/* Navigation Tabs */}
                <AppTabs 
                  currentTab={currentTab}
                  platform={params.platform}
                  appId={params.appId}
                />

                {/* About */}
                {app.description && (
                  <div>
                    <div className="text-xs text-zinc-500">О приложении</div>
                    <div className="text-sm">{app.description}</div>
                  </div>
                )}

                {/* Stats */}
                <div>
                  <div className="text-xs text-zinc-500">Всего экранов</div>
                  <div className="text-sm">{app.screens.length}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-500">Всего потоков</div>
                  <div className="text-sm">{app.flowTypes?.length}</div>
                </div>

                {/* Platforms */}
                <div>
                  <div className="text-xs text-zinc-500">Платформы</div>
                  <div className="text-sm">{platforms.join(", ")}</div>
                </div>

                {/* Flow Types */}
                {app.flowTypes && app.flowTypes.length > 0 && (
                  <div>
                    <div className="text-xs text-zinc-500">Типы потоков</div>
                    <div className="text-sm">
                      {app.flowTypes.map(flowType => flowType.name).join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <TabContent 
            currentTab={currentTab}
            initialScreens={app.screens}
            initialFlowTypes={app.flowTypes || []}
            initialFlowScreens={app.screens}
            appName={app.name}
          />
        </main>
      </div>
    </Container>
  );
}
