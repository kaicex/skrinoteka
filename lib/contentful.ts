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
        platform: screen.fields.platform?.map((p: any) => ({
          name: p.fields?.name || ''
        })) || [],
        flowType: screen.fields.flowType ? {
          name: screen.fields.flowType.fields?.name || ''
        } : undefined,
        thumbnail: screen.fields.thumbnail || false
      };
      
      screensByApp.get(appId)?.push(screenData);
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

export async function getAppById(appId: string): Promise<App | null> {
  try {
    const appResponse = await client.getEntry(appId, {
      include: 2
    });

    const screensResponse = await client.getEntries({
      content_type: 'screen',
      'fields.app.sys.id': appId,
      include: 2,
    });

    if (!appResponse) {
      return null;
    }

    const fields = appResponse.fields as any;
    
    // Get unique flow types from screens
    const uniqueFlowTypes = Array.from(new Set(
      screensResponse.items
        .map((screen: any) => screen.fields.flowType?.fields?.name)
        .filter(Boolean)
    )).map(name => ({ name }));
    
    const screens = screensResponse.items
      .filter((screen: any) => screen.fields.image?.fields?.file?.url)  // Фильтруем скрины без изображений
      .map((screen: any) => ({
        id: screen.sys.id,
        name: screen.fields.title || '',
        image: {
          url: `https:${screen.fields.image.fields.file.url}`
        },
        platform: screen.fields.platform?.map((p: any) => ({
          name: p.fields?.name || ''
        })) || [],
        flowType: screen.fields.flowType ? {
          name: screen.fields.flowType.fields?.name || ''
        } : undefined
      }));

    const result = {
      id: appId,
      name: fields.name || '',
      description: fields.description || '',
      category: fields.category?.fields?.name || '',
      logo: fields.app_logo?.fields?.file 
        ? {
            url: `https:${fields.app_logo.fields.file.url}`
          }
        : undefined,
      screens: screens,
      flowTypes: uniqueFlowTypes,
      date_updated: fields.dateUpdated || null
    };

    return result;

  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}
