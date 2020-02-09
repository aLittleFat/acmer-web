<template>
  <ACTimeLine :showStudentId="studentId" :myStudentId="studentId"/>
</template>

<script>
  import ACTimeLine from '@/components/ACTimeLine.vue'
  export default {
    data () {
      return {
        studentId: '',
        acList: Object
      }
    },
    components: {
      ACTimeLine
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
