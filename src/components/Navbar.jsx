import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <SportsEsportsIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          The LittleMac Associated Organization
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/tournaments"
          >
            Tournaments
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/players"
          >
            Players
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 