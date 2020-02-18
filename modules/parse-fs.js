const fs = require( 'fs' )
const { normalize } = require('path')
const del = require( 'del' )
const mkdirp = require( 'mkdirp' )

// Promise structure for writing a file to disk
const writefile = ( where, what ) => new Promise( ( resolve, reject ) => {
	fs.writeFile( where, what, err => {
		if ( err ) return reject( err )
		resolve( what )
	} )
} )

// Delete a folder through the promise api
const delp = what => new Promise( ( resolve, reject ) => {
	fs.access( what, err => {
		if ( !err ) return resolve( del.sync( [ what ] ) )
		resolve( )
	} )
} )

// Make directory if it does not exist yet
const mkdir = path => {
	path = normalize( path )
	return new Promise( ( resolve, reject ) => {
		// Check if folder exists
		fs.access( path, err => {
			if ( !err ) return resolve( )
			// Mkdir -p so the path to the folder is created if it doesn't exist
			mkdirp( path ).then( f => resolve() ).catch( err => reject( err ) )
		} )
	} )
}

// Read the contents of these files and return as an array
const readdata = ( path, filename ) => new Promise( ( resolve, reject ) => {
	fs.readFile( normalize( `${path}/${filename}` ), 'utf8', ( err, data ) => {
		if ( err ) return reject( err )
		// Resolve with an object that contains the name and data of a file
		resolve( { filename: filename, data: data } )
	} )
} )

// Safely write a file by chacking if the path exists
const safewrite = ( path, file, content ) => mkdir( path )
	.then( f => writefile( path + file, content ) )

module.exports = {
	write: writefile,
	swrite: safewrite,
	del: delp,
	mkdir: mkdir,
	readFile: readdata
}