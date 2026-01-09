export async function getDeliveryPromise(productId: string, location?: string) {
    // Mock implementation
    return new Promise<any>((resolve) => {
        setTimeout(() => {
            resolve({
                productId,
                location: location || 'Default Location',
                promisedMinDays: 2,
                promisedMaxDays: 4,
                confidenceLevel: 0.95,
                sellerRating: 4.8,
                deliveryGuarantee: true,
                message: 'Free delivery by Friday',
            });
        }, 500);
    });
}
