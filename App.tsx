
import React from 'react';
import Provider from './src/navigators/provider';
import { ToastProvider } from 'react-native-toast-notifications';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Provider />
    </ToastProvider>
  );
};

export default App;
