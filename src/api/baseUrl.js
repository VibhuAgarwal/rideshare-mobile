import Constants from 'expo-constants';
import {Platform} from 'react-native';

// API base URL selection:
// - Android emulator: 10.0.2.2 points back to your host machine.
// - Expo Go on a real device: use the dev server host IP automatically.
// - iOS simulator: localhost works.
const getDevServerHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants?.manifest?.debuggerHost ||
    Constants?.manifest2?.extra?.expoGo?.debuggerHost;
  if (!hostUri || typeof hostUri !== 'string') return null;
  return hostUri.split(':')[0];
};

const DEV_SERVER_HOST = getDevServerHost();

export const API_URL = Platform.select({
  android: DEV_SERVER_HOST
    ? `http://${DEV_SERVER_HOST}:5001/api`
    : 'http://10.0.2.2:5001/api',
  ios: DEV_SERVER_HOST
    ? `http://${DEV_SERVER_HOST}:5001/api`
    : 'http://localhost:5001/api',
  default: DEV_SERVER_HOST
    ? `http://${DEV_SERVER_HOST}:5001/api`
    : 'http://localhost:5001/api',
});
