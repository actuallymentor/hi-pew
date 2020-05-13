const pugfiles = require( __dirname + '/parse-pugfiles' )
const getContent = require( __dirname + '/parse-locales' )
const pfs = require( __dirname + '/parse-fs' )
const pug = require( 'pug' )
const { inlinecss } = require( './publish-css' )
const { minify } = require( 'html-minifier' )
const { SitemapStream, streamToPromise } = require( 'sitemap' )

const site = require( __dirname + '/config' )

// Compile pug to html
// Return a resolved promise with the file data
const compilepug = ( path, filename, css, content ) => Promise.resolve( {
	path: path,
	filename: filename,
	baseSlug: content.slug,
	lang: content.lang,
	// Compile the pug file with the site config as a local variable
	html: minify( pug.renderFile( path + filename, { site: site, css: css, content: content } ), {
		html5: true,
		minifyCSS: true,
		minifyJS: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		processScripts: [ 'application/ld+json' ]
	} )
} )

// Construct links
const makeLinks = ( pugfiles, content ) => {

	// Paths of files and thus the urls
	const paths = pugfiles.map( page => page.filename )

	// Structure the URLs for the sitemap package
	const structuredUrls = paths.map( path => ( {
		url: `${ site.system.url }${ path.split( '.' )[ 0 ] }.html`,
		links: content.map( lang => ( {
			lang: lang.lang,
			// Remove trailing slash freom system ur
			url: `${ site.system.url.replace(/\/$/, "") }${ lang.slug }${ path.split( '.' )[ 0 ] }.html`
		} ) )
	} ) )
	return structuredUrls
}
// Make sitemap
const makeSitemap = links => {
	const stream = new SitemapStream( { hostname: site.system.url } )
	links.map( link => stream.write( link ) )
	stream.end()
	return streamToPromise( stream ).then( data => data.toString() )
}

// Run a promise for every content item
const makeAllPugs = ( pugstrings, css, contents ) => Promise.all( contents.map( content => {
	// For every json declaration, make all pages
	return pugstrings.map( pug => compilepug( site.system.source, pug.filename, css, content ) )
// Flatten the array of arrays to just be an array of promises
} ).flat() )

// Write html to disk
// Use the safe write feature of the psf module
const writehtml = ( site, page ) => Promise.all( [
	pfs.swrite( site.system.public + page.baseSlug, `${ page.filename.split( '.' )[ 0 ] }.html`, page.html ),
	pfs.swrite( site.system.public + page.baseSlug + page.filename.split( '.' )[ 0 ] + '/', `index.html`, page.html )
] )
const writeSitemap = ( site, sitemap ) => pfs.swrite( site.system.public, 'sitemap.xml', sitemap.toString() )

// Combine the above two and the parse-pugfiles module to read, compile and write all pug files
// Make the public directory
const publishfiles = site => pfs.mkdir( site.system.public )
// Grab the pug data from disk
.then( f => Promise.all( [
	pugfiles( site.system.source ),
	inlinecss( `${ site.system.source }css/essential-above-the-fold.sass` ),
	getContent( `${ site.system.source }content` )
] ) )
// Parse pug into html
// Pugfiles have .filename and .data
// Generate essential css to be inlined into the pug files
.then( ( [ pugfiles, css, content ] ) => Promise.all( [
	makeAllPugs( pugfiles, css, content ),
	makeLinks( pugfiles, content )
] ) )
// .then( debug => { console.log( debug ); return debug } )
//  Write html files to disk
// Html ( page ) has .path, .filename .baseSlug and .html
.then( async ( [ htmls, links ] ) => Promise.all( [
	Promise.all( htmls.map( page => writehtml( site, page ) ) ),
	writeSitemap( site, await makeSitemap( links ) )
] ) )


module.exports = publishfiles