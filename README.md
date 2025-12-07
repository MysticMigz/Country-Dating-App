# Country Checklist App

A futuristic Next.js application for tracking countries you've visited. Built with MongoDB, Mongoose, and a beautiful interactive world map.

## Features

- 🔐 User authentication (Login/Register)
- 🗺️ Interactive world map with clickable countries
- 📊 Progress tracking with statistics
- 💾 Persistent data storage with MongoDB
- 🎨 Modern, futuristic UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Mongoose
- **Database**: MongoDB
- **UI**: Tailwind CSS, Custom components
- **Map**: react-simple-maps
- **State Management**: Zustand
- **Authentication**: JWT tokens

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
  - Local: `mongodb://localhost:27017/country-checklist`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/country-checklist`
- `JWT_SECRET`: A secret key for JWT token signing (use a strong random string)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── countries/    # Country tracking endpoints
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   └── CountryMap.tsx    # World map component
├── lib/
│   ├── mongodb.ts        # MongoDB connection
│   ├── auth.ts           # Authentication utilities
│   ├── countries.ts      # Country data
│   └── utils.ts          # Utility functions
├── models/
│   └── User.ts           # User model
└── store/
    └── authStore.ts      # Zustand store for auth state
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Explore Map**: View the interactive world map
3. **Mark Countries**: Click on countries to mark them as visited
4. **Track Progress**: View your statistics and progress percentage

## UI Framework Recommendation

This app uses **Tailwind CSS** for styling, which provides:
- Modern, futuristic design with dark theme
- Gradient effects and glassmorphism
- Responsive design
- Custom component system

For even more advanced UI components, you could integrate:
- **shadcn/ui**: Already compatible with the current setup
- **Framer Motion**: For smooth animations
- **react-spring**: For physics-based animations

## License

MIT

