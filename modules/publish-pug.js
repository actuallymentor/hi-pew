const pugfiles = require( __dirname + '/parse-pugfiles' )
const pfs = require( __dirname + '/parse-fs' )
const pug = require( 'pug' )
const { inlinecss } = require( './publish-css' )

const site = require( __dirname + '/config' )

// Compile pug to html
// Return a resolved promise with the file data
const compilepug = ( path, filename, css ) => Promise.resolve( {
	path: path,
	filename: filename,
	// Compile the pug file with the site config as a local variable
	html: pug.renderFile( path + filename, { site: site, css: css } )
} )

// Write html to disk
// Use the safe write feature of the psf module
const writehtml = ( site, page ) => pfs.swrite( site.system.public, page.filename.split( '.' )[ 0 ] + '.html', page.html )

// Combine the above two and the parse-pugfiles module to read, compile and write all pug files
// Make the public directory
const publishfiles = site => pfs.mkdir( site.system.public )
// Grab the pug data from disk
.then( f => Promise.all( [
	pugfiles( site.system.source ),
	inlinecss( `${ site.system.source }css/essential-above-the-fold.scss` )
] ) )
// Parse pug into html
// Pugfiles have .filename and .data
// Generate essential css to be inlined into the pug files
.then( ( [ pugfiles, css ] ) => Promise.all( pugfiles.map( pugfile => compilepug( site.system.source, pugfile.filename, css ) ) ) )
//  Write html files to disk
// Html ( page ) has .path, .filename and .html
.then( htmls => Promise.all( htmls.map( page => writehtml( site, page ) ) ) )


module.exports = publishfiles