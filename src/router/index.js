import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Auth.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Auth.vue'),
    'children': [
      {
        path: 'login',
        name: '登录',
        component: () => import('../views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: '注册',
        component: () => import('../views/Auth/Register.vue')
      },
      {
        path: 'forgetpassword',
        name: '忘记密码',
        component: () => import('../views/Auth/ForgetPassword.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
