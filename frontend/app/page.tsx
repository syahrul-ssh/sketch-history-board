'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Canvas, { CanvasHandle } from './components/Canvas';
import { Sketch, sketchApi } from '@/service/api';
import Toolbar from './components/Toolbar';
import HistoryPanel from './components/HistoryPanel';

export default function Home() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [showHistory, setShowHistory] = useState(false);
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    loadSketches();
  }, []);

  const loadSketches = async () => {
    setIsLoading(true);
    try {
      const data = await sketchApi.getAllSketches();
      setSketches(data);
    } catch (error) {
      console.error('Failed to load sketches:', error);
      alert('Failed to load sketches. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    const title = prompt('Enter a title for this version:') || 'Untitled';
    const imageData = canvasRef.current.getImageData();
    const thumbnail = canvasRef.current.getThumbnail();

    try {
      const newSketch = await sketchApi.createSketch(title, imageData, thumbnail);
      setSketches([newSketch, ...sketches]);
      alert('Version saved successfully!');
    } catch (error) {
      console.error('Failed to save sketch:', error);
      alert('Failed to save sketch. Make sure the backend is running.');
    }
  };

  const handleRestore = async (sketch: Sketch) => {
    if (canvasRef.current) {
      // Fetch the full image from Supabase URL
      try {
        const response = await fetch(sketch.imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          canvasRef.current?.loadImage(dataUrl);
        };
        
        reader.readAsDataURL(blob);
        setShowHistory(false);
      } catch (error) {
        console.error('Failed to load image:', error);
        alert('Failed to load image from storage.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this version?')) return;

    try {
      await sketchApi.deleteSketch(id);
      setSketches(sketches.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete sketch:', error);
      alert('Failed to delete sketch.');
    }
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
    updateUndoRedo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
    updateUndoRedo();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      canvasRef.current?.clearCanvas();
      updateUndoRedo();
    }
  };

  const updateUndoRedo = () => {
    setCanUndo(canvasRef.current?.canUndo() || false);
    setCanRedo(canvasRef.current?.canRedo() || false);
  };

  const handleDrawingChange = () => {
    updateUndoRedo();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Sketch History Board</h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Clock size={20} />
              History ({sketches.length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className={showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <Toolbar
                tool={tool}
                setTool={setTool}
                color={color}
                setColor={setColor}
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClear={handleClear}
                onSave={handleSave}
                canUndo={canUndo}
                canRedo={canRedo}
              />

              <Canvas
                ref={canvasRef}
                tool={tool}
                color={color}
                lineWidth={lineWidth}
                onDrawingChange={handleDrawingChange}
              />
            </div>

            {showHistory && (
              <div className="lg:col-span-1">
                <HistoryPanel
                  sketches={sketches}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}