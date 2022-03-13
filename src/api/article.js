import { request } from '@/utils/request'

export function getArticles (params) {
  return request({
    url: '/v1_0/articles',
    method: 'get',
    params
  })
}

export function getAllChannels () {
  return request({
    url: '/v1_0/channels',
    method: 'get'
  })
}

export function addUserChannel (channel) {
  return request({
    url: '/v1_0/user/channels',
    method: 'patch',
    data: {
      channels: [channel]
    }
  })
}

export function deleteUserChannel (channelId) {
  return request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'delete'
  })
}
