import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/ui/index.ts', 'src/types/index.ts', 'src/auth/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})