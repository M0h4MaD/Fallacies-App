import { Router } from 'express';
import { ai, GEMINI_MODEL } from '../config/gemini.js';

const router = Router();

router.post('/test-gemini', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: 'أعطني كلمة واحدة فقط: شغال',
    });

    return res.json({
      success: true,
      geminiResponse: response.text,
    });
  } catch (error: any) {
    console.error('❌ Direct Gemini Test Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect to Gemini via proxy',
      errorDetails: error,
    });
  }
});

export default router;
