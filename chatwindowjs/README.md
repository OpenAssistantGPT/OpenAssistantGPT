
run build: npx esbuild src/index.tsx --bundle --outdir=dist --watch

build css: npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch