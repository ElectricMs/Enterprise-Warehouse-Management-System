

//路由
import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"),children:[
        {path: "/dashboard/warehouse", component: () =>import("../views/dashboard/Warehouse.vue")},
        {path: "/dashboard/inandout", component: () =>import("../views/dashboard/InAndOut.vue")},
        {path: "/dashboard/record", component: () =>import("../views/dashboard/Record.vue")},
        {path: "/dashboard/slip", component: () =>import("../views/dashboard/Slip.vue")},
        {path: "/dashboard/statistics", component: () =>import("../views/dashboard/SalesStatistics.vue")},
    ] },
    { path: "/", component: () => import("../views/Login.vue") },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router, routes };