<template>
  <div>
    <Row>
      <Col span="8">
        <Card>
            <p slot="title">VJ</p>
            <div v-if="VjAccount===''">
              <Button size="small" type="success" @click="handleShowAddOjAccountModal('VJ')">添加</Button>
            </div>
            <div v-else>
              <Row>
                <Col span="6">
                  <a :href="handleGetAccountHref('https://vjudge.net/user/', VjAccount)" target="_blank">{{ VjAccount }}</a>
                </Col>
                <Col offset="2" span="3">
                  <Button size="small" type="warning" @click="handleShowChangeOjAccountModal('VJ')">修改</Button>
                </Col>
                <Col offset="1" span="3">
                  <Button size="small" type="error" @click="confirmDelete('VJ')">删除</Button>
                </Col>
              </Row>
            </div>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="addOjAccountModal"
      :title="handleTitle">
      <Row>
        <Col span="15">
          <Form :model="formItem" :label-width="100" :rules="rule">
            <FormItem label="用户名" prop="username">
              <Input v-model="formItem.modalUsername" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
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
      v-model="changeOjAccountModal"
      :title="handleTitle">
      <Row>
        <Col span="15">
          <Form :model="formItem" :label-width="100" :rules="rule">
            <FormItem label="用户名" prop="username">
              <Input v-model="formItem.modalUsername" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
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
        VjAccount: ''
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
          .post('/api/student/ojaccount/addMyOjAccount', {
            ojName: that.handleOjName,
            username: that.formItem.modalUsername,
            password: that.formItem.modalPassword
          })
          .then(res => {
            that.add_loading = false
            if (res.data === true) {
              that.$Message.success('添加成功')
              setTimeout(function () { that.$router.go(0) }, 2000)
            } else {
              that.$Message.error(res.data)
            }
          })
      },
      handleChangeOjAccount () {
        let that = this
        that.change_loading = true
        that.$http
          .post('/api/student/ojaccount/changeMyOjAccount', {
            ojName: that.handleOjName,
            username: that.formItem.modalUsername,
            password: that.formItem.modalPassword
          })
          .then(res => {
            that.change_loading = false
            if (res.data === true) {
              that.$Message.success('修改成功')
              setTimeout(function () { that.$router.go(0) }, 2000)
            } else {
              that.$Message.error(res.data)
            }
          })
      },
      handleDeleteOjAccount () {
        let that = this
        that.$http
          .post('/api/student/ojaccount/deleteMyOjAccount', {
            ojName: that.handleOjName
          })
          .then(res => {
            if (res.data === true) {
              that.$Message.success('删除成功')
              setTimeout(function () { that.$router.go(0) }, 2000)
            } else {
              that.$Message.error(res.data)
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
      }
    },
    created: function () {
      let that = this
      that.$http
        .get('/api/student/ojaccount/getMyOjAccount', {
          params: {
            ojName: 'VJ'
          }
        })
        .then(res => {
          that.VjAccount = res.data
        })
    }
  }
</script>

<style>
</style>
