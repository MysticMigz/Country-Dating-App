'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Heart, Search, X, Filter } from 'lucide-react';

export type FilterType = 'all' | 'visited' | 'dated' | 'both';

interface CountryFilterProps {
  filterType: FilterType;
  searchQuery: string;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  visitedCount: number;
  datedCount: number;
}

export default function CountryFilter({
  filterType,
  searchQuery,
  onFilterChange,
  onSearchChange,
  visitedCount,
  datedCount,
}: CountryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-slate-900/80 border-cyan-500/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300 mb-2">Show:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('all')}
                className={`${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All
              </Button>
              <Button
                variant={filterType === 'visited' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('visited')}
                className={`${
                  filterType === 'visited'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Visited ({visitedCount})
              </Button>
              <Button
                variant={filterType === 'dated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('dated')}
                className={`${
                  filterType === 'dated'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Heart className="h-3 w-3 mr-1" />
                Dated ({datedCount})
              </Button>
              <Button
                variant={filterType === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('both')}
                className={`${
                  filterType === 'both'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Both
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

