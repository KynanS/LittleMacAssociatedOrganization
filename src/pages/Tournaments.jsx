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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      setTournaments(getUniqueTournaments(tournamentData).sort());
      setPlayers(getUniquePlayers(tournamentData).sort());
      setRaces(getUniqueRaces(tournamentData).sort());
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
    const raceCounts = filteredData.reduce((acc, match) => {
      acc[match.race] = (acc[match.race] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(raceCounts).map(([race, count]) => ({
      name: race,
      value: count
    }));
  };

  const getMatchupStats = () => {
    const matchups = filteredData.reduce((acc, match) => {
      const matchup = `${match.race}v${match.opponentRace}`;
      acc[matchup] = (acc[matchup] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(matchups).map(([matchup, count]) => ({
      matchup,
      count
    }));
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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
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
                  outerRadius={150}
                  label
                >
                  {getRaceDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}>
                      <RaceIcon race={entry.name} size={16} />
                    </Cell>
                  ))}
                </Pie>
                <Tooltip />
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