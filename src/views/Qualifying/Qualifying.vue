<template>
  <div>
    <h1>{{season.name}}<small style="color: #9ea7b4;">{{season.type}}</small></h1>
    <Tabs value="name1">
      <TabPane label="总积分" name="name1">
        <Table :data="sumScoreList" :columns="columns">
          <template slot-scope="{ index }" slot="rank">
              {{ index+1 }}
          </template>
          <template slot-scope="{ row }" slot="name">
              {{ row.participant.participant }}
          </template>
          <template slot-scope="{ row }" slot="sum">
              {{ row.sumScore.toFixed(6) }}
          </template>
          <template v-for="(item,index) in qualifyingList" slot-scope="{ row }" :slot="index">
              {{ row.scoreList[index].toFixed(6) }}
          </template>
        </Table>
      </TabPane>
      <TabPane v-for="(item,index) in qualifyingList" :label="item.title" :key="index" :name="item.id">
        <QualifyingScoreTable :qualifyingId="item.id"></QualifyingScoreTable>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import QualifyingScoreTable from '@/components/QualifyingScoreTable.vue'
export default {
  data () {
    return {
      season: null,
      qualifyingList: [],
      sumScoreList: [],
      columns: [
        {
          title: '排名',
          slot: 'rank',
          sortable: true,
          width: 90
        },
        {
          title: '名称',
          slot: 'name',
          sortable: true,
          width: 250
        },
        {
          title: '总积分',
          slot: 'sum',
          sortable: true
        }
      ]
    }
  },
  methods: {
    getData () {
      let that = this
      that.$http
        .get('/api/season/' + that.$route.params.id)
        .then(res => {
          if (res.data.status === 0) {
            that.season = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
      that.$http
        .get('/api/season/' + that.$route.params.id + '/qualifyingCalculated')
        .then(res => {
          if (res.data.status === 0) {
            that.qualifyingList = res.data.data
            var list = []
            for (var i = 0; i < that.qualifyingList.length; i++) {
              var str = that.qualifyingList[i].title
              str += that.qualifyingList[i].proportion === 1 ? '' : '(x' + that.qualifyingList[i].proportion.toFixed(3) + ')'
              var slotstr = ''
              slotstr += i
              list.push({
                title: str,
                slot: slotstr,
                sortable: true
              })
            }
            that.columns.push({
              title: '单场积分',
              align: 'center',
              children: list
            })
          } else {
            that.$Message.error(res.data.msg)
          }
        })
      that.$http
        .get('/api/season/' + that.$route.params.id + '/sumScore')
        .then(res => {
          if (res.data.status === 0) {
            that.sumScoreList = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  },
  created: function () {
    this.getData()
  },
  components: {
    QualifyingScoreTable
  }
}
</script>

<style>
</style>
