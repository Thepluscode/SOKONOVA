// This file was causing a circular import. 
// The actual component is now directly in page.tsx
// We'll export a simple component instead of trying to import from page.tsx
export default function AdminTrustDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Admin Trust Dashboard</h1>
      <p>Dashboard content would go here.</p>
    </div>
  );
}