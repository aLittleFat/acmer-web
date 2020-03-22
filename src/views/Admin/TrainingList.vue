<template>
  <div>
    <div>
      <Button type="primary" @click="showAddTrainingModal()">添加训练计划</Button>
    </div>
    <br>
    <div>
      <Table :data="trainingList" :columns="columns">
        <template slot-scope="{ row }" slot="title">
          <router-link :to="{name:'TrainingAdmin',params: {id:row.id}}">{{row.title}}</router-link>
        </template>
        <template slot-scope="{ row }" slot="endTime">
          {{row.endTime.split('T')[0] + ' ' + row.endTime.split('T')[1].split('+')[0]}}
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="error" @click="handleDeleteTraining(row.id)">删除</Button>
        </template>
      </Table>
    </div>
    <Modal
      v-model="addTrainingModal" width="330px">
      <p slot="header" style="color:#0000ff;text-align:center">
          <span>添加训练</span>
      </p>
      <Form :model="formItem" :label-width="100" :rules="rule" ref="addTrainingForm">
        <FormItem label="名称" prop="title">
          <Input v-model="formItem.title"></Input>
        </FormItem>
        <FormItem label="截止时间" prop="time">
          <DatePicker v-model="formItem.time" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="OJ" prop="oj">
          <Select v-model="formItem.oj">
            <Option v-for="item in ojList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="竞赛ID" prop="cId">
          <Input v-model="formItem.cId"></Input>
        </FormItem>
        <FormItem v-if="formItem.needPassword && formItem.oj !== 'HDU'" label="竞赛密码" prop="password">
          <Input type="password" v-model="formItem.password" placeholder="请输入参赛密码"></Input>
        </FormItem>
        <FormItem v-if="formItem.needPassword && formItem.oj === 'HDU'" label="登录账号" prop="username">
          <Input v-model="formItem.username" placeholder="请输入登录账号"></Input>
        </FormItem>
        <FormItem v-if="formItem.needPassword && formItem.oj === 'HDU'" label="登录密码" prop="password">
          <Input type="password" v-model="formItem.password" placeholder="请输入登录密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddTraining('addTrainingForm')">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addTrainingModal: false,
        ojList: [
          {
            value: 'VJ',
            label: 'VJ'
          },
          {
            value: 'HDU',
            label: 'HDU'
          },
          {
            value: 'CodeForces',
            label: 'CodeForces'
          },
          {
            value: 'Gym',
            label: 'Gym'
          },
          {
            value: '计蒜客',
            label: '计蒜客'
          },
          {
            value: '牛客',
            label: '牛客'
          }
        ],
        formItem: {
          oj: '',
          title: '',
          password: '',
          cId: '',
          needPassword: false,
          time: '',
          username: ''
        },
        rule: {
          title: [{
            required: true,
            tigger: 'blur',
            message: '请输入名称'
          }],
          oj: [{
            required: true,
            tigger: 'blur',
            message: '请选择OJ'
          }],
          cId: [{
            required: true,
            tigger: 'blur',
            message: '请输入竞赛ID'
          }],
          password: [{
            required: true,
            tigger: 'blur',
            message: '请输入密码'
          }],
          time: [{
            required: true,
            message: '请选择时间'
          }]
        },
        tableLoading: true,
        trainingList: [],
        columns: [
          {
            title: '训练计划名称',
            slot: 'title'
          },
          {
            title: '截止时间',
            slot: 'endTime'
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
          .get('/api/training')
          .then(res => {
            if (res.data.status === 0) {
              that.trainingList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      showAddTrainingModal () {
        this.formItem.needPassword = false
        this.$refs['addTrainingForm'].resetFields()
        this.addTrainingModal = true
      },
      handleAddTraining (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/api/training', {
                title: that.formItem.title,
                ojName: that.formItem.oj,
                endTime: that.formItem.time,
                cId: that.formItem.cId,
                password: that.formItem.password,
                username: that.formItem.username
              })
              .then(res => {
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.getData()
                  that.addTrainingModal = false
                } else {
                  that.$Message.error(res.data.msg)
                  if (res.data.msg === '需要密码') {
                    that.formItem.needPassword = true
                  }
                  if (res.data.msg === '该比赛需要登录') {
                    that.formItem.needPassword = true
                  }
                }
              })
          } else {
            that.$Message.error('请正确填写表单')
          }
        })
      },
      handleDeleteTraining (trainingId) {
        let that = this
        that.$http
          .delete('/api/training', {
            params: {
              trainingId: trainingId
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
      this.getData()
    }
  }
</script>

<style>
</style>
