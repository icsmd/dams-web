const main = () => import('@/pages/nic/index.vue')

const routes = [
	{
		path: '/NIC',
		name: 'Nic',
		meta: { requiresAuth: true, layout: 'blank', title: 'DAMS' },
		component: main,
	},
]

export default routes
