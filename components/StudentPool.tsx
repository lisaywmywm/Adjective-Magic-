
import React, { useState, useRef } from 'react';
import type { Student } from '../types';
import { PlusIcon, TrashIcon, UserGroupIcon } from './icons';

interface StudentPoolProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onRemoveStudent: (studentId: string) => void;
  onSelectStudent: (student: Student) => void;
  selectedStudent1: Student | null;
  selectedStudent2: Student | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const StudentPool: React.FC<StudentPoolProps> = ({ students, onAddStudent, onRemoveStudent, onSelectStudent, selectedStudent1, selectedStudent2 }) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentFile, setNewStudentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewStudentFile(e.target.files[0]);
    }
  };

  const handleAddClick = async () => {
    if (!newStudentName.trim() || !newStudentFile) {
      setError('Please provide a name and a photo.');
      return;
    }
    setError(null);
    try {
      const photo = await fileToBase64(newStudentFile);
      const newStudent: Student = {
        id: new Date().toISOString(),
        name: newStudentName.trim(),
        photo,
      };
      onAddStudent(newStudent);
      setNewStudentName('');
      setNewStudentFile(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    } catch (err) {
      setError('Could not process the image file.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg h-full animate-fade-in">
      <h2 className="text-2xl font-bold font-display text-gray-700 mb-4 flex items-center gap-2">
        <UserGroupIcon className="w-7 h-7 text-purple-500" />
        Student Pool
      </h2>
      
      <div className="space-y-3 mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Student's Name"
          className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition"
        />
        <button
          onClick={handleAddClick}
          className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Student
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {students.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No students yet!</p>
          <p className="text-sm text-gray-400">Add a student to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {students.map((student) => {
            const isSelected1 = selectedStudent1?.id === student.id;
            const isSelected2 = selectedStudent2?.id === student.id;
            const isSelected = isSelected1 || isSelected2;
            return (
              <div key={student.id} className="relative group animate-pop-in">
                <button
                  onClick={() => onSelectStudent(student)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                    isSelected1 ? 'border-pink-500 ring-4 ring-pink-300' : isSelected2 ? 'border-teal-500 ring-4 ring-teal-300' : 'border-transparent hover:border-purple-400'
                  }`}
                >
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                </button>
                <p className="text-center text-sm font-semibold mt-1 truncate text-gray-700">{student.name}</p>
                <button 
                  onClick={() => onRemoveStudent(student.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label={`Remove ${student.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentPool;
