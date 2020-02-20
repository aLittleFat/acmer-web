<template>
  <Table :loading="tableLoading" :height="height" :columns="columns" :data="personalContestList">
    <template slot-scope="{ row }" slot="title">
        {{ row.title }}
    </template>
    <template slot-scope="{ row }" slot="solved">
        {{ row.solved }}
    </template>
    <template slot-scope="{ row }" slot="penalty">
        {{ row.penalty }}
    </template>
    <template slot-scope="{ row }" slot="solution">
        {{ row.solution }}
    </template>
  </Table>
</template>

<script>
  export default {
    name: 'PersonalContestTable',
    props: {
      studentId: String,
      height: Number
    },
    data () {
      return {
        columns: [
          {
            title: '比赛名称',
            slot: 'title',
            fixed: 'left',
            width: 300
          },
          {
            title: 'Solved',
            key: 'solved',
            fixed: 'left',
            width: 90
          },
          {
            title: '罚时',
            key: 'penalty',
            fixed: 'left',
            width: 90
          },
          {
            title: '题解',
            slot: 'solution',
            fixed: 'left',
            width: 80
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
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.tableLoading = true
        var url = ''
        if (that.studentId === '') {
          url = '/api/personalContest'
        } else {
          url = '/api/personalContest/' + that.studentId
        }
        that.$http
          .get(url)
          .then(res => {
            if (res.data.status === 0) {
              that.personalContestList = res.data.data
              for (var i = 0; i < that.personalContestList.length; ++i) {
                if (that.problemNum < that.personalContestList[i].proNum) {
                  that.problemNum = that.personalContestList[i].proNum
                }
              }
              for (i = 0; i < that.problemNum; ++i) {
                var ch = String.fromCharCode(65 + i)
                that.chars.push(ch)
                that.columns.push({
                  'title': ch,
                  'key': ch,
                  'align': 'center',
                  width: 100
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
      studentId: function () {
        this.getData()
      }
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
