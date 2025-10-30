"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const seller_applications_service_1 = require("./seller-applications.service");
const seller_applications_controller_1 = require("./seller-applications.controller");
let SellerApplicationsModule = class SellerApplicationsModule {
};
exports.SellerApplicationsModule = SellerApplicationsModule;
exports.SellerApplicationsModule = SellerApplicationsModule = __decorate([
    (0, common_1.Module)({
        providers: [seller_applications_service_1.SellerApplicationsService],
        controllers: [seller_applications_controller_1.SellerApplicationsController],
        exports: [seller_applications_service_1.SellerApplicationsService],
    })
], SellerApplicationsModule);
//# sourceMappingURL=seller-applications.module.js.map