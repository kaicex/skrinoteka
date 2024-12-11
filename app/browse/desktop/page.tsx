'use client';

import { getApps } from '@/lib/contentful';
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

export default function DesktopBrowsePage() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [selectedFlowType, setSelectedFlowType] = useState("Все типы");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [flowTypes, setFlowTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      const fetchedApps = await getApps();
      
      // Filter only desktop apps
      const desktopApps = fetchedApps.filter(app => 
        app.screens.some(screen => 
          screen.platform?.some(p => 
            ['web', 'desktop'].includes(p.name.toLowerCase())
          )
        )
      );
      
      setApps(desktopApps);
      setFilteredApps(desktopApps);
      
      // Get unique categories
      const categoriesSet = new Set(desktopApps.map(app => app.category));
      const uniqueCategories = ["Все категории", ...Array.from(categoriesSet)].filter(Boolean);
      setCategories(uniqueCategories);

      // Get unique flow types
      const allFlowTypes = new Set<string>();
      allFlowTypes.add("Все типы");
      
      desktopApps.forEach(app => {
        app.screens?.forEach(screen => {
          if (screen.flowType?.name) {
            allFlowTypes.add(screen.flowType.name);
          }
        });
      });
      
      setFlowTypes(Array.from(allFlowTypes));
    };
    
    fetchApps();
  }, []);

  const filterApps = (category: string, flowType: string, query: string) => {
    let filtered = [...apps];
    
    // Apply category filter
    if (category !== "Все категории") {
      filtered = filtered.filter(app => app.category === category);
    }
    
    // Apply flow type filter
    if (flowType !== "Все типы") {
      filtered = filtered.filter(app => 
        app.screens?.some(screen => screen.flowType?.name === flowType)
      );
    }

    // Apply search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchLower) ||
        app.description?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredApps(filtered);
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
        <PageHeaderHeading>Десктоп приложения</PageHeaderHeading>
      </PageHeader>

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-row gap-4 md:w-auto">
              <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                <SelectTrigger className="flex-1 md:flex-initial md:w-[240px]">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "Все категории" ? "Все категории" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFlowType} onValueChange={handleFlowTypeSelect}>
                <SelectTrigger className="flex-1 md:flex-initial md:w-[240px]">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {flowTypes.map((flowType) => (
                    <SelectItem key={flowType} value={flowType}>
                      {flowType === "Все типы" ? "Все типы" : flowType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <Input
                placeholder="Поиск приложений..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <DesktopAppCard
                key={app.id}
                app={app}
                href={`/browse/desktop/${app.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
