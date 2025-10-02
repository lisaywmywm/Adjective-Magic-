import React from 'react';
import type { Student, GeneratedImage } from '../types';
import { ShuffleIcon, SparklesIcon, XCircleIcon } from './icons';
import Spinner from './Spinner';


interface ComparisonStageProps {
  student1: Student | null;
  student2: Student | null;
  adjective: string;
  onDrawAdjective: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  resultImage: GeneratedImage | null;
  onClearSelection: () => void;
}

const StudentPlaceholder: React.FC<{ number: number; bgColor: string }> = ({ number, bgColor }) => (
  <div className={`w-full h-full flex flex-col items-center justify-center rounded-2xl bg-opacity-50 ${bgColor} border-2 border-dashed border-white/50`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white ${bgColor}`}>
      {number}
    </div>
    <p className="mt-2 text-sm text-gray-600 font-semibold">Select Student {number}</p>
  </div>
);

const ComparisonStage: React.FC<ComparisonStageProps> = ({ student1, student2, adjective, onDrawAdjective, onGenerate, isLoading, error, resultImage, onClearSelection }) => {
  const isReady = student1 && student2 && adjective;

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in animation-delay-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-display text-gray-700">Magic Stage</h2>
        {(student1 || student2 || adjective) && (
          <button onClick={onClearSelection} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition">
            <XCircleIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
        {/* Comparison Area */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="aspect-square">
            {student1 ? (
              <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-pink-500 shadow-md">
                <img src={student1.photo} alt={student1.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <StudentPlaceholder number={1} bgColor="bg-pink-400" />
            )}
            <p className="text-center font-bold mt-2 text-lg text-pink-600">{student1?.name || '...'}</p>
          </div>
          <div className="aspect-square">
            {student2 ? (
              <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-teal-500 shadow-md">
                <img src={student2.photo} alt={student2.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <StudentPlaceholder number={2} bgColor="bg-teal-400" />
            )}
            <p className="text-center font-bold mt-2 text-lg text-teal-600">{student2?.name || '...'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={onDrawAdjective}
            disabled={!student1 || !student2}
            className="w-full max-w-xs bg-amber-400 text-amber-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <ShuffleIcon className="w-5 h-5" />
            Draw an Adjective
          </button>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-inner w-full max-w-xs h-16 flex items-center justify-center">
            <p className="text-2xl font-display font-bold text-purple-600">{adjective || '?'}</p>
          </div>
          
          <button
            onClick={onGenerate}
            disabled={!isReady || isLoading}
            className={`w-full max-w-xs font-bold py-4 px-4 rounded-lg transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 text-xl ${
                !isReady || isLoading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 animate-pulse-strong'
            }`}
          >
            <SparklesIcon className="w-6 h-6" />
            Make Magic!
          </button>
        </div>
      </div>
      
      {/* Result Display */}
      <div className="bg-gray-100 rounded-lg p-4 min-h-[256px] flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-purple-600 font-semibold animate-pulse">Casting a fun spell...</p>
            <p className="text-sm text-gray-500">This can take a moment!</p>
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : resultImage ? (
          <div className="w-full animate-pop-in">
            <img src={resultImage.imageUrl} alt={resultImage.prompt} className="max-w-full max-h-96 mx-auto rounded-lg shadow-xl" />
          </div>
        ) : (
          <p className="text-gray-500">The magic result will appear here!</p>
        )}
      </div>
    </div>
  );
};

export default ComparisonStage;