import { createContext, PropsWithChildren, useContext, useState } from 'react';

const AuthContext = createContext({
  showOverlay: false,
  setShowOverlay: (ev: boolean) => {},
});

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <AuthContext.Provider value={{ showOverlay, setShowOverlay }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useOverlay = () => useContext(AuthContext);
