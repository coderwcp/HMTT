export function getItem (name) {
  const data = window.localStorage.getItem(name)
  // 通过try-catch防止获取过来的数据就是对象格式
  try {
    // 如果是json格式的对象
    return JSON.parse(data)
  } catch (err) {
    // 如果获取到的就是对象格式
    return data
  }
}

export function setItem (name, data) {
  if (data instanceof Object) {
    data = JSON.stringify(data)
  }
  window.localStorage.setItem(name, data)
}

export function removeItem (name) {
  window.localStorage.removeItem(name)
}
