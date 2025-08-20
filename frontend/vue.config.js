const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/': {
        target: 'https://wtfood.cs.bgu.ac.il',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
