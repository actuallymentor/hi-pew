const sass = require( 'node-sass' )
const fs = require( 'fs' ).promises
const { mkdir } = require( './parse-fs' )

const postcss = require( 'postcss' )
const autoprefixer = require( 'autoprefixer' )
const cssnano = require( 'cssnano' )

module.exports = site => new Promise( ( resolve, reject ) => { 

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
			.then( result => fs.writeFile( css.to, result.css ).then( resolve ) )
		 } )
	} )
	

	
 } )