'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import { countries } from '@/lib/countries';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

import { FilterType } from './CountryFilter';

interface CountryMapProps {
  visitedCountries: string[];
  datedCountries?: string[];
  onCountryClick: (countryCode: string) => void;
  filterType?: FilterType;
  searchQuery?: string;
}

export default function CountryMap({ 
  visitedCountries, 
  datedCountries = [], 
  onCountryClick,
  filterType = 'all',
  searchQuery = '',
}: CountryMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const isVisited = (countryCode: string) => {
    return visitedCountries.includes(countryCode);
  };

  const isDated = (countryCode: string) => {
    return datedCountries.includes(countryCode);
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  // Generate a unique vibrant color for each country based on its code
  const getCountryColor = (countryCode: string): string => {
    // Create a simple hash from the country code (works with any string)
    let hash = 0;
    const codeStr = String(countryCode || '');
    for (let i = 0; i < codeStr.length; i++) {
      hash = codeStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    
    // Use a predefined palette of bright, distinct colors
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80',
      '#EC7063', '#5DADE2', '#F1948A', '#82E0AA', '#F4D03F',
      '#AF7AC5', '#5DADE2', '#F5B041', '#58D68D', '#EB984E',
      '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
      '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#27AE60',
    ];
    
    const colorIndex = hash % colors.length;
    const selectedColor = colors[colorIndex];
    
    return selectedColor;
  };
  
  // Force apply colors after render by directly manipulating SVG paths
  useEffect(() => {
    const applyColors = () => {
      if (mapRef.current) {
        const svg = mapRef.current.querySelector('svg');
        if (svg) {
          const paths = svg.querySelectorAll('path');
          paths.forEach((path, index) => {
            let dataColor = path.getAttribute('data-color');
            const countryName = path.getAttribute('data-country-name');
            const countryCode = path.getAttribute('data-country-code');
            
            // If no data-color, try to generate one
            if (!dataColor) {
              if (countryCode && countryCode.length === 3) {
                dataColor = getCountryColor(countryCode);
                path.setAttribute('data-color', dataColor);
              } else if (countryName) {
                // Try to match country name to get code
                const matchedCountry = countries.find(c => 
                  c.name.toLowerCase() === countryName.toLowerCase() ||
                  countryName.toLowerCase().includes(c.name.toLowerCase()) ||
                  c.name.toLowerCase().includes(countryName.toLowerCase())
                );
                if (matchedCountry) {
                  dataColor = getCountryColor(matchedCountry.code);
                  path.setAttribute('data-color', dataColor);
                  path.setAttribute('data-country-code', matchedCountry.code);
                } else {
                  dataColor = getCountryColor(countryName);
                  path.setAttribute('data-color', dataColor);
                }
              } else {
                dataColor = getCountryColor(`fallback_${index}`);
                path.setAttribute('data-color', dataColor);
              }
            }
            
            // Force apply the color with multiple methods
            if (dataColor) {
              const pathEl = path as SVGPathElement;
              pathEl.setAttribute('fill', dataColor);
              pathEl.style.fill = dataColor;
              pathEl.style.setProperty('fill', dataColor, 'important');
              
              // Remove any conflicting fill styles from parent groups
              const parent = pathEl.parentElement;
              if (parent && parent.tagName === 'g') {
                const groupStyle = parent.getAttribute('style');
                if (groupStyle && groupStyle.includes('fill')) {
                  // Don't remove, but ensure our fill takes precedence
                }
              }
            }
          });
        }
      }
    };
    
    // Apply immediately and after delays to catch all render cycles
    applyColors();
    const timer = setTimeout(applyColors, 100);
    const timer2 = setTimeout(applyColors, 500);
    const timer3 = setTimeout(applyColors, 1000);
    const timer4 = setTimeout(applyColors, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [visitedCountries]); // Re-run when visited countries change


  return (
    <div ref={mapRef} className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Country Name Display at Top */}
      {hoveredCountryName && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 px-6 py-3 bg-slate-900/95 border-2 border-cyan-500/70 rounded-lg shadow-2xl pointer-events-none backdrop-blur-sm animate-fadeIn">
          <div className="text-cyan-400 font-bold text-lg sm:text-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-white">{hoveredCountryName}</span>
            {hoveredCountry && isVisited(hoveredCountry) && (
              <span className="text-green-400 text-xl">✓</span>
            )}
            {hoveredCountry && isDated(hoveredCountry) && (
              <span className="text-pink-400 text-xl">❤️</span>
            )}
          </div>
        </div>
      )}
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }} />
      </div>

      {/* Animated Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{
          animation: 'float 8s ease-in-out infinite reverse',
          animationDelay: '2s',
        }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/8 rounded-full blur-2xl animate-pulse" style={{
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '4s',
        }} />
      </div>

      {/* SVG Filters for Glow Effects */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="pinkGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <ComposableMap
        projectionConfig={{
          scale: 220,
          center: [0, 20],
        }}
        className="w-full h-full relative z-10"
      >

        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              console.log('Total geographies:', geographies.length);
              
              // Log first geography to see what properties are available
              if (geographies.length > 0) {
                const props = geographies[0].properties;
                console.log('First geography properties keys:', Object.keys(props));
                console.log('First geography properties values:', JSON.stringify(props, null, 2));
              }
              
              // First pass: render all countries with unique colors
              const geographyElements = geographies.map((geo, index) => {
                // Get country name from properties
                const countryName = geo.properties.name || geo.properties.NAME || `Country_${index}`;
                
                // Enhanced country matching with special cases
                let country = countries.find(c => 
                  c.name.toLowerCase() === countryName.toLowerCase()
                );
                
                // If no exact match, try partial matching with special cases
                if (!country) {
                  const mapNameLower = countryName.toLowerCase();
                  
                  // Special case mappings for countries with name variations
                  const specialCases: { [key: string]: string } = {
                    'congo': 'COG',
                    'democratic republic of the congo': 'COD',
                    'democratic republic of congo': 'COD',
                    'dr congo': 'COD',
                    'south sudan': 'SSD',
                    'sri lanka': 'LKA',
                    'spain': 'ESP',
                    'algeria': 'DZA',
                    'mali': 'MLI',
                    'niger': 'NER',
                    'turkmenistan': 'TKM',
                    'north korea': 'PRK',
                    'korea, north': 'PRK',
                    'democratic people\'s republic of korea': 'PRK',
                    'dprk': 'PRK',
                    'albania': 'ALB',
                  };
                  
                  // Check special cases first
                  const specialCode = specialCases[mapNameLower];
                  if (specialCode) {
                    country = countries.find(c => c.code === specialCode);
                  }
                  
                  // If still no match, try partial matching
                  if (!country) {
                    country = countries.find(c => {
                      const listName = c.name.toLowerCase();
                      // Handle Congo variations
                      if (mapNameLower.includes('congo') && listName.includes('congo')) {
                        if (mapNameLower.includes('democratic') && listName.includes('democratic')) return true;
                        if (!mapNameLower.includes('democratic') && !listName.includes('democratic')) return true;
                      }
                      // Handle Korea variations
                      if (mapNameLower.includes('north korea') && listName.includes('north korea')) return true;
                      if (mapNameLower.includes('south korea') && listName.includes('south korea')) return true;
                      // General partial matching
                      return mapNameLower.includes(listName) || listName.includes(mapNameLower);
                    });
                  }
                }
                
                // Use country code if found, otherwise use name for color generation
                const countryCode = country ? country.code : countryName;
                const visited = isVisited(countryCode);
                const dated = isDated(countryCode);
                const isHovered = hoveredCountry === countryCode;
                
                // Apply filters
                const matchesSearch = searchQuery === '' || 
                  countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (country && country.name.toLowerCase().includes(searchQuery.toLowerCase()));
                
                const matchesFilter = 
                  filterType === 'all' ||
                  (filterType === 'visited' && visited) ||
                  (filterType === 'dated' && dated) ||
                  (filterType === 'both' && (visited || dated));
                
                const shouldHighlight = matchesSearch && matchesFilter;
                const shouldBlackOut = !shouldHighlight && (filterType !== 'all' || searchQuery !== '');
                
                // Always generate a color - use country code if available, otherwise use name
                const colorKey = country ? country.code : countryName;
                const countryColor = shouldBlackOut ? '#000000' : getCountryColor(colorKey);
                
                // Log specific countries that were missing colors
                const missingColorCountries = ['Albania', 'Algeria', 'Spain', 'Mali', 'Niger', 'South Sudan', 'Congo', 'Turkmenistan', 'Sri Lanka', 'North Korea'];
                if (missingColorCountries.some(name => countryName.toLowerCase().includes(name.toLowerCase()))) {
                  console.log(`[COLOR DEBUG] ${countryName}:`, {
                    countryCode,
                    color: countryColor,
                    matched: !!country,
                    colorKey
                  });
                }
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryColor}
                    stroke="#333333"
                    strokeWidth={0.5}
                    data-color={countryColor}
                    data-country-name={countryName}
                    data-country-code={countryCode}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: 'pointer',
                        filter: shouldBlackOut ? 'none' : (visited ? 'url(#strongGlow)' : (dated ? 'url(#pinkGlow)' : (shouldHighlight ? 'url(#glow)' : 'none'))),
                        transition: 'all 0.3s ease',
                        stroke: shouldBlackOut ? '#000000' : (dated ? '#ec4899' : (shouldHighlight ? '#60a5fa' : '#333333')),
                        strokeWidth: shouldBlackOut ? 0.3 : (dated ? 1.5 : (shouldHighlight ? 1 : 0.5)),
                        opacity: shouldBlackOut ? 1 : 1,
                        fill: countryColor,
                      },
                      hover: {
                        outline: 'none',
                        cursor: 'pointer',
                        stroke: shouldBlackOut ? '#000000' : '#ffffff',
                        strokeWidth: shouldBlackOut ? 0.3 : 2,
                        filter: shouldBlackOut ? 'none' : (visited || dated ? 'url(#strongGlow)' : (shouldHighlight ? 'url(#glow)' : 'url(#glow)')),
                        fill: countryColor,
                        opacity: 1,
                      },
                      pressed: {
                        outline: 'none',
                      },
                    }}
                    onClick={(e: React.MouseEvent<SVGPathElement>) => {
                      e.preventDefault();
                      if (countryCode) {
                        onCountryClick(countryCode);
                      }
                    }}
                    onMouseEnter={() => {
                      if (countryCode) {
                        setHoveredCountry(countryCode);
                        const displayName = country ? country.name : countryName;
                        setHoveredCountryName(displayName);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                      setHoveredCountryName(null);
                    }}
                    onTouchStart={() => {
                      if (countryCode) {
                        setHoveredCountry(countryCode);
                        const displayName = country ? country.name : countryName;
                        setHoveredCountryName(displayName);
                      }
                    }}
                    onTouchEnd={() => {
                      // Delay clearing to allow for click events on mobile
                      setTimeout(() => {
                        setHoveredCountry(null);
                        setHoveredCountryName(null);
                      }, 300);
                    }}
                  />
                );
              });

              // Second pass: render country name labels with collision detection
              // First, collect all potential labels with their data
              const potentialLabels = geographies
                .map((geo) => {
                  const countryName = geo.properties.name || geo.properties.NAME || '';
                  if (!countryName) return null;
                  
                  // Try to find matching country code
                  const country = countries.find(c => 
                    c.name.toLowerCase() === countryName.toLowerCase() ||
                    countryName.toLowerCase().includes(c.name.toLowerCase()) ||
                    c.name.toLowerCase().includes(countryName.toLowerCase())
                  );
                  
                  const countryCode = country ? country.code : countryName;
                  const visited = isVisited(countryCode);
                  const isHovered = hoveredCountry === countryCode;
                  
                  // Calculate centroid from geometry
                  let centroid: [number, number] = [0, 0];
                  let area = 0;
                  const coordinates = geo.geometry.coordinates;
                  
                  if (geo.geometry.type === 'Polygon' && coordinates[0]) {
                    const ring = coordinates[0];
                    let sumX = 0, sumY = 0;
                    const sampleSize = Math.min(ring.length, 50);
                    for (let i = 0; i < sampleSize; i++) {
                      const idx = Math.floor((i / sampleSize) * ring.length);
                      sumX += ring[idx][0];
                      sumY += ring[idx][1];
                    }
                    centroid = [sumX / sampleSize, sumY / sampleSize];
                    // Estimate area by bounding box
                    const xs = ring.map((p: number[]) => p[0]);
                    const ys = ring.map((p: number[]) => p[1]);
                    const width = Math.max(...xs) - Math.min(...xs);
                    const height = Math.max(...ys) - Math.min(...ys);
                    area = width * height;
                  } else if (geo.geometry.type === 'MultiPolygon') {
                    let largestRing: number[][] = [];
                    let maxArea = 0;
                    coordinates.forEach((polygon: number[][][]) => {
                      polygon.forEach((ring: number[][]) => {
                        const xs = ring.map((p: number[]) => p[0]);
                        const ys = ring.map((p: number[]) => p[1]);
                        const width = Math.max(...xs) - Math.min(...xs);
                        const height = Math.max(...ys) - Math.min(...ys);
                        const ringArea = width * height;
                        if (ringArea > maxArea) {
                          maxArea = ringArea;
                          largestRing = ring;
                        }
                      });
                    });
                    if (largestRing.length > 0) {
                      let sumX = 0, sumY = 0;
                      const sampleSize = Math.min(largestRing.length, 50);
                      for (let i = 0; i < sampleSize; i++) {
                        const idx = Math.floor((i / sampleSize) * largestRing.length);
                        sumX += largestRing[idx][0];
                        sumY += largestRing[idx][1];
                      }
                      centroid = [sumX / sampleSize, sumY / sampleSize];
                      area = maxArea;
                    }
                  }

                  if (!centroid[0] || !centroid[1]) return null;

                  return {
                    geo,
                    countryName,
                    countryCode,
                    visited,
                    isHovered,
                    centroid,
                    area,
                    priority: visited ? 3 : (area > 1.0 ? 2 : (area > 0.5 ? 1 : 0)), // Priority: visited > very large > large > small
                  };
                })
                .filter((label): label is NonNullable<typeof label> => label !== null);

              // Sort by priority (visited first, then by area)
              potentialLabels.sort((a, b) => {
                if (a.priority !== b.priority) return b.priority - a.priority;
                return b.area - a.area;
              });

              // Collision detection: only show labels that don't overlap
              const labelElements: JSX.Element[] = [];
              const usedPositions: Array<{ x: number; y: number; radius: number }> = [];
              const minDistance = 2.0; // Minimum distance between labels (in projection coordinates) - increased for better spacing

              for (const label of potentialLabels) {
                // Skip very small countries unless visited or hovered - but don't skip island nations
                // Mauritius and other small island nations should still be visible
                const isSmallIsland = ['MUS', 'MDV', 'SYC', 'COM', 'STP', 'DMA', 'GRD', 'VCT', 'KNA', 'LCA', 'ATG', 'BRB', 'MLT', 'BHR', 'SGP'].includes(label.countryCode);
                if (label.area < 0.3 && !label.visited && !label.isHovered && !isSmallIsland) continue;

                // Check for collisions
                let hasCollision = false;
                for (const used of usedPositions) {
                  const dx = label.centroid[0] - used.x;
                  const dy = label.centroid[1] - used.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  if (distance < minDistance) {
                    hasCollision = true;
                    break;
                  }
                }

                if (!hasCollision) {
                  // Estimate label size based on text length (country codes are 3 chars)
                  // Smaller font sizes to prevent overlap
                  const fontSize = label.visited ? 6 : label.isHovered ? 6.5 : 5;
                  const textLength = 3; // Country codes are always 3 characters
                  const estimatedWidth = (textLength * fontSize * 0.5) / 220; // Approximate width in projection coords (adjusted for new scale)
                  const estimatedHeight = fontSize / 220;

                  // Reserve a larger area around the label to prevent overlaps
                  const reservedRadius = Math.max(estimatedWidth, estimatedHeight) * 1.5; // Increased buffer

                  usedPositions.push({
                    x: label.centroid[0],
                    y: label.centroid[1],
                    radius: reservedRadius,
                  });

                  const opacity = label.isHovered ? 1 : label.visited ? 0.95 : 0.7;

                  // Get country code for display (use first 3 characters if longer)
                  const displayCode = label.countryCode.length <= 3 ? label.countryCode : label.countryCode.substring(0, 3).toUpperCase();
                  
                  labelElements.push(
                    <Marker key={`label-${label.geo.rsmKey}`} coordinates={label.centroid}>
                      <text
                        textAnchor="middle"
                        fontSize={fontSize}
                        fill="#ffffff"
                        fontWeight="700"
                        pointerEvents="none"
                        style={{
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
                          opacity: opacity,
                          transition: 'all 0.2s ease',
                          userSelect: 'none',
                        }}
                        dy="0.35em"
                      >
                        {displayCode}
                      </text>
                    </Marker>
                  );
                }
              }

              return (
                <>
                  {geographyElements}
                  <g>{labelElements}</g>
                </>
              );
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      

      {/* Map Controls Hint */}
      <div className="absolute bottom-4 right-4 z-20 text-xs text-cyan-400/60 bg-slate-900/80 px-3 py-2 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span>🖱️ Scroll to zoom</span>
          <span className="text-slate-500">•</span>
          <span>🖱️ Drag to pan</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}

