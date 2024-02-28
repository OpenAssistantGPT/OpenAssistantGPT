npx tailwindcss -i ./src/input.css -o ../public/chatwindow.css
npx esbuild src/index.tsx --bundle --minify --outfile=../public/chatwindow.js