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
