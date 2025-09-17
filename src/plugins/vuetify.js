import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Custom Themes/Overriding Default Styles of Vuetify
export default createVuetify({
	components,
	directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {},
                // Add this line:
                variables: {
                    'font-family': '"Poppins", sans-serif',
                },
            },
        },
    },
})
