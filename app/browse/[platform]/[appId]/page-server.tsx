import { getAppById } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import { AppPageProps } from './types';

export async function AppPageServer({ params }: AppPageProps) {
  const app = await getAppById(params.appId);
  
  if (!app) {
    console.error('App not found:', params.appId);
    notFound();
  }

  return {
    app,
  };
}
