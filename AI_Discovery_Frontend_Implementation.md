# 🤖 AI-Powered User Discovery — Frontend Implementation Guide

This document outlines the implementation plan, component structure, and design ideas for integrating the AI-powered natural language user search into the NexChat/LinkUp frontend.

---

## 🏗️ 1. Architecture & Component Structure

### Pages
- **`/discovery` or `/explore`**: The main page for finding new people.

### Components
1. **`AIDiscoveryPage` (Page Component)**
   - Wraps the entire layout.
   - Manages global state for this feature (search query, results, loading status).

2. **`AISearchBar` (Component)**
   - A large, prominent text area or input field.
   - Handles `onChange` and `onSubmit` events.
   - Debounces the input if you want auto-search (though manual submit is safer for rate limits).

3. **`SearchResultsList` (Component)**
   - Renders a grid or list of `UserCard` components.
   - Handles the "Empty State" (no results) and "Loading State" (skeleton loaders).

4. **`MatchCard` / `UserCard` (Component)**
   - Displays the user's avatar, name, and basic info.
   - **Crucial Additions:** 
     - 🎯 **Match Score Indicator:** A circular progress bar or glowing badge showing the percentage.
     - 💡 **AI Match Reason:** A small, styled tooltip or text block explaining *why* they matched (e.g., "NestJS developer in Dhaka").

5. **`MatchScoreBadge` (Micro-component)**
   - Color-coded based on score (e.g., Green for >80%, Yellow for 60-80%).

---

## 🎨 2. UI/UX Design Ideas & Aesthetics

To make this feature feel truly **Premium and AI-driven**, we need modern aesthetics:

### A. The "Magic" Search Bar
- **Placeholder Text:** Use typewriter animations for the placeholder. Example: *"Try searching for 'React developers in Dhaka'..."* or *"Find a tech co-founder..."*
- **Visuals:** 
  - Add a subtle glowing border when focused.
  - Include a sparkly "AI Icon" (✨) on the submit button instead of a standard search glass.
  - Use a sleek, glassmorphic container (backdrop-blur) for the search bar area.

### B. Loading States (Skeleton & Animations)
- Instead of a boring spinner, use a **pulsing skeleton layout** that mimics the result cards.
- Add a text hint while loading: *"✨ AI is analyzing profiles..."* or *"🔍 Computing vector similarities..."* to make it feel advanced.

### C. The Result Cards (Match Cards)
- **Layout:** Masonry or a clean Grid.
- **Hover Effects:** 
  - Slight scale up (`transform: scale(1.02)`).
  - A subtle gradient shadow appears on hover.
- **Match Score UI:**
  - A glowing ring around the user's avatar representing the score.
  - Or a pill-shaped badge in the top right corner: `🔥 92% Match`.
- **Match Reason Section:**
  - Display the `matchReason` with an AI sparkle icon next to it.
  - Use a slightly different background color (e.g., a very faint purple/blue gradient) for the reason box to indicate it's AI-generated.

### D. Empty States
- If no users are found, show a beautiful, custom illustration (maybe an astronaut looking through a telescope).
- Suggest alternative queries to the user.

---

## 🔌 3. API Integration

### Endpoint Setup (Axios / Fetch)

Create a service function in your API utility folder:

```typescript
// src/services/aiDiscovery.service.ts
import api from './api'; // Your axios instance

export interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  matchScore: number;
  matchReason: string;
  isOnline: boolean;
  // ... other fields
}

export const searchUsersViaAI = async (query: string): Promise<SearchResult[]> => {
  const response = await api.post('/ai/search-users', { query });
  return response.data;
};
```

### State Management (React Query / SWR)

It is highly recommended to use **React Query** for this to handle caching, loading, and error states gracefully:

```typescript
// src/hooks/useAISearch.ts
import { useMutation } from '@tanstack/react-query';
import { searchUsersViaAI } from '../services/aiDiscovery.service';

export const useAISearch = () => {
  return useMutation({
    mutationFn: (query: string) => searchUsersViaAI(query),
  });
};
```

### Example Usage in Component

```tsx
const { mutate: searchUsers, data: results, isPending, error } = useAISearch();

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (query.length >= 3) {
    searchUsers(query);
  }
};
```

---

## 🛡️ 4. Handling Edge Cases & Errors

1. **Rate Limiting (429 Too Many Requests):**
   - The backend limits searches to 10 per minute.
   - **Frontend mitigation:** Add a debounce to the search if it's auto-submitting. If the user hits the limit, show a friendly toast: *"Whoa, slow down! Let the AI take a breath. Try again in a minute."*
   - Disable the search button temporarily if they hit the limit.

2. **Query Too Short (400 Bad Request):**
   - Disable the submit button until the input has at least 3 characters.

3. **Empty Database / No Embeddings:**
   - Since users need embeddings to be searched, if a user gets 0 results, prompt them with: *"No perfect matches found. Try broadening your search!"*

---

## 🚀 5. Step-by-Step Implementation Plan

1. **Create the UI Mockups / Base Components:** Build the `AISearchBar` and `MatchCard` with dummy data first to get the styling perfect.
2. **Setup API Service:** Add the axios calls for `/ai/search-users`.
3. **Connect State:** Hook up the search bar to the API using React Query or local state.
4. **Implement Loading/Error UI:** Add the skeleton loaders and toast notifications for errors.
5. **Add Micro-interactions:** Add the hover effects, glowing borders, and typewriter placeholders to polish the experience.
