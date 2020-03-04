<template>
  <Tabs value="name1">
    <TabPane label="概览" name="name1">
      <StudentInfo :studentId="studentId" />
    </TabPane>
    <TabPane label="刷题情况" name="ac">
      <ACTimeLine :studentId="studentId" :height="710"/>
    </TabPane>
    <TabPane label="训练情况" name="contest" >
      <PersonalContestTable :studentId="studentId" :height="710"/>
    </TabPane>
  </Tabs>
</template>

<script>
  import PersonalContestTable from '@/components/PersonalContestTable.vue'
  import ACTimeLine from '@/components/ACTimeLine.vue'
  import StudentInfo from '@/components/StudentInfo.vue'
  export default {
    data () {
      return {
        studentId: this.$route.params.id
      }
    },
    created: function () {
      console.log(this.studentId)
    },
    components: {
      PersonalContestTable,
      ACTimeLine,
      StudentInfo
    },
    watch: {
        '$route' (to, from) {
          if (to.name === 'Student') {
            this.studentId = to.params.id
          }
        }
    }
  }
</script>

<style>
</style>
