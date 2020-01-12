<template>
  <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
    <FormItem prop="email">
      <Input type="text" v-model="formInline.email" placeholder="Email">
      <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="formInline.password" placeholder="Password">
      <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="register()">注册</Button>
    </FormItem>
  </Form>
</template>
<script>
  // axios.defaults.baseURL = 'http://localhost:8081/'
  // axios.defaults.withCredentials = true
  import router from '../../router'
  export default {
    name: 'Login',
    data () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [{
            required: true,
            message: 'Please fill in the user name',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: 'Please fill in the password.',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: 'The password length cannot be less than 6 bits',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/auth/login', {
                email: that.formInline.email,
                password: that.formInline.password
              })
              .then(res => {
                  if (res.data === true) {
                    window.localStorage['token'] = res.headers.token
                    that.$Message.info('登录成功')
                    router.push('/')
                  } else {
                    that.$Message.error(res.data)
                  }
              })
            .catch(function (error) { // 请求失败处理
                that.$Message.error(error.data)
            })
          } else {
            that.$Message.error('请正确输入表单!')
          }
        })
      },
      register () {
        router.push('Register')
      }
    }
  }
</script>

<style>
</style>
