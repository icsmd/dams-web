// state
const state = {
    headerTitle: "",
    navbarTitle: "",
    route: "",
    routeQuery: {},
    routeParams: {},
    backgroundColor: "",
    subMenus: [],
    backClass: "",
    activeTab: 0,
};
// ========================================================================================

// getters
const getters = {
    headerTitle: (state) => state.headerTitle,
    navbarTitle: (state) => state.navbarTitle,
    route: (state) => state.route,
    routeQuery: (state) => state.routeQuery,
    routeParams: (state) => state.routeParams,
    backgroundColor: (state) => state.backgroundColor,
    subMenus: (state) => state.subMenus,
    backClass: (state) => state.backClass,
    activeTab: (state) => state.activeTab, //saving state/data
};
// ========================================================================================

// mutations
const mutations = {
    SET_HEADER_TITLE(state, data) {
      state.headerTitle = data;
    },
    SET_NAVBAR_TITLE(state, data) {
      state.navbarTitle = data;
    },
    SET_ROUTE(state, data) {
      state.route = data;
    },
    SET_ROUTE_QUERY(state, data) {
      state.routeQuery = data;
    },
    SET_ROUTE_PARAMS(state, data) {
      state.routeParams = data;
    },
    SET_BACKGROUND_COLOR(state, data) {
      state.backgroundColor = data;
    },
    SET_SUB_MENUS(state, data) {
      state.subMenus = data;
    },
    SET_BACK_CLASS(state, data) {
      state.backClass = data;
    },
    SET_ACTIVE_TAB(state, data) {
      state.activeTab = data;
    },
};
// ========================================================================================

// actions
const actions = {
    setHeaderTitle({ commit }, data) {
      commit("SET_HEADER_TITLE", data);
    },
    setNavbarTitle({ commit }, data) {
      commit("SET_NAVBAR_TITLE", data);
    },
    setRoute({ commit }, data) {
      commit("SET_ROUTE", data);
    },
    setRouteQuery({ commit }, data) {
      commit("SET_ROUTE_QUERY", data);
    },
    setRouteParams({ commit }, data) {
      commit("SET_ROUTE_PARAMS", data);
    },
    setBackgroundColor({ commit }, data) {
      commit("SET_BACKGROUND_COLOR", data);
    },
    setSubMenus({ commit }, data) {
      commit("SET_SUB_MENUS", data);
    },
    setBackClass({ commit }, data) {
      commit("SET_BACK_CLASS", data);
    },
    setActiveTab({ commit }, data) {
      commit("SET_ACTIVE_TAB", data);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
  