<template>
    <Table :data="seasonList" :columns="columns">
      <template slot-scope="{ row }" slot="name">
        <router-link :to="{name:'Qualifying',params: {id:row.id}}">{{row.name}}</router-link>
      </template>
    </Table>
</template>

<script>
  export default {
    data () {
      return {
        nowYear: 0,
        seasonList: [],
        columns: [
          {
            title: '年份',
            key: 'year'
          },
          {
            title: '赛季名称',
            slot: 'name'
          },
          {
            title: '赛季类型',
            key: 'type'
          },
          {
            title: 'CF比例',
            key: 'cfProportion'
          }
        ]
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/season')
          .then(res => {
            if (res.data.status === 0) {
              that.seasonList = res.data.data
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
