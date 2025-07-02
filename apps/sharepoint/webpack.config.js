// Add this to your webpack configuration
module.exports = {
  // ...existing config
  devServer: {
    // ...existing devServer config
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
