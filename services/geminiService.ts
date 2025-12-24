import { GoogleGenAI, Type } from "@google/genai";
import { AQIResult, PollutantData, AIAnalysis } from "../types.ts";

export const getAIAnalysis = async (aqi: AQIResult, data: PollutantData): Promise<AIAnalysis> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    console.warn("Gemini API Key is missing or default. Please update the .env file with your actual API_KEY.");
    return {
      healthAdvice: "Please configure your Gemini API Key in the .env file to receive personalized AI health insights.",
      precautions: ["Check your .env file", "Ensure API_KEY variable is set", "Restart the application"],
      impactSummary: "AI analysis is currently unavailable due to missing credentials."
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    As an environmental health expert specializing in Indian air quality standards, analyze this specific reading:
    
    CONTEXT:
    Location: ${data.location || 'Unknown'}
    Reading Time: ${data.timestamp}
    Overall AQI: ${aqi.aqiValue} (${aqi.category})
    Primary Pollutant: ${aqi.mainPollutant}
    
    POLLUTANT LEVELS:
    PM2.5: ${data.pm25} µg/m³
    PM10: ${data.pm10} µg/m³
    NO2: ${data.no2} µg/m³
    NH3: ${data.nh3} µg/m³
    SO2: ${data.so2} µg/m³
    CO: ${data.co} mg/m³
    O3: ${data.o3} µg/m³

    Provide a professional analysis in JSON focusing on:
    1. healthAdvice: Specific advice for people in this location.
    2. precautions: 3-4 actionable steps.
    3. impactSummary: 1-sentence environmental summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthAdvice: { type: Type.STRING },
            precautions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            impactSummary: { type: Type.STRING }
          },
          required: ["healthAdvice", "precautions", "impactSummary"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      healthAdvice: "Air quality is currently impacting health. Standard precautions are recommended.",
      precautions: ["Wear a mask outdoors", "Keep windows closed", "Use an air purifier"],
      impactSummary: `Current AQI indicates ${aqi.category} conditions at the reported location.`
    };
  }
};