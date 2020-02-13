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
        path: 'verify',
        name: 'Verify',
        component: () => import('@/views/Blank.vue'),
        children: [
          {
            path: 'registerverify',
            name: 'RegisterVerify',
            alias: '',
            component: () => import('@/views/Verify/RegisterVerify.vue')
          }
        ]
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/Blank.vue'),
        children: [
          {
            path: 'myacrecord',
            name: 'MyAcRecord',
            alias: '',
            component: () => import('@/views/Personal/MyAcRecord.vue')
          },
          {
            path: 'mycontest',
            name: 'MyContest',
            component: () => import('@/views/Personal/MyContest.vue')
          }
        ]
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/Blank.vue'),
        children: [
          {
            path: 'information',
            name: 'Information',
            alias: '',
            component: () => import('@/views/Setting/Information.vue')
          },
          {
            path: 'ojaccount',
            name: 'OjAccount',
            component: () => import('@/views/Setting/OjAccount.vue')
          }
        ]
      },
      {
        path: 'rank',
        name: 'Rank',
        component: () => import('@/views/Blank.vue'),
        children: [
          {
            path: 'personalacrank',
            name: 'PersonalAcRank',
            alias: '',
            component: () => import('@/views/Rank/PersonalAcRank.vue')
          }
        ]
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Blank.vue'),
        children: [
          {
            path: 'season',
            name: 'SeasonListAdmin',
            alias: '',
            component: () => import('@/views/Admin/SeasonList.vue')
          },
          {
            path: 'season/:id',
            name: 'SeasonAdmin',
            component: () => import('@/views/Admin/Season.vue')
          }
        ]
      },
      {
        path: 'student/:id',
        name: 'Student',
        component: () => import('@/views/Profile/Student.vue')
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
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Auth/Register.vue')
      },
      {
        path: 'forgetpassword',
        name: 'ForgetPassword',
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
