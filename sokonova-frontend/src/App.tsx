import { BrowserRouter } from "react-router-dom";
// Force refresh
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import ExitIntentPopup from "./components/feature/ExitIntentPopup";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./lib/auth";
import BuyerOnboarding from "./components/feature/BuyerOnboarding";
import BottomNav from "./components/feature/BottomNav";
import { ToastProvider } from "./contexts/ToastContext";

function AppContent() {
  const { needsOnboarding, completeOnboarding } = useAuth();

  return (
    <>
      <div className="pb-16 lg:pb-0 min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppRoutes />
        <BottomNav />
        <ExitIntentPopup />
      </div>
      {needsOnboarding && (
        <BuyerOnboarding
          onComplete={(data) => {
            console.log('Onboarding completed', data);
            completeOnboarding();
          }}
          autoStart={true}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <ToastProvider>
            <BrowserRouter basename={__BASE_PATH__}>
              <AppContent />
            </BrowserRouter>
          </ToastProvider>
        </I18nextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
