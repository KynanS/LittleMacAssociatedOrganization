# The LittleMac Associated Organization

A modern web application for analyzing StarCraft II tournament data. Built with React, Material-UI, and Recharts.

## Features

- Dark mode interface
- Interactive data visualization
- Dynamic filtering by tournament, player, and race
- Detailed tournament and player statistics
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your tournament data CSV file in the `public/data` directory as `tournament_data.csv`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## CSV Data Format

The application expects a CSV file with the following columns:
- tournament: Tournament name
- player: Player name
- race: Player's race (Terran, Protoss, Zerg)
- opponent: Opponent's name
- opponentRace: Opponent's race
- result: Match result (win/loss)
- date: Match date

## Deployment

The application is configured for GitHub Pages deployment. After building, the files will be in the `dist` directory.

## Technologies Used

- React
- Material-UI
- Recharts
- Vite
- PapaParse (CSV parsing)