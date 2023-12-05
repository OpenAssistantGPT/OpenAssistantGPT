npx tailwindcss -i ./src/input.css -o ../public/chatbot.css
npx esbuild src/index.tsx --bundle --minify --outfile=../public/chatbot.js