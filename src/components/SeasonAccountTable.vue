<template>
  <div>
    <Button type="primary" @click="showAddModal()">添加账号集</Button>
    <Divider />
    <Table :loading="tableLoading" stripe :columns="columns1" :data="seasonAccountList">
      <template slot-scope="{ row }" slot="action">
        <Button type="error" @click="handleDeleteSeasonAccount(row.id)">删除</Button>
      </template>
    </Table>
    <Modal
      v-model="add_modal">
      <p slot="header" style="text-align:center">
          <span>添加参赛者</span>
      </p>
      <Form :model="formItem" :rules="rule" ref="addSeasonAccountForm">
        <FormItem label="名称" prop="title">
          <Input v-model="formItem.title" placeholder="请输入账号集名称"></Input>
        </FormItem>
        <Table :columns="columns" :data="participantList">
          <template slot-scope="{ index }" slot="handles">
            <FormItem prop="handles">
              <Input v-model="formItem.handles[index]" ></Input>
            </FormItem>
          </template>
          <template slot-scope="{ index }" slot="account">
            <FormItem>
              <Input v-model="formItem.accounts[index]" ></Input>
            </FormItem>
          </template>
          <template slot-scope="{ index }" slot="password">
            <FormItem>
              <Input v-model="formItem.passwords[index]" ></Input>
            </FormItem>
          </template>
        </Table>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="addSeasonAccount">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'SeasonAccountTable',
    props: {
      id: Number
    },
    data () {
      return {
        add_modal: false,
        add_loading: false,
        tableLoading: true,
        participantList: [],
        seasonAccountList: [],
        formItem: {
          title: '',
          teamIds: [],
          seasonStudentIds: [],
          handles: [],
          accounts: [],
          passwords: []
        },
        columns1: [
          {
            title: '名称',
            key: 'title'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        columns: [
          {
            title: '参赛者',
            key: 'participant'
          },
          {
            title: '账号ID',
            slot: 'handles'
          },
          {
            title: '登录名',
            slot: 'account'
          },
          {
            title: '密码',
            slot: 'password'
          }
        ],
        rule: {
          title: [{
            required: true,
            tigger: 'blur',
            message: '请输入名称'
          }]
        }
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/season/' + that.id + '/participant')
          .then(res => {
            if (res.data.status === 0) {
              that.participantList = res.data.data
              that.formItem.teamIds = []
              that.formItem.seasonStudentIds = []
              that.formItem.handles = []
              that.formItem.accounts = []
              that.formItem.passwords = []
              for (let i = 0; i < that.participantList.length; i++) {
                that.formItem.teamIds.push(that.participantList[i].teamId)
                that.formItem.seasonStudentIds.push(that.participantList[i].seasonStudentId)
                that.formItem.handles.push('')
                that.formItem.accounts.push('')
                that.formItem.passwords.push('')
              }
            } else {
              that.$Message.error(res.data.msg)
            }
          })
          that.$http
            .get('/api/season/' + that.id + '/seasonAccount')
            .then(res => {
              if (res.data.status === 0) {
                that.tableLoading = false
                that.seasonAccountList = res.data.data
              } else {
                that.$Message.error(res.data.msg)
              }
            })
      },
      showAddModal () {
        let that = this
        that.$refs['addSeasonAccountForm'].resetFields()
        that.add_modal = true
      },
      addSeasonAccount () {
        let that = this
        that.$refs['addSeasonAccountForm'].validate((valid) => {
          if (valid) {
            that.add_loading = true
            that.$http
              .post('/api/season/' + that.id + '/seasonAccount', {
                title: that.formItem.title,
                handles: that.formItem.handles,
                teamIds: that.formItem.teamIds,
                seasonStudentIds: that.formItem.seasonStudentIds,
                accounts: that.formItem.accounts,
                passwords: that.formItem.passwords
              })
              .then(res => {
                that.add_loading = false
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.$router.go(0)
                  that.add_modal = false
                } else {
                  that.$Message.error(res.data.msg)
                }
              })
          } else {
            that.$Message.error('请正确填写表单')
          }
        })
      },
      handleDeleteSeasonAccount (id) {
        let that = this
        that.$http
          .delete('/api/seasonAccount/' + id)
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
              that.$router.go(0)
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    created: function () {
      this.getData()
    },
    watch: {
      teamId: function () {
        this.getData()
      }
    }
  }
</script>

<style>
</style>
