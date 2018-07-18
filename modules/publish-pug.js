const pugfiles = require( __dirname + '/parse-pugfiles' )
const pfs = require( __dirname + '/parse-fs' )
const pug = require( 'pug' )
const { inlinecss } = require( './publish-css' )

const site = require( __dirname + '/config' )

// Compile pug to html
const compilepug = ( path, filename, css ) => { 
	// Return a resolved promise with the file data
	return Promise.resolve( {
		path: path,
		filename: filename,
		// Compile the pug file with the site config as a local variable
		html: pug.renderFile( path + filename, { site: site, css: css } )
	} )
}

// Write html to disk
const writehtml = ( site, page ) => {
	return new Promise( ( resolve, reject ) => {
		// Use the safe write feature of the psf module
		pfs.swrite( site.system.public, page.filename.split( '.' )[ 0 ] + '.html', page.html )
		.then( resolve ).catch( reject )
	} )
}

// Combine the above two and the parse-pugfiles module to read, compile and write all pug files
const publishfiles = site => {
	return new Promise( ( resolve, reject ) => {

		// Make the public directory
		pfs.mkdir( site.system.public )

		// Grab the pug data from disk
		.then( f => pugfiles( site.system.source ) )

		// Parse pug into html
		.then( pugfiles => {
			// Generate essential css to be inlined into the pug files
			return inlinecss( `${ site.system.source }css/essential-above-the-fold.scss` )
			.then( css => { 
				// Pugfiles have .filename and .data
				return Promise.all( pugfiles.map( pugfile => { return compilepug( site.system.source, pugfile.filename, css ) } ) )
			} )
		} )

		//  Write html files to disk
		.then( htmls => {
			// Html ( page ) has .path, .filename and .html
			return Promise.all( htmls.map( page => { return writehtml( site, page ) } ) )
		} )

		// Handle resolve and reject
		.then( resolve ).catch( reject )
	} )
}

module.exports = publishfiles