<template>
  <Row>
      <Col span="12" offset="8">
        <!-- <Content :style="{padding: '0 50px'}"> -->
            <Card style="width:280px">
                <div style="text-align:center">
                    <img src="../../assets/images.png">
                    <!-- <h3>A high quality UI Toolkit based on Vue.js</h3> -->
                </div>
                <div>
                <router-view></router-view>
                </div>
            </Card>
        <!-- </Content> -->
      </Col>
  </Row>
</template>

<script>
  export default {

  }
</script>

<style>
</style>
