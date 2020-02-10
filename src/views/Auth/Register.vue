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
    <FormItem prop="name">
      <Input type="text" v-model="formInline.name" placeholder="姓名">
      <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="phone">
      <Input type="text" v-model="formInline.phone" placeholder="手机号码">
      <Icon type="ios-phone-portrait" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="role">
      <Select prefix = "ios-person-outline" v-model="formInline.role" style="width:200px">
          <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <div v-if="formInline.role === '学生'">
      <FormItem prop="grade">
        <Input type="text" v-model="formInline.grade" placeholder="年级">
        <Icon type="ios-time-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="id">
        <Input type="text" v-model="formInline.id" placeholder="学号">
        <Icon type="ios-school-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
    </div>
    <Row>
      <Col span="4" offset="4">
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">注册</Button>
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
          phone: '',
          role: '',
          id: '',
          grade: '',
          verifyCode: ''
        },
        totalTime: 60,
        getCodeButtonContent: '发送验证码',
        getCodeDisable: false,
        roles: [
          {
              value: '教师',
              label: '教师'
          },
          {
              value: '学生',
              label: '学生'
          }
        ],
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
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          verifyCode: [{
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
            },
            {
              pattern: /\d{6}$/,
              message: '请输入6位数字验证码',
              trigger: 'blur'
          }],
          phone: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|170|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
              message: '手机号码格式错误',
              trigger: 'blur'
          }],
          role: [{
            required: true,
            message: '请选择注册的用户角色',
            trigger: 'blur'
          }],
          grade: [{
              required: true,
              message: '请输入年级',
              trigger: 'blur'
            },
            {
              pattern: /^(2)\d{3}$/,
              message: '请输入4位年级',
              trigger: 'blur'
          }],
          id: [{
              required: true,
              message: '请输入学号',
              trigger: 'blur'
            },
            {
              pattern: /^(2)\d{11}$/,
              message: '请输入12位学号',
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
          .post('/auth/sendVerifyEmailCode', {
            email: that.formInline.email
          })
          .then(res => {
            if (res.data.status === 0) {
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
              that.$Message.error(res.data.msg)
            }
          })
        }
      },
      handleSubmit (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/auth/register', {
                email: that.formInline.email,
                password: that.formInline.password,
                phone: that.formInline.phone,
                name: that.formInline.name,
                verifyCode: that.formInline.verifyCode,
                grade: that.formInline.grade,
                studentId: that.formInline.id,
                type: that.formInline.role
              })
              .then(res => {
                if (res.data.status === 0) {
                   that.$Message.success('注册成功，请等到管理员审核')
                   router.push('Login')
                } else {
                  that.$Message.error(res.data.msg)
                }
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
