import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import GameBoard from '../views/GameBoard.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: GameBoard
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import(/* webpackChunkName: "about" */ '../views/StatisticsView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
