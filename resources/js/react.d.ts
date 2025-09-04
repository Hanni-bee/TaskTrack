declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
  
  export const createContext: typeof React.createContext;
  export const useContext: typeof React.useContext;
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
}
