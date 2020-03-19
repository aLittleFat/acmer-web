<template>
  <div>
    <Dropdown style="margin-left: 20px">
      <Button type="primary">
        添加比赛
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem><Button @click="showAddModal()">添加排位赛</Button></DropdownItem>
        <DropdownItem><Button @click="addBaseScore()">添加基础分</Button></DropdownItem>
        <DropdownItem><Button @click="addCfScore()">添加CF积分</Button></DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Divider />
    <Table :loading="tableLoading" stripe :columns="columns" :data="qualifyingList">
      <template slot-scope="{ row }" slot="action">
        <Button type="error" @click="handleDeleteQualifying(row.id)">删除</Button>
      </template>
    </Table>
    <Modal v-model="add_modal" width="360">
      <p slot="header" style="text-align:center">
        <span>添加排位赛</span>
      </p>
      <Form :model="formItem" :label-width="100" :rules="rule" ref="addQualifyingForm">
        <FormItem label="名称" prop="title">
          <Input v-model="formItem.title"></Input>
        </FormItem>
        <FormItem label="OJ" prop="oj">
          <Select v-model="formItem.oj">
            <Option v-for="item in ojList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="竞赛ID" prop="cId">
          <Input v-model="formItem.cId"></Input>
        </FormItem>
        <FormItem label="权重" prop="proportion">
          <Input type="number" v-model="formItem.proportion" ></Input>
        </FormItem>
        <FormItem v-if="formItem.needPassword" label="竞赛密码" prop="password">
          <Input type="password" v-model="formItem.password"></Input>
        </FormItem>
        <FormItem v-if="formItem.oj !== 'VJ' && formItem.oj !== ''" label="竞赛账号集" prop="seasonAccountId">
          <Select v-model="formItem.seasonAccountId">
            <Option v-for="item in seasonAccountList" :value="item.id" :key="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddQualifying()">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'QualifyingTable',
    props: {
      id: Number
    },
    data () {
      return {
        add_modal: false,
        add_loading: false,
        seasonStudentList: [],
        seasonAccountList: [],
        qualifyingList: [],
        columns: [
          {
            title: '名称',
            key: 'title'
          },
          {
            title: '比例',
            key: 'proportion'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
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
          proportion: 1.0,
          password: '',
          cId: '',
          seasonAccountId: '',
          needPassword: false
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
          proportion: [{
            type: 'number',
            required: true,
            tigger: 'blur',
            message: '请输入权重'
          }],
          password: [{
            required: true,
            tigger: 'blur',
            message: '请输入密码'
          }],
          seasonAccountId: [{
            required: true,
            message: '请选择账号集'
          }]
        },
        tableLoading: true
      }
    },
    methods: {
      showAddModal () {
        let that = this
        that.$refs['addQualifyingForm'].resetFields()
        this.add_modal = true
        that.formItem.needPassword = false
        that.formItem.oj = ''
      },
      handleAddQualifying () {
        let that = this
        that.$refs['addQualifyingForm'].validate((valid) => {
          if (valid) {
            that.add_loading = true
            that.$http
              .post('/api/season/' + that.$route.params.id + '/qualifying', {
                title: that.formItem.title,
                ojName: that.formItem.oj,
                cId: that.formItem.cId,
                password: that.formItem.password,
                proportion: that.formItem.proportion,
                seasonAccountId: that.formItem.seasonAccountId
              })
              .then(res => {
                that.add_loading = false
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.add_modal = false
                  that.getData()
                } else {
                  that.$Message.error(res.data.msg)
                  if (res.data.msg === '需要密码') {
                    that.formItem.needPassword = true
                  }
                }
              })
            } else {
              that.$Message.error('请正确输入表单')
            }
          })
      },
      handleDeleteQualifying (qualifyingId) {
        let that = this
        that.$http
          .delete('/api/qualifying/' + qualifyingId)
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
              that.getData()
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      addBaseScore () {
        let that = this
        that.$http
          .post('/api/season/' + that.id + '/baseQualifying')
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('添加成功')
              that.getData()
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      addCfScore () {
        let that = this
        that.$http
          .post('/api/season/' + that.id + '/cfRatingQualifying')
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('添加成功')
              that.getData()
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      getData () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/season/' + that.id + '/seasonAccount')
          .then(res => {
            if (res.data.status === 0) {
              that.seasonAccountList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
        that.$http
          .get('/api/season/' + that.id + '/qualifying')
          .then(res => {
            that.tableLoading = false
            if (res.data.status === 0) {
              that.qualifyingList = res.data.data
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
