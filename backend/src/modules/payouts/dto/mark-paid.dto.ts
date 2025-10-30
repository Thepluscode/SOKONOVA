import { IsArray, IsString, ArrayMinSize } from 'class-validator';

/**
 * DTO for marking order items as paid out
 *
 * Used by finance/admin to record that sellers have been paid.
 */
export class MarkPaidDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  orderItemIds: string[];

  @IsString()
  batchId: string; // e.g. "2025-10-28-run-1" for grouping and audit
}
