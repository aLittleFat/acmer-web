<template>
  <div>
    <div>
      <Table :loading="tableLoading" stripe :columns="columns" :data="users">
        <template slot-scope="{ row }" slot="name">
            {{ row.name }}
        </template>
        <template slot-scope="{ row }" slot="email">
            {{ row.email }}
        </template>
        <template slot-scope="{ row }" slot="grade">
          <div v-if="row.grade">
            {{ row.grade }}
          </div>
        </template>
        <template slot-scope="{ row }" slot="studentId">
          <div v-if="row.studentId">
            {{ row.studentId }}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="handleAccept(index)">通过</Button>
            <Button type="error" size="small" @click="handleReject(index)">不通过</Button>
        </template>
      </Table>
    </div>
    <br>
    <div>
      <Page ref="page" :total="totalNum" :pageSize="pageSize" style="text-align: center;" @on-change="handleGetUsers()" @on-page-size-change="handleGetUsers()" />
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
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/requestRetireUser', {
            params: {
              page: 1,
              size: that.pageSize
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.users = res.data.data.content
              that.totalNum = res.data.data.totalElements
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleAccept (index) {
        let that = this
        that.tableLoading = true
        that.$http
          .put('/api/user/' + that.users[index].id + '/status', {
            status: '退役'
          })
          .then(res => {
            that.getData()
            that.$Message.success('审核成功')
            that.tableLoading = false
          })
      },
      handleReject (index) {
        let that = this
        that.tableLoading = true
        that.$http
          .put('/api/user/' + that.users[index].id + '/status', {
            status: '现役'
          })
          .then(res => {
            that.getData()
            that.$Message.success('审核成功')
            that.tableLoading = false
          })
      },
      handleGetUsers () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/requestRetireUser', {
            params: {
              page: that.$refs.page.currentPage,
              size: that.$refs.page.currentPageSize
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.users = res.data.data.content
              that.totalNum = res.data.data.totalElements
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    }
  }
</script>

<style>
</style>
