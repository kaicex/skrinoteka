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
        limit: 1000
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
        screenType: screen.fields.screenType?.map((st: any) => ({
          name: st.fields?.name || ''
        })) || [],
        thumbnail: screen.fields.thumbnail || false,
        order: screen.fields.order || undefined,
        createdAt: screen.sys.createdAt
      };
      
      screensByApp.get(appId)?.push(screenData);
    });

    // Сортируем экраны для каждого приложения
    screensByApp.forEach((screens, appId) => {
      const sortedScreens = screens.sort((a, b) => {
        const aOrder = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
        const bOrder = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
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
    return null;
  }

  try {

    
    const [appResponse, screensResponse, videosResponse] = await Promise.all([
      client.getEntry(appId),
      client.getEntries({
        content_type: 'screen',
        'fields.app.sys.id': appId,
        include: 2,
        limit: 1000
      }),
      client.getEntries({
        content_type: 'video',
        'fields.app.sys.id': appId,
        include: 2,
      })
    ]);


    if (!appResponse?.fields) {
      return null;
    }

    const fields = appResponse.fields as any;
    
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
        duplicatedScreen: screen.fields.duplicatedScreen || false,
        platform: screen.fields.platform?.map((p: any) => ({
          name: p.fields?.name || ''
        })) || [],
        flowType: screen.fields.flowType ? {
          name: screen.fields.flowType.fields?.name || '',
          order: screen.fields.flowType.fields?.order
        } : undefined,
        screenType: screen.fields.screenType?.map((st: any) => ({
          name: st.fields?.name || ''
        })) || [],
        thumbnail: screen.fields.thumbnail || false,
        order: (screen.fields.order !== undefined ? screen.fields.order : undefined),
        createdAt: screen.sys.createdAt
      }))
      .sort((a, b) => {
        const aOrder = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
        const bOrder = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    // Получаем уникальные типы флоу из экранов
    const uniqueFlowTypes = Array.from(new Set(
      screens
        .map(screen => screen.flowType?.name)
        .filter(Boolean)
    )).map(name => {
      const flowType = screens.find(s => s.flowType?.name === name)?.flowType;
      return {
        name,
        order: flowType?.order
      };
    });

    // Сортируем flowTypes по order
    const sortedFlowTypes = uniqueFlowTypes.sort((a, b) => {
      const aOrder = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
      const bOrder = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

    // Получаем уникальные типы экранов
    const uniqueScreenTypes = Array.from(new Set(
      screens
        .flatMap(screen => screen.screenType?.map((st: { name: string }) => st.name) || [])
        .filter(Boolean)
    )).map(name => ({ name }));



    // Получаем видео
    const videos = videosResponse.items.map((videoEntry: any) => {
      // Получаем URL видео из поля video
      let videoUrl = '';
      
      if (videoEntry.fields.video?.fields?.file?.url) {
        videoUrl = `https:${videoEntry.fields.video.fields.file.url}`;
      }

      return {
        id: videoEntry.sys.id,
        title: videoEntry.fields.title || '',
        video: {
          url: videoUrl
        },
        isDesktop: videoEntry.fields.isDesktop || false
      };
    }) || [];



    return {
      id: appId,
      name: fields.name || '',
      description: fields.description || '',
      category: fields.category?.fields?.name || '',
      logo: fields.app_logo?.fields?.file?.url
        ? {
            url: `https:${fields.app_logo.fields.file.url}`,
          }
        : undefined,
      screens,
      videos,
      flowTypes: sortedFlowTypes,
      screenTypes: uniqueScreenTypes,
      platforms: fields.platforms || [],
      date_updated: fields.dateUpdated || '',
    };
  } catch (error) {
    return null;
  }
}
