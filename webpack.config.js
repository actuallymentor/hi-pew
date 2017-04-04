// Browser sync stuff
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' )
const bs = require( 'browser-sync' )

// Webpack and css
const autoprefixer = require ( 'autoprefixer' )
const webpack = require( 'webpack' )

// Workflow
const fs = require( 'fs' )
const pfs = require( __dirname + '/modules/parse-fs' )

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
  notify: {
    styles:  [
    "display: none",
    "padding: 15px",
    "font-family: sans-serif",
    "position: fixed",
    "font-size: 0.9em",
    "z-index: 9999",
    "bottom: 0px",
    "right: 0px",
    "border-bottom-left-radius: 5px",
    "background-color: #1B2032",
    "margin: 0",
    "color: white",
    "text-align: center"
    ]
  }
}
const bsyncplugconfig = {
  name: servername,
  callback: f => { thebs = bs.get( servername ) }
}


const plugins = process.env.NODE_ENV == 'production' ?
  [ new webpack.optimize.UglifyJsPlugin( { compress: { warnings: false }, sourceMap: true } ),
    new webpack.DefinePlugin( { 'process.env': { NODE_ENV: JSON.stringify( 'production' ) } } ),
    new webpack.DefinePlugin( stringify_env( ) ) ]
  :
  [ new BrowserSyncPlugin( bsconfig, bsyncplugconfig ),
    new webpack.DefinePlugin( stringify_env( ) )  ]

// ///////////////////////////////
// Watchers for non webpack files
// ///////////////////////////////

if ( process.env.NODE_ENV == 'development' ) fs.watch( site.system.source, { recursive: true }, ( eventType, filename ) => {
  if ( eventType != 'change' || filename.indexOf( 'pug' ) == -1 ) return
  if ( process.env.debug ) console.log( 'It is a pug file' )
  // Delete old build and generate pug files
  return publishpug( site ).then( f => { if ( process.env.debug ) console.log( 'Repeat build done' ); thebs.reload( ) } ).catch( console.log.bind( console ) )
} )

// Watch for asset changes
if ( process.env.NODE_ENV == 'development' ) fs.watch( site.system.source + 'assets/', ( eventType, filename ) => {
  if ( eventType != 'change') return
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
  return pfs.mkdir( site.system.public )
  .then( f => {
    return Promise.all( [ publishpug( site ), publishassets( site ) ] )
  } )
  .then( f => {
    console.log( 'Initial build done' )
    return {
      entry: site.system.source + 'js/main.js',
      output: {
        filename: 'app.js',
        path: `${site.system.public}js/`
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: { presets: [ 'es2015' ] }
            }
          },
          {
            test: /\.scss$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  plugins: f => { return [ autoprefixer( { browsers: ['last 2 versions'] } ) ] }
                }
              },
              "sass-loader" ]
          }
        ]
      },
      devtool: process.env.NODE_ENV == 'production' ?  'cheap-module-source-map' : 'eval',
      plugins: plugins
    }
  } )
}