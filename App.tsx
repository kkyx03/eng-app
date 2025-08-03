import * as React from 'react';
import RootNavigator from './src/navigation';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
