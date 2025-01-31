import { createClient } from 'contentful';
import { App } from './types';

if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
  throw new Error('NEXT_PUBLIC_CONTENTFUL_SPACE_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN is not defined');
}

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

export async function getApps(): Promise<App[]> {
  try {
    const [appsResponse, screensResponse] = await Promise.all([
      client.getEntries({
        content_type: 'app',
        include: 2,
      }),
      client.getEntries({
        content_type: 'screen',
        include: 2,
      })
    ]);

    // Проверяем наличие url при маппинге
    const screensByApp = new Map<string, any[]>();
    
    // Сначала собираем все экраны для каждого приложения
    screensResponse.items.forEach((screen: any) => {
      const appId = screen.fields.app?.sys?.id;
      if (!appId || !screen.fields.image?.fields?.file?.url) return;
      
      if (!screensByApp.has(appId)) {
        screensByApp.set(appId, []);
      }
      
      const screenData = {
        id: screen.sys.id,
        title: screen.fields.title,
        image: {
          url: `https:${screen.fields.image.fields.file.url}`
        },
        isDesktop: screen.fields.isDesktop || false,
        platform: screen.fields.platform?.map((p: any) => ({
          name: p.fields?.name || ''
        })) || [],
        flowType: screen.fields.flowType ? {
          name: screen.fields.flowType.fields?.name || ''
        } : undefined,
        thumbnail: screen.fields.thumbnail || false,
        order: screen.fields.order || undefined,
        createdAt: screen.sys.createdAt
      };
      
      screensByApp.get(appId)?.push(screenData);
    });

    // Сортируем экраны для каждого приложения
    screensByApp.forEach((screens, appId) => {
      const sortedScreens = screens.sort((a, b) => {
        // Если у обоих есть order, сортируем по нему
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Если order есть только у одного, он идет в конец
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        // Если order нет у обоих, сортируем по дате создания (старые в начале)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      screensByApp.set(appId, sortedScreens);
    });

    return appsResponse.items.map((item: any) => {
      const fields = item.fields;
      const appId = item.sys.id;
      
      return {
        id: appId,
        name: fields.name || '',
        description: fields.description,
        category: fields.category?.fields?.name || '',
        logo: fields.app_logo?.fields?.file 
          ? {
              url: `https:${fields.app_logo.fields.file.url}`
            }
          : undefined,
        screens: screensByApp.get(appId) || []
      };
    });
  } catch (error) {
    console.error('Error fetching apps:', error);
    return [];
  }
}

export async function getDesktopApps(): Promise<App[]> {
  const apps = await getApps();
  return apps.filter(app => 
    app.screens.some(screen => screen.isDesktop)
  );
}

export async function getMobileApps(): Promise<App[]> {
  const apps = await getApps();
  return apps.filter(app => 
    app.screens.some(screen => !screen.isDesktop)
  );
}

export async function getAppById(appId: string | undefined): Promise<App | null> {
  if (!appId || typeof appId !== 'string') {
    console.error('Error fetching app: invalid appId:', appId);
    return null;
  }

  try {
    console.log('Fetching app data for ID:', appId);
    
    const [appResponse, screensResponse, videosResponse] = await Promise.all([
      client.getEntry(appId),
      client.getEntries({
        content_type: 'screen',
        'fields.app.sys.id': appId,
        include: 2,
      }),
      client.getEntries({
        content_type: 'video',
        'fields.app.sys.id': appId,
        include: 2,
      })
    ]);

    console.log('Contentful responses:', {
      appFields: appResponse.fields,
      videosTotal: videosResponse.total,
      videosItems: videosResponse.items.length,
      videosResponse: JSON.stringify(videosResponse, null, 2)
    });

    // Детально логируем каждый элемент videosResponse
    videosResponse.items.forEach((item: any, index: number) => {
      console.log(`Video item ${index}:`, {
        sys: item.sys,
        fields: item.fields,
        rawItem: JSON.stringify(item, null, 2)
      });
    });

    if (!appResponse?.fields) {
      console.error('App response is invalid:', appResponse);
      return null;
    }

    const fields = appResponse.fields as any;
    console.log('Raw Contentful response:', {
      fields,
      videos: fields.videos,
      videosResponse
    });
    
    // Фильтруем и сортируем экраны
    const screens = screensResponse.items
      .filter((screen: any) => screen.fields?.image?.fields?.file?.url)
      .map((screen: any) => ({
        id: screen.sys.id,
        name: screen.fields.title || 'Untitled Screen',
        title: screen.fields.title,
        image: {
          url: `https:${screen.fields.image.fields.file.url}`
        },
        isDesktop: screen.fields.isDesktop || false,
        platform: screen.fields.platform?.map((p: any) => ({
          name: p.fields?.name || ''
        })) || [],
        flowType: screen.fields.flowType ? {
          name: screen.fields.flowType.fields?.name || ''
        } : undefined,
        thumbnail: screen.fields.thumbnail || false,
        order: screen.fields.order || 0,
        createdAt: screen.sys.createdAt
      }))
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    // Получаем уникальные типы флоу из экранов
    const uniqueFlowTypes = Array.from(new Set(
      screens
        .map(screen => screen.flowType?.name)
        .filter(Boolean)
    )).map(name => ({ name }));

    // Получаем видео
    const videos = videosResponse.items.map((videoEntry: any) => {
      console.log('Video entry fields:', {
        fields: videoEntry.fields,
        videoField: videoEntry.fields.video,
        videoUrl: videoEntry.fields.video?.fields?.file?.url
      });

      // Получаем URL видео из поля video
      let videoUrl = '';
      
      if (videoEntry.fields.video?.fields?.file?.url) {
        videoUrl = `https:${videoEntry.fields.video.fields.file.url}`;
      }

      console.log('Determined video URL:', videoUrl);

      return {
        id: videoEntry.sys.id,
        title: videoEntry.fields.title || '',
        video: {
          url: videoUrl
        },
        isDesktop: videoEntry.fields.isDesktop || false
      };
    }) || [];

    console.log('Final processed videos:', JSON.stringify(videos, null, 2));

    return {
      id: appId,
      name: fields.name || '',
      description: fields.description || '',
      category: fields.category?.fields?.name || '',
      logo: fields.app_logo?.fields?.file 
        ? {
            url: `https:${fields.app_logo.fields.file.url}`
          }
        : undefined,
      screens,
      videos,
      flowTypes: uniqueFlowTypes,
      date_updated: fields.dateUpdated || null
    };
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}
