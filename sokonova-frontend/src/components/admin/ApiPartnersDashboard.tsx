"use client";

import { useState } from "react";
import { 
  registerPartner, 
  generateApiKey, 
  updatePartnerStatus, 
  createWebhook, 
  getPartnerWebhooks, 
  updateWebhook, 
  deleteWebhook 
} from "@/lib/api/api-partner-platform";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Key, 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

interface ApiPartner {
  id: string;
  companyName: string;
  contactEmail: string;
  apiKeyName: string;
  apiKey: string;
  apiKeyLastGenerated?: string;
  status: string;
  createdAt: string;
}

interface Webhook {
  id: string;
  partnerId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}

interface ApiPartnersDashboardProps {
  partners: ApiPartner[];
  adminId: string;
}

export function ApiPartnersDashboard({ partners, adminId }: ApiPartnersDashboardProps) {
  const [partnerList, setPartnerList] = useState<ApiPartner[]>(partners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<ApiPartner | null>(null);
  const [webhooks, setWebhooks] = useState<Record<string, Webhook[]>>({});
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    apiKeyName: "",
  });
  const [webhookData, setWebhookData] = useState({
    url: "",
    events: [] as string[],
    secret: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactEmail.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      if (editingPartner) {
        // Update existing partner
        // In a real implementation, we would have an update endpoint
      } else {
        // Create new partner
        const newPartner = await registerPartner({
          companyName: formData.companyName,
          contactEmail: formData.contactEmail,
          apiKeyName: formData.apiKeyName,
        });
        
        setPartnerList([...partnerList, newPartner]);
      }
      
      setIsDialogOpen(false);
      setEditingPartner(null);
      setFormData({
        companyName: "",
        contactEmail: "",
        apiKeyName: "",
      });
    } catch (err) {
      setError("Could not save partner. Please try again.");
      console.error("Partner error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateApiKey = async (partnerId: string) => {
    try {
      const result = await generateApiKey(partnerId);
      setPartnerList(partnerList.map(p => 
        p.id === partnerId ? { ...p, apiKey: result.apiKey, apiKeyLastGenerated: new Date().toISOString() } : p
      ));
    } catch (err) {
      setError("Could not generate API key. Please try again.");
      console.error("API key error:", err);
    }
  };

  const handleUpdateStatus = async (partnerId: string, status: string) => {
    try {
      await updatePartnerStatus(partnerId, adminId, status);
      setPartnerList(partnerList.map(p => 
        p.id === partnerId ? { ...p, status } : p
      ));
    } catch (err) {
      setError("Could not update partner status. Please try again.");
      console.error("Status update error:", err);
    }
  };

  const handleCreateWebhook = async (partnerId: string) => {
    if (!webhookData.url.trim() || webhookData.events.length === 0) {
      setError("Please fill in all required webhook fields.");
      return;
    }
    
    try {
      const newWebhook = await createWebhook(partnerId, adminId, {
        url: webhookData.url,
        events: webhookData.events,
        secret: webhookData.secret || Math.random().toString(36).substring(2, 15),
      });
      
      setWebhooks(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), newWebhook]
      }));
      
      setWebhookData({
        url: "",
        events: [],
        secret: "",
      });
    } catch (err) {
      setError("Could not create webhook. Please try again.");
      console.error("Webhook error:", err);
    }
  };

  const fetchPartnerWebhooks = async (partnerId: string) => {
    if (webhooks[partnerId]) return;
    
    try {
      const partnerWebhooks = await getPartnerWebhooks(partnerId, adminId);
      setWebhooks(prev => ({
        ...prev,
        [partnerId]: partnerWebhooks
      }));
    } catch (err) {
      setError("Could not load webhooks. Please try again.");
      console.error("Webhook fetch error:", err);
    }
  };

  const toggleWebhookStatus = async (webhookId: string, partnerId: string, active: boolean) => {
    try {
      await updateWebhook(webhookId, adminId, { active });
      setWebhooks(prev => ({
        ...prev,
        [partnerId]: prev[partnerId].map(w => 
          w.id === webhookId ? { ...w, active } : w
        )
      }));
    } catch (err) {
      setError("Could not update webhook. Please try again.");
      console.error("Webhook update error:", err);
    }
  };

  const handleDeleteWebhook = async (webhookId: string, partnerId: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) {
      return;
    }
    
    try {
      await deleteWebhook(webhookId, adminId);
      setWebhooks(prev => ({
        ...prev,
        [partnerId]: prev[partnerId].filter(w => w.id !== webhookId)
      }));
    } catch (err) {
      setError("Could not delete webhook. Please try again.");
      console.error("Webhook delete error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Partners</h2>
          <p className="text-muted-foreground">
            Manage partners and their API access
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPartner(null);
            setFormData({
              companyName: "",
              contactEmail: "",
              apiKeyName: "",
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPartner(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Edit Partner" : "Add New Partner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="Enter contact email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKeyName">API Key Name</Label>
                <Input
                  id="apiKeyName"
                  value={formData.apiKeyName}
                  onChange={(e) => setFormData({...formData, apiKeyName: e.target.value})}
                  placeholder="Enter API key name"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
              
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
                  {isSubmitting ? "Saving..." : editingPartner ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {partnerList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No API partners yet.
            </p>
            <p className="text-muted-foreground mt-2">
              Add your first partner to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Registered Partners</CardTitle>
            <CardDescription>
              Manage API partners and their access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerList.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="font-medium">{partner.companyName}</div>
                      <div className="text-sm text-muted-foreground">
                        {partner.apiKeyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{partner.contactEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-mono">
                          {partner.apiKey ? `${partner.apiKey.substring(0, 8)}...` : "Not generated"}
                        </div>
                        {partner.apiKey && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateApiKey(partner.id)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {partner.apiKeyLastGenerated && (
                        <div className="text-xs text-muted-foreground">
                          Generated: {new Date(partner.apiKeyLastGenerated).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          partner.status === 'ACTIVE' ? 'default' : 
                          partner.status === 'PENDING' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(partner.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select 
                          value={partner.status} 
                          onValueChange={(value) => handleUpdateStatus(partner.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPartnerId(partner.id);
                            fetchPartnerWebhooks(partner.id);
                          }}
                        >
                          <Webhook className="h-4 w-4 mr-1" />
                          Webhooks
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
      
      {selectedPartnerId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks for {partnerList.find(p => p.id === selectedPartnerId)?.companyName}
            </CardTitle>
            <CardDescription>
              Configure webhook notifications for this partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-4">Create New Webhook</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL *</Label>
                    <Input
                      id="webhookUrl"
                      value={webhookData.url}
                      onChange={(e) => setWebhookData({...webhookData, url: e.target.value})}
                      placeholder="https://your-domain.com/webhook"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Events *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['order.created', 'order.updated', 'product.created', 'product.updated'].map(event => (
                        <div key={event} className="flex items-center space-x-2">
                          <Switch
                            id={event}
                            checked={webhookData.events.includes(event)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setWebhookData(prev => ({
                                  ...prev,
                                  events: [...prev.events, event]
                                }));
                              } else {
                                setWebhookData(prev => ({
                                  ...prev,
                                  events: prev.events.filter(e => e !== event)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={event} className="text-sm">
                            {event}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Secret (optional)</Label>
                    <Input
                      id="webhookSecret"
                      value={webhookData.secret}
                      onChange={(e) => setWebhookData({...webhookData, secret: e.target.value})}
                      placeholder="Enter webhook secret"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleCreateWebhook(selectedPartnerId)}
                    disabled={!webhookData.url || webhookData.events.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Existing Webhooks</h3>
                {webhooks[selectedPartnerId]?.length ? (
                  <div className="space-y-3">
                    {webhooks[selectedPartnerId].map(webhook => (
                      <div key={webhook.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{webhook.url}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {webhook.events.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={webhook.active}
                              onCheckedChange={(checked) => 
                                toggleWebhookStatus(webhook.id, selectedPartnerId, checked)
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWebhook(webhook.id, selectedPartnerId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(webhook.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Webhook className="h-8 w-8 mx-auto mb-2" />
                    <p>No webhooks configured yet.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
