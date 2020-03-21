<template>
  <Tabs value="0">
    <TabPane v-for="(item,index) in seasonList" :key="index" :label="item.name" :name="String(index)">
      <TeamContestRank :seasonId="item.id" />
    </TabPane>
  </Tabs>
</template>

<script>
  import TeamContestRank from '@/components/TeamContestRank.vue'
  export default {
    data () {
      return {
        seasonList: []
      }
    },
    components: {
      TeamContestRank
    },
    created: function () {
      let that = this
      that.$http
        .get('/api/teamSeason')
        .then(res => {
          if (res.data.status === 0) {
            that.seasonList = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  }
</script>

<style>
</style>
