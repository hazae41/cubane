import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@rollup/plugin-typescript";

/**
 * @type {import("rollup").RollupOptions[]}
 */
export const config = [
  {
    input: "./src/index.bench.ts",
    output: [{
      dir: "./dist/bench",
      format: "esm",
      exports: "auto",
      preserveModules: false,
      sourcemap: true,
      entryFileNames: "[name].mjs",
    }],
    plugins: [commonjs(), json(), resolve({ preferBuiltins: true }), ts()],
  },
]

export default config