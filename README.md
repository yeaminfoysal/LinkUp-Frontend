<div align="left">
  <h1>LinkUp - Frontend</h1>
  <p>
    LinkUp is a next-generation professional networking platform designed to seamlessly connect individuals through the power of Artificial Intelligence. By leveraging advanced natural language processing and semantic search, the platform completely redefines how professionals discover and interact with each other. It combines blazing-fast real-time messaging with a highly engaging social feed, all wrapped in a stunning, modern user interface.
  </p>
</div>

---

## 🌟 Key Features

### 🤖 AI-Powered Professional Matchmaking
Forget simple keyword searches. The platform uses **Natural Language Processing** and **Vector Similarity** to understand exactly what is being searched for. 
- **Semantic Search:** Descriptive queries like *"a UI designer with 3 years of React experience"* allow the AI to find the perfect match.
- **AI Match Insights:** Customized, AI-generated reasoning snippets explain exactly *why* a specific profile matched the search criteria.

### 💬 Instant & Seamless Real-Time Chat
Instant connections with the professional network are maintained without refreshing the page.
- **Live Online Presence:** Real-time visibility of active users on the platform.
- **Lightning Fast Messaging:** Zero-latency communication powered by WebSockets.

### 📝 Dynamic & Engaging Social Feed
Thoughts, achievements, and portfolios can be shared seamlessly.
- **Rich Media Sharing:** Effortless uploading and sharing of images or articles.
- **Interactive Networking:** Posts can be liked, comments replied to, and important content saved for later viewing.

### 🛡️ Iron-clad Security & Personalization
Data security and privacy are strictly prioritized.
- **JWT Authentication:** Secure and encrypted login sessions.
- **Premium Aesthetics:** Stunning, glassmorphism-inspired UI with fully supported **Dark Mode** & **Light Mode** themes.

---

## 🛠️ Full Project Tech Stack (Frontend & Backend)

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **[Next.js](https://nextjs.org/)** | React Framework for production |
| **Frontend** | **[React](https://reactjs.org/)** | UI Library |
| **Frontend** | **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework for styling |
| **Frontend** | **[Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)** | Global state management & server state caching |
| **Backend** | **[NestJS](https://nestjs.com/)** | Progressive Node.js framework for scalable server-side apps |
| **Backend** | **[Prisma](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/)** | Next-generation ORM and primary relational database |
| **AI & Search** | **[pgvector](https://github.com/pgvector/pgvector)** | Postgres extension for vector similarity search |
| **AI & Search** | **[Google Gemini AI](https://ai.google.dev/)** | Generating embeddings and dynamic match reasoning |
| **Real-Time** | **[Socket.IO](https://socket.io/)** | Real-time bidirectional event-based communication |
| **Auth**| **[Passport & JWT](https://www.passportjs.org/)** | Stateless authentication and authorization |
| **Cloud** | **[Cloudinary](https://cloudinary.com/)** | Cloud-based image and video management |

---

## 🚀 Setup & Environment Instructions

### Prerequisites
Make sure Node.js (v18+) and npm are installed.

### 1. Clone the Repository
```bash
git clone <repository_url>
cd LinkUp/LinkUp-Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with a browser to see the application.

---

## 🧠 Challenges Faced

- **Managing Global State with WebSockets:** Ensuring that incoming WebSocket events smoothly updated the UI without causing unnecessary re-renders was challenging. This was solved by effectively combining Zustand for global UI states and TanStack Query for server state caching.
- **AI Search Range Normalization:** Dealing with "asymmetric semantic search" where raw similarity scores appeared artificially low (around 60-70%). A custom normalization logic was implemented to scale scores up to a more human-readable 0-100% format.
- **Handling API Quotas Gracefully:** Robust error states were implemented to gracefully fallback to default texts when the backend hit Gemini AI Free Tier rate limits (429 Too Many Requests).

---

## 🚀 Future Enhancements

- **📞 Video & Audio Calling Feature:** Integration of WebRTC to allow seamless direct calling from the chat interface.
- **🌐 Multi-language Support:** Adding i18n support to make the platform accessible to a global audience.
- **📊 Advanced Analytics Dashboard:** Providing insights into profile views and connection growth.