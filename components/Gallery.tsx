
import React from 'react';
import type { GeneratedImage } from '../types';
import { PhotoIcon } from './icons';

interface GalleryProps {
  generatedImages: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ generatedImages }) => {
  if (generatedImages.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold font-display text-gray-700 mb-6 flex items-center gap-3">
        <PhotoIcon className="w-8 h-8 text-pink-500" />
        Magic Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {generatedImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 animate-pop-in">
            <img src={image.imageUrl} alt={image.prompt} className="w-full h-auto object-cover" />
            <div className="p-4">
              <p className="font-bold text-gray-800">
                {image.student1Name} vs. {image.student2Name}
              </p>
              <p className="text-sm text-purple-600 font-semibold">{image.adjective}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
