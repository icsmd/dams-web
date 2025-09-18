const person = () => import('@/pages/setup/person.vue')
const designation = () => import('@/pages/setup/designation.vue')
const agency = () => import('@/pages/setup/agency.vue')

const routes = [
	{
		path: '/System-Setup/Person',
		name: 'system-person',
		meta: { requiresAuth: true, layout: 'header', title: 'System Setup' },
		component: person,
	},
	{
		path: '/System-Setup/Designation',
		name: 'system-designation',
		meta: { requiresAuth: true, layout: 'header', title: 'System Setup' },
		component: designation,
	},
	{
		path: '/System-Setup/Agency',
		name: 'system-agency',
		meta: { requiresAuth: true, layout: 'header', title: 'System Setup' },
		component: agency,
	},
]

export default routes
