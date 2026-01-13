import{a as s}from"./index-CqGhWzgp.js";const n={open:async e=>s.post("/disputes/open",e),listForSeller:async e=>{const t=e?`?sellerId=${e}`:"";return s.get(`/disputes/seller${t}`)},listAll:async()=>s.get("/disputes/admin")};export{n as d};
//# sourceMappingURL=disputesService-HGmesabq.js.map
