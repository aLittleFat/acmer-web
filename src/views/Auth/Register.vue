<template>
  <Form ref="formInline" :model="formInline" :rules="ruleInline">
    <FormItem prop="email">
      <Input type="text" v-model="formInline.email" placeholder="邮箱">
      <Icon type="ios-mail-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <!-- <Row type="flex" justify="space-between" class="code-row-bg"> -->
      <!-- <Col span="9"> -->
        <FormItem prop="verifyCode">
          <Input type="text" v-model="formInline.verifyCode" placeholder="验证码">
          <Icon type="ios-mail-outline" slot="prepend"></Icon>
          <Button type="primary" @click="getCode()" v-model="getCodeButtonContent" :disabled="getCodeDisable" slot="append">{{getCodeButtonContent}}</Button>
          </Input>
        </FormItem>
      <!-- </Col> -->
      <!-- <Col span="4"> -->
      <!-- </Col> -->
    </Row>
    <FormItem prop="password">
      <Input type="password" v-model="formInline.password" placeholder="密码">
      <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="passwordAgain">
      <Input type="password" v-model="formInline.passwordAgain" placeholder="再次输入密码">
      <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="name">
      <Input type="text" v-model="formInline.name" placeholder="姓名">
      <Icon type="ios-mail-outline" slot="prepend"></Icon>
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
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="id">
        <Input type="text" v-model="formInline.id" placeholder="学号">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
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
  // axios.defaults.baseURL = 'http://localhost:8081/'
  // axios.defaults.withCredentials = true
  import router from '../../router'
  export default {
    name: 'Login',
    data () {
      return {
        formInline: {
          email: '',
          password: '',
          passwordAgain: '',
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
            }
          ],
          passwordAgain: [{
              required: true,
              message: '请再次输入密码',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码最少6位',
              trigger: 'blur'
            }
          ]
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
                if (res.data === true) {
                   that.$Message.info('注册成功，请等到管理员审核')
                   router.push('Login')
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
