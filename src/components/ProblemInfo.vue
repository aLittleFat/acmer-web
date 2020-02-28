<template>
  <Tabs value="name1">
      <TabPane label="题目信息" name="name1">
        <h2>{{info.problem.id}}</h2>
        <h3>{{info.problem.title}}</h3>
        <a :href="info.problem.link" target="_blank">{{ info.problem.link }}</a>
        <br>
        难度:
        <Rate disabled show-text allow-half v-model="info.difficult">
          <span style="color: #f5a623">{{ info.difficult }}</span>
        </Rate>
        <p>Tags:</p>
        <Tag v-for="(tag, index) in info.tags" :key="index">{{tag}}</Tag>
      </TabPane>
      <TabPane label="我的评价" v-if="info.ac" name="name2">
        难度:
        <Rate show-text allow-half v-model="info.myDifficult" @on-change="updateMyDifficult()">
          <span style="color: #f5a623">{{ info.myDifficult }}</span>
        </Rate>
        <p>Tags:</p>
        <Tag v-for="(tag, index) in info.myTags" closable @on-close="deleteTag(tag)" :key="index">{{tag}}</Tag>
        <Button v-if="addTagInput===false" icon="ios-add" type="dashed" size="small" @click="showAddTagInput()">添加标签</Button>
        <Input v-if="addTagInput" type="text" style="width: 4rem;" v-model="addTagText" size="small" @on-enter="submitAddTagInput()" >{{addTagText}}</Input>
        <Button v-if="addTagInput" type="dashed" size="small" @click="submitAddTagInput()">确认</Button>
      </TabPane>
  </Tabs>
</template>

<script>
export default {
  name: 'ProblemInfo',
  props: {
    problemId: Number
  },
  data () {
    return {
      info: {
        type: Object
      },
      addTagInput: false,
      addTagText: ''
    }
  },
  created: function () {
    this.getData()
  },
  methods: {
    getData () {
      let that = this
      that.$http
        .get('/api/problemInfo', {
          params: {
            problemId: this.problemId
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.info = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    },
    updateMyDifficult () {
      let that = this
      that.$http
        .put('/api/problemDifficult', {
          problemId: that.problemId,
          difficult: that.info.myDifficult
        })
        .then(res => {
          if (res.data.status === 0) {
            that.$Message.success('评价成功')
          } else {
            that.$Message.error(res.data.msg)
          }
          that.getData()
        })
    },
    showAddTagInput () {
      this.addTagInput = true
    },
    submitAddTagInput () {
      let that = this
      that.$http
        .put('/api/problemTag', {
          problemId: that.problemId,
          tagName: that.addTagText
        })
        .then(res => {
          if (res.data.status === 0) {
            that.$Message.success('添加成功')
            that.addTagInput = false
            that.addTagText = ''
            that.getData()
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    },
    deleteTag (tagName) {
      let that = this
      that.$http
        .delete('/api/problemTag', {
          params: {
            problemId: that.problemId,
            tagName: tagName
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.$Message.success('删除成功')
            that.getData()
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    }
  }
}
</script>

<style>
</style>
