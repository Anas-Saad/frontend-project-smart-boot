import axios from 'axios';

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
  }

  // Generate AI response using OpenAI
  async generateResponse(message, context = {}) {
    try {
      if (!this.openaiApiKey) {
        return this.generateMockResponse(message, context);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(context)
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;

    } catch (error) {
      console.error('AI response generation error:', error);
      return this.generateMockResponse(message, context);
    }
  }

  // Build system prompt based on business context
  buildSystemPrompt(context) {
    const { businessType, businessDescription, persona, language = 'ar' } = context;

    let prompt = `You are an AI assistant for a ${businessType} business. `;
    
    if (businessDescription) {
      prompt += `Business description: ${businessDescription}. `;
    }

    switch (persona) {
      case 'doctor':
        prompt += 'You are a medical professional assistant. Provide helpful health information but always recommend consulting with a healthcare provider for medical advice. ';
        break;
      case 'engineer':
        prompt += 'You are a technical engineering assistant. Provide accurate technical information and solutions. ';
        break;
      case 'shop_assistant':
        prompt += 'You are a helpful sales assistant. Focus on understanding customer needs and recommending appropriate products. ';
        break;
      default:
        prompt += 'You are a helpful customer service assistant. ';
    }

    if (language === 'ar') {
      prompt += 'Respond in Arabic. Be polite, professional, and helpful. ';
    } else {
      prompt += 'Respond in English. Be polite, professional, and helpful. ';
    }

    return prompt;
  }

  // Generate mock response for development/fallback
  generateMockResponse(message, context) {
    const { language = 'ar', persona = 'general' } = context;

    const responses = {
      ar: {
        general: [
          'شكراً لتواصلك معنا. كيف يمكنني مساعدتك اليوم؟',
          'أهلاً وسهلاً! أنا هنا لمساعدتك في أي استفسار.',
          'مرحباً! يسعدني أن أساعدك. ما الذي تحتاج إليه؟'
        ],
        doctor: [
          'مرحباً! أنا مساعد طبي ذكي. كيف يمكنني مساعدتك في استفساراتك الصحية؟',
          'أهلاً بك! يرجى وصف الأعراض أو الاستفسار الطبي وسأحاول مساعدتك.',
          'مرحباً! أنا هنا لتقديم المعلومات الصحية العامة. ما استفسارك؟'
        ],
        engineer: [
          'مرحباً! أنا مساعد هندسي متخصص. كيف يمكنني مساعدتك في المسائل التقنية؟',
          'أهلاً! أنا هنا لحل المشاكل التقنية والهندسية. ما التحدي الذي تواجهه؟',
          'مرحباً! يمكنني مساعدتك في الاستشارات الهندسية والتقنية.'
        ]
      },
      en: {
        general: [
          'Thank you for contacting us. How can I help you today?',
          'Hello! I\'m here to assist you with any questions.',
          'Hi! I\'m happy to help. What do you need?'
        ],
        doctor: [
          'Hello! I\'m a medical AI assistant. How can I help with your health questions?',
          'Welcome! Please describe your symptoms or medical inquiry.',
          'Hi! I\'m here to provide general health information. What\'s your question?'
        ],
        engineer: [
          'Hello! I\'m a technical engineering assistant. How can I help with technical matters?',
          'Hi! I\'m here to solve technical and engineering problems. What challenge are you facing?',
          'Welcome! I can assist you with engineering consultations and technical issues.'
        ]
      }
    };

    const personaResponses = responses[language][persona] || responses[language].general;
    return personaResponses[Math.floor(Math.random() * personaResponses.length)];
  }

  // Moderate content using AI
  async moderateContent(content, language = 'ar') {
    try {
      // Simple keyword-based moderation for demo
      const inappropriateKeywords = {
        ar: ['كلمة سيئة', 'محتوى غير مناسب'],
        en: ['inappropriate', 'spam', 'offensive']
      };

      const keywords = inappropriateKeywords[language] || inappropriateKeywords.en;
      const isInappropriate = keywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      );

      return {
        isAppropriate: !isInappropriate,
        confidence: isInappropriate ? 0.9 : 0.1,
        reason: isInappropriate ? 'Contains inappropriate content' : 'Content is appropriate'
      };

    } catch (error) {
      console.error('Content moderation error:', error);
      return {
        isAppropriate: true,
        confidence: 0.5,
        reason: 'Moderation service unavailable'
      };
    }
  }

  // Recommend products based on message
  async recommendProducts(message, products, context = {}) {
    try {
      // Simple keyword matching for demo
      const messageWords = message.toLowerCase().split(' ');
      
      const scoredProducts = products.map(product => {
        let score = 0;
        
        // Check name matches
        const nameWords = (product.name + ' ' + product.nameAr).toLowerCase().split(' ');
        nameWords.forEach(word => {
          if (messageWords.includes(word)) score += 3;
        });
        
        // Check category matches
        const categoryWords = (product.category + ' ' + product.categoryAr).toLowerCase().split(' ');
        categoryWords.forEach(word => {
          if (messageWords.includes(word)) score += 2;
        });
        
        // Check tags matches
        product.tags.forEach(tag => {
          if (messageWords.includes(tag.toLowerCase())) score += 1;
        });
        
        return { ...product, score };
      });

      // Return top 3 products with score > 0
      return scoredProducts
        .filter(product => product.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    } catch (error) {
      console.error('Product recommendation error:', error);
      return [];
    }
  }

  // Analyze sentiment of message
  async analyzeSentiment(message, language = 'ar') {
    try {
      // Simple sentiment analysis for demo
      const positiveWords = {
        ar: ['ممتاز', 'رائع', 'جيد', 'شكراً', 'أحب'],
        en: ['excellent', 'great', 'good', 'thanks', 'love', 'amazing']
      };

      const negativeWords = {
        ar: ['سيء', 'مشكلة', 'لا أحب', 'فظيع'],
        en: ['bad', 'problem', 'hate', 'terrible', 'awful']
      };

      const positive = positiveWords[language] || positiveWords.en;
      const negative = negativeWords[language] || negativeWords.en;

      const messageWords = message.toLowerCase().split(' ');
      
      let positiveScore = 0;
      let negativeScore = 0;

      messageWords.forEach(word => {
        if (positive.includes(word)) positiveScore++;
        if (negative.includes(word)) negativeScore++;
      });

      let sentiment = 'neutral';
      let confidence = 0.5;

      if (positiveScore > negativeScore) {
        sentiment = 'positive';
        confidence = Math.min(0.9, 0.5 + (positiveScore * 0.1));
      } else if (negativeScore > positiveScore) {
        sentiment = 'negative';
        confidence = Math.min(0.9, 0.5 + (negativeScore * 0.1));
      }

      return {
        sentiment,
        confidence,
        scores: {
          positive: positiveScore,
          negative: negativeScore,
          neutral: messageWords.length - positiveScore - negativeScore
        }
      };

    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        scores: { positive: 0, negative: 0, neutral: 1 }
      };
    }
  }
}

export default new AIService();