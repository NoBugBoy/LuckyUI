module.exports = {
    devServer: {
        proxy: {
            '/api': {
                changeOrigin:true,
                target: 'http://localhost:8888'
            },
          
            pathRewrite: {         //路径重置
                      '^/api': ''
                    }
        }
    }
};