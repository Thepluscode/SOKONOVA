
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import SavedSearches from '../../components/feature/SavedSearches';
import NotificationCenter from '../../components/feature/NotificationCenter';

export default function SavedSearchesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NotificationCenter />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SavedSearches />
      </div>

      <Footer />
    </div>
  );
}
