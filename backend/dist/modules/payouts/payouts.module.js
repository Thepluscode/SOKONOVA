"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutsModule = void 0;
const common_1 = require("@nestjs/common");
const payouts_service_1 = require("./payouts.service");
const payouts_controller_1 = require("./payouts.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let PayoutsModule = class PayoutsModule {
};
exports.PayoutsModule = PayoutsModule;
exports.PayoutsModule = PayoutsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        providers: [payouts_service_1.PayoutsService],
        controllers: [payouts_controller_1.PayoutsController],
        exports: [payouts_service_1.PayoutsService],
    })
], PayoutsModule);
//# sourceMappingURL=payouts.module.js.map