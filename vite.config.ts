import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

const remotesAppDev = {
  remoteComponent: process.env.VITE_REMOTECOMPONENT_LINK,
};


const remotesAppProd = {
  remoteComponent: process.env.VITE_REMOTECOMPONENT_LINK_PROD,
};

const remotesApp = process.env.NODE_ENV == "production"
  ? remotesAppProd
  : remotesAppDev;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      //@ts-ignore
      remotes: {
        ...remotesApp,
        from: "webpack",
        format: "esm",
      },
      shared: {
        'react': {
          import: true,
          //singleton: true,
          requiredVersion: '18.3.1',
        },
        'react-dom': {
          import: true,
          //singleton: true,
          requiredVersion: '18.3.1',
        },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        format: "esm",
        minifyInternalExports: false,
      },
      plugins: [
        // visualizer({
        //   open: true, // Open the report in the browser automatically
        //   filename: 'bundle-analysis.html', // Output file
        //   gzipSize: true, // Display gzip sizes
        //   brotliSize: true, // Display Brotli sizes
        // }),
      ],
    },
  },
  //@ts-ignore
  output: {
    libraryTarget: "system",
  },
  base: process.env.NODE_ENV == 'production' ? process.env.VITE_BASE_URL_PROD : process.env.VITE_BASE_URL,
  devServer: {
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    proxy: {
      "*": {
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});
