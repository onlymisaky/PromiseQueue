/** @type {import('@babel/core').TransformOptions} */
const transformOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 按需引入 corejs 中的模块 
        corejs: 3, // 核心 js 版本
        targets: '> 0.25%, not dead' // 浏览器支持范围
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3
      }
    ]
  ]
};

module.exports = transformOptions;
