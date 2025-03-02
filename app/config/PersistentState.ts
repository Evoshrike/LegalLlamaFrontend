import AsyncStorage from '@react-native-async-storage/async-storage';
import { highscore } from './types';

const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving data', error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error('Error retrieving data', error);
  }
  return null;
};

const getHighScores = async () => {
  const highScores = await getData('highScores');
  if (highScores) {
    return JSON.parse(highScores);
  }
  return [];
};

const saveHighScores = async (highScores: Array<highscore>) => {
    saveData('highScores', JSON.stringify(highScores));
    };

const initHighScores = async () => {
    const highScores = await getData('highScores');
    if (highScores === null) {
        saveHighScores([]);
    }
};

export {saveData, getData, getHighScores, saveHighScores, initHighScores};
export default {};