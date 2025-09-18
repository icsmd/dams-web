const main = () => import('@/pages/mancom/index.vue')

const routes = [
	{
		path: '/Management-Committee',
		name: 'Man-com',
		meta: { requiresAuth: true, layout: 'header', title: 'MANCOM' },
		component: main,
	},
]

export default routes
