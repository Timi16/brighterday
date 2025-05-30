import React, { useState, createContext, useContext } from 'react';

// Define the app state type
interface AppState {
  focusArea?: string;
  childAge?: string;
  firstTime?: string;
  feeling?: string;
  checkIns?: Array<{
    date: string;
    mood: string;
    topic?: string;
    note?: string;
  }>;
}

// Create a context for the app state
type AppStateContextType = {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
};

const AppStateContext = createContext<AppStateContextType>({
  state: {},
  updateState: () => {}
});

// Provider component
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({});

  const updateState = (updates: Partial<AppState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook to use the app state
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  
  return context;
};
