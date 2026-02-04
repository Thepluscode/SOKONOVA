import { getAllSellerServices } from "@/lib/api/seller-services";
import { ServiceCard } from "@/components/ServiceCard";

export default async function ServicesPage() {
  // Fetch all available seller services
  const servicesResponse = await getAllSellerServices();
  const services = servicesResponse || [];

  // Group services by category
  const servicesByCategory: Record<string, any[]> = {};
  services.forEach((service: any) => {
    const category = service.category || "Other";
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Seller Services Marketplace
        </h1>
        <p className="text-muted-foreground text-sm">
          Connect with vetted partners for logistics, marketing, photography, and more
        </p>
      </header>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <section key={category} className="space-y-6">
              <h2 className="text-2xl font-medium">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
