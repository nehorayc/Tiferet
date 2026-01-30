# Tiferet - Synagogue Digital Signage System

## Project Overview

**Tiferet** is a Hebrew-language digital signage web application designed specifically for synagogues. It serves as a maintenance-free, serverless information display system that runs continuously on TV screens in synagogue lobbies, displaying automated, rotating content without requiring manual intervention.

### Core Purpose
- Display community announcements and messages
- Show prayer times (zmanim) and Hebrew calendar information
- Present Shabbat times and weekly Torah portion (parsha)
- Broadcast special occasion notices (mazal tov, memorials, alerts)

## Technology Stack

### Frontend Framework
- **React 19.2.0** - Modern component-based UI framework
- **Vite 7.2.4** - Fast development server and build tool
- **Tailwind CSS 3.4.19** - Utility-first styling with RTL support

### Key Libraries
- **@hebcal/core** - Jewish calendar and prayer times calculations
- **papaparse** - CSV parsing for Google Sheets integration
- **axios** - HTTP client for API calls
- **date-fns** - Date manipulation and formatting
- **lucide-react** - Icon library
- **clsx & tailwind-merge** - Utility functions for conditional styling

### Deployment
- **GitHub Pages** - Static hosting for the production application

## Architecture

### System Design
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Google Sheets │────│   React App      │────│   TV Display    │
│   (Database)    │    │   (Frontend)     │    │   (Client)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
  Settings & Messages     Client-side          Static web page
  (CSV format)          processing           hosted on GitHub
                       (no backend)
```

### Data Flow
1. **Google Sheets** acts as the database (published as public CSV)
2. **React app** fetches data every 5 minutes using PapaParse
3. **Hebcal API** provides Jewish calendar and prayer times
4. **Content** is filtered by date range and displayed in rotating carousel

## Component Architecture

### Main Application Structure
- **App.jsx** - Main controller component with layout management
- **main.jsx** - React application entry point

### Core Components

#### Header.jsx
Top information bar displaying:
- Current parsha (Torah portion)
- Shabbat candle lighting times
- Havdalah times
- Rabenu Tam times
- Holiday information

#### Sidebar.jsx
Right sidebar (25% width) showing:
- Digital clock with current time
- Hebrew and Gregorian dates
- Daily prayer times (zmanim) with auto-scroll
- Visual indicators for different time categories

#### Carousel.jsx
Main content area (75% width) handling:
- Slide rotation based on configured duration
- Navigation dots showing progress
- Progress bar for time remaining on current slide

#### SlideCard.jsx
Content rendering factory supporting multiple slide types:
- **info**: General announcements (blue theme)
- **alert**: Important notices (red theme, animated)
- **mazaltov**: Congratulations (gold theme, festive)
- **memorial**: Memorials (subdued gray theme)
- **times**: Prayer schedules (blue theme)
- **image**: Full-screen images/flyers

## Custom Hooks

### useGoogleSheets.js
Data management hook that:
- Fetches CSV data from Google Sheets every 5 minutes
- Parses settings and messages separately
- Filters messages by date range (startDate/endDate)
- Handles Hebrew character encoding

### useHebcal.js
Jewish calendar integration hook that:
- Calculates daily prayer times for Jerusalem
- Determines Hebrew dates and parsha information
- Computes Shabbat times (candles, havdalah)
- Updates hourly for accuracy

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server with HMR
npm run build    # Production build to /dist folder
npm run preview  # Preview production build locally
npm run lint     # ESLint code quality checks
npm run deploy   # Deploy to GitHub Pages
```

### Development Environment
- Hot Module Replacement for fast development
- ESLint for code quality
- Vite for optimized builds
- GitHub Pages for deployment

## Design Patterns and Conventions

### RTL (Right-to-Left) Design
- All text uses `direction: rtl` and Hebrew locale
- Flexbox layouts consider RTL behavior
- Hebrew fonts (Frank Ruhl Libre) for authentic typography

### Styling Conventions
- Gold accent color (#d4af37) for synagogue aesthetic
- Semi-transparent backgrounds with blur effects
- Custom ornate borders for content cards
- High contrast for TV viewing from distance

### Data Structure
- Google Sheets with two tabs: `Settings` and `Messages`
- Messages require `startDate`/`endDate` for automatic filtering
- Type-based rendering system for different content categories

## Performance Considerations

### Optimization Strategies
- Efficient polling intervals (5 min for data, 1 hour for zmanim)
- Component memoization to prevent unnecessary re-renders
- Lazy loading and error boundaries for robustness
- Static asset optimization through Vite

### Accessibility Features
- Large, readable fonts for distance viewing
- High contrast color schemes
- Semantic HTML structure
- Screen reader friendly markup

## Key Features

### Automated Content Management
- Serverless architecture using Google Sheets as database
- Automatic date-based content filtering
- Configurable slide rotation timing
- Real-time updates without page refresh

### Jewish Calendar Integration
- Accurate prayer times for Jerusalem
- Hebrew calendar with parsha information
- Shabbat and holiday timing calculations
- Candle lighting and havdalah times

### Visual Design
- Elegant synagogue-appropriate aesthetic
- RTL typography with Hebrew fonts
- Animated transitions and visual effects
- Responsive layout for various screen sizes

## Deployment Strategy

### Production Deployment
1. Build: `npm run build` creates static assets in `/dist`
2. Push to GitHub repository
3. GitHub Pages serves from `/dist` folder
4. TV displays the GitHub Pages URL in kiosk mode

### Maintenance Benefits
- No server infrastructure required
- Content updates through Google Sheets interface
- Automatic deployments via GitHub Actions
- Zero-downtime updates

## Target Environment

### Hardware Requirements
- Modern TV with web browser capabilities
- Stable internet connection
- Kiosk mode or fullscreen browser operation

### Content Management
- Non-technical users can update content via Google Sheets
- No coding knowledge required for daily operations
- Immediate content updates with 5-minute refresh cycle

This architecture creates a completely serverless, maintenance-free digital signage solution that can be managed entirely through Google Sheets, making it ideal for synagogue communities without technical staff.