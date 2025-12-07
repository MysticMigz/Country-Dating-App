'use client';

import { useAuthStore } from '@/store/authStore';
import { countries } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Heart } from 'lucide-react';

interface DatedCountriesPanelProps {
  onRemoveCountry: (countryCode: string) => void;
}

export default function DatedCountriesPanel({ onRemoveCountry }: DatedCountriesPanelProps) {
  const { user } = useAuthStore();

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const datedCountriesList = (user?.datedCountries || [])
    .map(code => ({
      code,
      name: getCountryName(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!user || datedCountriesList.length === 0) {
    return (
      <Card className="bg-slate-900/80 border-pink-500/30 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Dated Countries
          </CardTitle>
          <CardDescription className="text-slate-400">
            Countries of people you've dated will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 py-8">
            <p>No countries added yet</p>
            <p className="text-sm mt-2">Click on countries on the map to mark them</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-pink-500/30 backdrop-blur-sm h-[440px] md:h-[900px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Dated Countries
        </CardTitle>
        <CardDescription className="text-slate-400">
          {datedCountriesList.length} {datedCountriesList.length === 1 ? 'country' : 'countries'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {datedCountriesList.map(({ code, name }) => (
            <div
              key={code}
              className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-pink-500/50 transition-all group"
            >
              <span className="text-slate-200 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                {name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCountry(code)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

