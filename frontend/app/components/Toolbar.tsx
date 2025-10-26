'use client';

import React from 'react';
import { Save, Undo, Redo, Eraser, Pen, Trash2 } from 'lucide-react';

interface ToolbarProps {
  tool: 'pen' | 'eraser';
  setTool: (tool: 'pen' | 'eraser') => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded transition-colors ${
            tool === 'pen'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Pen"
        >
          <Pen size={20} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded transition-colors ${
            tool === 'eraser'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
          title="Color"
        />

        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="px-3 py-2 border rounded bg-white text-black cursor-pointer"
        >
          <option value="1">Thin</option>
          <option value="2">Normal</option>
          <option value="4">Medium</option>
          <option value="8">Thick</option>
          <option value="16">Very Thick</option>
        </select>

        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo size={20} />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          title="Clear"
        >
          <Trash2 size={20} />
        </button>

        <div className="ml-auto">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={20} />
            Save as Version
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;