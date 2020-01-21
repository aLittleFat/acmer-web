<template>
  <div>
  <div>
    <Table :loading="tableLoading" stripe :columns="columns" :data="users">
      <template slot-scope="{ row }" slot="name">
          {{ row.user.name }}
      </template>
      <template slot-scope="{ row }" slot="email">
          {{ row.user.email }}
      </template>
      <template slot-scope="{ row }" slot="grade">
        <div v-if="row.student">
          {{ row.student.grade }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="studentId">
        <div v-if="row.student !== null">
          {{ row.student.id }}
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="handleAccept(index)">通过</Button>
          <Button type="error" size="small" @click="handleReject(index)">不通过</Button>
      </template>
    </Table>
  </div>
  <div>
    <Page ref="page" :total="totalNum" :pageSize="pageSize" @on-change="handleGetUsers()" @on-page-size-change="handleGetUsers()" />
  </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        columns: [
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '邮箱',
            slot: 'email'
          },
          {
            title: '年级',
            slot: 'grade'
          },
          {
            title: '学号',
            slot: 'studentId'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        users: [],
        totalNum: 0,
        pageSize: 15,
        tableLoading: true
      }
    },
    created () {
      let that = this
      that.$http
        .get('/api/admin/verify/getUserUnverify', {
          params: {
            page: 1,
            size: that.pageSize
          }
        })
        .then(res => {
          that.users = res.data.content
          that.totalNum = res.data.totalElements
          that.tableLoading = false
        })
    },
    methods: {
      handleAccept (index) {
        let that = this
        that.tableLoading = true
        that.$http
          .post('/api/admin/verify/registerVerify', {
            id: that.users[index].user.id
          })
          .then(res => {
            that.remove(index)
            that.$Message.info('审核成功')
            that.tableLoading = false
          })
      },
      handleReject (index) {
        let that = this
        that.tableLoading = true
        that.$http
          .post('/api/admin/verify/deleteAccount', {
            id: that.users[index].user.id
          })
          .then(res => {
            that.remove(index)
            that.$Message.info('已删除该账户，并发送邮件进行通知')
            that.tableLoading = false
          })
      },
      remove (index) {
        this.users.splice(index, 1)
      },
      handleGetUsers () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/admin/verify/getUserUnverify', {
            params: {
              page: that.$refs.page.currentPage,
              size: that.$refs.page.currentPageSize
            }
          })
          .then(res => {
            that.users = res.data.content
            that.totalNum = res.data.totalElements
            that.tableLoading = false
          })
      }
    }
  }
</script>

<style>
</style>
