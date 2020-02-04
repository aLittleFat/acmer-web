<style scoped>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        margin: 5px;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
<template>
  <Scroll :on-reach-bottom="handleReachBottom" :height="700">
    <Row>
      <Col span="20">
          <Timeline>
            <TimelineItem v-for="(item, index) in acList" :key="index">
              <p class="time">{{item.time}}</p>
                <Button size="small" class="content" type="primary" v-for="(acItem, acIndex) in item.acProblems" :key="acIndex">{{acItem.problem.ojName}} {{acItem.problem.problemId}}</Button>
            </TimelineItem>
          </Timeline>
      </Col>
      <Col v-if="myStudentId!==showStudentId">
        <Checkbox v-model="notShowMy">不显示我AC的</Checkbox>
      </Col>
    </Row>
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </Scroll>
</template>
<script>
    export default {
      name: 'ACTimeLine',
      props: {
        showStudentId: String,
        myStudentId: String
      },
      data () {
        return {
          notShowMy: false,
          queryTime: 0,
          loading: true,
          acList: Object
        }
      },
      methods: {
        handleReachBottom () {
          return new Promise(resolve => {
            let that = this
            that.queryTime = new Date(that.acList[that.acList.length - 1].time)
            that.queryTime.setHours(0)
            that.$http
              .get('api/student/acProblem/getMyAcProblems', {
                params: {
                  time: that.queryTime.getTime(),
                  days: 5
                }
              })
              .then(res => {
                for (let i = 0; i < res.data.length; ++i) {
                  that.acList.push(res.data[i])
                }
                resolve()
              })
          })
        }
      },
      created: function () {
        let that = this
        that.loading = true
        that.queryTime = new Date()
        that.queryTime.setHours(0)
        that.queryTime.setMinutes(0)
        that.queryTime.setSeconds(0)
        that.$http
          .get('api/student/acProblem/getMyAcProblems', {
            params: {
              time: that.queryTime.getTime(),
              days: 8
            }
          })
          .then(res => {
            that.acList = res.data
            that.loading = false
          })
      }
    }
</script>
