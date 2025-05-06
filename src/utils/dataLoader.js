import Papa from 'papaparse';

export const loadTournamentData = async () => {
  try {
    const response = await fetch('/data/LMSL_Matches.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          // Transform the data to match our expected format
          const transformedData = results.data.map(row => ({
            tournament: row.LMSL,
            player: row['Player 1 Name'],
            race: row['Player 1 Faction'],
            opponent: row['Player 2 Name'],
            opponentRace: row['Player 2 Faction'],
            result: row.Winner === '1' ? 'win' : 'loss',
            date: new Date().toISOString().split('T')[0], // Using current date as placeholder
            group: row.Group,
            groupStage: row['Group Stage'],
            matchNumber: row['Match Number'],
            player1Score: row['Player 1 Score'],
            player2Score: row['Player 2 Score']
          }));
          resolve(transformedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading tournament data:', error);
    return [];
  }
};

export const getUniqueTournaments = (data) => {
  return [...new Set(data.map(row => row.tournament))];
};

export const getUniquePlayers = (data) => {
  return [...new Set(data.map(row => row.player))];
};

export const getUniqueRaces = (data) => {
  return [...new Set(data.map(row => row.race))];
};

export const filterData = (data, filters) => {
  return data.filter(row => {
    if (filters.tournaments && filters.tournaments.length > 0) {
      if (!filters.tournaments.includes(row.tournament)) return false;
    }
    if (filters.players && filters.players.length > 0) {
      if (!filters.players.includes(row.player)) return false;
    }
    if (filters.races && filters.races.length > 0) {
      if (!filters.races.includes(row.race)) return false;
    }
    return true;
  });
}; 