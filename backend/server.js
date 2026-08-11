const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is missing');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/test-gemini', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: 'Say hello in one short sentence.'
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({ error: 'Gemini request failed' });
  }
});

app.get('/list-models', async (req, res) => {
  try {
    const models = await ai.models.list();
    const availableModels = [];

    for await (const model of models) {
      availableModels.push({
        name: model.name,
        supportedActions: model.supportedActions
      });
    }

    res.json(availableModels);
  } catch (error) {
    console.error('Model list error:', error);
    res.status(500).json({ error: 'Could not list models' });
  }
});

app.post('/classify', async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({
        error: 'Image and mimeType are required'
      });
    }

    const base64Image = image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image
          }
        },
        {
           text: `Analyze this image and classify it into ONE of these categories: dog breed, car brand, or city name.

Respond with ONLY valid JSON using exactly this format:
{
  "type": "dog" | "car" | "city" | "unknown",
  "classification": "the specific breed, brand, or city name",
  "confidence": "high" | "medium" | "low",
  "description": "1-2 sentence explanation of what you see and why this classification makes sense"
}

Rules:
- Use "dog" for dog breed images.
- Use "car" for car brand images.
- Use "city" for recognizable city/location images.
- Use "unknown" if the image does not clearly belong to one of those categories.
- Do not use markdown.
- Return JSON only.`
        }
      ]
    });

    const text = response.text.trim();
    const classification = JSON.parse(text);

res.json(classification);

  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({
      error: 'Classification failed'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});