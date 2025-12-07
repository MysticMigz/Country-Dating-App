'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Heart, X } from 'lucide-react';
import { countries } from '@/lib/countries';

interface CountrySelectionDialogProps {
  isOpen: boolean;
  countryCode: string | null;
  isVisited: boolean;
  isDated: boolean;
  onClose: () => void;
  onAddToVisited: () => void;
  onAddToDated: () => void;
  onRemoveFromVisited: () => void;
  onRemoveFromDated: () => void;
}

export default function CountrySelectionDialog({
  isOpen,
  countryCode,
  isVisited,
  isDated,
  onClose,
  onAddToVisited,
  onAddToDated,
  onRemoveFromVisited,
  onRemoveFromDated,
}: CountrySelectionDialogProps) {
  const getCountryName = (code: string | null) => {
    if (!code) return '';
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !countryCode) return null;

  const countryName = getCountryName(countryCode);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="bg-slate-900/95 border-cyan-500/50 backdrop-blur-md shadow-2xl w-full max-w-md animate-fadeIn">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {countryName}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-400 text-sm mb-4">
              Choose an action for this country:
            </p>
            
            <div className="space-y-2">
              {/* Visited Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  Visited Countries
                </div>
                {isVisited ? (
                  <Button
                    onClick={() => {
                      onRemoveFromVisited();
                      onClose();
                    }}
                    variant="outline"
                    className="w-full border-red-500/50 hover:bg-red-500/20 hover:border-red-500 text-red-400"
                  >
                    Remove from Visited
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onAddToVisited();
                      onClose();
                    }}
                    variant="default"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    Add to Visited
                  </Button>
                )}
              </div>

              {/* Dated Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <Heart className="h-4 w-4 text-pink-400" />
                  Dated Countries
                </div>
                {isDated ? (
                  <Button
                    onClick={() => {
                      onRemoveFromDated();
                      onClose();
                    }}
                    variant="outline"
                    className="w-full border-red-500/50 hover:bg-red-500/20 hover:border-red-500 text-red-400"
                  >
                    Remove from Dated
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onAddToDated();
                      onClose();
                    }}
                    variant="default"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  >
                    Add to Dated
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-200"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

