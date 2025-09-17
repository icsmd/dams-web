const login = () => import('@/pages/index.vue')
const mainMenu = () => import('@/pages/core/index.vue')
const development = () => import('@/pages/notFound.vue')
const intelPrimary = () => import('@/pages/systemSetup/primaryType.vue')

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
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: mainMenu,
	},
	{
		path: '/Ongoing-Development',
		name: 'not-found',
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: development,
	},
	{
		path: '/System-Setup/Intel-Primary-Type',
		name: 'intel-primary-type',
		meta: { requiresAuth: true, layout: 'header', title: 'Intel Primary Type' },
		component: intelPrimary,
	},
]

export default routes
