/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PUBLIC_URL: string;
    REACT_APP_VERSION: string;
    REACT_APP_WEBSOCKET_URL: string;
  }
}
