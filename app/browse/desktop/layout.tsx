import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Десктоп приложения - Обзор',
  description: 'Просмотр десктоп приложений и вдохновение для вашего следующего проекта.'
};

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
