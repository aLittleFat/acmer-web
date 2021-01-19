<template>
  <Table :loading="tableLoading" stripe :columns="columns" :data="seasonAccountList"></Table>
</template>

<script>
  export default {
    name: 'TeamAccountTable',
    props: {
      teamId: Number
    },
    data () {
      return {
        tableLoading: false,
        seasonAccountList: [],
        columns: [
          {
            title: '名称',
            key: 'title'
          },
          {
            title: '账号ID',
            key: 'handle'
          },
          {
            title: '登录名',
            key: 'account'
          },
          {
            title: '密码',
            key: 'password'
          }
        ]
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/teamAccount', {
            params: {
              teamId: that.teamId
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.seasonAccountList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    created: function () {
      this.getData()
    }
  }
</script>

<style>
</style>
