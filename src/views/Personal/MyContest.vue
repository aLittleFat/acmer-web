<template>
  <PersonalContestTable :studentId="studentId" />
</template>

<script>
  import PersonalContestTable from '@/components/PersonalContestTable.vue'
  export default {
    data () {
      return {
        studentId: ''
      }
    },
    components: {
      PersonalContestTable
    },
    created: function () {
      let that = this
      that.$http
        .get('api/common/user/getMyInfo')
        .then(res => {
          if (res.data.status === 0) {
            that.studentId = res.data.data.student.id
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  }
</script>

<style>
</style>
