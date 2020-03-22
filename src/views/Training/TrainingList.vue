<template>
  <Table :data="trainingList" :columns="columns">
    <template slot-scope="{ row }" slot="title">
      <router-link :to="{name:'Training',params: {id:row.id}}">{{row.title}}</router-link>
    </template>
    <template slot-scope="{ row }" slot="endTime">
      {{row.endTime.split('T')[0] + ' ' + row.endTime.split('T')[1].split('+')[0]}}
    </template>
  </Table>
</template>

<script>
  export default {
    data () {
      return {
        tableLoading: true,
        trainingList: [],
        columns: [
          {
            title: '训练计划名称',
            slot: 'title'
          },
          {
            title: '截止时间',
            slot: 'endTime'
          }
        ]
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/training')
          .then(res => {
            if (res.data.status === 0) {
              that.trainingList = res.data.data
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
