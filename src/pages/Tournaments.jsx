import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { loadTournamentData, getUniqueTournaments, getUniquePlayers, getUniqueRaces, filterData } from '../utils/dataLoader';
import RaceIcon from '../components/RaceIcon';

const COLORS = {
  'p': '#FFD700', // Yellow for Protoss
  't': '#1E90FF', // Blue for Terran
  'z': '#9370DB', // Purple for Zerg
};

const RACE_NAMES = {
  'p': 'Protoss',
  't': 'Terran',
  'z': 'Zerg'
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[name.toLowerCase()]}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

function Tournaments() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [races, setRaces] = useState([]);
  const [filters, setFilters] = useState({
    tournaments: [],
    players: [],
    races: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const tournamentData = await loadTournamentData();
      setData(tournamentData);
      setFilteredData(tournamentData);
      
      // Sort tournaments numerically
      const sortedTournaments = getUniqueTournaments(tournamentData)
        .sort((a, b) => parseInt(a) - parseInt(b));
      setTournaments(sortedTournaments);
      
      setPlayers(getUniquePlayers(tournamentData).sort());
      const validRaces = getUniqueRaces(tournamentData)
        .filter(race => race && ['z', 't', 'p'].includes(race.toLowerCase()))
        .sort();
      setRaces(validRaces);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(filterData(data, filters));
  }, [filters, data]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getRaceDistribution = () => {
    // Get matches for selected tournaments
    const tournamentMatches = filters.tournaments.length > 0
      ? data.filter(match => filters.tournaments.includes(match.tournament))
      : data;

    // Get unique players and their races from the tournament matches
    const playerRaces = new Map();
    
    tournamentMatches.forEach(match => {
      // Process Player 1
      if (match.player && match.race) {
        const playerName = match.player;
        const race = match.race.toLowerCase();
        
        if (!playerRaces.has(playerName)) {
          playerRaces.set(playerName, { 'p': 0, 't': 0, 'z': 0 });
        }
        const races = playerRaces.get(playerName);
        if (['p', 't', 'z'].includes(race)) {
          races[race]++;
        }
      }

      // Process Player 2
      if (match.opponent && match.opponentRace) {
        const playerName = match.opponent;
        const race = match.opponentRace.toLowerCase();
        
        if (!playerRaces.has(playerName)) {
          playerRaces.set(playerName, { 'p': 0, 't': 0, 'z': 0 });
        }
        const races = playerRaces.get(playerName);
        if (['p', 't', 'z'].includes(race)) {
          races[race]++;
        }
      }
    });

    // Count players by their main race
    const raceCounts = {
      'p': 0,
      't': 0,
      'z': 0
    };

    playerRaces.forEach((races, playerName) => {
      const mainRace = Object.entries(races)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      
      if (mainRace) {
        raceCounts[mainRace]++;
      }
    });

    return Object.entries(raceCounts)
      .filter(([_, count]) => count > 0)
      .map(([race, count]) => ({
        name: race,
        value: count
      }));
  };

  const normalizeMatchup = (race1, race2) => {
    const [r1, r2] = [race1.toLowerCase(), race2.toLowerCase()].sort();
    return `${r1}v${r2}`;
  };

  const getMatchupStats = () => {
    const matchups = {};
    
    filteredData.forEach(match => {
      if (match.race && match.opponentRace && 
          ['z', 't', 'p'].includes(match.race.toLowerCase()) && 
          ['z', 't', 'p'].includes(match.opponentRace.toLowerCase())) {
        const matchup = normalizeMatchup(match.race, match.opponentRace);
        matchups[matchup] = (matchups[matchup] || 0) + 1;
      }
    });

    return Object.entries(matchups)
      .map(([matchup, count]) => ({
        matchup,
        count
      }))
      .sort((a, b) => a.matchup.localeCompare(b.matchup));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tournament Analytics
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tournaments</InputLabel>
              <Select
                multiple
                value={filters.tournaments}
                onChange={(e) => handleFilterChange('tournaments', e.target.value)}
                input={<OutlinedInput label="Tournaments" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {tournaments.map((tournament) => (
                  <MenuItem key={tournament} value={tournament}>
                    {tournament}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Players</InputLabel>
              <Select
                multiple
                value={filters.players}
                onChange={(e) => handleFilterChange('players', e.target.value)}
                input={<OutlinedInput label="Players" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {players.map((player) => (
                  <MenuItem key={player} value={player}>
                    {player}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Races</InputLabel>
              <Select
                multiple
                value={filters.races}
                onChange={(e) => handleFilterChange('races', e.target.value)}
                input={<OutlinedInput label="Races" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <RaceIcon race={value} size={16} />
                            <Typography variant="body2">{value}</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                {races.map((race) => (
                  <MenuItem key={race} value={race}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RaceIcon race={race} />
                      <Typography>{race}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, pb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Race Distribution
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={getRaceDistribution()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={renderCustomizedLabel}
                >
                  {getRaceDistribution().map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase()]}>
                      <RaceIcon race={entry.name} size={16} />
                    </Cell>
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, RACE_NAMES[name.toLowerCase()]]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Matchup Distribution
            </Typography>
            <ResponsiveContainer>
              <BarChart data={getMatchupStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="matchup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Tournaments; 