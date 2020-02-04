import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Home.vue'),
    'children': [
      {
        path: 'registerverify',
        name: 'registerverify',
        component: () => import('@/views/Verify/RegisterVerify.vue')
      },
      {
        path: 'information',
        name: 'information',
        component: () => import('@/views/Setting/Information.vue')
      },
      {
        path: 'ojaccount',
        name: 'ojaccount',
        component: () => import('@/views/Setting/OjAccount.vue')
      },
      {
        path: 'myacrecord',
        name: 'myacrecord',
        component: () => import('@/views/Personal/MyAcRecord.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth/Auth.vue'),
    'children': [
      {
        path: 'login',
        name: '登录',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: '注册',
        component: () => import('@/views/Auth/Register.vue')
      },
      {
        path: 'forgetpassword',
        name: '忘记密码',
        component: () => import('@/views/Auth/ForgetPassword.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.toLowerCase().startsWith('/auth')) {
    if (localStorage.token) {
      next({
        path: ''
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
