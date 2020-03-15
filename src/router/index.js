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
            path: 'overview',
            name: 'Overview',
            component: () => import('@/views/Personal/Overview.vue')
          },
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
      },
      {
        path: 'team/:id',
        name: 'Team',
        component: () => import('@/views/Profile/Team.vue')
      },
      {
        path: 'contest/:id',
        name: 'Contest',
        component: () => import('@/views/Contest/Contest.vue')
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
        alias: [
          '/login',
          ''
        ],
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        alias: '/register',
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
  if (to.name === 'Login' || to.name === 'Register') {
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
