import React,{useEffect,useState} from 'react'
import  Providers from './src/Navigation/index' 
import { LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RequestHandler from './src/Util/RequestHandler';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  // Get information about Internet availability or not.
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      // You can also check for other properties of `state` to handle different connection scenarios
    });
    // Clean up the subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Retry failed requests whenever internet connectivity is restored
    if (isConnected) {
      RequestHandler.retryFailedRequests(); // Use the RequestHandler utility here
    }
  }, [isConnected]);
  return (
    <Providers />
  )
}
export default App

