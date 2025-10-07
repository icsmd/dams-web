import { createRouter, createWebHistory } from 'vue-router'

import core from '@/router/routes/core'
import mancom from '@/router/routes/mancom'
import nic from '@/router/routes/nic'
import setup from '@/router/routes/setup'

const login = () => import('@/pages/index.vue')

let routes = [
	{
		path: '/',
		name: 'Login',
		meta: { requiresAuth: false, layout: 'blank', title: 'Login' },
		component: login,
	},
]

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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

router.beforeEach((to, from, next) => {
	document.title = `${import.meta.env.DAMS_APP_NAME || 'Electronic Attendance Management System'} ${
		to.meta.title ? '| ' + to.meta.title : ''
	}`;

	const token = getCookie('session_token');

	// 🔹 1. If route requires authentication and no token, redirect to Login
	if (to.meta.requiresAuth && !token) {
		if (to.name !== 'Login') {
			next({ name: 'Login' });
		} else {
			next(); // prevent loop if already on Login
		}
		return; // stop here after redirect
	}

	// 🔹 2. If user is logged in and tries to go to Login page, redirect to Home (optional)
	if (token && to.name === 'Login') {
		next({ name: 'Dashboard' }); // change 'Dashboard' to your real home route
		return;
	}

	// 🔹 3. Continue as normal
	next();
});

export default router
