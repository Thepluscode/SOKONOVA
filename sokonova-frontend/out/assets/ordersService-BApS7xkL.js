import{a as e}from"./index-ZpOvIOBK.js";const o={listMine:async()=>e.get("/orders/mine"),listForUser:async r=>e.get(`/orders/user/${r}`),listForSeller:async r=>{const s=r?`?sellerId=${r}`:"";return e.get(`/orders/seller${s}`)},create:async(r,s)=>e.post(`/orders/create?cartId=${s}`,r),getById:async r=>e.get(`/orders/${r}`)};export{o};
//# sourceMappingURL=ordersService-BApS7xkL.js.map
