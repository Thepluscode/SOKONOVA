// Fix for circular reference issue with Prisma's WhereWithAggregatesInput types
// This file provides alternative types that avoid the circular reference problem

// Augment the Prisma namespace to fix the circular reference issue
declare namespace Prisma {
  // Override the problematic UserScalarWhereWithAggregatesInput type
  export type UserScalarWhereWithAggregatesInput = {
    // Simplified version that avoids circular references
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput;
    // Include only the fields we actually use in our application
    id?: string | Prisma.StringWithAggregatesFilter<string>;
    email?: string | Prisma.StringWithAggregatesFilter<string>;
    role?: string | Prisma.StringWithAggregatesFilter<string>;
    country?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    city?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    gender?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    birthDate?: string | Prisma.DateTimeNullableWithAggregatesFilter<Date>;
    createdAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
    updatedAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
  };
  
  // Apply the same fix to other similar types if needed
  export type OrderScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderScalarWhereWithAggregatesInput | Prisma.OrderScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderScalarWhereWithAggregatesInput;
    id?: string | Prisma.StringWithAggregatesFilter<string>;
    userId?: string | Prisma.StringWithAggregatesFilter<string>;
    total?: number | Prisma.DecimalWithAggregatesFilter<Prisma.Decimal>;
    currency?: string | Prisma.StringWithAggregatesFilter<string>;
    status?: string | Prisma.EnumOrderStatusWithAggregatesFilter<"PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED">;
    createdAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
    updatedAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
    paymentRef?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    shippingAdr?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    buyerName?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    buyerPhone?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    buyerEmail?: string | Prisma.StringNullableWithAggregatesFilter<string>;
  };
  
  // Add other types as needed
  export type ProductScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductScalarWhereWithAggregatesInput | Prisma.ProductScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductScalarWhereWithAggregatesInput;
    id?: string | Prisma.StringWithAggregatesFilter<string>;
    sellerId?: string | Prisma.StringWithAggregatesFilter<string>;
    title?: string | Prisma.StringWithAggregatesFilter<string>;
    description?: string | Prisma.StringWithAggregatesFilter<string>;
    price?: number | Prisma.DecimalWithAggregatesFilter<Prisma.Decimal>;
    currency?: string | Prisma.StringWithAggregatesFilter<string>;
    imageUrl?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    category?: string | Prisma.StringNullableWithAggregatesFilter<string>;
    ratingAvg?: number | Prisma.FloatNullableWithAggregatesFilter<number>;
    ratingCount?: number | Prisma.IntNullableWithAggregatesFilter<number>;
    createdAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
    updatedAt?: string | Prisma.DateTimeWithAggregatesFilter<Date>;
  };
  
  // Define the filter types to avoid circular references
  export type StringWithAggregatesFilter<T> = {
    equals?: T;
    in?: T[];
    notIn?: T[];
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    contains?: T;
    startsWith?: T;
    endsWith?: T;
    not?: T | StringWithAggregatesFilter<T>;
  };
  
  export type StringNullableWithAggregatesFilter<T> = {
    equals?: T | null;
    in?: T[] | null;
    notIn?: T[] | null;
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    contains?: T;
    startsWith?: T;
    endsWith?: T;
    not?: T | StringNullableWithAggregatesFilter<T> | null;
  };
  
  export type DateTimeWithAggregatesFilter<T> = {
    equals?: T;
    in?: T[];
    notIn?: T[];
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    not?: T | DateTimeWithAggregatesFilter<T>;
  };
  
  export type DateTimeNullableWithAggregatesFilter<T> = {
    equals?: T | null;
    in?: T[] | null;
    notIn?: T[] | null;
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    not?: T | DateTimeNullableWithAggregatesFilter<T> | null;
  };
  
  export type DecimalWithAggregatesFilter<T> = {
    equals?: T;
    in?: T[];
    notIn?: T[];
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    not?: T | DecimalWithAggregatesFilter<T>;
  };
  
  export type EnumOrderStatusWithAggregatesFilter<T> = {
    equals?: T;
    in?: T[];
    notIn?: T[];
    not?: T | EnumOrderStatusWithAggregatesFilter<T>;
  };
  
  export type FloatNullableWithAggregatesFilter<T> = {
    equals?: T | null;
    in?: T[] | null;
    notIn?: T[] | null;
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    not?: T | FloatNullableWithAggregatesFilter<T> | null;
  };
  
  export type IntNullableWithAggregatesFilter<T> = {
    equals?: T | null;
    in?: T[] | null;
    notIn?: T[] | null;
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    not?: T | IntNullableWithAggregatesFilter<T> | null;
  };
}