import { createRouter, createWebHistory } from 'vue-router'

import management from '@/router/routes/management'
import core from '@/router/routes/core'
import document from '@/router/routes/document'

let routes = []

routes = routes.concat(
	management, 
	core,
	document,
);

const router = createRouter({
	history: createWebHistory(import.meta.BASE_URL),
	routes: routes,
})

// Set the document title and handle authentication checks before each route navigation
router.beforeEach((to, from, next) => {
	document.title = `${import.meta.env.APP_NAME || 'Vue Template'} ${
		to.meta.title ? '| ' + to.meta.title : ''
	}`

	// if (to.meta.requiresAuth && !localStorage.getItem('token')) {
	// 	next({ name: 'login' })
	// } else {
	// 	next()
	// }

	next()
})

export default router
