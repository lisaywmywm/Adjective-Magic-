
import React, { useState, useCallback, useMemo } from 'react';
import { Student, GeneratedImage } from './types';
import { ADJECTIVES } from './constants';
import { generateComparativeImage } from './services/geminiService';
import StudentPool from './components/StudentPool';
import ComparisonStage from './components/ComparisonStage';
import Gallery from './components/Gallery';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent1, setSelectedStudent1] = useState<Student | null>(null);
  const [selectedStudent2, setSelectedStudent2] = useState<Student | null>(null);
  const [adjective, setAdjective] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (selectedStudent1?.id === studentId) setSelectedStudent1(null);
    if (selectedStudent2?.id === studentId) setSelectedStudent2(null);
  };

  const handleSelectStudent = (student: Student) => {
    if (selectedStudent1?.id === student.id) {
      setSelectedStudent1(null);
    } else if (selectedStudent2?.id === student.id) {
      setSelectedStudent2(null);
    } else if (!selectedStudent1) {
      setSelectedStudent1(student);
    } else if (!selectedStudent2) {
      setSelectedStudent2(student);
    }
  };

  const handleDrawAdjective = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ADJECTIVES.length);
    setAdjective(ADJECTIVES[randomIndex]);
  }, []);

  const handleGenerateMagic = useCallback(async () => {
    if (!selectedStudent1 || !selectedStudent2 || !adjective) {
      setError("Please select two students and draw an adjective.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { imageUrl, text } = await generateComparativeImage(selectedStudent1, selectedStudent2, adjective);
      
      const newImage: GeneratedImage = {
        id: new Date().toISOString(),
        imageUrl,
        prompt: text || "Generated with Adjective Magic",
        student1Name: selectedStudent1.name,
        student2Name: selectedStudent2.name,
        adjective,
      };
      
      setGeneratedImages((prev) => [newImage, ...prev]);

    } catch (err) {
      console.error(err);
      setError("Oops! The magic spell failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudent1, selectedStudent2, adjective]);
  
  const latestImage = useMemo(() => generatedImages.length > 0 ? generatedImages[0] : null, [generatedImages]);

  return (
    <div className="min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4">
            <SparklesIcon className="w-12 h-12 text-pink-500" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
              Adjective Magic
            </h1>
            <SparklesIcon className="w-12 h-12 text-teal-500" />
          </div>
          <p className="mt-2 text-lg text-gray-600">Create funny pictures and learn English adjectives!</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StudentPool 
              students={students}
              onAddStudent={handleAddStudent}
              onRemoveStudent={handleRemoveStudent}
              onSelectStudent={handleSelectStudent}
              selectedStudent1={selectedStudent1}
              selectedStudent2={selectedStudent2}
            />
          </div>
          <div className="lg:col-span-2">
            <ComparisonStage
              student1={selectedStudent1}
              student2={selectedStudent2}
              adjective={adjective}
              onDrawAdjective={handleDrawAdjective}
              onGenerate={handleGenerateMagic}
              isLoading={isLoading}
              error={error}
              resultImage={latestImage}
              onClearSelection={() => {
                setSelectedStudent1(null);
                setSelectedStudent2(null);
                setAdjective('');
              }}
            />
          </div>
        </main>
        
        <Gallery generatedImages={generatedImages} />
      </div>
    </div>
  );
};

export default App;
