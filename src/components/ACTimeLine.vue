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
  <Scroll :on-reach-bottom="handleReachBottom" :height="height">
    <Row>
      <Col span="20">
          <Timeline>
            <TimelineItem v-for="(item, index) in acList" :key="index">
              <p class="time">{{item.time}}</p>
                <Button size="small" class="content" type="primary" v-for="(acItem, acIndex) in item.acProblems" :key="acIndex">{{acItem.problem.ojName}} {{acItem.problem.problemId}}</Button>
            </TimelineItem>
          </Timeline>
      </Col>
      <Col v-if="studentId !== ''">
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
        studentId: String,
        height: Number
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
            var url = ''
            if (that.studentId === '') {
              url = '/api/acProblems?time=' + that.queryTime.getTime() + '&days=5'
            } else {
              url = '/api/acProblems/' + that.studentId + '?except=' + that.notShowMy + '&time=' + that.queryTime.getTime() + '&days=5'
            }
            that.$http
              .get(url)
              .then(res => {
                if (res.data.status === 0) {
                  for (let i = 0; i < res.data.data.length; ++i) {
                    that.acList.push(res.data.data[i])
                  }
                } else {
                  that.$Message.error(res.data.msg)
                }
                resolve()
              })
          })
        },
        getData () {
          let that = this
          that.loading = true
          that.queryTime = new Date()
          that.queryTime.setHours(0)
          that.queryTime.setMinutes(0)
          that.queryTime.setSeconds(0)
          var url = ''
          if (that.studentId === '') {
            url = '/api/acProblems?time=' + that.queryTime.getTime() + '&days=10'
          } else {
            url = '/api/acProblems/' + that.studentId + '?except=' + that.notShowMy + '&time=' + that.queryTime.getTime() + '&days=10'
          }
          that.$http
            .get(url)
            .then(res => {
              if (res.data.status === 0) {
                that.acList = res.data.data
                that.loading = false
              } else {
                that.$Message.error(res.data.msg)
              }
            })
        }
      },
      created: function () {
        this.getData()
      },
      watch: {
        studentId: function () {
          this.getData()
        },
        notShowMy: function () {
          this.getData()
        }
      }
    }
</script>
