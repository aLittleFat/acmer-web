<template>
  <ContestTable :contestId="contestId"></ContestTable>
</template>

<script>
import ContestTable from '@/components/ContestTable.vue'
export default {
  data () {
    return {
      contestId: this.$route.params.id
    }
  },
  components: {
    ContestTable
  }
}
</script>

<style>
</style>
