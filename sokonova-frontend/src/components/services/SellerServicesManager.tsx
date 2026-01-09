"use client";

import { useState } from "react";
import { offerSellerService, updateSellerService, deleteSellerService, updateServiceOrderStatus } from "@/lib/api/seller-services";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SellerService {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  deliveryTime: number;
  active: boolean;
  createdAt: string;
}

interface ServiceOrder {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  message: string;
  price: number;
  currency: string;
  status: string;
  note?: string;
  createdAt: string;
  service?: {
    title: string;
  };
  buyer?: {
    name: string;
  };
}

interface SellerServicesManagerProps {
  sellerId: string;
  initialServices: SellerService[];
  initialOrders: ServiceOrder[];
}

export function SellerServicesManager({ sellerId, initialServices, initialOrders }: SellerServicesManagerProps) {
  const [services, setServices] = useState<SellerService[]>(initialServices);
  const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<SellerService | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "USD",
    category: "",
    deliveryTime: 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || formData.price <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      if (editingService) {
        // Update existing service
        const updatedService = await updateSellerService(editingService.id, {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          category: formData.category,
          deliveryTime: formData.deliveryTime,
        });
        
        setServices(services.map(s => 
          s.id === editingService.id ? { ...s, ...updatedService } : s
        ));
      } else {
        // Create new service
        const newService = await offerSellerService({
          sellerId,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          category: formData.category,
          deliveryTime: formData.deliveryTime,
        });
        
        setServices([...services, newService]);
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        price: 0,
        currency: "USD",
        category: "",
        deliveryTime: 3,
      });
    } catch (err) {
      setError("Failed to save service. Please try again.");
      console.error("Service error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this service?")) {
      return;
    }
    
    try {
      await deleteSellerService(id);
      setServices(services.map(s => 
        s.id === id ? { ...s, active: false } : s
      ));
    } catch (err) {
      setError("Failed to deactivate service. Please try again.");
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (service: SellerService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      currency: service.currency,
      category: service.category,
      deliveryTime: service.deliveryTime,
    });
    setIsDialogOpen(true);
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateServiceOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      setError("Failed to update order status. Please try again.");
      console.error("Order status error:", err);
    }
  };

  return (
    <Tabs defaultValue="services" className="space-y-6">
      <TabsList>
        <TabsTrigger value="services">My Services</TabsTrigger>
        <TabsTrigger value="orders">Service Orders</TabsTrigger>
      </TabsList>
      
      <TabsContent value="services" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Services You Offer</h2>
            <p className="text-muted-foreground">
              Create and manage services for other sellers
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingService(null);
              setFormData({
                title: "",
                description: "",
                price: 0,
                currency: "USD",
                category: "",
                deliveryTime: 3,
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingService(null)}>
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Professional Product Photography"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the service you're offering..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ({formData.currency}) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value) => setFormData({...formData, currency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="GHS">GHS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Accounting">Accounting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time (days) *</Label>
                    <Input
                      id="deliveryTime"
                      type="number"
                      min="1"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({...formData, deliveryTime: parseInt(e.target.value) || 3})}
                      placeholder="3"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingService ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {"You haven't created any services yet."}
              </p>
              <p className="text-muted-foreground mt-2">
                Create your first service to help other sellers grow their businesses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
              <CardDescription>
                Services available to other sellers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.filter(s => s.active).map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="font-medium">{service.title}</div>
                      </TableCell>
                      <TableCell>
                        {service.category || "Other"}
                      </TableCell>
                      <TableCell>
                        {service.currency} {service.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {service.deliveryTime} days
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                          >
                            Deactivate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="orders" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Service Orders</h2>
          <p className="text-muted-foreground">
            Manage orders for your services
          </p>
        </div>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {"You don't have any service orders yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Orders for your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.service?.title || "Service"}</div>
                      </TableCell>
                      <TableCell>
                        {order.buyer?.name || "Buyer"}
                      </TableCell>
                      <TableCell>
                        {order.currency} {order.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'ACCEPTED')}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'REJECTED')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
