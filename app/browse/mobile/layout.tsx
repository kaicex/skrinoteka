import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мобильные приложения - Обзор',
  description: 'Просмотр вдохновение для вашего следующего проекта.'
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
