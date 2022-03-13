import { request } from '@/utils/request'
export function login (data) {
  return request({
    url: '/v1_0/authorizations',
    method: 'post',
    data
  })
}

export function getSmsCode (mobile) {
  return request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: 'get'
  })
}

export function getUserInfo () {
  return request({
    url: '/v1_0/user',
    method: 'get'
  })
}

export function getUserChannels () {
  return request({
    url: '/v1_0/user/channels',
    method: 'get'
  })
}
