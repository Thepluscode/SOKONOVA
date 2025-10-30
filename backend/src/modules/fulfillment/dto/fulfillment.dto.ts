import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for marking an item as shipped
 */
export class MarkShippedDto {
  @IsOptional()
  @IsString()
  carrier?: string; // e.g. "DHL", "FedEx", "UPS", "Local Courier"

  @IsOptional()
  @IsString()
  trackingCode?: string; // Tracking number from carrier

  @IsOptional()
  @IsString()
  note?: string; // Note to buyer (e.g. "Expected delivery in 2-3 days")
}

/**
 * DTO for marking an item as delivered
 */
export class MarkDeliveredDto {
  @IsOptional()
  @IsString()
  proofUrl?: string; // URL to delivery proof (photo, signature, receipt)

  @IsOptional()
  @IsString()
  note?: string; // Delivery note (e.g. "Left with receptionist")
}

/**
 * DTO for marking an item as having an issue
 */
export class MarkIssueDto {
  @IsString()
  note: string; // Required description of the issue
}
