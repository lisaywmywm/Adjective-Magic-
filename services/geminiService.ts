import { GoogleGenAI, Modality } from "@google/genai";
import { Student } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(",")[1],
      mimeType,
    },
  };
};

export const generateComparativeImage = async (
  student1: Student,
  student2: Student,
  adjective: string
): Promise<{ imageUrl: string; text: string | null }> => {
  const model = 'gemini-2.5-flash-image-preview';

  const imagePart1 = fileToGenerativePart(student1.photo, "image/jpeg");
  const imagePart2 = fileToGenerativePart(student2.photo, "image/jpeg");

  const prompt = `Your task is to create a single, unified, exaggerated, fun, and cute cartoon-style image.
The most critical instruction is to use the exact faces from the two photos provided and seamlessly blend them onto new cartoon bodies. Do not alter their faces.
The image should compare the two children based on the adjective "${adjective}".
Make the child named ${student1.name} exemplify this adjective far more than the child named ${student2.name}.
The final image must contain both children.
At the bottom of the image, add a clear text label for ${student1.name} under their character, and a clear text label for ${student2.name} under theirs.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [imagePart1, imagePart2, { text: prompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  let imageUrl: string | null = null;
  let text: string | null = null;

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      text = part.text;
    } else if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  if (!imageUrl) {
    throw new Error("Image generation failed. No image was returned.");
  }
  
  return { imageUrl, text };
};