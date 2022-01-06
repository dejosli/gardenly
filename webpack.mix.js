let mix = require('laravel-mix');

mix
  .js('resources/js/app.js', 'public/js/app.js')
  .sass('resources/scss/app.scss', 'public/css/app.css');

if (!mix.inProduction()) {
  mix.webpackConfig({
    devtool: 'inline-source-map',
  });
}
