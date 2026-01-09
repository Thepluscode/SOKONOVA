
import React from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import ProductComparison from '../../components/feature/ProductComparison';

const ComparePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductComparison />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePage;
