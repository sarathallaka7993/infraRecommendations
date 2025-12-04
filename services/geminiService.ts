import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are an expert Cloud Infrastructure Architect assisting a user with a dashboard that visualizes two specific scenarios.

**Context:**
The user is viewing a dashboard with two scenarios:
1. **Student Management Application (AWS Serverless)**
   - **Architecture:** AWS Lambda, API Gateway, DynamoDB.
   - **Issues:**
     - Cold Start Latency (~980ms) due to Lambda init and first DB query.
     - Resource Constraints (100% memory utilization) leading to CPU throttling.
     - API Gateway Integration Latency correlated with Lambda issues.
     - 5XX Execution Timeouts during bulk inserts (1000 students).
   - **Recommendations:** Increase Lambda memory (scales CPU), enable SnapStart/Provisioned Concurrency, use DynamoDB Accelerator (DAX), optimize code, increase API Gateway timeouts.

2. **Voting Application (Kubernetes on EC2)**
   - **Architecture:** K8s on EC2, Prometheus, Grafana.
   - **Issues:**
     - High NXDOMAIN Errors (79% of responses) due to CoreDNS network congestion.
     - Memory Underutilization (over-provisioned resources).
   - **Recommendations:** Scale CoreDNS pods to reduce DNS errors. Reduce allocated disk/memory to save costs (Right-sizing).

**Your Goal:**
Answer questions about these scenarios, explain the metrics, justify the recommendations, and provide cloud best practices. Keep answers concise, professional, and helpful. If the user asks about something unrelated to cloud infrastructure or these scenarios, politely steer them back.
`;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key is missing. Please check your environment configuration.";
  }
  
  try {
    const session = getChatSession();
    const result = await session.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the cloud insights engine right now. Please try again later.";
  }
};