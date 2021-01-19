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
          <FormItem label="状态:">
            {{user.status}}
            <Button type="error" @click="requestRetire" v-if="user.status==='现役'" style="margin-left: 1.5rem;">申请退役</Button>
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
        <FormItem label="QQ:" prop="qq">
          <div v-if="changing">
            <Input v-model="formItem.qq" placeholder="请输入QQ"></Input>
          </div>
          <div v-else>
            {{user.qq}}
          </div>
        </FormItem>
        <FormItem>
          <div v-if="changing">
            <Button type="success" @click="handleSubmit('infoForm')">提交</Button>
            <Button type="error" @click="handleCancle()" style="margin-left: 1.5rem;">取消</Button>
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
      return {
        user: {
          type: null
        },
        formItem: {
          phone: '',
          icpcEmail: '',
          qq: ''
        },
        rule: {
          phone: [{
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|16[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],
          email: [{
            type: 'email',
            message: '请输入正确的ICPC邮箱',
            trigger: 'blur'
          }],
          qq: [{
            pattern: /^\d{6,10}$/,
            message: '请输入正确的QQ号',
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
        this.formItem.qq = this.user.qq
        this.changing = true
      },
      handleCancle () {
        this.formItem.phone = this.user.phone
        this.formItem.icpcEmail = this.user.icpcEmail
        this.formItem.qq = this.user.qq
        this.changing = false
      },
      handleSubmit (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .put('/api/info', {
                phone: that.formItem.phone,
                icpcEmail: that.formItem.icpcEmail,
                qq: that.formItem.qq
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
      },
      requestRetire () {
        let that = this
        that.$http
          .put('/api/retire/' + that.user.studentId)
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('申请成功')
              that.getData()
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
