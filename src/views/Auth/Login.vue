<template>
  <Form ref="formInline" :model="formInline" :rules="ruleInline">
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
    <Row>
      <Col span="4" offset="6">
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        </FormItem>
      </Col>
      <Col span="4" offset="4">
        <FormItem>
          <Button type="primary" @click="register()">注册</Button>
        </FormItem>
      </Col>
    </Row>
    <Row type="flex" justify="end" class="code-row-bg">
      <FormItem>
        <router-link to="forgetpassword">忘记密码</router-link>
      </FormItem>
      <Col offset="1">
        <FormItem>
          <router-link to="/">游客登录</router-link>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
<script>
  import router from '@/router'
  export default {
    data () {
      return {
        formInline: {
          email: '',
          password: ''
        },
        ruleInline: {
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '邮箱格式错误',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码最少6位',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 16,
              message: '密码最多16位',
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
                  if (/^\d+$/.test(res.data)) {
                    window.localStorage['token'] = res.headers.token
                    window.localStorage['userId'] = res.data
                    console.log(res.headers.token)
                    console.log(localStorage.token)
                    that.$Message.success('登录成功')
                    router.push('/')
                  } else {
                    that.$Message.error(res.data)
                  }
              })
            .catch(function (error) {
              that.$Message.error(error.data)
            })
          } else {
            that.$Message.error('请正确输入表单!')
          }
        })
      },
      register () {
        router.push('register')
      }
    }
  }
</script>

<style>
</style>
