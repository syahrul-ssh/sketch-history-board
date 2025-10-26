'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CanvasProps {
  tool: 'pen' | 'eraser';
  color: string;
  lineWidth: number;
  onDrawingChange: () => void;
}

export interface CanvasHandle {
  getImageData: () => string;
  getThumbnail: () => string;
  clearCanvas: () => void;
  loadImage: (dataUrl: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ tool, color, lineWidth, onDrawingChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [history, setHistory] = React.useState<string[]>([]);
    const [historyStep, setHistoryStep] = React.useState(-1);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas internal size
          canvas.width = 800;
          canvas.height = 600;
          
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          saveToHistory();
        }
      }
    }, []);

    const saveToHistory = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dataUrl = canvas.toDataURL();
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(dataUrl);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    };

    const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      
      // Calculate the scale factor between display size and internal size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Get mouse position relative to canvas
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      return { x, y };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getCanvasCoordinates(e);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getCanvasCoordinates(e);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const stopDrawing = () => {
      if (isDrawing) {
        setIsDrawing(false);
        saveToHistory();
        onDrawingChange();
      }
    };

    useImperativeHandle(ref, () => ({
      getImageData: () => {
        return canvasRef.current?.toDataURL() || '';
      },
      getThumbnail: () => {
        return canvasRef.current?.toDataURL('image/jpeg', 0.3) || '';
      },
      clearCanvas: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveToHistory();
            onDrawingChange();
          }
        }
      },
      loadImage: (dataUrl: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              saveToHistory();
              onDrawingChange();
            }
          };
          img.src = dataUrl;
        }
      },
      undo: () => {
        if (historyStep > 0) {
          const newStep = historyStep - 1;
          setHistoryStep(newStep);
          restoreFromHistory(newStep);
          onDrawingChange();
        }
      },
      redo: () => {
        if (historyStep < history.length - 1) {
          const newStep = historyStep + 1;
          setHistoryStep(newStep);
          restoreFromHistory(newStep);
          onDrawingChange();
        }
      },
      canUndo: () => historyStep > 0,
      canRedo: () => historyStep < history.length - 1,
    }));

    const restoreFromHistory = (step: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = history[step];
    };

    return (
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="cursor-crosshair border-4 border-gray-300 rounded-lg bg-white"
        style={{ 
          display: 'block',
          width: '100%',
          height: 'auto',
          touchAction: 'none'
        }}
      />
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas;