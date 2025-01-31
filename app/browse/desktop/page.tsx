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

  const { data: apps = [], isLoading } = useDesktopApps();

  useEffect(() => {
    if (!apps.length) return;

    // Get unique categories
    const categoriesSet = new Set(apps.map(app => app.category));
    const uniqueCategories = ["Все", ...Array.from(categoriesSet)].filter(Boolean);
    setCategories(uniqueCategories);

    // Get unique flow types from web platform screens only
    const allFlowTypes = new Set<string>();
    allFlowTypes.add("Все");
    
    apps.forEach(app => {
      app.screens?.forEach(screen => {
        if (screen.flowType?.name && screen.platform?.some(p => p.name.toLowerCase() === 'web')) {
          allFlowTypes.add(screen.flowType.name);
        }
      });
    });
    
    setFlowTypes(Array.from(allFlowTypes));

    let filtered = [...apps];
    
    // Apply category filter
    if (selectedCategory !== "Все") {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }
    
    // Apply flow type filter
    if (selectedFlowType !== "Все") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => 
          screen.flowType?.name === selectedFlowType && 
          screen.platform?.some(p => p.name.toLowerCase() === 'web')
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(searchQuery).map(result => result.item);
    }

    setFilteredApps(filtered);
  }, [apps, selectedCategory, selectedFlowType, searchQuery]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    let filtered = [...apps];
    
    // Apply category filter
    if (value !== "Все") {
      filtered = filtered.filter(app => app.category === value);
    }
    
    // Apply flow type filter
    if (selectedFlowType !== "Все") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => 
          screen.flowType?.name === selectedFlowType && 
          screen.platform?.some(p => p.name.toLowerCase() === 'web')
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(searchQuery).map(result => result.item);
    }

    setFilteredApps(filtered);
  };

  const handleFlowTypeSelect = (value: string) => {
    setSelectedFlowType(value);
    let filtered = [...apps];
    
    // Apply category filter
    if (selectedCategory !== "Все") {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }
    
    // Apply flow type filter
    if (value !== "Все") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => 
          screen.flowType?.name === value && 
          screen.platform?.some(p => p.name.toLowerCase() === 'web')
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(searchQuery).map(result => result.item);
    }

    setFilteredApps(filtered);
    
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
    let filtered = [...apps];
    
    // Apply category filter
    if (selectedCategory !== "Все") {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }
    
    // Apply flow type filter
    if (selectedFlowType !== "Все") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => 
          screen.flowType?.name === selectedFlowType && 
          screen.platform?.some(p => p.name.toLowerCase() === 'web')
        )
      );
    }

    // Apply search filter
    if (value.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(value).map(result => result.item);
    }

    setFilteredApps(filtered);
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
