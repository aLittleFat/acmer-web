<template>
  <Tabs value="info">
    <TabPane label="概览" name="info">
      <TeamInfo :teamId="teamId"/>
    </TabPane>
    <TabPane label="训练情况" name="contest" >
      <TeamContestTable :teamId="teamId" :height="620"/>
    </TabPane>
  </Tabs>
</template>

<script>
  import TeamContestTable from '@/components/TeamContestTable.vue'
  import TeamInfo from '@/components/TeamInfo.vue'
  export default {
    data () {
      return {
        teamId: this.$route.params.id
      }
    },
    created: function () {
      // console.log(this.studentId)
    },
    components: {
      TeamContestTable,
      TeamInfo
    },
    watch: {
        '$route' (to, from) {
          if (to.name === 'Team') {
            this.teamId = to.params.id
          }
        }
    }
  }
</script>

<style>
</style>
