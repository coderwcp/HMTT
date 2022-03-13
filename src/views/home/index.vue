<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <ArticleList :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isEditChannelShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
      >
        <ChannelEdit @update-active="onUpdateActive" :myChannels="channels" :active="active"></ChannelEdit>
      </van-popup
    >
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserChannels } from '@/api/user'
import ArticleList from './components/articleList'
import ChannelEdit from './components/channelEdit'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // // 定义数据接收频道列表
      articleList: [],
      isEditChannelShow: false
    }
  },
  computed: {
    ...mapState(['tokens'])
  },
  watch: {},
  mounted () {},
  methods: {
    // index: 编辑删除传递过来的 index
    // isEditChannelShow: 弹出层的显示状态
    onUpdateActive (index, isEditChannelShow) {
      console.log(index)
      // 更新选中的频道
      this.active = index
      // 自动关闭弹出层
      this.isEditChannelShow = isEditChannelShow
    }
  },
  // 加载频道数据方法
  async created () {
    try {
      let channels = [] // 保存后续逻辑的执行结果
      // if (this.tokens) {
      //   // 已登录,调用接口获取频道列表
      //   const { data } = await getUserChannels()
      //   channels = data.data.channels
      // } else {
      //   // 未登录,从本地获取频道列表
      //   if (getItem('TOUTIAO_CHANN`S')) {
      //     // 如果本地存储有数据
      //     channels = getItem('TOUTIAO_CHANNELS')
      //   } else {
      //     // 本地存储没有数据,则获取默认推荐频道
      //     const { data } = await getUserChannels()
      //     channels = data.data.channels
      //   }
      // }

      // 先从本地存储中获取数据
      const localChannels = getItem('TOUTIAO_CHANNELS')
      if (this.tokens || !localChannels) {
        // 如果登录或者是本地存储没有数据,都通过接口获取数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录,本地存储有数据
        channels = localChannels
      }
      this.channels = channels
    } catch (err) {
      this.$toast('获取频道列表数据失败')
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding: 174px 0 100px;
  /deep/.van-nav-bar__title {
    max-width: inherit !important;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
