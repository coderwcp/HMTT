<template>
  <div class="channel-edit">
    <van-cell title="我的频道" class="title-text" :border="false">
      <van-button
        size="mini"
        class="edit-btn"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="channel.id"
        @click="onMyChannelClick(channel,index)"
      >
        <van-icon slot="icon" name="close" v-show="isEdit && !fixedChannelsIds.includes(channel.id)" />
        <span class="text" slot="text" :class="{ active: active === index }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" class="title-text" :border="false"></van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { mapState } from 'vuex' // 用于判断用户是否登录,来保存用户频道
import { setItem } from '@/utils/storage' // 如果用户为登录则保存频道到本都存储中
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/article'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      channels: [],
      isEdit: false, // 编辑按钮控制删除
      fixedChannelsIds: [0] // 固定显示的频道,无法删除
    }
  },
  computed: {
    recommendChannels () {
      return this.channels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    },
    ...mapState(['tokens'])
  },
  watch: {},
  async created () {
    // 获取所有频道
    try {
      const { data: { data: { channels } } } = await getAllChannels()
      this.channels = channels
    } catch (err) {
      this.$toast('频道获取失败')
    }
  },
  mounted () {},
  methods: {
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      console.log(channel)
      // 1. 导入vuex中的mapState、storage中的方法
      // 2、根据user判断是否登陆
      // 3、如果已登录，封装添加频道的请求方法
      if (this.tokens) {
        // 已登陆,调用接口存储频道到当前用户
        // 4、引入addUserChannel方法
        try {
          const res = await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          console.log(res)
          this.$toast('添加频道成功')
        } catch (err) {
          console.log(err)
          this.$toast('添加频道失败,请稍后重试')
        }
      } else {
        // 未登录,存储频道到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }

      // 5、修改添加频道的处理逻辑
    },
    onMyChannelClick (channel, index) {
      if (!this.isEdit) {
        // 非编辑操作,点击执行切换
        this.$emit('update-active', index, false)
      } else {
        // 编辑操作,执行删除频道
        // 当在编辑状态下点击推荐时,会将推荐频道删除,判断点击的索引是否为 0,如果是,直接return退出函数
        if (index === 0) return
        // 如果当前显示的频道在删除的频道之后,删除后就会发生频道自动切换到当前后一个频道
        // 如果删除的是最后一个就会报错,因为后面没有频道展示
        // 如何解决: 把当前显示的频道前一个的active值传给父组件,让父组件直接展示前一个频道
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, false)
        }
        this.myChannels.splice(index, 1)
        console.log(channel)
        this.deleteChannel(channel)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.tokens) {
          // 已登录,调用接口删除
          await deleteUserChannel(channel.id)
        } else {
          // 未登录,重新把当前删除后的数组保存到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 70px;
}
.title-text {
  font-size: 32px;
  color: #333333;
}
.edit-btn {
  width: 104px;
  height: 48px;
  font-size: 26px;
  color: #f85959;
  border: 1px solid #f85959;
}
/deep/ .my-grid {
  .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 30px;
    color: #cacaca;
    z-index: 2;
  }
}
/deep/ .grid-item {
  width: 160px;
  height: 86px;
  .van-grid-item__content {
    white-space: nowrap;
    background-color: #f4f5f6;
    .van-grid-item__text,
    .text {
      color: #222;
      font-size: 28px;
      white-space: nowrap;
    }
    .active {
      color: red;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  .van-grid-item__text,
  .text {
    font-size: 28px;
    color: #222;
    margin-top: 0;
  }
}
/deep/ .recommend-grid {
  .van-grid-item__content {
    flex-direction: row;
  }
  .van-icon-plus {
    font-size: 28px;
    margin-right: 6px;
  }
}
</style>
