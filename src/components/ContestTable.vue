<template>
  <Table :columns="columns" :data="contestRecordList">
    <template slot-scope="{ row }" slot="solution">
        {{ row.solution }}
    </template>
    <template slot-scope="{ index }" slot="rank">
      {{index + 1}}
    </template>
    <template slot-scope="{ row }" slot="participants">
      <div>
        <router-link :to="{name:'Student',params:{id:row.studentId}}" v-if="row.studentId">{{row.participants}}</router-link>
        <router-link :to="{name:'Team',params:{id:row.teamId}}" v-if="row.teamId">{{row.participants}}</router-link>
      </div>
    </template>
  </Table>
</template>

<script>
  export default {
    name: 'ContestTable',
    props: {
      contestId: Number
    },
    data () {
      return {
        columns: [
          {
            title: '排名',
            // fixed: 'left',
            slot: 'rank',
            width: 90
          },
          {
            title: '参赛者',
            slot: 'participants',
            // fixed: 'left',
            width: 180
          },
          {
            title: 'Solved',
            key: 'solvedNumber',
            // fixed: 'left',
            width: 90
          },
          {
            title: '罚时',
            key: 'penalty',
            // fixed: 'left',
            width: 90
          },
          {
            title: '题解',
            slot: 'solution',
            // fixed: 'left',
            width: 80
          }
        ],
        contestRecordList: [],
        problemList: [],
        tableLoading: true
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.tableLoading = true
        var url = '/api/contestTable/'
        that.$http
          .get(url, {
            params: {
              contestId: that.contestId
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.contestRecordList = res.data.data.contestRecordLines
              for (let i = 0; i < that.contestRecordList.length; ++i) {
                that.contestRecordList[i].cellClassName = Object()
                for (let j = 0; j < that.contestRecordList[i].solved.length; ++j) {
                  that.contestRecordList[i].cellClassName[that.contestRecordList[i].solved[j]] = 'table-ac-cell'
                }
                for (let j = 0; j < that.contestRecordList[i].upSolved.length; ++j) {
                  that.contestRecordList[i].cellClassName[that.contestRecordList[i].upSolved[j]] = 'table-up-cell'
                }
              }
              that.problemList = res.data.data.problemList
              for (let i = 0; i < res.data.data.problemList.length; ++i) {
                that.columns.push({
                  'title': that.problemList[i],
                  'key': that.problemList[i],
                  'align': 'center',
                  width: 70
                })
              }
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    watch: {
      contestId: function () {
        this.getData()
      }
    }
  }
</script>

<style>
  .ivu-table .table-ac-cell {
    background-color: #00c853;
  }
  .ivu-table .table-up-cell {
    background-color: #e3e300;
  }
</style>
