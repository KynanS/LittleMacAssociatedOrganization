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
  LineChart,
  Line,
} from 'recharts';
import { loadTournamentData, getUniquePlayers, getUniqueTournaments, filterData } from '../utils/dataLoader';
import RaceIcon from '../components/RaceIcon';

function Players() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [filters, setFilters] = useState({
    players: [],
    tournaments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const tournamentData = await loadTournamentData();
      setData(tournamentData);
      setFilteredData(tournamentData);
      setPlayers(getUniquePlayers(tournamentData).sort());
      setTournaments(getUniqueTournaments(tournamentData).sort());
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

  const getPlayerStats = () => {
    const playerStats = {};
    
    filteredData.forEach(match => {
      if (!playerStats[match.player]) {
        playerStats[match.player] = {
          wins: 0,
          losses: 0,
          total: 0,
          race: match.race,
        };
      }
      
      playerStats[match.player].total++;
      if (match.result === 'win') {
        playerStats[match.player].wins++;
      } else {
        playerStats[match.player].losses++;
      }
    });

    return Object.entries(playerStats).map(([player, stats]) => ({
      player,
      winRate: (stats.wins / stats.total) * 100,
      totalMatches: stats.total,
      race: stats.race,
    }));
  };

  const getPlayerMatchupStats = (player) => {
    const matchupStats = {};
    
    filteredData
      .filter(match => match.player === player)
      .forEach(match => {
        const matchup = `${match.race}v${match.opponentRace}`;
        if (!matchupStats[matchup]) {
          matchupStats[matchup] = { wins: 0, total: 0 };
        }
        matchupStats[matchup].total++;
        if (match.result === 'win') {
          matchupStats[matchup].wins++;
        }
      });

    return Object.entries(matchupStats).map(([matchup, stats]) => ({
      matchup,
      winRate: (stats.wins / stats.total) * 100,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Player Analytics
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
        </Grid>
      </Paper>

      {/* Player Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Player Win Rates
            </Typography>
            <ResponsiveContainer>
              <BarChart data={getPlayerStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="player"
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const playerData = getPlayerStats().find(p => p.player === payload.value);
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                          <tspan x={0} dy="0.71em">
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                              <RaceIcon race={playerData.race} size={16} />
                              {payload.value}
                            </Box>
                          </tspan>
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="winRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {filters.players.length === 1 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
              <Typography variant="h6" gutterBottom>
                {filters.players[0]}'s Matchup Statistics
              </Typography>
              <ResponsiveContainer>
                <BarChart data={getPlayerMatchupStats(filters.players[0])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="matchup" />
                  <YAxis label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="winRate" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Players; 