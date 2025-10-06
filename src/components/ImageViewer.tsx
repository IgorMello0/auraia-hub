import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  fileUrl: string;
  fileName: string;
  className?: string;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export const ImageViewer = ({ fileUrl, fileName, className }: ImageViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(2); // Index for 1x zoom
  const [rotation, setRotation] = useState<number>(0);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 0));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/50">
        <span className="text-sm font-medium truncate flex-1">{fileName}</span>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoomLevel <= 0}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(ZOOM_LEVELS[zoomLevel] * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoomLevel >= ZOOM_LEVELS.length - 1}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Content */}
      <div className="flex-1 overflow-auto bg-muted/20 flex items-center justify-center p-4">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full h-auto shadow-lg transition-transform"
          style={{
            transform: `scale(${ZOOM_LEVELS[zoomLevel]}) rotate(${rotation}deg)`,
          }}
        />
      </div>
    </div>
  );
};
