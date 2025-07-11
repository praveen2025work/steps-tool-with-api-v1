import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Maximize2, Pin, PinOff, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { TileData, TileSlide, TileStatus } from '@/types/finance-types';
import { TileContent } from './TileContent';

interface FinanceTileProps {
  tile: TileData;
  onFocus: () => void;
  isFocused: boolean;
  isFullView: boolean;
  isCompact?: boolean;
}

const FinanceTile: React.FC<FinanceTileProps> = ({ 
  tile, 
  onFocus, 
  isFocused,
  isFullView,
  isCompact = false
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add error handling for missing slides
  const currentSlide = tile.slides && Array.isArray(tile.slides) && tile.slides.length > 0 
    ? tile.slides[currentSlideIndex % tile.slides.length] 
    : null;

  useEffect(() => {
    if (!isPinned && tile.slides && Array.isArray(tile.slides) && tile.slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % tile.slides.length);
      }, 15000); // 15 seconds rotation
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPinned, tile.slides]);

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
    
    if (!isPinned && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev - 1 + tile.slides.length) % tile.slides.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % tile.slides.length);
  };

  const getStatusColor = (status: TileStatus) => {
    switch (status) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={`w-full transition-all duration-300 ${isFocused ? 'ring-2 ring-primary' : ''} ${isCompact ? 'h-auto min-h-[180px]' : ''}`}
      onClick={onFocus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={`relative ${isCompact ? 'p-3 pb-2' : 'p-4'}`}>
        <div className="flex justify-between items-start">
          <div className={`${isCompact ? 'max-w-[70%]' : ''}`}>
            <CardTitle className={`${isCompact ? 'text-sm' : 'text-lg'} flex items-center gap-2 truncate`}>
              <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getStatusColor(tile.status)}`}></div>
              <span className="truncate">{tile.title}</span>
              {tile.alert && (
                <AlertCircle className="flex-shrink-0 h-4 w-4 text-amber-500" />
              )}
            </CardTitle>
            {!isCompact && (
              <CardDescription className="mt-1">{tile.description}</CardDescription>
            )}
          </div>
          
          <div className="flex gap-1 flex-shrink-0">
            {(isHovered || isPinned) && tile.slides && Array.isArray(tile.slides) && tile.slides.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrevSlide}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNextSlide}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {(isHovered || isPinned) && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePinToggle}>
                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
            )}
            
            {isHovered && !isFullView && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onFocus}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {tile.slides && Array.isArray(tile.slides) && tile.slides.length > 1 && !isCompact && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
            {tile.slides.map((_, index) => (
              <div 
                key={index} 
                className={`h-1 w-6 rounded-full ${index === currentSlideIndex ? 'bg-primary' : 'bg-muted'}`}
              ></div>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className={`${isCompact ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
        {currentSlide ? (
          <TileContent 
            slide={currentSlide} 
            isFullView={isFullView} 
            isCompact={isCompact}
          />
        ) : (
          <div className="flex items-center justify-center h-20 w-full bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        )}
      </CardContent>
      
      {!isCompact && (
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div>Updated: {tile.lastUpdated}</div>
          {currentSlide && currentSlide.source && <div className="truncate max-w-[50%]">Source: {currentSlide.source}</div>}
        </CardFooter>
      )}
    </Card>
  );
};

export default FinanceTile;