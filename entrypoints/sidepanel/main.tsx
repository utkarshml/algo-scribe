import ReactDOM from 'react-dom/client';
import "../popup/style.css"
import App from './App';
import { ThemeProvider } from '@/components/ThemeProvider';




ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);
