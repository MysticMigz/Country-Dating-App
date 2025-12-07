declare module 'react-simple-maps' {
  import { ComponentType, ReactNode } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  export interface GeographyProps {
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    filter?: string;
    'data-color'?: string;
    'data-country-name'?: string;
    'data-country-code'?: string;
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
    onContextMenu?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
    onTouchStart?: (event: React.TouchEvent<SVGPathElement>) => void;
    onTouchEnd?: (event: React.TouchEvent<SVGPathElement>) => void;
  }

  export interface ComposableMapProps {
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    className?: string;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography?: string | object;
    children?: (props: { geographies: any[] }) => ReactNode;
  }

  export interface ZoomableGroupProps {
    children?: ReactNode;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: React.CSSProperties;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Marker: ComponentType<MarkerProps>;
}

