function convertTimeToSeconds(timeString: string) {
  // Extract minutes and seconds from the time string
  const match = timeString.match(/PT(\d+)M(\d+)S/);

  if (!match) {
    console.error('Invalid time format');
    return null;
  }

  // Convert minutes and seconds to seconds
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  // Calculate total seconds
  const totalSeconds = minutes * 60 + seconds;

  return totalSeconds;
}

export default convertTimeToSeconds;
