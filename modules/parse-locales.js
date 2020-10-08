const { promises: fs } = require( 'fs' )
const { readFile } = require( './parse-fs' )

// Grab all pug files from the root of the source directory
const getJSONs = async path => {

	try {
		const files = await fs.readdir( path )
		return files.filter( file => file.includes( '.json' ) )
	} catch( e ) {
		console.error( `Error reading ${path}: `, e )
	}

}

// Validate the structure of the json filename and get the lang for it
// Json file syntax should be language.json ( e.g. en.json or nl.json )
const validateJson = async json => {

	if( json.lang && json.slug.includes( '/' ) ) return json
	else throw 'Invalid json'

}

// Return the json files ( as pug syntax )
// Grab all .json files
const getContent = path => getJSONs( path )
// Grab the content of all .json files
// Get the content of each file with it's language string, outputs { filename, content }
.then( files => Promise.all( files.map( file => readFile( path, file ) ) ) )
// Extract json data from strings
.then( strings => strings.map( string => JSON.parse( string.data ) ) )
// Validate that the jsons are well-formatted
.then( allJsons => Promise.all( allJsons.map( json => validateJson( json ) ) ) )

module.exports = getContent