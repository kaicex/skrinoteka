export interface Screen {
  id: string;
  name: string;
  title?: string;
  image: {
    url: string;
  };
  platform: Array<{
    name: string;
  }>;
  flowType?: {
    name: string;
  };
  thumbnail?: boolean;
  order?: number;
  createdAt: string;
  isDesktop?: boolean;
}

export interface App {
  id: string;
  name: string;
  category: string;
  description?: string;
  screens: Screen[];
  logo?: {
    url: string;
  };
  flowTypes?: Array<{
    name: string;
  }>;
  date_updated?: string;
}

export interface AppPageProps {
  params: {
    platform: string;
    appId: string;
  };
  searchParams: {
    tab?: string;
    flowType?: string;
  };
}
