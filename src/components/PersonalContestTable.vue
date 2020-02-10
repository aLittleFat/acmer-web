<template>
  <Table :loading="tableLoading" :columns="columns" :data="personalContestList">
    <template slot-scope="{ row }" slot="title">
        {{ row.contest.name }}
    </template>
    <template slot-scope="{ row }" slot="solved">
        {{ row.solved }}
    </template>
    <template slot-scope="{ row }" slot="penalty">
        {{ row.penalty }}
    </template>
    <template slot-scope="{ row }" slot="solution">
        {{ row.personalContestRecord.solution }}
    </template>
  </Table>
</template>

<script>
  export default {
    name: 'PersonalContestTable',
    props: {
      studentId: String
    },
    data () {
      return {
        columns: [
          {
            title: '比赛名称',
            slot: 'title'
          },
          {
            title: 'Solved',
            slot: 'solved'
          },
          {
            title: '罚时',
            slot: 'penalty'
          },
          {
            title: '题解',
            slot: 'solution'
          }
        ],
        personalContestList: [],
        chars: [],
        problemNum: 0,
        tableLoading: true,
        includeRetired: false
      }
    },
    created: function () {
      let that = this
      that.$http
        .get('/api/student/contest/getMyContest')
        .then(res => {
          if (res.data.status === 0) {
            that.personalContestList = res.data.data
            for (var i = 0; i < that.personalContestList.length; ++i) {
              if (that.problemNum < that.personalContestList[i].contest.problemNumber) {
                that.problemNum = that.personalContestList[i].contest.problemNumber
              }
            }
            for (i = 0; i < that.problemNum; ++i) {
              var ch = String.fromCharCode(65 + i)
              that.chars.push(ch)
              that.columns.push({
                'title': ch,
                'key': ch,
                'align': 'center'
              })
            }
            for (i = 0; i < that.personalContestList.length; ++i) {
              that.personalContestList[i].cellClassName = Object()
              for (var j = 0; j < that.personalContestList[i].personalContestProblemRecords.length; ++j) {
                if (that.personalContestList[i].personalContestProblemRecords[j].status === 'Solved') {
                  that.personalContestList[i].cellClassName[that.chars[j]] = 'table-ac-cell'
                  that.personalContestList[i][that.chars[j]] = that.personalContestList[i].personalContestProblemRecords[j].acTime + '(' + that.personalContestList[i].personalContestProblemRecords[j].tries + ')'
                } else if (that.personalContestList[i].personalContestProblemRecords[j].status === 'UpSolved') {
                  that.personalContestList[i][that.chars[j]] = that.personalContestList[i].personalContestProblemRecords[j].acTime + '(' + that.personalContestList[i].personalContestProblemRecords[j].tries + ')'
                  that.personalContestList[i].cellClassName[that.chars[j]] = 'table-up-cell'
                } else if (that.personalContestList[i].personalContestProblemRecords[j].tries > 0) {
                  that.personalContestList[i][that.chars[j]] = '(' + that.personalContestList[i].personalContestProblemRecords[j].tries + ')'
                  that.personalContestList[i].cellClassName[that.chars[j]] = 'table-wa-cell'
                } else {
                  that.personalContestList[i][that.chars[j]] = ''
                  that.personalContestList[i].cellClassName[that.chars[j]] = ''
                }
              }
            }

            that.tableLoading = false
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  }
</script>

<style>
  .ivu-table .table-ac-cell {
    background-color: #e9f6ea;
    color: #67b16b;
  }
  .ivu-table .table-wa-cell {
    background-color: #fae8e8;
    color: #de6531;
  }
  .ivu-table .table-up-cell {
    background-color: #a3d7d6;
    color: #67b16b;
  }
</style>
