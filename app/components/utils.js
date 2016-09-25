const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  const twoDigits = (a) => (a <= 9 ? '0' : '') + a;

  return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
};

exports.formatTime = formatTime;
