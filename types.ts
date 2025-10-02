
export interface Student {
  id: string;
  name: string;
  photo: string; // Base64 data URL
}

export interface GeneratedImage {
  id: string;
  imageUrl: string; // Base64 data URL from Gemini
  prompt: string;
  student1Name: string;
  student2Name: string;
  adjective: string;
}
