<template>
  <div>
    <Col span="8">
      <Form :model="formItem" :label-width="120" :rules="rule" ref="infoForm">
        <FormItem label="姓名:">
          {{user.name}}
        </FormItem>
        <FormItem label="邮箱:">
          {{user.email}}
        </FormItem>
        <div v-if="user.studentId" >
          <FormItem label="年级:">
            {{user.grade}}
          </FormItem>
          <FormItem label="学号:">
            {{user.studentId}}
          </FormItem>
        </div>
        <FormItem label="手机:" prop="phone">
          <div v-if="changing">
            <Input v-model="formItem.phone" placeholder="请输入手机号码"></Input>
          </div>
          <div v-else>
            {{user.phone}}
          </div>
        </FormItem>
        <FormItem label="ICPC_Email:" prop="email">
          <div v-if="changing">
            <Input v-model="formItem.icpcEmail" placeholder="请输入ICPC邮箱"></Input>
          </div>
          <div v-else>
            {{user.icpcEmail}}
          </div>
        </FormItem>
        <FormItem>
          <div v-if="changing">
            <Row>
              <Col span="4">
                <Button type="primary" @click="handleSubmit('infoForm')">提交</Button>
              </Col>
              <Col offset="2">
                <Button type="primary" @click="handleCancle()">取消</Button>
              </Col>
            </Row>
          </div>
          <div v-else>
            <Button type="primary" @click="handleChange()">修改</Button>
          </div>
        </FormItem>
      </Form>
    </Col>
  </div>
</template>

<script>
  export default {
    data () {
      // const valiPhone = (rule, value, callback) => {
      //     if (value !== '' && /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|170|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value) === false) {
      //         callback(new Error('请输入正确的手机号码'))
      //     } else {
      //         callback()
      //     }
      // }
      return {
        user: {
          type: Object
        },
        formItem: {
          phone: '',
          icpcEmail: ''
        },
        rule: {
          phone: [{
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|170|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],
          email: [{
            type: 'email',
            message: '请输入正确的ICPC邮箱',
            trigger: 'blur'
          }]
        },
        changing: false
      }
    },
    methods: {
      handleChange () {
        this.formItem.phone = this.user.phone
        this.formItem.icpcEmail = this.user.icpcEmail
        this.changing = true
      },
      handleCancle () {
        this.formItem.phone = this.user.phone
        this.formItem.icpcEmail = this.user.icpcEmail
        this.changing = false
      },
      handleSubmit (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .put('/api/info', {
                phone: that.formItem.phone,
                icpcEmail: that.formItem.icpcEmail
              })
              .then(res => {
                if (res.data.status === 0) {
                   that.$Message.success('修改成功')
                   that.getInfo()
                   that.changing = false
                } else {
                  that.$Message.error(res.data.msg)
                }
              })
          } else {
            that.$Message.error('请正确输入表单!')
          }
        })
      },
      getInfo () {
        let that = this
        that.$http
          .get('/api/info')
          .then(res => {
            if (res.data.status === 0) {
              that.user = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    created: function () {
      this.getInfo()
    }
  }
</script>

<style>

</style>
