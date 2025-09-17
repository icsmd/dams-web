/**
 * This module manages User data in the Vuex store.
 * It defines the state, getters, mutations, and actions for the module.
 */
const state = {
	list: [],
	meta: {},
}

const getters = {
	list: (state) => state.list,
	meta: (state) => state.meta,
}

const mutations = {
	/**
	 * Set the list of User models
	 */
	SET_LIST(state, data) {
		state.list = data
	},
	/**
	 * Set the metadata for User collections
	 */
	SET_META(state, meta) {
		state.meta = meta
	},

	/**
	 * Set the current User model
	 */
	SET_DATA(state, data) {
		state.model = data
	},
	/**
	 * Insert a new User model into the list
	 */
	INSERT(state, data) {
		state.list.push(data)
	},
	/**
	 * Update a User model in the list
	 */
	UPDATE(state, data) {
		const listIndex = state.list.map((l) => l.id).indexOf(data.id)
		state.list.splice(listIndex, 1, data)
	},
	/**
	 * Delete a User model from the list
	 */
	DELETE(state, data) {
		const listIndex = state.list.map((l) => l.id).indexOf(data.id)
		state.list.splice(listIndex, 1)
	},
}

const actions = {
	async paginate(
		{ commit },
		{ page = 1, search = null, itemsPerPage = 15, orderBy = [], majorTypeId } = {},
	) {
		const { data, meta } = await axios.get('document/incoming')

		commit('SET_LIST', data)
		commit('SET_META', meta)

		return {
			data: data,
			meta: meta,
		}
	},

	async update({ commit }, model) {
		const response = await axios.put(`document/incoming/${model.id}`, model)

		return response
	},
	async save({ commit }, model) {
		const response = await axios.post('/create-user', model)

		return response
	},
	async destroy({ commit }, model) {
		const response = await axios.delete(`document/incoming/${model.id}`)

		return response
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
