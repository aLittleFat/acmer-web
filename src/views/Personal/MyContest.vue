<template>
  <PersonalContestTable studentId="" :height="750" />
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
    }
  }
</script>

<style>
</style>
