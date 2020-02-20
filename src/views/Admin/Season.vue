<template>
  <div>
    <h1>{{season.name}}<small style="color: #9ea7b4;">{{season.type}}</small></h1>
    <Tabs value="name1">
      <TabPane label="参赛者" name="name1">
        <SeasonStudentTable v-if="season.type==='个人赛'" :id="$route.params.id"></SeasonStudentTable>
        <SeasonTeamTable v-else :id="$route.params.id"></SeasonTeamTable>
      </TabPane>
      <TabPane label="排位赛" name="name2">
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import SeasonStudentTable from '@/components/SeasonStudentTable.vue'
  import SeasonTeamTable from '@/components/SeasonTeamTable.vue'
  export default {
    data () {
      return {
        season: {
          type: Object
        }
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/season/' + that.$route.params.id)
          .then(res => {
            if (res.data.status === 0) {
              that.season = res.data.data
            }
          })
      }
    },
    components: {
      SeasonStudentTable,
      SeasonTeamTable
    }
  }
</script>

<style>
</style>
