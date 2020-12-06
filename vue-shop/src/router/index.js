import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Power from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Shop from '../components/goods/Shop.vue'
import App from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Repote from '../components/repote/Repote.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: 'login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, {
            path: '/rights',
            component: Power
        }, {
            path: '/roles',
            component: Roles
        },
        {
            path: '/goods',
            component: Cate
        }, {
            path: '/params',
            component: Params
        },
        {
            path: '/categories',
            component: Shop
        }, {
            path: '/goods/Add',
            component: App
        }, {
            path: '/orders',
            component: Order
        }, {
            path: '/reports',
            component: Repote
        }
    ]
}, ]


const router = new VueRouter({
    routes
})
router.beforeEach((to, form, next) => {
    if (to.path == '/login') return next()
    const toKen = window.sessionStorage.getItem("token");
    if (!toKen) return next('/login')
    next()
})

export default router