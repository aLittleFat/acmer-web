<template>
  <div>
    <h1>{{season.name}}<small style="color: #9ea7b4;">{{season.type}}</small></h1>
    <Tabs value="name1">
      <TabPane label="总积分" name="name1">标签一的内容</TabPane>
      <TabPane v-for="(item,index) in qualifyingList" :label="item.title" :key="index" :name="item.id">
        <QualifyingScoreTable :qualifyingId="item.id"></QualifyingScoreTable>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import QualifyingScoreTable from '@/components/QualifyingScoreTable.vue'
export default {
  data () {
    return {
      season: null,
      qualifyingList: []
    }
  },
  methods: {
    getData () {
      let that = this
      that.$http
        .get('/api/season/' + that.$route.params.id)
        .then(res => {
          if (res.data.status === 0) {
            that.season = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
      that.$http
        .get('/api/season/' + that.$route.params.id + '/qualifying')
        .then(res => {
          if (res.data.status === 0) {
            that.qualifyingList = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  },
  created: function () {
    this.getData()
  },
  components: {
    QualifyingScoreTable
  }
}
</script>

<style>
</style>
