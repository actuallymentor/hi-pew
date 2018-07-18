const sass = require( 'node-sass' )
const fs = require( 'fs' ).promises
const { mkdir } = require( './parse-fs' )

const postcss = require( 'postcss' )
const autoprefixer = require( 'autoprefixer' )
const cssnano = require( 'cssnano' )

const file = site => new Promise( ( resolve, reject ) => { 

	const css = { 
		from: `${site.system.source}css/styles.scss`,
		to: `${site.system.public}assets/css/styles.css`
	 }

	mkdir( `${site.system.public}assets/css/` ).then( f => { 
		sass.render( { file: css.from }, ( err, result ) => { 
			if( err ) reject( err )
			// Run postcss with plugins
			postcss( [ autoprefixer, cssnano ] )
			.process( result.css, { from: css.from, to: css.to } )
			.then( result => fs.writeFile( css.to, result.css ) )
			.then( resolve )
		 } )
	} )
	
 } )

const inline = path => new Promise( ( resolve, reject ) => { 

	sass.render( { file: path }, ( err, result ) => { 
		if( err ) reject( err )
		// Run postcss with plugins
		postcss( [ autoprefixer, cssnano ] )
		.process( result.css, { from: path, to: path + 'dummy' } )
		.then( result => resolve( result.css ) )
	 } )
	
} )

module.exports = { 
	inlinecss: inline,
	css: file
}