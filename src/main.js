import '@/assets/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.min.css'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'

import { registerPlugins } from '@/plugins'
import axios from 'axios'

import './plugins/axios'
import './plugins/string'
import './plugins/axios'
import './plugins/moment'
import './plugins/mitt'
import './plugins/sweet-alert'
import store from './store'

import App from './app.vue'
import Default from './layouts/default.vue'
import Blank from './layouts/blank.vue'
import Header from './layouts/header.vue'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

axios.defaults.baseURL = `${import.meta.env.DAMS_API_URL}`

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('session_token');

if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

const vuetify = createVuetify({
	icons: {
		defaultSet: 'fa',
		aliases: { ...faAliases, ...mdiAliases },
		sets: {
            fa,
            mdi,
		},
	},
})

export default vuetify

const app = createApp(App)

app.config.performance = true

registerPlugins(app)

app
	.component('default-layout', Default)
	.component('blank-layout', Blank)
	.component('header-layout', Header)
	.use(store)
	.mount('#app')