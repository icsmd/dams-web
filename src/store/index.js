/**
 * This code creates the Vuex store for your application.
 * It imports the necessary modules and defines the store using `createStore` from 'vuex'.
 * The modules are then added to the 'modules' option of the store.
 */

import { createStore } from 'vuex'
import VuexPersist from 'vuex-persist'

// Import the necessary modules
// Cores Import
import modals from './modules/core/modals'
import references from './modules/core/references'
import agency from './modules/setup/agency'
import person from './modules/setup/person'

// Features Import
// import users from './modules/auth/user'
// import incoming from './modules/document/incoming'


const vuexLocalStorage = new VuexPersist({
	key: 'vuex',
	storage: window.sessionStorage,
	modules: ['auth'],
})

export default createStore({
	modules: {
		modals,
		references,
		agency,
		person,
	},
	plugins: [vuexLocalStorage.plugin],
})
