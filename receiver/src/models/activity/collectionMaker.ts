export function getCollectionName(date?: string) {
  const dateToUse = date ? new Date(date) : new Date();
  const year = dateToUse.getFullYear();
  const month = (dateToUse.getMonth() + 1).toString().padStart(2, '0');
  return `data_${year}_${month}`;
}


/* in cause you want to test it with mintues insted of months use this code */
// export function getCollectionName(min?: number) {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = (now.getMonth() + 1).toString().padStart(2, '0');
//   const day = now.getDate().toString().padStart(2, '0');
//   const hour = now.getHours().toString().padStart(2, '0'); 
//   const minutes = min ||now.getMinutes();
//   const roundedMinutes = Math.floor(minutes / 2) * 2;
//   const minuteSegment = roundedMinutes.toString().padStart(2, '0');
//   return `data_${year}${month}${day}_${hour}_${minuteSegment}`;
// }