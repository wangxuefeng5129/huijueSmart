<template>
  <div class="app-container">
    <el-container>
      <el-aside width="200px">
        <div class="myMenuBox">
          <div class="screenViewBox">
            <div class="screenViewTitle">
              <svg-icon style="color:#fff;" icon-class="screen" />
              <span>屏幕视图</span>
            </div>
            <div class="screenViewList">
              <span :class="{viewIsChecked:viewIsCurrentChecked===1}" @click="changeScreen(1)">
                <svg-icon icon-class="view_1x1" />
                <i>1X1</i>
              </span>
              <span :class="{viewIsChecked:viewIsCurrentChecked===4}" @click="changeScreen(4)">
                <svg-icon icon-class="view_2x2" />
                <i>2X2</i>
              </span>
              <span :class="{viewIsChecked:viewIsCurrentChecked===9}" @click="changeScreen(9)">
                <svg-icon icon-class="view_3x3" />
                <i>3X3</i>
              </span>
              <span :class="{viewIsChecked:viewIsCurrentChecked===16}" @click="changeScreen(16)">
                <svg-icon icon-class="view_4x4" />
                <i>4X4</i>
              </span>
            </div>
          </div>
          <div class="monitorBox">
            <div class="monitorTitle">
              <svg-icon icon-class="monitor" />
              <span>监控站点</span>
            </div>
            <div class="monitorList">
              <el-collapse>
                <el-collapse-item v-for="(items,indexs) in videoSource" :key="indexs" :name="indexs">
                  <template slot="title">
                    <div class="collapseItemTitle" :title="items.lampPostName">{{ items.lampPostName }}</div>
                  </template>
                  <span
                    v-for="(item,index) in items.videoData"
                    :key="index"
                    :class="{myIsChecked:index===isCurrentChecked&&indexs===isLightCurrentChecked}"
                    :title="item.videoName"
                    @click="currentSource(item.url,index,item.videoSerial,indexs)"
                  >{{ item.videoName }}</span>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div class="controlBox">
            <div class="controlTitle">
              <svg-icon icon-class="control" />
              <span>云台控制</span>
            </div>
            <div class="controlList">
              <table class="controlDirection">
                <tr>
                  <td title="左上" @mousedown="yuntaiControlStart(4)" @mouseup="yuntaiControlStop(4)">
                    <svg-icon icon-class="top_left" />
                  </td>
                  <td title="上" @mousedown="yuntaiControlStart(0)" @mouseup="yuntaiControlStop(0)">
                    <svg-icon icon-class="top" />
                  </td>
                  <td title="右上" @mousedown="yuntaiControlStart(6)" @mouseup="yuntaiControlStop(6)">
                    <svg-icon icon-class="top_right" />
                  </td>
                </tr>
                <tr>
                  <td title="左" @mousedown="yuntaiControlStart(2)" @mouseup="yuntaiControlStop(2)">
                    <svg-icon icon-class="left" />
                  </td>
                  <td title="刷新" @click="changeScreen(currentScreenNum)">
                    <svg-icon icon-class="refresh" />
                  </td>
                  <td title="右" @mousedown="yuntaiControlStart(3)" @mouseup="yuntaiControlStop(3)">
                    <svg-icon icon-class="right" />
                  </td>
                </tr>
                <tr>
                  <td title="左下" @mousedown="yuntaiControlStart(5)" @mouseup="yuntaiControlStop(5)">
                    <svg-icon icon-class="down_left" />
                  </td>
                  <td title="下" @mousedown="yuntaiControlStart(1)" @mouseup="yuntaiControlStop(1)">
                    <svg-icon icon-class="down" />
                  </td>
                  <td title="右下" @mousedown="yuntaiControlStart(7)" @mouseup="yuntaiControlStop(7)">
                    <svg-icon icon-class="down_right" />
                  </td>
                </tr>
              </table>
              <table class="smallOrBig">
                <tr>
                  <td title="放大倍率" @mousedown="yuntaiControlStart(8)" @mouseup="yuntaiControlStop(8)">
                    <svg-icon icon-class="zoom" />
                  </td>
                  <td title="摄像头倍率">
                    <svg-icon icon-class="zoom_change" />
                  </td>
                  <td title="缩小倍率" @mousedown="yuntaiControlStart(9)" @mouseup="yuntaiControlStop(9)">
                    <svg-icon icon-class="zoom_out" />
                  </td>
                </tr>
                <tr>
                  <td title="近焦距" @mousedown="yuntaiControlStart(10)" @mouseup="yuntaiControlStop(10)">
                    <svg-icon icon-class="zoom" />
                  </td>
                  <td title="摄像头焦距">
                    <svg-icon icon-class="focal_length" />
                  </td>
                  <td title="远焦距" @mousedown="yuntaiControlStart(11)" @mouseup="yuntaiControlStop(11)">
                    <svg-icon icon-class="zoom_out" />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div v-if="source" class="videoBox">
          <div v-for="(item,index) in videoSourceNum" :key="index" style="border:1px solid #fff;" class="videoContainer" :class="{videoIsChecked:index==videoIsCurrentChecked,oneScreen:oneScreen,twoScreen:twoScreen,threeScreen:threeScreen,fourScreen:fourScreen}" @click="play(index)">
            <video :id="'myPlayer'+index" class="myPlayer" poster="" controls playsInline webkit-playsinline autoplay>
              <source :src="source" type="rtmp/flv">
            </video>
          </div>
        </div>
        <div v-else class="videoBox">
          <div v-for="(item,index) in videoSourceNum" :key="index" style="border:1px solid #fff;" class="videoContainer" :class="{videoIsChecked:index==videoIsCurrentChecked,oneScreen:oneScreen,twoScreen:twoScreen,threeScreen:threeScreen,fourScreen:fourScreen}" @click="play(index)" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import axios from 'axios'
import qs from 'qs'

export default {
  name: 'InlineEditTable',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },

      accessToken: 'at.aie5nrxmdq5u0flq9imzin9fbhtprsmg-2dmff6akbc-1wlqk5p-ui7zvgpnj', // 萤石云获取的accessToken
      deviceSerial: '', // 设备号
      isCurrentChecked: null, // 站点列表选中
      isLightCurrentChecked: null, // 站点列表选中
      videoIsCurrentChecked: null, // 分屏列表选中
      videoSourceNum: 4,
      viewIsCurrentChecked: null,
      currentScreenNum: 4,
      oneScreen: false,
      twoScreen: true,
      threeScreen: false,
      fourScreen: false,
      source: '',
      videoSource: ''
    }
  },
  created() {
    // this.getList()
    this.getDevLis()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const items = response.data.items
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalTitle = v.title //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      })
    },

    getAccessToken() {
      // 获取accessToken
      var urlParams = {
        appKey: '416d0315f72b4228a854052cf740bc11',
        appSecret: '7cc945c8c90a93dddee572e70b35764f'
      }
      axios
        .post(
          'https://open.ys7.com/api/lapp/token/get',
          qs.stringify(urlParams)
        )
        .then(res => {
          if (res.data.code === 200) {
            this.accessToken = res.data.data.accessToken
            // sessionStorage.setItem("accessToken", res.data.data.accessToken)
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    play(index) {
      console.log(this.isCurrentChecked)
      if (this.isCurrentChecked === null) {
        this.$message({
          message: '请选择监控点',
          type: 'warning'
        })
      } else {
        new EZUIPlayer('myPlayer' + index)
        this.videoIsCurrentChecked = index
      }
    },
    currentSource(currentSource, index, deviceSerial, indexs) {
      this.isCurrentChecked = index
      this.isLightCurrentChecked = indexs
      this.source = currentSource
      this.deviceSerial = deviceSerial
    },
    changeScreen(num) {
      this.viewIsCurrentChecked = num
      this.videoIsCurrentChecked = null
      this.videoSourceNum = 0
      setTimeout(() => {
        this.videoSourceNum = num
        this.currentScreenNum = num
      }, 100)
      if (num === 1) {
        this.oneScreen = true
        this.twoScreen = false
        this.threeScreen = false
        this.fourScreen = false
      } else if (num === 4) {
        this.twoScreen = true
        this.oneScreen = false
        this.threeScreen = false
        this.fourScreen = false
      } else if (num === 9) {
        this.threeScreen = true
        this.oneScreen = false
        this.twoScreen = false
        this.fourScreen = false
      } else if (num === 16) {
        this.fourScreen = true
        this.oneScreen = false
        this.twoScreen = false
        this.threeScreen = false
      }
    },
    getDevLis() {
      axios.get('http://180.167.48.172:9527/api/getApiLampPost').then(res => {
        console.log(res)
        this.videoSource = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    yuntaiControlStart(direction) {
      if (this.isCurrentChecked === null) {
        this.$message({
          message: '请选择监控点',
          type: 'warning'
        })
      } else {
        var urlParams = {
          accessToken: this.accessToken,
          deviceSerial: this.deviceSerial,
          channelNo: '1',
          direction: direction,
          speed: '2'
        }
        axios
          .post(
            'https://open.ys7.com/api/lapp/device/ptz/start',
            qs.stringify(urlParams)
          )
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
            } else if (res.data.code === 10002) {
              this.getAccessToken()
              this.$message({
                message: '操作失败，请重试！',
                type: 'warning'
              })
            } else {
              this.$message({
                message: '操作失败！',
                type: 'warning'
              })
            }
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    yuntaiControlStop(direction) {
      if (this.isCurrentChecked != null) {
        var urlParams = {
          accessToken: this.accessToken,
          deviceSerial: this.deviceSerial,
          channelNo: '1',
          direction: direction
        }
        axios
          .post(
            'https://open.ys7.com/api/lapp/device/ptz/stop',
            qs.stringify(urlParams)
          )
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-aside {
    /* background-color: #D3DCE6; */
    color: #333;
    text-align: center;
    /* line-height: 200px; */
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding: 0;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    /* height: 100px; */
    overflow: auto;
  }
  .box-card::-webkit-scrollbar {
    display: none;
  }

  .videoBox {
    float: left;
    // width: calc(100vw - 450px);
    width: 100%;
    height: calc(100vh - 124px);
    background-color: #1F2D3D;

    .videoContainer {
      float: left;
      padding: 2px;

      .myPlayer {
        float: left;
        width: 100%;
        height: 100%;
      }
    }

    .videoIsChecked {
      border: 1px solid #05e0f7;
    }

    .oneScreen {
      width: 100%;
      height: 100%;
    }

    .twoScreen {
      width: 50%;
      height: 50%;
    }

    .threeScreen {
      width: 33%;
      height: 33%;
    }

    .fourScreen {
      width: 25%;
      height: 25%;
    }
  }

  .myMenuBox {
    width: 200px;
    height: calc(100vh - 124px);
    float: left;
    background-color: #2A394B;

    .screenViewBox {
      width: 100%;
      height: 180px;
      padding: 0 20px;

      .screenViewTitle {
        padding-top: 5px;
        overflow: hidden;
        width: 100%;

        span {
          height: 30px;
          line-height: 30px;
          color: #f0f0f0;
          display: block;
          float: left;
          margin-left: 15px;
        }

        svg {
          margin-top: 5px;
          width: 20px;
          height: 20px;
          display: block;
          float: left;
        }
      }

      .screenViewList {
        overflow: hidden;

        span {
          cursor: pointer;
          border-radius: 4px;
          background-color: #fff;
          margin-top: 5px;
          color: #333;
          width: 100%;
          height: 30px;
          line-height: 30px;
          display: block;
          float: left;
          padding: 0 10px;

          svg {
            margin-top: 7.5px;
            display: block;
            float: left;
            width: 15px;
            height: 15px;
            color: #36CFC9;
          }

          i {
            // margin-left: 25px;
            width: 50px;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            text-align: center;
          }
        }

        .viewIsChecked {
          color: #fff;
          background-color: #64D9D6;
          svg{
            color: #fff;
          }
        }

        // span:hover{
        //   background-color: #0E3F45;
        //   color: #f0f0f0;
        // }
      }
    }

    .monitorBox {
      width: 100%;
      height: calc(100vh - 554px);
      padding: 0 20px;

      // background-color: #ccc;
      .monitorTitle {
        // padding: 0 20px;
        width: 100%;
        overflow: hidden;

        span {
          height: 30px;
          line-height: 30px;
          color: #f0f0f0;
          display: block;
          float: left;
          margin-left: 15px;
        }

        svg {
          color: #fff;
          margin-top: 5px;
          width: 20px;
          height: 20px;
          display: block;
          float: left;
        }
      }
      .monitorList::-webkit-scrollbar {
        display: none;
      }
      .monitorList {
        background-color: #fff;
        height: calc(100vh - 594px);
        margin-top: 5px;
        overflow: scroll;
        border-radius: 4px;
        .collapseItemTitle {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 10px;
        }
        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          // border-radius: 4px;
          background-color: #fff;
          margin-top: 5px;
          color: #333;
          width: 100%;
          height: 30px;
          line-height: 30px;
          display: block;
          float: left;
          padding: 0 20px;
          font-size: 14px;
          text-align: left;
        }

        .myIsChecked {
          color: #f0f0f0;
          background-color: #64D9D6;
        }
      }
    }

    .controlBox {
      width: 100%;
      height: 250px;
      padding: 0 20px;

      .controlTitle {
        width: 100%;
        overflow: hidden;

        span {
          height: 30px;
          line-height: 30px;
          color: #f0f0f0;
          display: block;
          float: left;
          margin-left: 15px;
        }

        svg {
          margin-top: 5px;
          width: 20px;
          height: 20px;
          display: block;
          float: left;
          color: #fff;
        }
      }

      .controlList {
        overflow: hidden;

        table {
          float: left;

          tr {
            td {
              border-radius: 8px;
              width: 36px;
              height: 36px;
              margin-left: 20px;
              text-align: center;
              color: #f0f0f0;
              background-color: #64D9D6;
              cursor: pointer;

              svg {
                width: 15px;
                height: 15px;
                color: #fff;
              }
            }
          }
        }

        .controlDirection {
          margin-left: 20px;
        }

        .smallOrBig {
          margin: 10px 0 0 20px;
          // margin:10px 0 0 0;
        }
      }
    }
  }
</style>
