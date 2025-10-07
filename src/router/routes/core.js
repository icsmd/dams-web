
const mainMenu = () => import('@/pages/core/index.vue')
const development = () => import('@/pages/notFound.vue')

const routes = [
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
