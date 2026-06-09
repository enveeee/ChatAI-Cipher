# ChatAI — Cipher 🤖

A real-time multi-room chat application with a built-in AI assistant named **Cipher**, powered by Groq's Llama 3.3.

## Features
- 💬 Real-time messaging with Socket.io
- 🏠 Multiple chat rooms
- ✦ AI assistant — type `@cipher` to summon Cipher
- ⚡ Live typing indicators
- 📊 Analytics dashboard
- 🔐 JWT authentication with NextAuth

## Tech Stack
- **Frontend:** Next.js 16, React, TypeScript
- **Backend:** Node.js, Socket.io
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Auth:** NextAuth.js + bcrypt
- **AI:** Groq API (Llama 3.3)

## Getting Started

### 1. Clone the repo
\`\`\`bash
git clone https://github.com/yourusername/chatai-cipher.git
cd chatai-cipher
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables
Create a `.env` file:
\`\`\`env
DATABASE_URL="your-neon-postgresql-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3002"
\`\`\`

### 4. Push database schema
\`\`\`bash
npx prisma db push
\`\`\`

### 5. Run the app
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Usage
- Register an account → land in **#general** room
- Type a message and hit Enter
- Type `@cipher your question` to ask the AI assistant
- Visit `/dashboard` for analytics

## Author
**Sanskruti Varade** — [linkedin.com/in/varades](https://linkedin.com/in/varades) | [nidhiidev.vercel.app](https://nidhiidev.vercel.app)