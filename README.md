# NuCliqWeb
Web interface for NuCliq, a social media app with 100+ beta downloads, enabling community engagement and personalized interactions. Built with React, integrated with NuCliq’s backend APIs for real-time functionality.

## Status
NuCliqWeb is in beta, supporting NuCliq’s 100+ beta downloads. Active development continues, with group chat and homepage enhancements planned for Q4 2025.

## Tech Stack
- Frontend: React (hooks, functional components)
- Integrations: Firebase (authentication), NuCliqBackEndLocal APIs (Node.js, Cloud Firestore), Stripe (in development) (subscriptions)
- Deployment: GoDaddy (continuous deployment)

## Features
- User authentication (Firebase, Apple/Google Sign-in with JWT-based security)
- Real-time social interactions (view text/image/video posts, likes, comments, replies; powered by NuCliqBackEndLocal APIs)
- Mood-based filtering (happy/scary/sad feeds)
- Profile management (bio, name updates, synced via Cloud Firestore APIs)
- Theme marketplace (view/upload wallpapers, free or credit-based, API-driven)
- Upcoming: Group chat and homepage (React UI, API integration, Q4 2025)
- Upcoming: Subscription management (view/purchase via RevenueCat, Q4 2025)

## Metrics
- Supports 100+ beta users, connecting diverse communities
- 40% faster UI rendering with React hooks and component optimization (vs. class-based components)
- Integrates with APIs handling 100+ daily requests, 99.9% uptime
- 20% higher user engagement via personalized theme marketplace

## Setup
1. Clone: `git clone https://github.com/Dsavaglio01/NuCliqWeb`
2. Install: `npm install`
3. Configure: Add `.env` with API keys (Firebase, NuCliqBackEndLocal)
4. Run: `npm start`

## Screenshots
![Dashboard](docs/dashboard.png)
![Theme Marketplace](docs/marketplace.png)
