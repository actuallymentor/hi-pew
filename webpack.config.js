// Browser sync stuff
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' )
const bs = require( 'browser-sync' )

// Webpack and css
const autoprefixer = require ( 'autoprefixer' )
const webpack = require( 'webpack' )

// Workflow
const fs = require( 'fs' )
const pfs = require( __dirname + '/modules/parse-fs' )
const { css } = require( __dirname + '/modules/publish-css' )


// Site config 
const site = require( __dirname + '/modules/config' )

// Conversions
const publishpug = require( __dirname + '/modules/publish-pug' )
const publishassets = require( __dirname + '/modules/publish-assets' )

// Get environment variables
const dotenv = require('dotenv')

// ///////////////////////////////
// Plugins
// ///////////////////////////////
let thebs
const servername = 'bsserver'
const bsconfig = {
  host: 'localhost',
  open: true,
  cors: true,
  port: 3000,
  server: { 
    baseDir: [ site.system.public ],
    serveStaticOptions: {
      extensions: ['html']
    }
  },
  notify: false
}
const bsyncplugconfig = {
  name: servername,
  callback: f => { thebs = bs.get( servername ) }
}

const envPlugin = new webpack.DefinePlugin( {
  process: {
    env: {
      ...JSON.stringify( dotenv.config().parsed ),
      NODE_ENV: JSON.stringify( process.env.NODE_ENV )
    }
  }
} )

// ///////////////////////////////
// Watchers for non webpack files
// ///////////////////////////////

if ( process.env.NODE_ENV == 'development' ) fs.watch( site.system.source, { recursive: true }, ( eventType, filename ) => {
  if ( eventType != 'change' || !filename.includes( 'pug' ) ) return
  if ( process.env.debug ) console.log( 'It is a pug file' )
  // Delete old build and generate pug files
  return publishpug( site ).then( f => { if ( process.env.debug ) console.log( 'Repeat build done' ); thebs.reload( ) } ).catch( console.log.bind( console ) )
} )

if ( process.env.NODE_ENV == 'development' ) fs.watch( site.system.source, { recursive: true }, ( eventType, filename ) => {
  if ( eventType != 'change' || ( !filename.includes( 'sass' ) && !filename.includes( 'scss' ) ) ) return
  if ( process.env.debug ) console.log( 'It is a css file' )
  // Delete old build and generate pug/css files
    // Delete old build and generate pug/css files
    return publishpug( site ).then( f => css( site ) ).then( f => { if ( process.env.debug ) console.log( 'Repeat pug build done' ); thebs.reload( ) } ).catch( console.log.bind( console ) )

} )

// Watch for asset changes
if ( process.env.NODE_ENV == 'development' ) fs.watch( site.system.source + 'assets/', ( eventType, filename ) => {
  if ( filename.includes( 'pug' ) || filename.includes( 'sass' ) || filename.includes( 'scss' ) ) return
  if ( process.env.debug ) console.log( 'It is an asset file' )
  // Delete old build and generate pug files
  return publishassets( site ).then( f => { if ( process.env.debug ) console.log( 'Repeat assets done' ); thebs.reload( ) } ).catch( console.log.bind( console ) )
} )


module.exports = ( ) => {
  return Promise.all( [ publishpug( site ), publishassets( site ), css( site ) ] )
  .then( f => {

      console.log( 'Pug, CSS and Assets built.' )

      const webpackConfig = {
        entry: site.system.source + 'js/main.js',
        mode: process.env.NODE_ENV,
        output: {
          filename: `app-${site.system.timestamp}.js`,
          path: `${site.system.public}assets/js/`
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            }
          ]
        },
        devtool: process.env.NODE_ENV == 'production' ? false : 'inline-source-map',
        plugins: process.env.NODE_ENV == 'production' ? [ envPlugin ] : [ envPlugin, new BrowserSyncPlugin( bsconfig, bsyncplugconfig ) ]
      }

    console.log( 'Initial build done: ', webpackConfig )
    return webpackConfig

  } ).catch( console.log.bind( console ) )
}