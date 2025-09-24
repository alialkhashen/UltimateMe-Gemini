import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, isOpen }: ImageCropperProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    const image = imageRef.current;
    const container = containerRef.current;
    if (!image || !container) return;

    // Center the image initially
    const containerRect = container.getBoundingClientRect();
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayHeight = containerRect.height;
      displayWidth = displayHeight * imageAspect;
    } else {
      displayWidth = containerRect.width;
      displayHeight = displayWidth / imageAspect;
    }

    setPosition({
      x: (containerRect.width - displayWidth) / 2,
      y: (containerRect.height - displayHeight) / 2
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  }, [position, imageLoaded]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageLoaded) return;
    
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const cropSize = Math.min(containerRect.width, containerRect.height) * 0.8;
    const cropX = (containerRect.width - cropSize) / 2;
    const cropY = (containerRect.height - cropSize) / 2;

    // Calculate constrained position
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // Apply constraints to keep the crop area filled
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayHeight = containerRect.height;
      displayWidth = displayHeight * imageAspect;
    } else {
      displayWidth = containerRect.width;
      displayHeight = displayWidth / imageAspect;
    }

    const scaledWidth = displayWidth * zoom;
    const scaledHeight = displayHeight * zoom;

    // Constrain horizontal movement
    const maxX = cropX;
    const minX = cropX + cropSize - scaledWidth;
    newX = Math.max(minX, Math.min(maxX, newX));

    // Constrain vertical movement  
    const maxY = cropY;
    const minY = cropY + cropSize - scaledHeight;
    newY = Math.max(minY, Math.min(maxY, newY));

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, imageLoaded, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCroppedImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const container = containerRef.current;
    if (!canvas || !image || !container || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const containerRect = container.getBoundingClientRect();
    const cropSize = Math.min(containerRect.width, containerRect.height) * 0.8;
    const cropX = (containerRect.width - cropSize) / 2;
    const cropY = (containerRect.height - cropSize) / 2;

    // Calculate the scale factor
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayHeight = containerRect.height;
      displayWidth = displayHeight * imageAspect;
    } else {
      displayWidth = containerRect.width;
      displayHeight = displayWidth / imageAspect;
    }

    const scaledWidth = displayWidth * zoom;
    const scaledHeight = displayHeight * zoom;

    // Calculate source coordinates
    const scaleX = image.naturalWidth / scaledWidth;
    const scaleY = image.naturalHeight / scaledHeight;
    
    const sourceX = Math.max(0, (cropX - position.x) * scaleX);
    const sourceY = Math.max(0, (cropY - position.y) * scaleY);
    const sourceWidth = Math.min(image.naturalWidth - sourceX, cropSize * scaleX);
    const sourceHeight = Math.min(image.naturalHeight - sourceY, cropSize * scaleY);

    ctx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, 200, 200
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [zoom, position, imageLoaded]);

  const handleCrop = () => {
    const croppedImage = getCroppedImage();
    if (croppedImage) {
      onCropComplete(croppedImage);
    }
  };

  const resetPosition = () => {
    setZoom(1);
    const image = imageRef.current;
    const container = containerRef.current;
    if (!image || !container) return;

    const containerRect = container.getBoundingClientRect();
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayHeight = containerRect.height;
      displayWidth = displayHeight * imageAspect;
    } else {
      displayWidth = containerRect.width;
      displayHeight = displayWidth / imageAspect;
    }

    setPosition({
      x: (containerRect.width - displayWidth) / 2,
      y: (containerRect.height - displayHeight) / 2
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop area */}
          <div 
            ref={containerRef}
            className="relative w-[400px] h-[300px] mx-auto border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="absolute select-none pointer-events-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'top left'
              }}
              onLoad={handleImageLoad}
              draggable={false}
            />
            {/* Crop circle overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="border-4 border-white rounded-full shadow-lg bg-transparent"
                style={{ 
                  width: '240px',
                  height: '240px',
                  boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' 
                }} 
              />
            </div>
          </div>

          {/* Zoom slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
              disabled={!imageLoaded}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 justify-between">
            <Button variant="outline" onClick={resetPosition} disabled={!imageLoaded}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleCrop} disabled={!imageLoaded}>
                Apply Crop
              </Button>
            </div>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
