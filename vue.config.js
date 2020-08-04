const path = require('path')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('common', path.join(__dirname, './src/common'))
      .set('components', path.join(__dirname, './src/components'))
  }
}