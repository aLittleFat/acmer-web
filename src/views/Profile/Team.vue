<template>
  <Tabs value="name1">
    <TabPane label="概览" name="name1">
      <!-- <StudentInfo :studentId="studentId" /> -->
    </TabPane>
    <TabPane label="训练情况" name="contest" >
      <TeamContestTable :teamId="teamId" :height="710"/>
    </TabPane>
  </Tabs>
</template>

<script>
  import TeamContestTable from '@/components/TeamContestTable.vue'
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
      TeamContestTable
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
