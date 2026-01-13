"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
let SellerProductsController = class SellerProductsController {
    constructor(products) {
        this.products = products;
    }
    async myProducts(sellerId) {
        return this.products.sellerList(sellerId);
    }
    async createProduct(dto, sellerId) {
        return this.products.create({ ...dto, sellerId });
    }
    async updateProduct(productId, dto, sellerId) {
        return this.products.sellerUpdate(sellerId, productId, dto);
    }
    async updateInventory(productId, dto, sellerId) {
        return this.products.sellerUpdateInventory(sellerId, productId, dto.quantity);
    }
};
exports.SellerProductsController = SellerProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellerProductsController.prototype, "myProducts", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, String]),
    __metadata("design:returntype", Promise)
], SellerProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)(':productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, String]),
    __metadata("design:returntype", Promise)
], SellerProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Patch)(':productId/inventory'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dto_1.UpdateInventoryDto, String]),
    __metadata("design:returntype", Promise)
], SellerProductsController.prototype, "updateInventory", null);
exports.SellerProductsController = SellerProductsController = __decorate([
    (0, common_1.Controller)('seller/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], SellerProductsController);
//# sourceMappingURL=seller-products.controller.js.map