🛒 Apex Systems | AI-Powered E-Commerce Platform
A production-grade e-commerce storefront designed to prove that AI agents can seamlessly replace traditional retail sales consultants. Instead of browsing static filters, users interact with a 24/7 AI Architect that analyzes their needs, budget, and workflow to engineer the perfect custom PC and build their cart in real-time.

🧠 Core Architecture & Features
- AI Sales Consultant (Groq / Llama 3.3): A floating, persistent chat widget that acts as an enterprise sales rep. It uses LLM Function Calling to parse user intent, check hardware compatibility rules, and return strict JSON product recommendations directly into the chat UI.
- Custom LLM Fine-Tuning (HuggingFace / QLoRA): To prove AI engineering capabilities, a custom Llama-3-8B model was fine-tuned via QLoRA on a synthetic dataset of PC-building conversations. The model was trained on Google Colab and deployed to HuggingFace. (Note: To ensure zero-latency for this live demo without incurring GPU hosting costs, the production API is routed to Groq's Llama-3.3 endpoint).
- Full-Stack Auth & Database (Supabase): Implemented secure user authentication and a PostgreSQL database with Row Level Security (RLS). Users can sign up, log in, and save AI-generated builds directly to their profile.
- Dynamic E-Commerce UI: A premium, dark-mode storefront inspired by iBuyPower/Newegg. Features fully responsive category pages with working sidebar filters (React State management for Price/Brand/GPU filtering).
- Functional Support Modules: A dynamic support section featuring a mock Order Tracking system (generates random 1-7 day ETAs), an accordion FAQ, and warranty info.

🛠 Tech Stack
- Frontend: Next.js 14 (App Router), React, Tailwind CSS, TypeScript
- Backend: Next.js Serverless API Routes
- Database & Auth: Supabase (PostgreSQL)
- AI/LLM: Groq (Llama-3.3-70b) with native JSON mode parsing
- Custom LLM Training: HuggingFace transformers, peft, trl (QLoRA 4-bit Quantization)

💻 Engineering Highlights
- Resilient LLM Parsing: Implemented bulletproof JSON extraction logic and context-window slicing (messages.slice(-6)) to prevent rate-limit crashes and ensure zero frontend failures during multi-turn conversations.
- State Synchronization: Managed complex React state for cross-component UI updates, including a persistent shopping cart utilizing browser localStorage.
- Security First Approach: Enforced database-level security using Supabase Row Level Security (RLS) so users can only access their own saved builds. API keys are strictly handled server-side via Next.js environment variables.
- Rapid Prototyping: Demonstrated the power of AI-orchestrated development by taking a complex, multi-page e-commerce platform from zero to fully functional in a matter of days.

🚀 Live Demo
URL: [Insert your Vercel URL here once deployed]
