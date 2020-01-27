<template>
  <Form ref="formInline" :model="formInline" :rules="ruleInline">
    <FormItem prop="email">
      <Input type="text" v-model="formInline.email" placeholder="邮箱">
      <Icon type="ios-mail-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
      <FormItem prop="verifyCode">
        <Input type="text" v-model="formInline.verifyCode" placeholder="验证码">
        <Icon type="ios-code" slot="prepend"></Icon>
        <Button type="primary" @click="getCode()" v-model="getCodeButtonContent" :disabled="getCodeDisable" slot="append">{{getCodeButtonContent}}</Button>
        </Input>
      </FormItem>
    </Row>
    <FormItem prop="password">
      <Input type="password" v-model="formInline.password" placeholder="密码">
      <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="confirmPwd">
      <Input type="password" v-model="formInline.confirmPwd" placeholder="再次输入密码">
      <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <Row>
      <Col span="4" offset="4">
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </FormItem>
      </Col>
      <Col span="4" offset="4">
      <FormItem>
        <Button type="primary" @click="handleReset('formInline')">重置</Button>
      </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
  import router from '@/router'
  export default {
    data () {
      const valiConfirmPwd = (rule, value, callback) => {
          if (value !== this.formInline.password) {
              callback(new Error('两次输入的密码不一致'))
          } else {
              callback()
          }
      }

      return {
        formInline: {
          email: '',
          password: '',
          confirmPwd: '',
          verifyCode: ''
        },
        totalTime: 60,
        getCodeButtonContent: '发送验证码',
        getCodeDisable: false,
        ruleInline: {
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }],
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
            },
            {
              pattern: /^\S{6,16}/,
              message: '密码不能包含空格',
              trigger: 'blur'
            }
          ],
          confirmPwd: [{
              required: true,
              message: '请再次输入密码',
              trigger: 'blur'
            },
            {
              validator: valiConfirmPwd,
              message: '两次输入的密码不同',
              trigger: 'blur'
            }
          ],
          verifyCode: [{
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
            },
            {
              pattern: /\d{6}$/,
              message: '请输入6位数字验证码',
              trigger: 'blur'
          }]
        }
      }
    },
    methods: {

      getCode () {
        let that = this
        if (that.formInline.email === '') {
          that.$Message.error('请输入正确的邮箱格式')
        } else {
        that.$http
          .post('/auth/sendForgetPasswordVerifyEmailCode', {
            email: that.formInline.email
          })
          .then(res => {
            if (res.data === true) {
              that.getCodeButtonContent = that.totalTime + 's后重新发送'
              that.getCodeDisable = true
                let clock = window.setInterval(() => {
                  that.totalTime--
                  that.getCodeButtonContent = that.totalTime + 's后重新发送'
                  if (that.totalTime < 0) {
                      window.clearInterval(clock)
                      that.getCodeButtonContent = '重新发送验证码'
                      that.totalTime = 60
                      that.getCodeDisable = false
                  }
                }, 1000)
            } else {
              that.$Message.error(res.data)
            }
          })
          .catch(error => {
            console.log(error)
            that.$Message.error('网络错误')
          })
        }
      },
      handleSubmit (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/auth/forgetPassword', {
                email: that.formInline.email,
                password: that.formInline.password,
                verifyCode: that.formInline.verifyCode
              })
              .then(res => {
                if (res.data === true) {
                   that.$Message.success('修改密码成功')
                   router.push('Login')
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
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>

<style>
</style>
