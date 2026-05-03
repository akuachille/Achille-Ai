import { GoogleGenAI, Modality } from "@google/genai";
import { 
  MODEL_THINKING, 
  MODEL_LITE, 
  MODEL_TTS, 
  MODEL_IMAGE_ANALYSIS, 
  MODEL_IMAGE_GEN,
  MAX_THINKING_BUDGET 
} from '../constants';
import { GenerationOptions } from '../types';

// Initialize the API client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates text or image response based on user input and options.
 */
export const generateResponse = async (
  prompt: string,
  options: GenerationOptions & { isBananaMode?: boolean }
): Promise<{ text?: string; image?: string; sources?: { title: string; url: string }[] }> => {
  try {
    const isImageAnalysis = !!options.image && !options.isBananaMode;
    const isImageGen = options.isBananaMode;
    
    // Determine the model to use
    let modelName = MODEL_LITE;
    let config: any = {};

    if (isImageGen) {
      modelName = MODEL_IMAGE_GEN;
      config.imageConfig = { aspectRatio: "1:1" };
    } else if (options.useThinking && !isImageAnalysis) {
      modelName = MODEL_THINKING;
      config.thinkingConfig = { thinkingBudget: MAX_THINKING_BUDGET };
    } else if (isImageAnalysis) {
      modelName = MODEL_IMAGE_ANALYSIS;
    } else {
      modelName = MODEL_LITE;
    }

    const parts: any[] = [];
    
    // Add Image if present (for analysis OR editing)
    if (options.image) {
      const base64Data = options.image.split(',')[1];
      const mimeType = options.image.split(';')[0].split(':')[1];
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Add Text Prompt
    parts.push({ text: prompt });

    const tools: any[] = [];
    if (options.useSearch) tools.push({ googleSearch: {} });
    if (options.useCode) tools.push({ codeExecution: {} });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        ...config,
        tools: tools.length > 0 ? tools : undefined,
        toolConfig: tools.length > 0 ? { includeServerSideToolInvocations: true } : undefined
      }
    });

    let result: { text?: string; image?: string; sources?: { title: string; url: string }[] } = {};

    // Extract Grounding Sources (Google Search)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      result.sources = chunks
        .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
        .filter(Boolean);
    }

    for (const candidate of response.candidates) {
      if (!candidate.content?.parts) continue;
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          result.image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          result.text = (result.text || "") + part.text;
        } else if (part.executableCode) {
          result.text = (result.text || "") + `\n\n\`\`\`${part.executableCode.language}\n${part.executableCode.code}\n\`\`\``;
        } else if (part.codeExecutionResult) {
          result.text = (result.text || "") + `\n\n**Output:**\n\`\`\`\n${part.codeExecutionResult.output}\n\`\`\``;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: `Error: ${error instanceof Error ? error.message : "Something went wrong"}` };
  }
};

/**
 * Generates speech from text using the TTS model.
 */
export const generateSpeech = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TTS,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) throw new Error("No audio data returned");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return await audioContext.decodeAudioData(bytes.buffer);
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const playAudioBuffer = (buffer: AudioBuffer) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};