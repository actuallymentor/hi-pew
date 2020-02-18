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
require('dotenv').config( `${__dirname}/.env` )
// Remap process env
const stringify_env = f => {
  let environment = {}
  Object.keys( process.env ).map( ( key, index ) => { return environment[ key ] = JSON.stringify( process.env[ key ] ) } )
  return environment
}

// ///////////////////////////////
// Plugins
// ///////////////////////////////
let thebs
const servername = 'bsserver'
const bsconfig = {
  host: 'localhost',
  open: true,
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

const envconfig = {
  'process.env': {
    NODE_ENV: JSON.stringify( 'production' )
  }
}

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

const maps = env => {
  if( env == 'production' ) {
    return 'cheap-module-source-map'
  } else {
    return 'eval'
  }
}

module.exports = ( ) => {
  return Promise.all( [ publishpug( site ), publishassets( site ), css( site ) ] )
  .then( f => {
    console.log( 'Initial build done' )
    return {
      entry: site.system.source + 'js/main.js',
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
      devtool: process.env.NODE_ENV == 'production' ?  'cheap-module-source-map' : 'eval',
      plugins: process.env.NODE_ENV == 'production' ? [ new webpack.DefinePlugin( envconfig ) ] : [ new BrowserSyncPlugin( bsconfig, bsyncplugconfig ) ]
    }
  } ).catch( console.log.bind( console ) )
}