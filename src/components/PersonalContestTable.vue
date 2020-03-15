<template>
  <Table :loading="tableLoading" :height="height" :columns="columns" :data="personalContestList">
    <template slot-scope="{ row }" slot="title">
        {{ row.contestTitle }}
    </template>
    <template slot-scope="{ row }" slot="penalty">
        {{ row.penalty }}
    </template>
    <template slot-scope="{ row }" slot="solution">
        {{ row.solution }}
    </template>
    <!-- <template v-for="item in problemList" slot-scope="{ row }" :slot="item">
      <div :key="item">
        <div v-if="row.solved.includes(item)" class="ivu-table table-ac-cell"></div>
      </div>
    </template> -->
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
            key: 'solvedNumber',
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
        problemList: [],
        problemNum: 0,
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
              that.personalContestList = res.data.data.contestRecord
              for (let i = 0; i < that.personalContestList.length; ++i) {
                that.personalContestList[i].cellClassName = Object()
                for (let j = 0; j < that.personalContestList[i].solved.length; ++j) {
                  that.personalContestList[i].cellClassName[that.personalContestList[i].solved[j]] = 'table-ac-cell'
                }
                for (let j = 0; j < that.personalContestList[i].upSolved.length; ++j) {
                  that.personalContestList[i].cellClassName[that.personalContestList[i].upSolved[j]] = 'table-up-cell'
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
      studentId: function () {
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
