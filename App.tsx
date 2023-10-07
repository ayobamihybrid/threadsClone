import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Main from './src/navigation/Main';
import Auth from './src/navigation/Auth';
import Store from './redux/Store';
import { Provider, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { loadUser } from './redux/actions/userActions';
import Loader from './components/Loader';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs()

function App() {
  return (
    <Provider store={Store}>
      <AppStack />
    </Provider>
  );
}

const AppStack = () => {
  const { isAuthenticated, loading } = useSelector((state: any) => state.user);

  React.useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  return (
    <>
      <>
        <StatusBar
          animated={true}
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
          showHideTransition={'fade'}
        />
      </>
      {loading ? (
        <Loader />
      ) : (
        <>
          {isAuthenticated ? (
            <NavigationContainer>
              <Main />
            </NavigationContainer>
          ) : (
            <NavigationContainer>
              <Auth />
            </NavigationContainer>
          )}
        </>
      )}
    </>
  );
};

export default App;
