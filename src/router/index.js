import { createRouter, createWebHistory } from 'vue-router'

import core from '@/router/routes/core'
import mancom from '@/router/routes/mancom'
import nic from '@/router/routes/nic'
import setup from '@/router/routes/setup'

let routes = []

routes = routes.concat(
	core,
	mancom,
	nic,
	setup,
);

const router = createRouter({
	history: createWebHistory(import.meta.BASE_URL),
	routes: routes,
})

// Set the document title and handle authentication checks before each route navigation
router.beforeEach((to, from, next) => {
	document.title = `${import.meta.env.DAMS_APP_NAME || 'Electronic Attendance Management System'} ${
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
