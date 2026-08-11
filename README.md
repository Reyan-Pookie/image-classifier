# 🖼️ AI Image Classifier

An AI-powered image classification web application that uses **Google Gemini** to analyze images and identify **dog breeds, car brands, and cities**.

## ✨ Features

- 🐕 **Dog Breed Classification** — Identifies dog breeds from uploaded images.
- 🚗 **Car Brand Classification** — Identifies recognizable car brands.
- 🏙️ **City Classification** — Identifies recognizable cities and locations.
- 🎯 **Confidence Level** — Displays the confidence of the classification.
- 📝 **AI Description** — Provides a short explanation of what Gemini sees.
- 🖼️ **Image Preview** — Preview an image before classification.
- 🔐 **Secure API Key Handling** — Gemini API credentials are stored using environment variables.

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- CORS

### AI

- Google Gemini API
- `@google/genai`

## 🏗️ Project Architecture

```text
User uploads image
        ↓
React Frontend
        ↓
POST /classify
        ↓
Node.js + Express Backend
        ↓
Google Gemini API
        ↓
Structured JSON response
        ↓
React displays classification
```

## 📁 Project Structure

```text
image-classifier/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 🚀 Getting Started

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/Reyan-Pookie/image-classifier.git
cd image-classifier
```

### 2. Install dependencies

Install the frontend dependencies:

```bash
npm install
```

Then install the backend dependencies:

```bash
cd backend
npm install
```

### 3. Add your Gemini API key

Go back to the project root:

```bash
cd ..
```

Create a file named `.env` in the project root.

Inside `.env`, add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

**Never upload your `.env` file or your API key to GitHub.**

### 4. Start the backend

Open a terminal in the `backend` folder:

```bash
cd backend
node server.js
```

You should see:

```text
Backend running on http://localhost:3000
```

### 5. Start the frontend

Open a **second terminal** in the project root:

```bash
npm run dev
```

You should see:

```text
Local: http://localhost:5173/
```

Open that address in your browser.

### 6. Use the classifier

1. Upload an image.
2. Preview the image.
3. Click **Classify Image**.
4. Gemini analyzes the image.
5. The application displays the category, classification, confidence, and description.

## 🧪 Supported Classifications

| Category | Example |
|---|---|
| 🐕 Dog Breed | German Shepherd |
| 🚗 Car Brand | Toyota |
| 🏙️ City | New York |

The application can also return **Unknown** when an image does not clearly belong to one of the supported categories.

## 🔐 Environment Variables

The application uses the following environment variable:

```env
GEMINI_API_KEY=
```

The real `.env` file is excluded from Git using `.gitignore`.

For other developers, use `.env.example` as a template.

## 🎯 Example Result

For a German Shepherd image, Gemini can return:

```json
{
  "type": "dog",
  "classification": "German Shepherd",
  "confidence": "high",
  "description": "A German Shepherd dog with a black and tan coat standing alert on a beach near ocean waves."
}
```

## 🔮 Future Improvements

- Add more image categories.
- Improve classification accuracy.
- Add image classification history.
- Add drag-and-drop image uploads.
- Add confidence visualization.
- Deploy the application publicly.
- Add automated testing.
- Improve mobile responsiveness.

## 👨‍💻 Author

**Reyan-Pookie**

Built using React, Node.js, Express, and Google Gemini.