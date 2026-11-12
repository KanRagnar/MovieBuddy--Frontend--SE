# MovieBuddy Frontend (React + Vite)

Standalone React web application for **MovieBuddy**, built according to the UI wireframes, OpenAPI specification, and User Stories, integrated directly with the Node.js/Express REST API backend.

## Features & Screens
1. **Login / Register (`/login`)**: Authenticate with backend (`GET /user/login`) or create a new user account (`POST /user`).
2. **Home / Discover Titles (`/`)**: Browse movies & series by genre, search by keywords (`GET /title`, `GET /title/search`), and click any title for details.
3. **Title Details & Reviews (`/title/:titleId`)**: View synopsis, release date, duration/seasons, toggle Favorites (`POST/DELETE /title/:titleId/AddToFavorites`), and create/edit/delete reviews (`POST /title/:titleId/Review`, `PUT/DELETE /review/:reviewId`).
4. **Watch With / Swiping (`/swipe`)**: View one user profile at a time, toggle between profile photo & their favorite movies, and swipe left/right (`POST /user/:userId/swipe`) with instant match alerts.
5. **Profile & Favorite List (`/profile`)**: Edit profile fields (`Made in`, `Job`, `Into`, `Education`, `Sex`), toggle profile visibility (`PUT /user/:userId`), and manage your Favorite List.
6. **Messages & Chat (`/messages`)**: View matched buddies, send messages (`POST /user/:senderId/text`), and delete individual messages (`DELETE /text/:textId`).

## Setup & Run
1. Make sure `moviebuddy-backend` is running on `http://localhost:3000`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser (default demo credentials: `sampleuser` / `samplepassword`).
