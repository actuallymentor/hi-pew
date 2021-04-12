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

	
	const file = await exists( path )
	console.log( file ? '✅ exists ' : '🛑 not exists ', path )
	if( !file ) {
		console.log( '👵 creating ', path )
		const folder = await mkdirp( path ).catch( e => console.log( 'ERROR!', e ) )
		console.log( 'Creation of ', path, folder )
	}
}

// Read the contents of these files and return as an array
const readdata = ( path, filename ) => fs.readFile( normalize( `${path}/${filename}` ), 'utf8' ).then( data => ( { filename: filename, data: data } ) )

// Safely write a file by chacking if the path exists
const safewrite = async ( path, file, content ) => {

	path = normalize( path )
	await mkdir( path )
	await writefile( path + file, content )

}

module.exports = {
	write: writefile,
	swrite: safewrite,
	del: delp,
	mkdir: mkdir,
	readFile: readdata,
	exists: exists
}