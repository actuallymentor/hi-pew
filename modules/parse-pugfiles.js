const fs = require( 'fs' )
const { readFile } = require( './parse-fs' )

// Grab all pug files from the root of the source directory
const getpugs = path => new Promise( ( resolve, reject ) => {
	fs.readdir( path, ( err, files ) => {
		if ( err ) return reject( err )
		// This will return an array of file names that contain .pug
		resolve( files.filter( file => file.indexOf( '.pug' ) != -1 ) )
	} )
} )

// Use the above two promises to return the pug files ( as pug syntax )
// Grab all .pug files
const returnpugs = path => getpugs( path )
// Grab the content of all .pug files
.then( files => Promise.all( files.map( filename => readFile( path, filename ) ) ) )

module.exports = returnpugs