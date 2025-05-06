import { Box, Typography } from '@mui/material';

export const getRaceIcon = (raceCode) => {
  // Map single-letter race codes to full race names
  const raceMap = {
    'z': 'zerg',
    't': 'terran',
    'p': 'protoss'
  };

  const raceName = raceMap[raceCode.toLowerCase()];
  if (!raceName) return null;

  try {
    return require(`../assets/race-icons/${raceName}.png`);
  } catch (error) {
    return null;
  }
};

const RaceIcon = ({ race, size = 24 }) => {
  const icon = getRaceIcon(race);

  if (!icon) {
    return (
      <Typography variant="body2" component="span">
        {race}
      </Typography>
    );
  }

  return (
    <Box
      component="img"
      src={icon}
      alt={race}
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        verticalAlign: 'middle',
      }}
    />
  );
};

export default RaceIcon; 