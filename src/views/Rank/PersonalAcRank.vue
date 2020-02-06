<template>
  <Tabs value="name1">
    <TabPane label="总榜" name="name1">
      <PersonalAcTable :grade="0" />
    </TabPane>
    <TabPane v-for="(year,index) in yearList" :key="index" :label="year+'级'" :name="String(year)">
      <PersonalAcTable :grade="year" />
    </TabPane>
  </Tabs>
</template>

<script>
  import PersonalAcTable from '@/components/PersonalAcTable.vue'
  export default {
    data () {
      return {
        yearList: []
      }
    },
    components: {
      PersonalAcTable
    },
    created: function () {
      let that = this
      var y = (new Date()).getFullYear()
      for (let i = y - 4; i < y; ++i) {
        that.yearList.push(i)
      }
    }
  }
</script>

<style>
</style>
