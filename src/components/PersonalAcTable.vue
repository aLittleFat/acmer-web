<template>
  <Table :loading="tableLoading" stripe :columns="columns" :data="personalAcList">
    <template slot-scope="{ row, index }" slot="rank">
      {{ index+1 }}
    </template>
    <template slot-scope="{ row }" slot="grade">
      {{ row.student.grade }}
    </template>
    <template slot-scope="{ row }" slot="name">
      <router-link :to="{name:'Student',params:{id: row.student.id}}">{{ row.user.name }}</router-link>
    </template>
    <template slot-scope="{ row }" slot="acNum">
      {{ row.acNum }}
    </template>
    <template slot-scope="{ row }" slot="awards">
      {{ row.awards }}
    </template>
  </Table>
</template>

<script>
  export default {
    name: 'PersonalAcTable',
    props: {
      grade: Number
    },
    data () {
      return {
        columns: [
          {
            title: '排名',
            slot: 'rank'
          },
          {
            title: '年级',
            slot: 'grade'
          },
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '题量',
            slot: 'acNum'
          },
          {
            title: '获奖情况',
            slot: 'awards'
          }
        ],
        personalAcList: [],
        tableLoading: true,
        includeRetired: false
      }
    },
    created: function () {
      let that = this
      that.$http
        .get('/api/personalProblemAcRank', {
          params: {
            grade: that.grade,
            includeRetired: that.includeRetired
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.personalAcList = res.data.data
            that.tableLoading = false
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  }
</script>

<style>
</style>
