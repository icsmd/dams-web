import vuetify from './vuetify'
import router from '@/router'

// Register all plugins here
export function registerPlugins(app) {
	app.use(vuetify).use(router)
}
