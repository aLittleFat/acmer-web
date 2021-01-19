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
      <template slot-scope="{ row }" slot="action">
          <Button v-if="row.isAdmin !== 1" type="error" size="small" @click="handleDelete(row.studentId)">删除</Button>
          <Button v-if="row.isAdmin !== 1" type="primary" size="small" style="margin-left: 1rem" @click="handleSetAdmin(row.studentId)">设为管理员</Button>
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
          .get('/api/student', {
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
      handleDelete (id) {
        let that = this
        that.tableLoading = true
        that.$http
          .delete('/api/student', {
            params: {
              studentId: id
            }
          })
          .then(res => {
            that.getData()
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleSetAdmin (id) {
        let that = this
        that.tableLoading = true
        that.$http
          .put('/api/admin', {
              studentId: id
          })
          .then(res => {
            that.getData()
            if (res.data.status === 0) {
              that.$Message.success('成功设为管理员')
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleGetUsers () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/student', {
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
