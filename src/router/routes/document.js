const list = () => import('@/pages/document/index.vue');
const create = () => import('@/pages/document/create.vue');
const setting = () => import('@/pages/document/settings/index.vue');
const settingCreate = () => import('@/pages/document/settings/create.vue');

const routes = [
	{
		path: '/Document-Management/',
		name: 'document-management',
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: list,
	},
	{
		path: '/Document-Management/Create',
		name: 'document-management-create',
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: create,
	},
	{
		path: '/Document-Management/Settings',
		name: 'document-management-settings',
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: setting,
	},
	{
		path: '/Document-Management/Settings/Create',
		name: 'document-management-settings-create',
		meta: { requiresAuth: true, layout: 'header', title: 'Information System' },
		component: settingCreate,
	},
]

export default routes
