<template>
  <div>
    <Card style="width: 30rem;">
        <p slot="title">VJ</p>
        <div v-if="VjAccount===''">
          <Button size="small" type="success" @click="handleShowAddOjAccountModal('VJ')">添加</Button>
        </div>
        <div v-else>
          <a :href="handleGetAccountHref('https://vjudge.net/user/', VjAccount)" target="_blank">{{ VjAccount }}</a>
          <Button size="small" type="warning" style="margin-left: 2rem;" @click="handleShowChangeOjAccountModal('VJ')">修改</Button>
          <Button size="small" type="error" style="margin-left: 2rem;" @click="confirmDelete('VJ')">删除</Button>
        </div>
    </Card>
    <br>
    <Card style="width: 30rem;">
      <p slot="title">HDU</p>
      <div v-if="HduAccount===''">
        <Button size="small" type="success" @click="handleShowAddOjAccountModal('HDU')">添加</Button>
      </div>
      <div v-else>
        <a :href="handleGetAccountHref('http://acm.hdu.edu.cn/userstatus.php?user=', HduAccount)" target="_blank">{{ HduAccount }}</a>
        <Button size="small" type="warning" style="margin-left: 2rem;" @click="handleShowChangeOjAccountModal('HDU')">修改</Button>
        <Button size="small" type="error" style="margin-left: 2rem;" @click="confirmDelete('HDU')">删除</Button>
      </div>
    </Card>
    <br>
    <Card style="width: 30rem;">
      <p slot="title">BZOJ</p>
      <div v-if="BzojAccount===''">
        <Button size="small" type="success" @click="handleShowAddOjAccountModal('BZOJ')">添加</Button>
      </div>
      <div v-else>
        <a :href="handleGetAccountHref('https://www.lydsy.com/JudgeOnline/userinfo.php?user=', BzojAccount)" target="_blank">{{ BzojAccount }}</a>
        <Button size="small" type="warning" style="margin-left: 2rem;" @click="handleShowChangeOjAccountModal('BZOJ')">修改</Button>
        <Button size="small" type="error" style="margin-left: 2rem;" @click="confirmDelete('BZOJ')">删除</Button>
      </div>
    </Card>
    <br>
    <Card style="width: 30rem;">
      <p slot="title">CodeForces</p>
      <div v-if="CfAccount===''">
        <Button size="small" type="success" @click="handleShowAddOjAccountModal('CodeForces')">添加</Button>
      </div>
      <div v-else>
        <a :href="handleGetAccountHref('https://www.codeforces.com/profile/', CfAccount)" target="_blank">{{ CfAccount }}</a>
        <Button size="small" type="warning" style="margin-left: 2rem;" @click="handleShowChangeOjAccountModal('CodeForces')">修改</Button>
        <Button size="small" type="error" style="margin-left: 2rem;" @click="confirmDelete('CodeForces')">删除</Button>
      </div>
    </Card>
    <Modal
      v-model="addOjAccountModal">
      <p slot="header" style="color:#f60;text-align:center">
          <span>{{handleModalTitle}}</span>
      </p>
      <Row>
        <Col span="15">
          <Form :model="formItem" :label-width="100" :rules="rule">
            <FormItem label="用户名" prop="username">
              <Input v-model="formItem.modalUsername" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem v-if="handleOjName==='CodeForces'" prop="verifyCode">
              <Input type="text" v-model="formItem.modalPassword" placeholder="验证码">
              <Icon type="ios-code" slot="prepend"></Icon>
              <Button type="primary" @click="getCode()" :loading="getCode_loading" v-model="getCodeButtonContent" :disabled="getCodeDisable" slot="append">{{getCodeButtonContent}}</Button>
              </Input>
            </FormItem>
            <FormItem v-else label="密码" prop="password">
              <Input type="password" v-model="formItem.modalPassword" placeholder="请输入密码"></Input>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddOjAccount()">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="changeOjAccountModal">
      <p slot="header" style="color:#f60;text-align:center">
          <span>{{handleModalTitle}}</span>
      </p>
      <Row>
        <Col span="15">
          <Form :model="formItem" :label-width="100" :rules="rule">
            <FormItem label="用户名" prop="username">
              <Input v-model="formItem.modalUsername" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem v-if="handleOjName==='CodeForces'" prop="verifyCode">
              <Input type="text" v-model="formItem.modalPassword" placeholder="验证码">
              <Icon type="ios-code" slot="prepend"></Icon>
              <Button type="primary" @click="getCode()" v-model="getCodeButtonContent" :disabled="getCodeDisable" slot="append">{{getCodeButtonContent}}</Button>
              </Input>
            </FormItem>
            <FormItem v-else label="密码" prop="password">
              <Input type="password" v-model="formItem.modalPassword" placeholder="请输入密码"></Input>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="warning" :loading="change_loading" @click="handleChangeOjAccount()">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addOjAccountModal: false,
        changeOjAccountModal: false,
        handleOjName: '',
        handleModalTitle: '',
        formItem: {
          modalUsername: '',
          modalPassword: ''
        },
        add_loading: false,
        change_loading: false,
        getCode_loading: false,
        VjAccount: '',
        HduAccount: '',
        BzojAccount: '',
        CfAccount: '',
        getCodeButtonContent: '发送验证码',
        getCodeDisable: false,
        totalTime: 60
      }
    },
    methods: {
      handleGetAccountHref (url, account) {
        return url + account
      },
      handleAddOjAccount () {
        let that = this
        that.add_loading = true
        that.$http
          .post('/api/ojAccount', {
            ojName: that.handleOjName,
            username: that.formItem.modalUsername,
            password: that.formItem.modalPassword
          })
          .then(res => {
            that.add_loading = false
            if (res.data.status === 0) {
              that.$Message.success('添加成功')
              that.handleGetOjAccount()
              that.addOjAccountModal = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleChangeOjAccount () {
        let that = this
        that.change_loading = true
        that.$http
          .put('/api/ojAccount', {
            ojName: that.handleOjName,
            username: that.formItem.modalUsername,
            password: that.formItem.modalPassword
          })
          .then(res => {
            that.change_loading = false
            if (res.data.status === 0) {
              that.$Message.success('修改成功')
              that.handleGetOjAccount()
              that.changeOjAccountModal = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleDeleteOjAccount () {
        let that = this
        that.$http
          .delete('/api/ojAccount', {
            params: {
              ojName: that.handleOjName
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
              that.handleGetOjAccount()
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleShowAddOjAccountModal (ojName) {
        let that = this
        that.resetModalForm()
        that.handleOjName = ojName
        that.handleModalTitle = '添加' + ojName + '账号'
        that.addOjAccountModal = true
      },
      handleShowChangeOjAccountModal (ojName) {
        let that = this
        that.resetModalForm()
        that.handleOjName = ojName
        that.handleModalTitle = '修改' + ojName + '账号'
        that.changeOjAccountModal = true
      },
      resetModalForm () {
        this.formItem.modalUsername = ''
        this.formItem.modalPassword = ''
      },
      confirmDelete (ojName) {
        this.handleOjName = ojName
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>确认要删除' + ojName + '账号吗</p>',
          onOk: () => {
              this.handleDeleteOjAccount()
          }
        })
      },
      getCode () {
        let that = this
        if (that.formItem.modalUsername === '') {
          that.$Message.error('请输入CodeForces账号')
        } else {
          that.getCode_loading = true
          that.totalTime = 60
          that.$http
            .post('/api/cfVerifyCode', {
              username: that.formItem.modalUsername
            })
            .then(res => {
              that.getCode_loading = false
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
      getVjAccount () {
        let that = this
        that.$http
          .get('/api/ojAccount', {
            params: {
              ojName: 'VJ'
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.VjAccount = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      getHduAccount () {
        let that = this
        that.$http
          .get('/api/ojAccount', {
            params: {
              ojName: 'HDU'
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.HduAccount = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      getBzojAccount () {
        let that = this
        that.$http
          .get('/api/ojAccount', {
            params: {
              ojName: 'BZOJ'
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.BzojAccount = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      getCfAccount () {
        let that = this
        that.$http
          .get('/api/ojAccount', {
            params: {
              ojName: 'CodeForces'
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.CfAccount = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleGetOjAccount () {
        let that = this
        switch (that.handleOjName) {
          case 'VJ': {
            that.getVjAccount()
            break
          }
          case 'HDU': {
            that.getHduAccount()
            break
          }
          case 'BZOJ': {
            that.getBzojAccount()
            break
          }
          case 'CodeForces': {
            that.getCfAccount()
            break
          }
        }
      }
    },
    created: function () {
      let that = this
      that.getVjAccount()
      that.getHduAccount()
      that.getBzojAccount()
      that.getCfAccount()
    }
  }
</script>

<style>
</style>
