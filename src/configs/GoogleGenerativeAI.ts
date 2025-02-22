import { GoogleGenerativeAI } from '@google/generative-ai';

import { GOOGLE_API_KEY } from '@/configs/env.js';

// Create a new instance of the GoogleGenerativeAI class
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export default model;
