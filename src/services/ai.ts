import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.warn("VITE_GEMINI_API_KEY is not set. AI features will be disabled.");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContentStream = async (prompt: string) => {
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
        throw new Error("VITE_GEMINI_API_KEY is not configured.");
    }
    const result = await model.generateContentStream(prompt);
    return result.stream;
};

export const isAIConfigured = () => {
    return !!apiKey && apiKey !== 'YOUR_API_KEY';
}
