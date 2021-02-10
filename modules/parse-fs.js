const { promises: fs } = require( 'fs' )
const { normalize } = require('path')
const del = require( 'del' )
const mkdirp = require( 'mkdirp' )

// Promise structure for writing a file to disk
const writefile = fs.writeFile

// Check if a resource exists
const exists = what => fs.access( what ).then( f => true ).catch( f => false )

// Delete a folder through the promise api
const delp = async what => {

	const file = await exists( what )
	if( file ) return del.sync( [ what ] )

}

// Make directory if it does not exist yet
const mkdir = async path => {

	path = normalize( path )
	const file = await exists( path )
	if( !file ) return mkdirp( path )
}

// Read the contents of these files and return as an array
const readdata = ( path, filename ) => fs.readFile( normalize( `${path}/${filename}` ), 'utf8' ).then( data => ( { filename: filename, data: data } ) )

// Safely write a file by chacking if the path exists
const safewrite = ( path, file, content ) => mkdir( path ).then( f => writefile( path + file, content ) )

module.exports = {
	write: writefile,
	swrite: safewrite,
	del: delp,
	mkdir: mkdir,
	readFile: readdata,
	exists: exists
}