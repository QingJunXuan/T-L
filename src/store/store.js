import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store(
  {
    state: {
      data: [{
        name: 'start',
        x: 250,
        y: 50
      }],
      links: [],
      catalog: [],
      score: []
    },
    mutations: {
      setCatalog (state, catalog) {
        state.catalog = catalog
      },
      setScore (state, score) {
        state.score = score
      }
    }
  }
)
