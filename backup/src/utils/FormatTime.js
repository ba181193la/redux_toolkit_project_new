const formatTime = (isoTime) => {
  const date = new Date(isoTime);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hours < 12;

  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${isAM ? 'AM' : 'PM'}`;
};

export default formatTime;
