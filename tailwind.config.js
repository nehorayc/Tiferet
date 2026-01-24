/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'progress': 'progress linear forwards',
            },
            keyframes: {
                progress: {
                    'from': { width: '0%' },
                    'to': { width: '100%' },
                }
            }
        },
    },
    plugins: [],
}


