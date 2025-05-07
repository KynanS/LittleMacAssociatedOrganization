import { Box, Typography } from '@mui/material';
import zergIcon from '../assets/race-icons/zerg.png';
import terranIcon from '../assets/race-icons/terran.png';
import protossIcon from '../assets/race-icons/protoss.png';

export const getRaceIcon = (raceCode) => {
  // Map single-letter race codes to image imports
  const raceMap = {
    'z': zergIcon,
    't': terranIcon,
    'p': protossIcon
  };

  return raceMap[raceCode.toLowerCase()] || null;
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