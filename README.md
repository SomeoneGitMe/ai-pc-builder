🛒 Apex Systems | AI-Powered E-Commerce Platform
A production-grade e-commerce storefront designed to prove that AI agents can seamlessly replace traditional retail sales consultants. Instead of browsing static filters, users interact with a 24/7 AI Architect that analyzes their needs, budget, and workflow to engineer the perfect custom PC and build their cart in real-time.

🧠 Core Architecture & Features
AI Sales Consultant (Groq / Llama 3.3): A floating, persistent chat widget that acts as an enterprise sales rep. It uses LLM Function Calling to parse user intent, check hardware compatibility rules, and return strict JSON product recommendations.
Full-Stack Auth & Database (Supabase): Implemented secure user authentication and a PostgreSQL database with Row Level Security (RLS). Users can sign up, log in, and save AI-generated builds directly to their profile.
Dynamic E-Commerce UI: A premium, dark-mode storefront inspired by iBuyPower/Newegg. Features fully responsive category pages (Gaming PCs, Workstations, Laptops) with working sidebar filters (React State management for Price/Brand/GPU filtering).
AI-Augmented Development: Architected and deployed in a rapid, AI-augmented workflow. Utilized multi-agent orchestration for system design, debugging, and deployment, proving the ability to ship full-stack applications 10x faster than traditional development cycles.

🛠 Tech Stack
Frontend: Next.js 14 (App Router), React, Tailwind CSS, TypeScript
Backend: Next.js Serverless API Routes
Database & Auth: Supabase (PostgreSQL)
AI/LLM: Groq (Llama-3.3-70b) with native JSON mode parsing
Deployment: Vercel (Ready for Deployment)

💻 Engineering Highlights
Resilient LLM Parsing: Implemented bulletproof JSON extraction logic to handle LLM response variance, ensuring zero frontend crashes during AI generation.
State Synchronization: Managed complex React state for cross-component UI updates (e.g., AI chat bubble opening from multiple CTA buttons across different page layouts).
Security First Approach: Enforced database-level security using Supabase Row Level Security (RLS) so users can only access their own saved builds. API keys are strictly handled server-side via Next.js environment variables.
Rapid Prototyping: Demonstrated the power of AI-orchestrated development by taking a complex, multi-page e-commerce platform from zero to fully functional in a matter of hours.

🚀 Live Demo
URL: [Insert your Vercel URL here once deployed]