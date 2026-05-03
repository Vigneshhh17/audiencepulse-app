#AudiencePulse 
Paste a YouTube link. Understand your audience in seconds.

🔗 Live Demo: audiencepulse-app.vercel.app

#What it does
AudiencePulse analyzes the top 100 comments from any YouTube video and returns:

Sentiment breakdown — positive, negative and neutral percentages
What people loved — top 3 things the audience praised
Top complaints — top 3 frictions viewers mentioned
Questions people asked — top 3 unanswered questions in the comments
One line summary — plain English description of the video based purely on what commenters said


#How it works
User pastes YouTube URL
        │
        ▼
┌─────────────────┐
│   Frontend      │  React + Vite (Vercel)
│  AudiencePulse  │  User enters URL → clicks Analyze
└────────┬────────┘
         │ GET request
         ▼
┌─────────────────┐
│   n8n Webhook   │  Receives URL
│   (Railway)     │  Extracts video ID
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  YouTube Data   │  Fetches top 100 comments
│    API v3       │  via Google Cloud API
└────────┬────────┘
         │ Raw comment data
         ▼
┌─────────────────┐
│   Groq API      │  LLaMA 3.3 70B analyzes comments
│  LLaMA 3.3 70B  │  Returns structured JSON insights
└────────┬────────┘
         │ JSON response
         ▼
┌─────────────────┐
│   Frontend      │  Displays sentiment bars,
│   Dashboard     │  scores, insights and summary
└─────────────────┘

#Tech Stack
LayerTechnologyFrontendReact, Vite, TailwindCSSAutomationn8n (self-hosted on Railway)DataYouTube Data API v3AIGroq API — LLaMA 3.3 70BHostingVercel (frontend) + Railway (backend)

Local Setup
bashgit clone https://github.com/Vigneshhh17/audiencepulse-app
cd audiencepulse-app
npm install
npm run dev

You will need:

YouTube Data API v3 key → console.cloud.google.com
Groq API key → console.groq.com
n8n instance (local or Railway)


#n8n Workflow
The automation pipeline consists of 5 nodes:

Webhook — receives GET request with YouTube URL
Extract Video ID — parses video ID from any YouTube URL format
HTTP Request — fetches top 100 comments via YouTube Data API v3
Groq AI — sends comments to LLaMA 3.3 70B for analysis
Respond to Webhook — returns clean JSON to frontend


#Results Example
json{
  "sentiment_score": 97,
  "positive_percent": 85,
  "negative_percent": 5,
  "neutral_percent": 10,
  "top_questions": [
    "Who are the other commentators in this video?",
    "Was this block goaltending?",
    "Who else is here after LeBron's recent block?"
  ],
  "top_complaints": [
    "The video was sped up to make the block look better",
    "Referees missed a goaltending call",
    "This wasn't the most impactful play in the game"
  ],
  "what_people_loved": [
    "LeBron's historic block",
    "The excitement of the game",
    "The Cavaliers winning the championship"
  ],
  "one_line_summary": "LeBron James' iconic block in the 2016 NBA Finals is widely regarded as one of the greatest plays in NBA history."
}
