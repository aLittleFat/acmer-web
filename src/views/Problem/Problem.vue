<template>
  <div>
    <div style="text-align: center;">
      搜索：
      <Input search v-model="key" placeholder="请输入关键字" @on-search="getData()" style="width: 30rem;" />
      <Button @click="funnel = true" type="success" style="margin-left: 1rem;"><Icon type="ios-funnel-outline" />筛选</Button>
      <Drawer title="筛选" :closable="false" v-model="funnel">
        From:
        <Rate show-text allow-half clearable v-model="minDifficult">
          <span style="color: #f5a623">{{ minDifficult }}</span>
        </Rate>
        <br>
        To:
        <Rate show-text allow-half clearable v-model="maxDifficult">
          <span style="color: #f5a623">{{ maxDifficult }}</span>
        </Rate>
        <Divider/>
        标签：
        <br>
        <Tag v-for="(tag, index) in tagList" color="green" :ref="tag" :name="tag" @on-change="checkTag" checkable :checked="false" :key="index">{{tag}}</Tag>
        <Divider/>
        <Button type="success" @click="getData">确定</Button>
        <Button type="info" @click="reset">重置</Button>
      </Drawer>
    </div>
    <Table :loading="tableLoading" stripe :columns="columns" :data="problemList" style="margin-top: 2rem;">
      <template slot-scope="{ row }" slot="title">
        <a @click="showProblemInfo(row.id)">{{row.title}}</a>
      </template>
      <template slot-scope="{ row }" slot="difficult">
        <Rate disabled show-text allow-half v-model="row.difficult">
          <span style="color: #f5a623">{{ row.difficult }}</span>
        </Rate>
      </template>
      <template slot-scope="{ row }" slot="tags">
        <div v-if="row.tags!==''">
          <Tag v-for="(tag, index) in row.tags.split(' ')" :key="index">{{tag}}</Tag>
        </div>
      </template>
    </Table>
    <br>
    <div>
      <Page ref="page" :total="totalNum" :pageSize="pageSize" style="text-align: center;" @on-change="handleGetProblems()" @on-page-size-change="handleGetProblems()" />
    </div>
  </div>
</template>

<script>
  import ProblemInfo from '@/components/ProblemInfo.vue'
  export default {
    data () {
      return {
        columns: [
          {
            title: 'OJ',
            key: 'ojName'
          },
          {
            title: 'ID',
            key: 'problemId'
          },
          {
            title: '标题',
            slot: 'title'
          },
          {
            title: '难度',
            slot: 'difficult'
          },
          {
            title: '标签',
            slot: 'tags'
          }
        ],
        key: '',
        minDifficult: 0,
        maxDifficult: 5,
        tagName: '',
        funnel: false,
        problemList: [],
        tagList: [],
        totalNum: 0,
        pageSize: 12,
        tableLoading: true
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/problemView', {
            params: {
              key: that.key,
              maxDifficult: that.maxDifficult,
              minDifficult: that.minDifficult,
              tagName: that.tagName,
              page: 1,
              size: that.pageSize
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.problemList = res.data.data.content
              that.totalNum = res.data.data.totalElements
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
        that.$http
          .get('/api/tag', {
            params: {
              key: ''
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.tagList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      showProblemInfo (problemId) {
        this.$Modal.info({
          okText: '关闭',
          closable: true,
          render: (h) => {
            return h(ProblemInfo, {
              props: {
                problemId: problemId
              }
            })
          }
        })
      },
      handleGetProblems () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/problemView', {
            params: {
              key: that.key,
              maxDifficult: that.maxDifficult,
              minDifficult: that.minDifficult,
              tagName: that.tagName,
              page: that.$refs.page.currentPage,
              size: that.$refs.page.currentPageSize
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.problemList = res.data.data.content
              that.totalNum = res.data.data.totalElements
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      checkTag (checked, name) {
        let that = this
        if (checked) {
          if (that.tagName === '') {
            that.tagName = name
          } else {
            that.$refs[that.tagName][0].isChecked = false
            that.tagName = name
          }
        } else {
          that.tagName = ''
        }
      },
      reset () {
        let that = this
        that.minDifficult = 0.0
        that.maxDifficult = 5.0
        if (that.tagName !== '') {
          that.$refs[that.tagName][0].isChecked = false
          that.tagName = ''
        }
      }
    }
  }
</script>

<style>
</style>
