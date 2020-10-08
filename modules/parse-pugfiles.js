const { promises: fs } = require( 'fs' )
const { readFile } = require( './parse-fs' )

// Grab all pug files from the root of the source directory
const getpugs = async path => {

	try {
		const files = await fs.readdir( path )
		return files.filter( file => file.includes( '.pug' ) )
	} catch( e ) {
		console.error( `Error getting pugs from: `, e )
	}

}

// Use the above two promises to return the pug files ( as pug syntax )
// Grab all .pug files
const returnpugs = path => getpugs( path )
// Grab the content of all .pug files
.then( files => Promise.all( files.map( filename => readFile( path, filename ) ) ) )

module.exports = returnpugs