<template>
  <div class="login">
    <van-nav-bar class="nav-bar" title="登录">
      <van-icon slot="left" @click="$router.back()" name="arrow-left" />
    </van-nav-bar>

    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        name="mobile"
        placeholder="请输入用户名"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        :rules="userFormRules.code"
        name="code"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <van-count-down
          slot="button"
          v-if="isCountDownShow"
          :time="1000 * 60"
          format="ss s"
          class="count-down-sms"
          @finish="isCountDownShow = false"
        />
        <van-button
          slot="button"
          v-else
          native-type="button"
          type="default"
          class="send-sms-btn"
          size="samll"
          round
          @click="onSendSms"
          >发送验证码</van-button
        >
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      user: {
        mobile: '15982778680',
        code: '246810'
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|4|5|7|8|9]\d{9}$/,
          message: '手机号码格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false
    }
  },
  methods: {
    ...mapMutations(['setToken']),
    // 登录
    async onSubmit () {
      // 展示登陆中 loading
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      // 2.登录
      try {
        const res = await login(this.user)
        // console.log(res)
        this.$toast.success('登陆成功')
        // 登录成功后保存返回的token到本地存储，调用vuex中的setUser方法来存储
        // 第一种直接commit触发mutations中的setToken方法存储token到vuex中
        // this.$store.commit('setToken', res.data.data)
        // 第二种使用mapMutations方法把mutations中的方法放入当前组件中methods直接调用setToken方法
        this.setToken(res.data.data)
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log(err)
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后尝试')
        }
      }
    },
    // 发送验证码
    async onSendSms () {
      // console.log('onSendSms')
      // console.log(this.$refs.loginForm)
      // 1. 校验手机号
      try {
        // validate 返回的是一个 promise对象
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      console.log('验证通过')
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await getSmsCode(this.user.mobile)
        // 3.1. 验证码发送成功
        this.$toast('发送成功')
      } catch (err) {
        // 3.2. 验证码发送失败，关闭倒计时
        this.isCountDownShow = false
        console.dir(err)
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>``

<style scoped lang="less">
.login {
  .toutiao {
    font-size: 37px;
  }
  .btnSubmit {
    background-color: var(--color-tint);
  }
  .count-down-sms {
    text-align: center;
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    border-radius: 23px;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    margin: 0 !important;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
