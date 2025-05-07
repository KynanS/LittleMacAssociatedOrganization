import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { loadTournamentData } from '../utils/dataLoader';
import RaceIcon from '../components/RaceIcon';

function Home() {
  const [data, setData] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tournamentData = await loadTournamentData();
      setData(tournamentData);
      
      // Calculate player medals
      const playerStats = tournamentData.reduce((acc, match) => {
        // Initialize player stats if not exists
        if (!acc[match.player]) {
          acc[match.player] = { 
            gold: 0, 
            silver: 0, 
            bronze: 0,
            raceCounts: { [match.race]: 1 }
          };
        } else {
          // Increment race count
          acc[match.player].raceCounts[match.race] = (acc[match.player].raceCounts[match.race] || 0) + 1;
        }

        if (!acc[match.opponent]) {
          acc[match.opponent] = { 
            gold: 0, 
            silver: 0, 
            bronze: 0,
            raceCounts: { [match.opponentRace]: 1 }
          };
        } else {
          // Increment race count
          acc[match.opponent].raceCounts[match.opponentRace] = (acc[match.opponent].raceCounts[match.opponentRace] || 0) + 1;
        }

        // Check for Grand Finals
        if (match.group === 'playoffs' && match.groupStage === 'R03' && match.matchNumber === '1') {
          if (match.result === 'win') {
            acc[match.player].gold++;
            acc[match.opponent].silver++;
          } else {
            acc[match.opponent].gold++;
            acc[match.player].silver++;
          }
        }
        
        // Check for Bronze Match
        if (match.group === 'playoffs' && match.groupStage === '3rd Place Match' && match.matchNumber === '3rd Place Match') {
          if (match.result === 'win') {
            acc[match.player].bronze++;
          } else {
            acc[match.opponent].bronze++;
          }
        }

        return acc;
      }, {});

      const topPlayersList = Object.entries(playerStats)
        .map(([player, stats]) => {
          // Find most used race
          const mostUsedRace = Object.entries(stats.raceCounts)
            .sort((a, b) => b[1] - a[1])[0][0];

          return {
            player,
            gold: stats.gold,
            silver: stats.silver,
            bronze: stats.bronze,
            race: mostUsedRace
          };
        })
        .sort((a, b) => {
          // Sort by gold medals first
          if (b.gold !== a.gold) return b.gold - a.gold;
          // Then by silver medals
          if (b.silver !== a.silver) return b.silver - a.silver;
          // Finally by bronze medals
          return b.bronze - a.bronze;
        })
        .slice(0, 15);

      setTopPlayers(topPlayersList);

      // Get recent results (last 5 matches)
      const recent = [...tournamentData]
        .sort((a, b) => b.matchNumber - a.matchNumber)
        .slice(0, 5);
      setRecentResults(recent);
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        LittleMac StarCraft II League (LMSL)
      </Typography>
      
      <Grid container spacing={3}>
        {/* Medal Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top LMSL Players by Tournament Placements
            </Typography>
            <TableContainer sx={{ maxHeight: 340 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell align="center">Race</TableCell>
                    <TableCell align="center">🥇</TableCell>
                    <TableCell align="center">🥈</TableCell>
                    <TableCell align="center">🥉</TableCell>
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPlayers.map((player, index) => (
                    <TableRow key={player.player}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{player.player}</TableCell>
                      <TableCell align="center">
                        <RaceIcon race={player.race} size={24} />
                      </TableCell>
                      <TableCell align="center">{player.gold}</TableCell>
                      <TableCell align="center">{player.silver}</TableCell>
                      <TableCell align="center">{player.bronze}</TableCell>
                      <TableCell align="center">
                        {player.gold + player.silver + player.bronze}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Results */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Results
            </Typography>
            <Box sx={{ overflow: 'auto' }}>
              {recentResults.map((match, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {match.player} ({match.race}) vs {match.opponent} ({match.opponentRace})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {match.tournament} - {match.group} {match.groupStage} Match {match.matchNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score: {match.player1Score} - {match.player2Score}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 