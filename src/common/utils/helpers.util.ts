import { compareSync, hashSync } from 'bcrypt';

// Encrypt data using consistent salt rounds
export function encodeData(data: string): string {
  const saltRounds = parseInt(process.env.DATA_SALT || '10', 10);
  return hashSync(data, saltRounds);
}

// Compare plain data with a hashed version
export function compareData(data: string, hash: string): boolean {
  try {
    // bcrypt will extract the salt from the hash and use it for comparison
    return compareSync(data, hash);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

// Time conversion constants
export const secondToMilliSeconds = 1000;
export const minuteToMilliSeconds = 60 * secondToMilliSeconds;
export const hourToMilliSeconds = 60 * minuteToMilliSeconds;
export const dayToMilliSeconds = 24 * hourToMilliSeconds;
export const weekToMilliSeconds = 7 * dayToMilliSeconds;

// Convert time strings to milliseconds based on a delimiter
export function timeToMilliSeconds(
  time: string,
  delimiter: string = 'h',
): number {
  const [value, unit] = time.split(delimiter);
  const valueNumber = parseInt(value, 10);

  switch (delimiter) {
    case 's':
      return valueNumber * secondToMilliSeconds;
    case 'm':
      return valueNumber * minuteToMilliSeconds;
    case 'h':
      return valueNumber * hourToMilliSeconds;
    case 'd':
      return valueNumber * dayToMilliSeconds;
    case 'w':
      return valueNumber * weekToMilliSeconds;
    default:
      return valueNumber;
  }
}
