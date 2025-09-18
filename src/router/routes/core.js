const login = () => import('@/pages/index.vue')
const mainMenu = () => import('@/pages/core/index.vue')
const development = () => import('@/pages/notFound.vue')

const routes = [
	{
		path: '/',
		name: 'Login',
		meta: { requiresAuth: true, layout: 'blank', title: 'Login' },
		component: login,
	},
	{
		path: '/Main-Menu',
		name: 'main-menu',
		meta: { requiresAuth: true, layout: 'header', title: 'Electronic Attendance Management System' },
		component: mainMenu,
	},
	{
		path: '/Ongoing-Development',
		name: 'not-found',
		meta: { requiresAuth: true, layout: 'header', title: 'Electronic Attendance Management System' },
		component: development,
	},
]

export default routes
