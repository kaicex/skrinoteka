'use client';

import { useDesktopApps } from '@/hooks/use-apps';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { App } from '@/lib/types';
import Link from 'next/link';
import { DesktopAppCard } from '@/components/browse/desktop-app-card';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DesktopBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedFlowType, setSelectedFlowType] = useState(searchParams.get('flowType') || "Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [flowTypes, setFlowTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: apps = [], isLoading } = useDesktopApps();

  useEffect(() => {
    if (!apps.length) return;

    // Get unique categories
    const categoriesSet = new Set(apps.map(app => app.category));
    const uniqueCategories = ["Все", ...Array.from(categoriesSet)].filter(Boolean);
    setCategories(uniqueCategories);

    // Get unique flow types from desktop screens only
    const flowTypesSet = new Set<string>(["Все"]);
    apps.forEach(app => {
      app.screens.forEach(screen => {
        if (screen.flowType?.name && screen.isDesktop) {
          flowTypesSet.add(screen.flowType.name);
        }
      });
    });
    setFlowTypes(Array.from(flowTypesSet));
  }, [apps]);

  useEffect(() => {
    if (!apps.length) return;

    const filtered = apps.filter(app => {
      // Фильтрация по категории
      if (selectedCategory !== "Все" && app.category !== selectedCategory) {
        return false;
      }

      // Фильтрация по типу flow
      if (selectedFlowType !== "Все") {
        const hasMatchingFlow = app.screens.some(
          screen => 
            screen.isDesktop && 
            screen.flowType?.name === selectedFlowType
        );
        if (!hasMatchingFlow) return false;
      }

      // Поиск по названию
      if (searchQuery) {
        const fuse = new Fuse([app], {
          keys: ['name', 'description'],
          threshold: 0.4,
        });
        return fuse.search(searchQuery).length > 0;
      }

      return true;
    });

    setFilteredApps(filtered);
  }, [apps, selectedCategory, selectedFlowType, searchQuery]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    const filtered = apps.filter(app => {
      // Фильтрация по категории
      if (value !== "Все" && app.category !== value) {
        return false;
      }

      // Фильтрация по типу flow
      if (selectedFlowType !== "Все") {
        const hasMatchingFlow = app.screens.some(
          screen => 
            screen.isDesktop && 
            screen.flowType?.name === selectedFlowType
        );
        if (!hasMatchingFlow) return false;
      }

      // Поиск по названию
      if (searchQuery) {
        const fuse = new Fuse([app], {
          keys: ['name', 'description'],
          threshold: 0.4,
        });
        return fuse.search(searchQuery).length > 0;
      }

      return true;
    });
    setFilteredApps(filtered);
    setPage(1);
  };

  const handleFlowTypeSelect = (value: string) => {
    setSelectedFlowType(value);
    const filtered = apps.filter(app => {
      // Фильтрация по категории
      if (selectedCategory !== "Все" && app.category !== selectedCategory) {
        return false;
      }

      // Фильтрация по типу flow
      if (value !== "Все") {
        const hasMatchingFlow = app.screens.some(
          screen => 
            screen.isDesktop && 
            screen.flowType?.name === value
        );
        if (!hasMatchingFlow) return false;
      }

      // Поиск по названию
      if (searchQuery) {
        const fuse = new Fuse([app], {
          keys: ['name', 'description'],
          threshold: 0.4,
        });
        return fuse.search(searchQuery).length > 0;
      }

      return true;
    });
    setFilteredApps(filtered);
    setPage(1);
    
    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString());
    if (value === "Все") {
      params.delete('flowType');
    } else {
      params.set('flowType', value);
    }
    router.replace(`/browse/desktop?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filtered = apps.filter(app => {
      // Фильтрация по категории
      if (selectedCategory !== "Все" && app.category !== selectedCategory) {
        return false;
      }

      // Фильтрация по типу flow
      if (selectedFlowType !== "Все") {
        const hasMatchingFlow = app.screens.some(
          screen => 
            screen.isDesktop && 
            screen.flowType?.name === selectedFlowType
        );
        if (!hasMatchingFlow) return false;
      }

      // Поиск по названию
      if (value) {
        const fuse = new Fuse([app], {
          keys: ['name', 'description'],
          threshold: 0.4,
        });
        return fuse.search(value).length > 0;
      }

      return true;
    });
    setFilteredApps(filtered);
    setPage(1);
  };

  return (
    <Container size="xl">
      <PageHeader className='pl-0'>
        <PageHeaderHeading>Десктоп приложения</PageHeaderHeading>
      </PageHeader>

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full md:w-auto">
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <label className="text-sm text-zinc-500">Категория</label>
                <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                  <SelectTrigger className="w-full md:w-[200px] h-9">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "Все" ? "Все" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <label className="text-sm text-zinc-500">Тип флоу</label>
                <Select value={selectedFlowType} onValueChange={handleFlowTypeSelect}>
                  <SelectTrigger className="w-full md:w-[200px] h-9">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {flowTypes.map((flowType) => (
                      <SelectItem key={flowType} value={flowType}>
                        {flowType === "Все" ? "Все" : flowType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Input
                placeholder="Поиск приложений..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full md:w-[300px] h-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
              <p className="text-zinc-400">Загрузка приложений...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-400">По вашему запросу ничего не нашлось</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <DesktopAppCard
                  key={app.id}
                  app={app}
                  href={selectedFlowType !== "Все" ? `/browse/desktop/${app.id}?flowType=${encodeURIComponent(selectedFlowType)}` : `/browse/desktop/${app.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
