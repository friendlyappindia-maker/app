
import { GoogleGenAI } from "@google/genai";

// Helper to safely get the AI instance
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "PLACEHOLDER_API_KEY") {
    console.warn("Gemini API Key is missing or invalid. AI features will be disabled.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }
};

export const getSmartDiagnosisSummary = async (diagnosisNotes: string): Promise<string> => {
  const ai = getAIInstance();
  if (!ai || !diagnosisNotes) return diagnosisNotes;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following medical diagnosis notes into a clear, concise professional summary for a referring general physician. Use professional medical terminology but be brief: ${diagnosisNotes}`,
      config: {
          systemInstruction: "You are a senior surgical consultant summarizing clinical findings for a referring family doctor."
      }
    });
    return response.text || diagnosisNotes;
  } catch (error) {
    console.error("Gemini Error in getSmartDiagnosisSummary:", error);
    return diagnosisNotes;
  }
};

export const generatePatientNotification = async (hospitalName: string, doctorName: string): Promise<string> => {
  const ai = getAIInstance();
  if (!ai) return `Hello, ${doctorName} has referred you to ${hospitalName}. Please contact them at your convenience.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, reassuring WhatsApp message for a patient who has just been referred. Include Hospital: ${hospitalName} and Referring Doctor: ${doctorName}. Keep it professional and empathetic.`,
    });
    return response.text || "Referral successful.";
  } catch (error) {
    console.error("Gemini Error in generatePatientNotification:", error);
    return "Referral successful.";
  }
};
