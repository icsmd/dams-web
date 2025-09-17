// Camel Case for Component Naming
// For pages components always lowercase
const management = () => import('@/pages/management/index.vue')
// const documentIncoming = () => import('@/pages/document/incoming.vue')

const routes = [
	{
		path: '/Management/User',
		name: 'user-management',
		meta: { requiresAuth: true, layout: 'header', title: 'User Management' },
		component: management,
	},
]

export default routes
