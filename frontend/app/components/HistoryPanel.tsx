'use client';

import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Sketch } from '@/service/api';

interface HistoryPanelProps {
  sketches: Sketch[];
  onRestore: (sketch: Sketch) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  sketches,
  onRestore,
  onDelete,
  isLoading,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 max-h-[700px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Saved Versions</h2>
      {isLoading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : sketches.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No saved versions yet</p>
      ) : (
        <div className="space-y-4">
          {sketches.map((sketch) => (
            <div key={sketch.id} className="bg-white rounded-lg p-3 shadow">
              <img
                src={sketch.thumbnailUrl}
                alt={sketch.title}
                className="w-full h-32 object-cover rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onRestore(sketch)}
                crossOrigin="anonymous"
              />
              <p className="text-sm font-medium text-gray-800 mb-1">{sketch.title}</p>
              <p className="text-xs text-gray-600 mb-2">
                {new Date(sketch.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onRestore(sketch)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
                <button
                  onClick={() => onDelete(sketch.id)}
                  className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;