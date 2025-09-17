/**
 * This module manages the state and actions related to modal functionality in the Vuex store.
 * It defines the state, getters, mutations, and actions for the module.
 */

const state = {
	activeModal: false, // The currently active modal
	confirmModal: {
		options: null, // The options for the confirm modal
		opened: false, // The status of the confirm modal
		resolve: null, // The resolve function for the confirm modal
		reject: null, // The reject function for the confirm modal
	},
	modalParams: false, // The parameters for the modal
}

const getters = {
	/**
	 * Get the modal parameters
	 */
	modalParams: (state) => state.modalParams,

	/**
	 * Get the confirm modal object
	 */
	confirmModal: (state) => state.confirmModal,

	/**
	 * Get the active modal
	 */
	activeModal: (state) => state.activeModal,
}

const mutations = {
	/**
	 * Set the active modal
	 */
	ACTIVE_MODAL(state, modal) {
		state.activeModal = modal
	},

	/**
	 * Set the modal parameters
	 */
	MODAL_PARAMETER(state, parameters) {
		state.modalParams = parameters
	},

	/**
	 * Close the active modal
	 */
	CLOSE_MODAL(state) {
		state.activeModal = false
		state.modalParams = false
	},

	/**
	 * Set the status of the confirm modal
	 */
	CONFIRM_STATUS(state, status) {
		state.confirmModal.opened = status
	},

	/**
	 * Set the resolve and reject functions for the confirm modal
	 */
	CONFIRM_PROMISE(state, { resolve, reject }) {
		state.confirmModal.resolve = resolve
		state.confirmModal.reject = reject
	},

	/**
	 * Set the options for the confirm modal
	 */
	CONFIRM_OPTIONS(state, options) {
		state.confirmModal.options = options
	},
}

const actions = {
	/**
	 * Open a modal
	 */
	open({ commit }, modal) {
		document.body.classList.add('no-scroll')

		if (typeof modal === 'object') {
			commit('MODAL_PARAMETER', modal.params)
			modal = modal.name
		}

		commit('ACTIVE_MODAL', modal)
	},

	/**
	 * Close the active modal
	 */
	close({ commit }) {
		document.body.classList.remove('no-scroll')

		commit('MODAL_PARAMETER', null)
		commit('CLOSE_MODAL')
	},

	/**
	 * Resolve the confirm action
	 */
	confirmAction({ commit, state }) {
		state.confirmModal.resolve()
		commit('CONFIRM_STATUS', false)
	},

	/**
	 * Show the confirm modal and return a promise
	 */
	confirm({ commit }, options = {}) {
		commit('CONFIRM_OPTIONS', options)
		commit('CONFIRM_STATUS', true)

		return new Promise((resolve, reject) => {
			commit('CONFIRM_PROMISE', { resolve, reject })
		})
	},

	/**
	 * Set the status of the confirm modal
	 */
	setConfirmModalStatus({ commit }, status) {
		commit('CONFIRM_STATUS', status)
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
