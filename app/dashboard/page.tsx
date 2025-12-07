'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CountryMap from '@/components/CountryMap';
import VisitedCountriesPanel from '@/components/VisitedCountriesPanel';
import DatedCountriesPanel from '@/components/DatedCountriesPanel';
import CountrySelectionDialog from '@/components/CountrySelectionDialog';
import CountryFilter, { FilterType } from '@/components/CountryFilter';
import { countries } from '@/lib/countries';
import { LogOut, Globe, CheckCircle2, X, MapPin, Heart } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, clearAuth, updateVisitedCountries, updateDatedCountries } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const lastFetchedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    
    // Only fetch if we haven't fetched for this token yet
    // This prevents infinite loops when user state updates
    if (token !== lastFetchedTokenRef.current) {
      lastFetchedTokenRef.current = token;
      fetchUserCountries();
    }
  }, [token]); // Only depend on token, not user (to avoid loop from updateVisitedCountries)

  const fetchUserCountries = async () => {
    if (!token) return;
    
    try {
      const [visitedResponse, datedResponse] = await Promise.all([
        fetch('/api/countries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('/api/dated-countries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (visitedResponse.ok) {
        const data = await visitedResponse.json();
        updateVisitedCountries(data.visitedCountries || []);
      }
      
      if (datedResponse.ok) {
        const data = await datedResponse.json();
        updateDatedCountries(data.datedCountries || []);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setIsDialogOpen(true);
  };

  const handleAddToVisited = async () => {
    if (!token || !selectedCountry) return;
    
    setMapLoading(true);
    try {
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode: selectedCountry }),
      });

      if (response.ok) {
        const data = await response.json();
        updateVisitedCountries(data.visitedCountries);
      }
    } catch (error) {
      console.error('Failed to update country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleRemoveFromVisited = async () => {
    if (!token || !selectedCountry) return;
    
    setMapLoading(true);
    try {
      const response = await fetch('/api/countries', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode: selectedCountry }),
      });

      if (response.ok) {
        const data = await response.json();
        updateVisitedCountries(data.visitedCountries);
      }
    } catch (error) {
      console.error('Failed to remove country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleRemoveCountry = async (countryCode: string) => {
    if (!token) return;
    
    setMapLoading(true);
    
    try {
      const response = await fetch('/api/countries', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode }),
      });

      if (response.ok) {
        const data = await response.json();
        updateVisitedCountries(data.visitedCountries);
      }
    } catch (error) {
      console.error('Failed to remove country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleAddToDated = async () => {
    if (!token || !selectedCountry) return;
    
    setMapLoading(true);
    try {
      const response = await fetch('/api/dated-countries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode: selectedCountry }),
      });

      if (response.ok) {
        const data = await response.json();
        updateDatedCountries(data.datedCountries);
      }
    } catch (error) {
      console.error('Failed to update dated country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleRemoveFromDated = async () => {
    if (!token || !selectedCountry) return;
    
    setMapLoading(true);
    try {
      const response = await fetch('/api/dated-countries', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode: selectedCountry }),
      });

      if (response.ok) {
        const data = await response.json();
        updateDatedCountries(data.datedCountries);
      }
    } catch (error) {
      console.error('Failed to remove dated country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleRemoveDatedCountry = async (countryCode: string) => {
    if (!token) return;
    
    setMapLoading(true);
    
    try {
      const response = await fetch('/api/dated-countries', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode }),
      });

      if (response.ok) {
        const data = await response.json();
        updateDatedCountries(data.datedCountries);
      }
    } catch (error) {
      console.error('Failed to remove dated country:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const visitedCount = user.visitedCountries.length;
  const datedCount = user.datedCountries?.length || 0;
  const totalCount = countries.length;
  const percentage = Math.round((visitedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative">
              <img 
                src="/countrydatingapp-high-resolution-logo.png" 
                alt="Country Checklist Logo" 
                className="h-20 w-auto object-contain"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome, {user.name}!
              </h1>
              <p className="text-slate-400 mt-1">Track your country adventures</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Filter */}
        <CountryFilter
          filterType={filterType}
          searchQuery={searchQuery}
          onFilterChange={setFilterType}
          onSearchChange={setSearchQuery}
          visitedCount={visitedCount}
          datedCount={datedCount}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Countries</CardTitle>
              <Globe className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{totalCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Visited</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{visitedCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Progress</CardTitle>
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {percentage}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Map and Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Map - Takes 3 columns on large screens */}
          <div className={`lg:col-span-3 transition-all duration-300 ${showPanel ? '' : 'lg:col-span-5'}`}>
            <Card className="bg-slate-900/80 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Global Map
                    </CardTitle>
                    <CardDescription className="text-slate-400 flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      Click on countries to add them to your lists.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPanel(!showPanel)}
                    className="md:hidden"
                  >
                    {showPanel ? <X className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[900px] rounded-lg overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 shadow-inner">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse pointer-events-none"></div>
                  
                  {mapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                        <p className="text-cyan-400 text-sm">Updating...</p>
                      </div>
                    </div>
                  )}
                  <CountryMap
                    visitedCountries={user.visitedCountries}
                    datedCountries={user.datedCountries || []}
                    onCountryClick={handleCountryClick}
                    filterType={filterType}
                    searchQuery={searchQuery}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panels - Takes 2 columns on large screens, stacked on mobile */}
          {showPanel && (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <VisitedCountriesPanel onRemoveCountry={handleRemoveCountry} />
              <DatedCountriesPanel onRemoveCountry={handleRemoveDatedCountry} />
            </div>
          )}
        </div>

        {/* Country Selection Dialog */}
        <CountrySelectionDialog
          isOpen={isDialogOpen}
          countryCode={selectedCountry}
          isVisited={user?.visitedCountries.includes(selectedCountry || '') || false}
          isDated={user?.datedCountries?.includes(selectedCountry || '') || false}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedCountry(null);
          }}
          onAddToVisited={handleAddToVisited}
          onAddToDated={handleAddToDated}
          onRemoveFromVisited={handleRemoveFromVisited}
          onRemoveFromDated={handleRemoveFromDated}
        />
      </div>
    </div>
  );
}

