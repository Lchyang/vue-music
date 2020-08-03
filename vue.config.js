const path = require('path')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('common', path.join(__dirname, './src/common'))
  }
}