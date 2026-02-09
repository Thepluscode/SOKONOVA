# Next.js to Vite Migration Guide

## Features to Move from Next.js App to Vite Frontend

Based on comprehensive analysis, here are the valuable features from your Next.js app that should be migrated to your primary Vite frontend.

---

## 🎯 High Priority - Must Migrate

### 1. **Motion/Animation System** ⭐⭐⭐

**Location in Next.js**: `components/ux/motion.tsx`

**What it provides**:
- PageReveal - Page transition animations
- FadeUp - Smooth fade-up animations
- MotionCard - Animated card components
- StaggerContainer/StaggerItem - Staggered list animations
- Professional, smooth UX enhancements

**Why migrate**: The Vite app's homepage has basic CSS animations, but the Next.js motion system is far more sophisticated and provides a premium feel.

**Migration task**:
```bash
# Copy to Vite
cp components/ux/motion.tsx sokonova-frontend/src/components/base/motion.tsx

# Install Framer Motion in Vite
cd sokonova-frontend
npm install framer-motion
```

**Update Vite homepage**:
- Replace CSS animations with Framer Motion components
- Add PageReveal wrapper
- Use FadeUp for sections
- Add StaggerContainer for product grids

---

### 2. **Advanced Business Components** ⭐⭐⭐

The Next.js app has **15+ advanced components** that the Vite app lacks:

#### a) **Admin/Seller Intelligence Components**

| Component | Purpose | Status in Vite |
|-----------|---------|----------------|
| `AdminControlTowerDashboard.tsx` | System-wide monitoring | ❌ Missing |
| `BuyerCohortIntelligence.tsx` | Customer segmentation | ❌ Missing |
| `ProfitabilityConsole.tsx` | Profit analysis | ❌ Missing |
| `InventoryRiskRadar.tsx` | Stock risk alerts | ❌ Missing |
| `ImpactInclusionDashboard.tsx` | Impact metrics | ❌ Missing |
| `ExceptionWorkflowDashboard.tsx` | Exception handling | ❌ Missing |
| `MicroFulfillmentDashboard.tsx` | Fulfillment metrics | ❌ Missing |

**Migration**:
```bash
# Copy all business intelligence components
cp components/AdminControlTowerDashboard.tsx sokonova-frontend/src/components/admin/
cp components/BuyerCohortIntelligence.tsx sokonova-frontend/src/components/seller/
cp components/ProfitabilityConsole.tsx sokonova-frontend/src/components/seller/
cp components/InventoryRiskRadar.tsx sokonova-frontend/src/components/seller/
cp components/ImpactInclusionDashboard.tsx sokonova-frontend/src/components/admin/
cp components/ExceptionWorkflowDashboard.tsx sokonova-frontend/src/components/admin/
cp components/MicroFulfillmentDashboard.tsx sokonova-frontend/src/components/admin/
```

**Then update imports** to use Vite's routing and API client.

---

#### b) **Trust & Safety Components**

| Component | Purpose | Status in Vite |
|-----------|---------|----------------|
| `KYCForm.tsx` | Seller verification | ❌ Missing |
| `TaxRegistrationForm.tsx` | Tax compliance | ❌ Missing |
| `CounterfeitDetectionResults.tsx` | Product authenticity | ❌ Missing |
| `CounterfeitReportReview.tsx` | Review counterfeit reports | ❌ Missing |
| `ReputationGraph.tsx` | Seller reputation viz | ❌ Missing |

**Migration**:
```bash
# Copy trust components
cp components/KYCForm.tsx sokonova-frontend/src/components/seller/trust/
cp components/TaxRegistrationForm.tsx sokonova-frontend/src/components/seller/trust/
cp components/CounterfeitDetectionResults.tsx sokonova-frontend/src/components/admin/trust/
cp components/CounterfeitReportReview.tsx sokonova-frontend/src/components/admin/trust/
cp components/ReputationGraph.tsx sokonova-frontend/src/components/seller/trust/
```

---

#### c) **Service & Subscription Components**

| Component | Purpose | Status in Vite |
|-----------|---------|----------------|
| `SellerServicesManager.tsx` | Manage seller services | ❌ Missing |
| `ServiceCard.tsx` | Service display card | ❌ Missing |
| `ServiceDetail.tsx` | Service details | ❌ Missing |
| `SubscriptionBenefits.tsx` | Show subscription perks | ❌ Missing |
| `SubscriptionPlans.tsx` | Plan comparison | ❌ Missing |
| `SponsoredPlacementsManager.tsx` | Manage ads | ❌ Missing |
| `ApiPartnersDashboard.tsx` | API partner portal | ❌ Missing |

**Migration**:
```bash
# Copy service components
cp components/SellerServicesManager.tsx sokonova-frontend/src/components/services/
cp components/ServiceCard.tsx sokonova-frontend/src/components/services/
cp components/ServiceDetail.tsx sokonova-frontend/src/components/services/
cp components/SubscriptionBenefits.tsx sokonova-frontend/src/components/subscriptions/
cp components/SubscriptionPlans.tsx sokonova-frontend/src/components/subscriptions/
cp components/SponsoredPlacementsManager.tsx sokonova-frontend/src/components/seller/marketing/
cp components/ApiPartnersDashboard.tsx sokonova-frontend/src/components/partner/
```

---

#### d) **Social & Discovery Components**

| Component | Purpose | Status in Vite |
|-----------|---------|----------------|
| `InfluencerCard.tsx` | Display influencers | ❌ Missing |
| `StoryCard.tsx` | Social stories | ❌ Missing |
| `CategoryStrip.tsx` | Category carousel | ⚠️ Basic version exists |
| `RegionTile.tsx` | City/region tiles | ❌ Missing |
| `TrendingProductsStripWithLoading.tsx` | Product carousel with SSR | ⚠️ Static version exists |
| `FeaturedSellersStripWithLoading.tsx` | Seller carousel with SSR | ⚠️ Static version exists |

**Migration**:
```bash
# Copy social components
cp components/InfluencerCard.tsx sokonova-frontend/src/components/social/
cp components/StoryCard.tsx sokonova-frontend/src/components/social/
cp components/CategoryStrip.tsx sokonova-frontend/src/components/discovery/
cp components/RegionTile.tsx sokonova-frontend/src/components/discovery/
```

**Note**: The "WithLoading" components use Next.js Suspense. Adapt them to use Vite's async patterns.

---

### 3. **NotificationBell Component** ⭐⭐

**Location**: `components/NotificationBell.tsx`

**What it provides**:
- Real-time notification badge
- Unread count
- Dropdown with recent notifications
- Mark as read functionality
- Integrates with backend notifications API

**Current Vite status**: Has `NotificationCenter.tsx` but not as sophisticated

**Migration**:
```bash
cp components/NotificationBell.tsx sokonova-frontend/src/components/feature/
```

**Update**: Replace NextAuth session with Vite's auth context

---

### 4. **Config-Driven Approach** ⭐⭐

**Location**: `lib/config.ts`

**What it provides**:
- Centralized CATEGORIES constant
- Centralized CITIES constant
- Easier maintenance
- Single source of truth

**Current Vite status**: Hardcoded data in components

**Migration**:
```bash
cp lib/config.ts sokonova-frontend/src/lib/config.ts
```

**Update all components** to import from config instead of hardcoding.

---

### 5. **UI Component Library** ⭐⭐

The Next.js app has a complete shadcn/ui component set:

**Components to migrate**:
- `components/ui/dropdown-menu.tsx` - ✅ Very useful
- `components/ui/tabs.tsx` - ✅ Used in many places
- `components/ui/dialog.tsx` - ✅ Modal system
- `components/ui/alert.tsx` - ✅ Notifications
- `components/ui/badge.tsx` - ✅ Status badges
- `components/ui/table.tsx` - ✅ Data tables
- All other ui/* components

**Current Vite status**: Has basic Button, Card, but missing many components

**Migration**:
```bash
# Install shadcn/ui in Vite
cd sokonova-frontend
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs
npm install @radix-ui/react-dialog
# ... etc

# Copy all UI components
cp -r components/ui/* sokonova-frontend/src/components/ui/
```

---

## 🔄 Medium Priority - Nice to Have

### 6. **Enhanced Product Components** ⭐

| Component | Purpose |
|-----------|---------|
| `CompareButton.tsx` | Product comparison |
| `ShareProduct.tsx` | Social sharing |
| `DeliveryPromise.tsx` | Delivery estimate |
| `ProductFulfillmentInfo.tsx` | Fulfillment details |

**Migration**:
```bash
cp components/CompareButton.tsx sokonova-frontend/src/components/feature/
cp components/ShareProduct.tsx sokonova-frontend/src/components/feature/
cp components/DeliveryPromise.tsx sokonova-frontend/src/components/feature/
cp components/ProductFulfillmentInfo.tsx sokonova-frontend/src/components/feature/
```

---

### 7. **ChatAssistant Component** ⭐

**Location**: `components/ChatAssistant.tsx`

**What it provides**: AI-powered product Q&A

**Current Vite status**: Has `BuyerSellerChat.tsx` and `LiveChat.tsx` but not AI chat

**Migration**: Copy and integrate with backend `/chat` endpoints

---

### 8. **Error Handling** ⭐

**Location**: `components/ErrorBoundary.tsx`

**What it provides**: React error boundary for graceful error handling

**Current Vite status**: No error boundary

**Migration**:
```bash
cp components/ErrorBoundary.tsx sokonova-frontend/src/components/base/
```

---

## ❌ Low Priority - Don't Migrate

### 9. **API Routes** (app/api/*)

**Don't migrate because**:
- Next.js-specific server-side functionality
- Your Vite app should call backend API directly (port 4000)
- No benefit in Vite (client-side only)

**Alternative**: Ensure Vite service modules call backend correctly

---

### 10. **AuthProvider/NextAuth**

**Don't migrate because**:
- NextAuth is Next.js-specific
- Vite app likely uses different auth (JWT tokens, etc.)

**Alternative**: Use Vite's existing auth system (localStorage tokens)

---

## 📋 Migration Checklist

### Phase 1: Core Components (Week 1)

- [ ] **Install dependencies in Vite**
  ```bash
  cd sokonova-frontend
  npm install framer-motion
  npm install @radix-ui/react-dropdown-menu
  npm install @radix-ui/react-tabs
  npm install @radix-ui/react-dialog
  npm install @radix-ui/react-alert-dialog
  npm install lucide-react  # Icon library
  ```

- [ ] **Copy UI components**
  ```bash
  cp -r components/ui/* sokonova-frontend/src/components/ui/
  ```

- [ ] **Copy motion system**
  ```bash
  cp components/ux/motion.tsx sokonova-frontend/src/components/base/motion.tsx
  ```

- [ ] **Copy config**
  ```bash
  cp lib/config.ts sokonova-frontend/src/lib/config.ts
  ```

- [ ] **Update homepage with animations**
  - Replace CSS animations with Framer Motion
  - Add PageReveal, FadeUp, StaggerContainer
  - Import categories/cities from config

### Phase 2: Business Components (Week 2)

- [ ] **Copy admin components**
  ```bash
  mkdir -p sokonova-frontend/src/components/admin
  cp components/AdminControlTowerDashboard.tsx sokonova-frontend/src/components/admin/
  cp components/ImpactInclusionDashboard.tsx sokonova-frontend/src/components/admin/
  cp components/ExceptionWorkflowDashboard.tsx sokonova-frontend/src/components/admin/
  cp components/MicroFulfillmentDashboard.tsx sokonova-frontend/src/components/admin/
  cp components/ApiPartnersDashboard.tsx sokonova-frontend/src/components/admin/
  ```

- [ ] **Copy seller components**
  ```bash
  mkdir -p sokonova-frontend/src/components/seller
  cp components/BuyerCohortIntelligence.tsx sokonova-frontend/src/components/seller/
  cp components/ProfitabilityConsole.tsx sokonova-frontend/src/components/seller/
  cp components/InventoryRiskRadar.tsx sokonova-frontend/src/components/seller/
  cp components/SponsoredPlacementsManager.tsx sokonova-frontend/src/components/seller/
  ```

- [ ] **Copy trust components**
  ```bash
  mkdir -p sokonova-frontend/src/components/trust
  cp components/KYCForm.tsx sokonova-frontend/src/components/trust/
  cp components/TaxRegistrationForm.tsx sokonova-frontend/src/components/trust/
  cp components/CounterfeitDetectionResults.tsx sokonova-frontend/src/components/trust/
  cp components/ReputationGraph.tsx sokonova-frontend/src/components/trust/
  ```

- [ ] **Update all imports**
  - Change `@/` to `../../` or configure Vite alias
  - Replace Next.js `Link` with React Router `Link`
  - Replace Next.js `Image` with regular `<img>` or `vite-imagetools`
  - Remove `'use client'` directives

### Phase 3: Feature Components (Week 3)

- [ ] **Copy notification system**
  ```bash
  cp components/NotificationBell.tsx sokonova-frontend/src/components/feature/
  ```

- [ ] **Copy product enhancements**
  ```bash
  cp components/CompareButton.tsx sokonova-frontend/src/components/feature/
  cp components/ShareProduct.tsx sokonova-frontend/src/components/feature/
  cp components/DeliveryPromise.tsx sokonova-frontend/src/components/feature/
  cp components/ProductFulfillmentInfo.tsx sokonova-frontend/src/components/feature/
  ```

- [ ] **Copy social components**
  ```bash
  mkdir -p sokonova-frontend/src/components/social
  cp components/InfluencerCard.tsx sokonova-frontend/src/components/social/
  cp components/StoryCard.tsx sokonova-frontend/src/components/social/
  ```

- [ ] **Copy service components**
  ```bash
  mkdir -p sokonova-frontend/src/components/services
  cp components/SellerServicesManager.tsx sokonova-frontend/src/components/services/
  cp components/ServiceCard.tsx sokonova-frontend/src/components/services/
  cp components/ServiceDetail.tsx sokonova-frontend/src/components/services/
  ```

- [ ] **Copy subscription components**
  ```bash
  mkdir -p sokonova-frontend/src/components/subscriptions
  cp components/SubscriptionBenefits.tsx sokonova-frontend/src/components/subscriptions/
  cp components/SubscriptionPlans.tsx sokonova-frontend/src/components/subscriptions/
  ```

### Phase 4: Integration & Testing (Week 4)

- [ ] **Update all component imports**
  - Configure Vite path alias: `@` → `src/`
  - Update all relative imports
  - Fix TypeScript errors

- [ ] **Test all pages**
  - Homepage with new animations
  - Admin pages with new dashboards
  - Seller pages with new analytics
  - Product pages with enhanced features
  - Social pages with new components

- [ ] **Clean up**
  - Remove unused CSS animations
  - Remove duplicate components
  - Optimize bundle size
  - Run linter

---

## 🎨 Styling Considerations

The Next.js app uses **Tailwind CSS** with custom theme configuration. Ensure your Vite app has:

1. **Same Tailwind config**
   ```bash
   cp tailwind.config.ts sokonova-frontend/
   ```

2. **Same CSS variables**
   ```bash
   cp app/globals.css sokonova-frontend/src/index.css
   ```

3. **Dark mode support**
   - Next.js uses `next-themes`
   - Vite should use similar dark mode toggle
   - Copy `lib/theme.ts` approach

---

## 🔧 Vite Configuration Updates

Add path alias to `vite.config.ts`:

```typescript
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📊 Summary Statistics

### Components to Migrate

| Category | Count | Priority |
|----------|-------|----------|
| UI Components | 17 | High |
| Motion/Animation | 1 system | High |
| Admin Components | 7 | High |
| Seller Components | 8 | High |
| Trust Components | 5 | High |
| Service Components | 3 | Medium |
| Social Components | 2 | Medium |
| Product Enhancements | 4 | Medium |
| Subscription Components | 2 | Medium |
| **TOTAL** | **49 components** | - |

### Estimated Effort

- **Phase 1** (Core): 2-3 days
- **Phase 2** (Business): 3-4 days
- **Phase 3** (Features): 2-3 days
- **Phase 4** (Testing): 2-3 days
- **Total**: 9-13 days (2-3 weeks)

---

## 🚀 Quick Start

To begin migration immediately:

1. **Install dependencies**:
   ```bash
   cd sokonova-frontend
   npm install framer-motion lucide-react
   npm install @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-dialog
   ```

2. **Copy core files first**:
   ```bash
   # From project root
   cp -r components/ui sokonova-frontend/src/components/
   cp lib/config.ts sokonova-frontend/src/lib/
   ```

3. **Update path alias** in `vite.config.ts`

4. **Test one component** at a time

---

## ✅ Benefits After Migration

Once complete, your Vite app will have:

✅ **Professional animations** - Smooth, polished UX
✅ **Advanced analytics** - Business intelligence dashboards
✅ **Complete UI library** - 17 reusable components
✅ **Trust & safety** - KYC, tax, counterfeit detection
✅ **Better maintainability** - Config-driven approach
✅ **Enhanced features** - Notifications, sharing, delivery promise
✅ **Production-ready quality** - Same level as Next.js app

Your Vite app will be the **complete, feature-rich frontend** combining the best of both worlds!

---

## 📝 Notes

- All Next.js `Link` → React Router `Link`
- All Next.js `Image` → `<img>` or `vite-imagetools`
- Remove all `'use client'` directives (Vite is CSR)
- Replace `useSession()` with your auth context
- Update API imports to use Vite's service modules

---

Ready to start migration? I can help implement any phase!
