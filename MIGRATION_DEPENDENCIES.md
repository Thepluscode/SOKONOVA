# Dependencies Required for Migration

## ⚠️ IMPORTANT: Disk Space Issue

Your system is currently out of disk space. Before installing these dependencies:

1. **Free up disk space** (at least 500MB recommended)
2. **Clear npm cache**: `npm cache clean --force`
3. **Check disk usage**: `df -h`

## Installation Commands

Once you have disk space, run these commands:

### Phase 1: Core Dependencies

```bash
cd sokonova-frontend

# Install with legacy peer deps to avoid conflicts
npm install --legacy-peer-deps \
  framer-motion \
  lucide-react \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-tabs \
  @radix-ui/react-dialog \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-select \
  @radix-ui/react-label \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  class-variance-authority \
  clsx \
  tailwind-merge \
  recharts
```

### Phase 2: Additional Dependencies (if needed)

```bash
npm install --legacy-peer-deps \
  date-fns \
  react-hook-form \
  zod
```

## Package Versions

The components were copied from Next.js app which uses:
- `framer-motion`: ^11.x
- `lucide-react`: ^0.4x
- `@radix-ui/*`: ^1.x
- `recharts`: ^2.x (for charts in dashboards)

## Alternative: Manual Cleanup

If still having issues:

1. **Remove node_modules**:
   ```bash
   rm -rf sokonova-frontend/node_modules
   rm sokonova-frontend/package-lock.json
   ```

2. **Clear system tmp**:
   ```bash
   rm -rf /tmp/*
   ```

3. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

4. **Reinstall**:
   ```bash
   cd sokonova-frontend
   npm install
   # Then run the migration dependencies above
   ```

## Components Already Copied

The following components have been copied to your Vite frontend.
They will work once dependencies are installed:

- ✅ UI Components (17)
- ✅ Motion System
- ✅ Config Files
- ✅ Business Intelligence Components (20+)
- ✅ All Phase 1, 2, and 3 components

Just need to install dependencies and they'll be ready to use!
