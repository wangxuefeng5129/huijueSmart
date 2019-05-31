import {
  //  asyncRoutes,
  constantRoutes } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function validatenull(children) {
  if (children && children.length > 0) {
    return false
  } else {
    return true
  }
}

function toBoolean(status) {
  if (status === 1) {
    return true
  } else {
    return false
  }
}

function filterRoutes(data, noRedirect) {
  const editRoutes = []
  data.forEach(e => {
    const route = {
      alwaysShow: toBoolean(e.alwaysShow),
      path: e.path,
      name: e.title,
      meta: {
        icon: e.icon,
        title: e.title
      },
      component: () => import(`@/views/${e.component}`),
      redirect: noRedirect ? null : `${e.path}/${e.children[0].path}`,
      children: validatenull(e.children) ? [] : filterRoutes(e.children, true)
    }
    editRoutes.push(route)
  })
  return editRoutes
}

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRoutes = filterRoutes(data)
        console.log(accessedRoutes)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default permission
