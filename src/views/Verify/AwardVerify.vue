<template>
  <div>
    <div>
      <Table :loading="tableLoading" stripe :columns="columns" :data="users">
        <template slot-scope="{ row }" slot="time">
          {{row.time.split('T')[0]}}
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="handleAccept(index)">通过</Button>
            <Button type="error" size="small" @click="handleReject(index)">不通过</Button>
        </template>
      </Table>
    </div>
    <br>
    <div>
      <Page ref="page" :total="totalNum" :pageSize="pageSize" @on-change="handleGetAwards()" @on-page-size-change="handleGetAwards()" />
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        columns: [
          {
            title: '获奖者',
            key: 'students'
          },
          {
            title: '类型',
            key: 'contestType'
          },
          {
            title: '赛区',
            key: 'regional'
          },
          {
            title: '奖项',
            key: 'level'
          },
          {
            title: '时间',
            slot: 'time'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        awards: [],
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
          .get('/api/award/notVerified', {
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
          .put('/api/award/' + that.users[index].id + '/verified')
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
          .delete('/api/award/' + that.users[index].id + '/verified')
          .then(res => {
            that.getData()
            that.$Message.success('删除成功')
            that.tableLoading = false
          })
      },
      handleGetAwards () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/award/notVerified', {
            params: {
              page: that.$refs.page.currentPage,
              size: that.$refs.page.currentPageSize
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.awards = res.data.data.content
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
