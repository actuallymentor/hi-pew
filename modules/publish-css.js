const sass = require( 'sass' )
const { promises: fs } = require( 'fs' )
const { mkdir } = require( './parse-fs' )

const postcss = require( 'postcss' )
const autoprefixer = require( 'autoprefixer' )
const cssnano = require( 'cssnano' )
const doiuse = require( 'doiuse' )

const cssWarning = warning => {

	const { feature, featureData } = warning
	const { title, missing, partial } = featureData
	if( partial ) console.log( "\x1b[33m", `[CSS] partial support - ${ title } - ${ partial }`, "\x1b[0m" )
	if( missing ) console.log( "\x1b[31m", `[CSS] missing support - ${ title } - ${ missing } missing support`, "\x1b[0m" )

}

const file = site => new Promise( ( resolve, reject ) => { 

	const css = { 
		from: `${site.system.source}css/styles.sass`,
		to: `${site.system.public}assets/css/styles.css`
	}

	mkdir( `${site.system.public}assets/css/` ).then( f => { 
		
		const result = sass.compile( css.from )
		if( !result ) return reject( `No valid CSS from ${ css.from }` )
		// Run postcss with plugins
		postcss( [
			autoprefixer,
			cssnano,
			doiuse( { ...site.system.browser.support, onFeatureUsage: cssWarning } )
		] )
		.process( result.css, { from: css.from, to: css.to } )
		.then( result => fs.writeFile( css.to, result.css ) )
		.then( resolve )
		.catch( err => console.log( err ) )

	} )
	
 } )

const inline = ( site, path ) => new Promise( ( resolve, reject ) => { 

	const result = sass.compile( path )
	if(!result ) return reject( `No valid CSS from ${ path }` )
	// Run postcss with plugins
	postcss( [
		autoprefixer,
		cssnano,
		doiuse( { ...site.system.browser.support, onFeatureUsage: cssWarning } )
	] )
	.process( result.css, { from: path, to: path + 'dummy' } )
	.then( result => resolve( result.css ) )
	.catch( err => console.log( err ) )
	
} )

module.exports = { 
	inlinecss: inline,
	css: file
}