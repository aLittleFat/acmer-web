<template>
  <Tabs value="info">
    <TabPane label="概览" name="info">
      <TeamInfo :teamId="teamId"/>
    </TabPane>
    <TabPane label="训练情况" name="contest" >
      <TeamContestTable :teamId="teamId" :height="620"/>
    </TabPane>
    <TabPane v-if="isMyTeam" label="我的账号集" name="teamAccount" >
      <TeamAccountTable :teamId="teamId"/>
    </TabPane>
  </Tabs>
</template>

<script>
  import TeamContestTable from '@/components/TeamContestTable.vue'
  import TeamInfo from '@/components/TeamInfo.vue'
  import TeamAccountTable from '@/components/TeamAccountTable.vue'
  export default {
    data () {
      return {
        teamId: this.$route.params.id,
        isMyTeam: false
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/isMyTeam')
          .then(res => {
            if (res.data.status === 0) {
              that.isMyTeam = res.data.data
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
      TeamContestTable,
      TeamInfo,
      TeamAccountTable
    },
    watch: {
        '$route' (to, from) {
          if (to.name === 'Team') {
            this.teamId = to.params.id
            this.getData()
          }
        }
    }
  }
</script>

<style>
</style>
