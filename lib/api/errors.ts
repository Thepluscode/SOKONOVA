// lib/api/errors.ts

export class VersionConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VersionConflictError';
  }
}

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InventoryError';
  }
}

export class CartOperationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'CartOperationError';
  }
}