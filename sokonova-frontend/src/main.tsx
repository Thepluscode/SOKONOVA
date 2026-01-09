import { StrictMode } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Track recently viewed products
const trackRecentlyViewed = (productId: string) => {
  const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  const updated = [productId, ...recent.filter((id: string) => id !== productId)].slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};

// Track product views on route changes
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const productMatch = path.match(/\/products\/(\d+)/);
  if (productMatch) {
    trackRecentlyViewed(productMatch[1]);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
