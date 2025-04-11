import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import App from './App';
import { useTranslation } from 'react-i18next';
import { MsalProvider } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { useSelector } from 'react-redux';

const Root = () => {
  const [msalInstance, setMsalInstance] = useState(null);
  const { msalConfig } = useSelector((state) => state.auth);
  const { i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const createEmotionCache = (dir) =>
    createCache({
      key: dir === 'rtl' ? 'muirtl' : 'mui',
      stylisPlugins: dir === 'rtl' ? [rtlPlugin] : undefined,
    });
  const cache = createEmotionCache(direction);

  const theme = createTheme({
    direction,
    typography: {
      fontFamily: 'Lato, sans-serif',
    },
  });

  useEffect(() => {
    if (msalConfig) {
      // Create MSAL instance when config is available
      const msalInstance = new PublicClientApplication({
        auth: {
          clientId: msalConfig.clientId,
          authority: `https://login.microsoftonline.com/${msalConfig.tenantId}`,
          redirectUri: msalConfig?.redirectUrl,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: true,
        },
      });
      setMsalInstance(msalInstance);
    }
  }, [msalConfig]);

  return msalInstance ? (
    <MsalProvider instance={msalInstance}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </CacheProvider>
    </MsalProvider>
  ) : (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Root;
