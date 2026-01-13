"use client";

import { useState, useEffect } from "react";
import { createSponsoredPlacement, updateSponsoredPlacement, deleteSponsoredPlacement } from "@/lib/api/sponsored-placements";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface SponsoredPlacement {
  id: string;
  sellerId: string;
  productId: string;
  categorySlug?: string;
  searchTerm?: string;
  bidAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  product?: {
    title: string;
    imageUrl?: string;
    price: number;
  };
}

interface SponsoredPlacementsManagerProps {
  sellerId: string;
  initialPlacements: SponsoredPlacement[];
}

export function SponsoredPlacementsManager({ sellerId, initialPlacements }: SponsoredPlacementsManagerProps) {
  const [placements, setPlacements] = useState<SponsoredPlacement[]>(initialPlacements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<SponsoredPlacement | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    categorySlug: "",
    searchTerm: "",
    bidAmount: 0,
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingPlacement) {
      setFormData({
        productId: editingPlacement.productId,
        categorySlug: editingPlacement.categorySlug || "",
        searchTerm: editingPlacement.searchTerm || "",
        bidAmount: editingPlacement.bidAmount,
        startDate: editingPlacement.startDate.split("T")[0],
        endDate: editingPlacement.endDate.split("T")[0],
      });
    } else {
      setFormData({
        productId: "",
        categorySlug: "",
        searchTerm: "",
        bidAmount: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [editingPlacement, isDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || (!formData.categorySlug && !formData.searchTerm) || formData.bidAmount <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      if (editingPlacement) {
        // Update existing placement
        const updatedPlacement = await updateSponsoredPlacement(editingPlacement.id, {
          bidAmount: formData.bidAmount,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        
        setPlacements(placements.map(p => 
          p.id === editingPlacement.id ? { ...p, ...updatedPlacement } : p
        ));
      } else {
        // Create new placement
        const newPlacement = await createSponsoredPlacement({
          sellerId,
          productId: formData.productId,
          categorySlug: formData.categorySlug || undefined,
          searchTerm: formData.searchTerm || undefined,
          bidAmount: formData.bidAmount,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        
        setPlacements([...placements, newPlacement]);
      }
      
      setIsDialogOpen(false);
      setEditingPlacement(null);
    } catch (err) {
      setError("Could not save sponsored placement. Please try again.");
      console.error("Sponsored placement error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsored placement?")) {
      return;
    }
    
    try {
      await deleteSponsoredPlacement(id);
      setPlacements(placements.filter(p => p.id !== id));
    } catch (err) {
      setError("Could not delete sponsored placement. Please try again.");
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (placement: SponsoredPlacement) => {
    setEditingPlacement(placement);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Sponsored Placements</h2>
          <p className="text-muted-foreground">
            Promote your products to reach more buyers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPlacement(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPlacement(null)}>
              Create New Placement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPlacement ? "Edit Placement" : "Create New Placement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID *</Label>
                <Input
                  id="productId"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  placeholder="Enter product ID"
                  required
                  disabled={!!editingPlacement}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placementType">Placement Type</Label>
                <Select 
                  value={formData.categorySlug ? "category" : formData.searchTerm ? "search" : ""}
                  onValueChange={(value) => {
                    if (value === "category") {
                      setFormData({...formData, categorySlug: "", searchTerm: ""});
                    } else if (value === "search") {
                      setFormData({...formData, categorySlug: "", searchTerm: ""});
                    }
                  }}
                  disabled={!!editingPlacement}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category Page</SelectItem>
                    <SelectItem value="search">Search Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(!formData.categorySlug && !formData.searchTerm) ? null : formData.categorySlug !== undefined ? (
                <div className="space-y-2">
                  <Label htmlFor="categorySlug">Category Slug *</Label>
                  <Input
                    id="categorySlug"
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({...formData, categorySlug: e.target.value})}
                    placeholder="e.g., fashion, electronics"
                    required
                    disabled={!!editingPlacement}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="searchTerm">Search Term *</Label>
                  <Input
                    id="searchTerm"
                    value={formData.searchTerm}
                    onChange={(e) => setFormData({...formData, searchTerm: e.target.value})}
                    placeholder="e.g., ankara dress, phone case"
                    required
                    disabled={!!editingPlacement}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="bidAmount">Bid Amount (USD) *</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.bidAmount}
                  onChange={(e) => setFormData({...formData, bidAmount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : editingPlacement ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {placements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {"You don't have any sponsored placements yet."}
            </p>
            <p className="text-muted-foreground mt-2">
              Create your first placement to promote your products.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Placements</CardTitle>
            <CardDescription>
              Manage your sponsored product placements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Bid Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((placement) => (
                  <TableRow key={placement.id}>
                    <TableCell>
                      <div className="font-medium">
                        {placement.product?.title || placement.productId}
                      </div>
                    </TableCell>
                    <TableCell>
                      {placement.categorySlug ? (
                        <span>Category: {placement.categorySlug}</span>
                      ) : placement.searchTerm ? (
                        <span>Search: {placement.searchTerm}</span>
                      ) : (
                        <span>Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      ${placement.bidAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(placement.startDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(placement.endDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        placement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        placement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        placement.status === 'ENDED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {placement.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(placement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(placement.id)}
                        >
                          Delete
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
    </div>
  );
}
