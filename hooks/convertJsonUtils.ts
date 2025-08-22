/**
 * Converts a JSON object to a string
 * @param jsonData - The JSON object to convert
 * @returns The stringified JSON or empty string if conversion fails
 */
export const jsonToString = (jsonData: any): string => {
  try {
    return JSON.stringify(jsonData);
  } catch (error) {
    console.error('Error converting JSON to string:', error);
    return '';
  }
};

/**
 * Converts a string to a JSON object
 * @param jsonString - The string to convert to JSON
 * @returns The parsed JSON object or null if parsing fails
 */
export const stringToJson = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error converting string to JSON:', error);
    return null;
  }
};
