import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PortfolioThemeProvider } from './theme/portfolioTheme';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioThemeProvider>
      <App />
    </PortfolioThemeProvider>
  </StrictMode>,
);
