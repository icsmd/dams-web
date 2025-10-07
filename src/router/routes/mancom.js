const main = () => import('@/pages/mancom/index.vue')
const events = () => import('@/pages/mancom/events.vue')
const attendance = () => import('@/pages/mancom/attendance.vue')

const routes = [
	{
		path: '/Management-Committee/Meetings',
		name: 'Man-com',
		meta: { requiresAuth: true, layout: 'header', title: 'MANCOM' },
		component: main,
	},
	{
		path: '/Management-Committee/Meetings/:id/Events',
		name: 'Man-com-events',
		meta: { requiresAuth: true, layout: 'header', title: 'MANCOM' },
		component: events,
	},
	{
		path: '/Management-Committee/Meetings/:id/Events/:eventId/Attendance',
		name: 'Man-com-attendance',
		meta: { requiresAuth: true, layout: 'header', title: 'MANCOM' },
		component: attendance,
	},
]

export default routes
