'use client';

import { getApps } from '@/lib/contentful';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { AppGrid } from '@/components/browse/app-grid';
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
import { AppCard } from '@/components/browse/app-card';
import { useInView } from 'react-intersection-observer';
import Fuse from 'fuse.js';

export default function MobileBrowsePage() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [displayedApps, setDisplayedApps] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedFlowType, setSelectedFlowType] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [flowTypes, setFlowTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 12;

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });

  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    setDisplayedApps(filteredApps.slice(start, end));
  }, [page, filteredApps]);

  useEffect(() => {
    if (inView) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const fetchedApps = await getApps();
        // Filter only mobile apps (iOS and Android)
        const mobileApps = fetchedApps.filter(app => 
          app.screens.some(screen => 
            screen.platform?.some(p => 
              ['ios', 'android'].includes(p.name.toLowerCase())
            )
          )
        );
        
        setApps(mobileApps);
        setFilteredApps(mobileApps);
        
        // Get unique categories
        const uniqueCategories = ["Все", ...new Set(mobileApps.map(app => app.category))].filter(Boolean);
        setCategories(uniqueCategories);

        // Get unique flow types from all screens
        const allFlowTypes = new Set<string>();
        allFlowTypes.add("Все");
        mobileApps.forEach(app => {
          app.screens?.forEach(screen => {
            if (screen.flowType?.name) {
              allFlowTypes.add(screen.flowType.name);
            }
          });
        });
        setFlowTypes(Array.from(allFlowTypes));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApps();
  }, []);

  const filterApps = (category: string, flowType: string, query: string) => {
    let filtered = [...apps];
    
    if (category !== "Все") {
      filtered = filtered.filter(app => app.category === category);
    }
    
    if (flowType !== "Все") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => screen.flowType?.name === flowType)
      );
    }

    if (query.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
      filtered = fuse.search(query).map(result => result.item);
    }
    
    setFilteredApps(filtered);
    setPage(1); // Сбрасываем страницу при новой фильтрации
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    filterApps(value, selectedFlowType, searchQuery);
  };

  const handleFlowTypeSelect = (value: string) => {
    setSelectedFlowType(value);
    filterApps(selectedCategory, value, searchQuery);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    filterApps(selectedCategory, selectedFlowType, value);
  };

  return (
    <Container size="xl">
      <PageHeader className='pl-0'>
        <PageHeaderHeading>Мобильные приложения</PageHeaderHeading>
      </PageHeader>

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-row gap-4 md:w-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-500">Категория</label>
                <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                  <SelectTrigger className="flex-1 md:flex-initial md:w-[200px] h-9">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-500">Тип флоу</label>
                <Select value={selectedFlowType} onValueChange={handleFlowTypeSelect}>
                  <SelectTrigger className="flex-1 md:flex-initial md:w-[200px] h-9">
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

          <AppGrid apps={displayedApps} isLoading={isLoading}>
            {displayedApps.map((app) => (
              <AppCard 
                key={app.id} 
                app={{
                  id: app.id,
                  name: app.name,
                  category: app.category,
                  description: app.description,
                  screens: app.screens,
                  logo: app.logo
                }}
                href={`/browse/mobile/${app.id}`}
              />
            ))}
          </AppGrid>
          {displayedApps.length < filteredApps.length && (
            <div ref={ref} className="w-full h-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
