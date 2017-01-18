// Browser sync stuff
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' )

// Webpack and css
const autoprefixer = require ( 'autoprefixer' )
const webpack = require( 'webpack' )

// Workflow
const WebpackPreBuildPlugin = require( 'pre-build-webpack' )
const FileWatcherPlugin = require( 'file-watcher-webpack-plugin' )
const pfs = require( __dirname + '/modules/parse-fs' )

// Site config 
const site = require( __dirname + '/modules/config' )

// Conversions
const publishpug = require( __dirname + '/modules/publish-pug' )

// ///////////////////////////////
// Plugins
// ///////////////////////////////
const bsync = new BrowserSyncPlugin( {
  host: 'localhost',
  open: false,
  port: 3000,
  server: { 
    baseDir: [ __dirname + '/public' ],
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
} )
const setenv = new webpack.DefinePlugin( {
  'process.env': {
    NODE_ENV: JSON.stringify( 'production' )
  }
} )
const makeugly = new webpack.optimize.UglifyJsPlugin( {
  compress: {
    warnings: false
  }
})

const prebuild = new WebpackPreBuildPlugin( stats => {
  // Delete old build and generate pug files
  publishpug( site )
} )

const watchall = new FileWatcherPlugin( {
      root: site.system.source,
      files: ['*.pug', '*.scss']
  } )

const pluginarray = ( env, server ) => {
  if ( env == 'production' ) {
    if ( server ) {
      return [
      setenv,
      makeugly,
      prebuild,
      bsync,
      watchall
      ]
    } else {
      return [
      setenv,
      prebuild,
      makeugly
      ]
    }
  } else if ( env == 'development' ) {
    return [
    prebuild,
    bsync,
    watchall
    ]
  } else {
    return []
  }
}
const maps = env => {
  if( env == 'production' ) {
    return 'cheap-module-source-map'
  } else {
    return 'eval'
  }
}

module.exports = {
  watch: true,
  entry: site.system.source + 'js/main.js',
  output: {
    filename: site.system.public + 'js/app.js'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css", "sass", "postcss"]
    }
    ]
  },
  devtool: maps( process.env.NODE_ENV ),
  postcss: [
  autoprefixer( { browsers: ['last 2 versions'] } )
  ],
  plugins: pluginarray( process.env.NODE_ENV, process.env.server )
}