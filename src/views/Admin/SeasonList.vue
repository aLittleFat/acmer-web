<template>
  <div>
    <div>
      <Button type="primary" @click="showAddSeasonModal()">添加赛季</Button>
    </div>
    <br>
    <div>
      <Table :data="seasonList" :columns="columns">
        <template slot-scope="{ row }" slot="name">
          <router-link :to="{name:'SeasonAdmin',params: {id:row.id}}">{{row.name}}</router-link>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="error" @click="handleDeleteSeason(row.id)">删除</Button>
        </template>
      </Table>
    </div>
    <Modal
      v-model="addSeasonModal">
      <p slot="header" style="color:#0000ff;text-align:center">
          <span>添加赛季</span>
      </p>
      <Row>
        <Col span="15">
          <Form ref="addSeasonForm" :model="formItem" :label-width="100" :rules="rule">
            <FormItem label="年份">
              <InputNumber :max="nowYear" :min="2000" v-model="formItem.year"></InputNumber>
            </FormItem>
            <FormItem label="赛季名称" prop="name">
              <Input v-model="formItem.name" placeholder="请输入赛季名称"></Input>
            </FormItem>
            <FormItem label="比赛类型" prop="type">
              <Select prefix = "ios-person-outline" v-model="formItem.type" style="width:200px">
                  <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="CF比例">
              <InputNumber
                :max="100"
                :min="0"
                v-model="formItem.cfProportion"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"></InputNumber>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddSeason('addSeasonForm')">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addSeasonModal: false,
        nowYear: 0,
        formItem: {
          year: 0,
          name: '',
          type: '',
          cfProportion: 30
        },
        rule: {
          name: [{
            required: true,
            message: '请输入赛季名称',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请选择赛季类型'
          }]
        },
        types: [
          {
              value: '个人赛',
              label: '个人赛'
          },
          {
              value: '组队赛',
              label: '组队赛'
          }
        ],
        seasonList: [],
        columns: [
          {
            title: '年份',
            key: 'year'
          },
          {
            title: '赛季名称',
            slot: 'name'
          },
          {
            title: '赛季类型',
            key: 'type'
          },
          {
            title: 'CF比例',
            key: 'cfProportion'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ]
      }
    },
    methods: {
      getData () {
        let that = this
        that.$http
          .get('/api/season')
          .then(res => {
            if (res.data.status === 0) {
              that.seasonList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      showAddSeasonModal () {
        this.addSeasonModal = true
      },
      handleAddSeason (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/api/season', {
                year: that.formItem.year,
                name: that.formItem.name,
                type: that.formItem.type,
                cfPro: that.formItem.cfProportion
              })
              .then(res => {
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.getData()
                  that.addSeasonModal = false
                } else {
                  that.$Message.error(res.data.msg)
                }
              })
          } else {
            that.$Message.error('请正确填写表单')
          }
        })
      },
      handleDeleteSeason (seasonId) {
        let that = this
        that.$http
          .delete('/api/season', {
            params: {
              seasonId: seasonId
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
    },
    created: function () {
      this.nowYear = (new Date()).getFullYear()
      this.formItem.year = this.nowYear
      this.getData()
    }
  }
</script>

<style>
</style>
