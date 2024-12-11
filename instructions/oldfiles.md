app/broswse/page.tsx

"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { getApps } from '@/lib/utils'
import type { App } from '@/lib/types'
import { AppGrid } from '@/components/app-grid'
import { FlowTypeFilter } from '@/components/filters/flow-type-filter'
import { CategoryFilter } from '@/components/filters/category-filter'
import Fuse from 'fuse.js'
import { useSearchParams } from 'next/navigation'

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [selectedFlowType, setSelectedFlowType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  
  const selectedPlatform = searchParams.get('platform')?.toLowerCase() || 'ios'
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        if (!mounted) return
        setIsLoading(true)
        const fetchedApps = await getApps()
        if (!mounted) return
        setApps(fetchedApps)
      } catch {
        // Silent error handling
      } finally {
        if (!mounted) return
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [])

  const fuse = useMemo(() => {
    return new Fuse(apps, {
      keys: ['name', 'description'],
      threshold: 0.3,
      includeScore: true,
    })
  }, [apps])

  const filteredApps = useMemo(() => {
    if (searchQuery) {
      const results = fuse.search(searchQuery)
      return results.map(result => result.item)
    }

    return apps.filter(app => {
      const matchesCategory = selectedCategory === 'all' || 
        app.category.name === selectedCategory

      const hasMatchingScreen = (app.screens?.some(screen => {
        return screen.platform?.some(p => 
          p.name.toLowerCase() === selectedPlatform.toLowerCase()
        )
      })) ?? false

      const hasMatchingFlowType = (selectedFlowType === 'all' || 
        app.screens?.some(screen => {
          const matchesFlow = screen.flowType?.name === selectedFlowType
          const matchesPlatform = screen.platform?.some(p => 
            p.name.toLowerCase() === selectedPlatform.toLowerCase()
          )
          return matchesFlow && matchesPlatform
        })) ?? false

      const shouldShow = matchesCategory && hasMatchingScreen && 
        (selectedFlowType === 'all' || hasMatchingFlowType)

      return shouldShow
    })
  }, [apps, selectedPlatform, searchQuery, selectedFlowType, selectedCategory, fuse])

  return (
    <div className="min-h-screen text-gray-100">
      <div className="flex">
        <aside className="w-52 min-h-[calc(100vh-73px)] border-r border-gray-700">
          <div className="px-4 py-8">
            <div className="space-y-6">
              <div>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onChange={setSelectedCategory}
                  apps={apps}
                  vertical={false}
                />
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-2 text-gray-300">Flow Types</h3>
                <FlowTypeFilter
                  selectedFlowType={selectedFlowType}
                  onChange={setSelectedFlowType}
                  apps={apps}
                  vertical={true}
                />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">
              {searchQuery ? (
                `Found ${filteredApps.length} apps`
              ) : (
                `Explore ${filteredApps.length} ${selectedCategory !== 'all' ? `${selectedCategory} ` : ''}
                ${selectedFlowType !== 'all' ? `${selectedFlowType} ` : ''}${selectedPlatform} apps`
              )}
            </h1>
            <p className="text-xl mb-8 text-gray-400">updated weekly</p>
            <AppGrid apps={filteredApps} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  )
}


app/app-detail/[appId]/page.tsx

'use client';

import { notFound } from 'next/navigation';
import { getAppDetail } from '@/lib/app-detail';
import { AppHeader } from '@/components/app-detail/app-header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScreensTab } from '@/components/app-detail/screens-tab';
import { FlowsTab } from '@/components/app-detail/flows-tab';
import { useEffect, useState } from 'react';

interface AppDetailPageProps {
  params: {
    appId: string;
  };
}

const AppDetailPage = ({ params }: AppDetailPageProps) => {
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAppDetail(params.appId)
      .then((fetchedApp) => {
        if (!mounted) return;
        if (!fetchedApp) {
          notFound();
          return;
        }
        setApp(fetchedApp);
      })
      .catch((error) => {
        console.error('Failed to fetch app:', error);
        if (!mounted) return;
        notFound();
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.appId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!app) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Tabs defaultValue="screens" className="w-full flex flex-col lg:flex-row" >
        <div className="w-full lg:w-72 xl:w-80 2xl:w-96" >
          <AppHeader app={app} />
        </div>
        
        <main className="flex-1 px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 lg:py-8">
          <div className="mt-2">
            <TabsContent value="screens">
              <ScreensTab app={app} />
            </TabsContent>

            <TabsContent value="flows">
              <FlowsTab app={app} />
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </div>
  );
};

export default AppDetailPage;


lib/contentful.ts
import { createClient } from 'contentful';
import { LRUCache } from 'lru-cache'

// Check if we have the required environment variables
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.error('Missing required Contentful environment variables:',
    !spaceId ? 'NEXT_PUBLIC_CONTENTFUL_SPACE_ID' : '',
    !accessToken ? 'NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN' : ''
  );
}

// Create a dummy client for when credentials are missing
const dummyClient = {
  getEntries: async () => ({ items: [], total: 0, skip: 0, limit: 0 }),
};

// Create the appropriate client based on credentials
export const client = (spaceId && accessToken)
  ? createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    })
  : dummyClient; 

const cache = new LRUCache({
  max: 500, // Максимальное количество элементов
  ttl: 1000 * 60 * 5, // Время жизни кэша - 5 минут
})

export async function getContentfulData(query: string, variables?: Record<string, any>) {
  const cacheKey = `${query}${JSON.stringify(variables)}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const result = await fetchFromContentful(query, variables)
  cache.set(cacheKey, result)
  return result
} 

lib/types.ts
import type { EntryFields } from 'contentful';

// Базовые интерфейсы
export interface Category {
  id: string;
  name: string;
}

export interface FlowType {
  id: string;
  name: string;
  screens: Screen[];
  steps: Step[];
}

export interface Platform {
  id: string;
  name: string;
}

export interface ContentfulImage {
  fields: {
    file: {
      url: string;
    };
    title?: string;
  };
}

export interface Screen {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  flowTypes: FlowType[];
  platforms: Platform[];
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  screens: Screen[];
  group?: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  appLogo: {
    url: string;
    width: number;
    height: number;
  };
  platforms: Platform[];
  screens: Screen[];
  flowTypes: FlowType[];
}

export interface AppDetail {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  icon: {
    url: string;
    title: string;
  };
  websiteUrl?: string;
  screens: Screen[];
  flows: Flow[];
  totalScreens: number;
  totalFlows: number;
}

// Contentful типы
export interface ContentfulAppFields {
  name: EntryFields.Text;
  description: EntryFields.Text;
  app_logo?: {
    fields: {
      file: {
        url: string;
      };
      title?: string;
    };
  };
  category?: {
    sys: {
      id: string;
    };
    fields: {
      name: string;
    };
  };
  websiteUrl?: EntryFields.Text;
}

export interface ContentfulScreenFields {
  title?: EntryFields.Text;
  description?: EntryFields.Text;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  app: {
    sys: {
      id: string;
    };
  };
  flowType: {
    sys: {
      id: string;
    };
    fields: {
      name: string;
    };
  };
  platform: Array<{
    sys: {
      id: string;
    };
    fields: {
      name: string;
    };
  }>;
  order?: EntryFields.Number;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  screenId: string;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface FetchState<T> {
  data: T | null
  status: LoadingState
  error: Error | null
} 


lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { client } from './contentful'
import type { 
  App, 
  Screen,
  Category,
  ContentfulAppFields,
  ContentfulScreenFields,
} from './types'
import { ImageLoaderProps } from 'next/image';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function getApps(): Promise<App[]> {
  if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) {
    return [];
  }

  try {
    const [appsResponse, screensResponse] = await Promise.all([
      client.getEntries<ContentfulAppFields>({
        content_type: 'app',
        include: 2,
      }),
      client.getEntries<ContentfulScreenFields>({
        content_type: 'screen',
        include: 2,
      })
    ]);

    const screensByApp = new Map<string, Screen[]>();
    
    screensResponse.items.forEach((screen) => {
      const appId = screen.fields.app.sys.id;
      if (!screensByApp.has(appId)) {
        screensByApp.set(appId, []);
      }
      
      const screenData: Screen = {
        id: screen.sys.id,
        imageUrl: screen.fields.image?.fields?.file?.url 
          ? `https:${screen.fields.image.fields.file.url}`
          : '',
        flowType: {
          id: screen.fields.flowType?.sys?.id || '',
          name: screen.fields.flowType?.fields?.name || '',
        },
        platform: screen.fields.platform?.map(p => ({
          id: p.sys.id,
          name: p.fields.name as 'iOS' | 'Android' | 'Web',
        })) || [],
        appId
      };
      
      const screens = screensByApp.get(appId);
      if (screens) {
        screens.push(screenData);
      }
    });

    return appsResponse.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      description: item.fields.description,
      icon: {
        url: item.fields.app_logo?.fields?.file?.url 
          ? `https:${item.fields.app_logo.fields.file.url}`
          : '',
        title: item.fields.app_logo?.fields?.title || '',
      },
      category: item.fields.category 
        ? {
            id: item.fields.category.sys.id,
            name: item.fields.category.fields.name,
          }
        : { id: '', name: '' },
      platforms: [],
      websiteUrl: '',
      screens: screensByApp.get(item.sys.id) || []
    }));
  } catch (error) {
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/contentful/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

export function contentfulImageLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [
    `w=${width}`,
    `q=${quality || 75}`,
    'fm=webp'
  ];
  return `${src}?${params.join('&')}`;
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from './ui/card';
import { ImageIcon } from 'lucide-react';
import type { App } from '@/lib/types';
import { ApiResponse } from '@/lib/types';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isIconLoading, setIsIconLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const screenImages = app.screens?.slice(0, 3) || [];
  const currentImage = screenImages[currentImageIndex];

  const ImageDots = () => (
    <div 
      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      onClick={(e) => e.preventDefault()}
    >
      {screenImages.map((_, index) => (
        <button
          key={index}
          onMouseEnter={() => setCurrentImageIndex(index)}
          onFocus={() => setCurrentImageIndex(index)}
          className={`w-2 h-2 rounded-full transition-all duration-200
            ${currentImageIndex === index 
              ? 'bg-white scale-110' 
              : 'bg-white/50 hover:bg-white/75'
            }`}
          aria-label={`View screenshot ${index + 1}`}
        />
      ))}
    </div>
  );

  const AppIcon = () => (
    <div className="relative w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-800">
      {app.icon?.url ? (
        <>
          {isIconLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          <Image
            src={app.icon.url}
            alt={app.icon.title || app.name}
            fill
            className={`object-contain transition-opacity duration-300 ${
              isIconLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="48px"
            priority
            onLoad={() => setIsIconLoading(false)}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-400">
            {app.name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Link 
      href={`/app-detail/${app.id}`} 
      className="block"
    >
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative w-full pt-[177.78%] bg-gray-800 group">
          {currentImage?.imageUrl && !imageError ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}
              <Image
                src={currentImage.imageUrl}
                alt={`${app.name} screenshot ${currentImageIndex + 1}`}
                fill
                className={`object-cover transition-all duration-300 absolute top-0 left-0 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority
                onLoad={() => setIsImageLoading(false)}
                onError={() => setImageError(true)}
              />
              
              {screenImages.length > 1 && <ImageDots />}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <ImageIcon className="w-16 h-16 text-gray-600" />
            </div>
          )}
        </div>
        
        <CardHeader className="space-y-2">
          <div className="flex items-center space-x-3">
            <AppIcon />
            <div>
              <h3 className="font-semibold text-lg">{app.name}</h3>
              <p className="text-sm text-muted-foreground">
                {app.category?.name || 'Uncategorized'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
} 

import { App } from "@/lib/types"
import { AppCard } from "./app-card"
import { EmptyState } from './empty-state'
import { Card, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface AppGridProps {
  apps: App[]
  isLoading?: boolean
  className?: string
}

function AppCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative w-full pt-[177.78%] bg-gray-800">
        <Skeleton className="absolute inset-0 rounded-t-3xl" />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-3xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-2xl" />
            <Skeleton className="h-4 w-24 rounded-2xl" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export function AppGrid({ apps, isLoading = false, className = '' }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!apps.length) {
    return <EmptyState />
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 ${className}`}>
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  )
} 