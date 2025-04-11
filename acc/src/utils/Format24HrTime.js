const format24HrTime = (isoTime) => {
  const time = isoTime.split('T')[1];
  let hour = time.split(':')[0];
  let min = time.split(':')[1];
  return `${hour}:${min}`;
};
export default format24HrTime;
