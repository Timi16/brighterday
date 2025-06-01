import Constants from 'expo-constants';

// Secure API key handling - in a real production app, use environment variables or a secure vault
// For development, we'll use a placeholder that should be replaced with your key through environment variables
const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || '';

/**
 * Send a message to the OpenAI API
 * @param {string} message - The user's message
 * @param {Array} history - Previous conversation history
 * @returns {Promise<Object>} - The API response
 */
export const sendMessageToOpenAI = async (message, history = []) => {
  try {
    // Format the conversation history for the OpenAI API
    const messages = [
      { role: "system", content: "You are Sunny, a compassionate and supportive parenting assistant focused on helping parents navigate challenges and build positive relationships with their children. Provide warm, practical, and evidence-based advice that's easy to understand and implement. You are empathetic but also concise. You never make users feel judged and always validate their feelings and experiences. Your tone is warm, personable, and encouraging." },
      ...history.map(item => ({
        role: item.type === 'user' ? 'user' : 'assistant',
        content: item.text
      })),
      { role: "user", content: message }
    ];

    // Make the API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error communicating with OpenAI');
    }

    const data = await response.json();
    return {
      reply: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

/**
 * Generate parenting tips based on a specific topic
 * @param {string} topic - The parenting topic to generate tips for
 * @returns {Promise<Array>} - Array of tips
 */
export const generateParentingTips = async (topic) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a parenting expert who provides practical, evidence-based advice. Format your response as a JSON array of tip objects."
          },
          {
            role: "user",
            content: `Generate 5 helpful parenting tips about "${topic}". Each tip should include a title, summary (1-2 sentences), and detailed content (3-4 paragraphs). Format as a JSON array of objects with fields: title, summary, and content.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error generating tips with OpenAI');
    }

    const data = await response.json();
    const tipsString = data.choices[0].message.content;
    const tipsObject = JSON.parse(tipsString);
    
    return tipsObject.tips || [];
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};
