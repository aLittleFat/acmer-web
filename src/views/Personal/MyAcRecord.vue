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
          that.studentId = res.data.student.id
        })
    }
  }
</script>

<style>
</style>
