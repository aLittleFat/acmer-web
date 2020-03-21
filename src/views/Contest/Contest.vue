<template>
  <div>
    <h1>{{contestInfo.title}}</h1>
    <a :href="contestInfo.link" target="_blank">{{contestInfo.link}}<Icon type="ios-open-outline" /></a>
    <Divider />
    <ContestTable :contestId="contestId"></ContestTable>
  </div>
</template>

<script>
import ContestTable from '@/components/ContestTable.vue'
export default {
  data () {
    return {
      contestInfo: {
        title: '',
        link: ''
      },
      contestId: this.$route.params.id
    }
  },
  created: function () {
    let that = this
    that.$http
      .get('/api/contestInfo', {
        params: {
          contestId: that.contestId
        }
      })
      .then(res => {
        if (res.data.status === 0) {
          that.contestInfo = res.data.data
        } else {
          that.$Message.error(res.data.msg)
        }
      })
  },
  components: {
    ContestTable
  }
}
</script>

<style>
</style>
