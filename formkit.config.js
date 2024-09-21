import { defaultConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'
import { createProPlugin, inputs } from '@formkit/pro'

const pro = createProPlugin(import.meta.env.VITE_PRO_KEY, inputs)

const config = defaultConfig({
    plugins: [pro],
    config: {
        rootClasses
    },
    
})

export default config