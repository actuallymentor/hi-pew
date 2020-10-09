// promise based file parsing
const { del, mkdir } = require( __dirname + '/parse-fs' )
// Recursive copy library
const ncp = require( 'ncp' )

let copyfolder = ( source, destination ) => {
	return new Promise( async ( resolve, reject ) => {
		// Recursively copy all assets from the source to the public folder
		await mkdir( destination )
		ncp( source, destination, err => {
			if ( err ) return reject(  err )
			resolve( )
		} )
	} )
}

const copyassets = site => del( site.system.public + 'assets/*' )
.then( copyfolder( site.system.source + 'assets', site.system.public + 'assets' ) )

module.exports = copyassets