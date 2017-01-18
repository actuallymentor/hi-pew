module.exports = {
	identity: {
		title: "Website",
		desc: "Description of website",
		"logo": "logo.jpg"
	},
	system: {
		public: __dirname + '/../public/',
		source: __dirname + '/../src/',
		url: process.env.local ? 'http://localhost:3000/' : 'https://www.liveurl.com',
		gverification: undefined,
		year: new Date().getFullYear()
	},
	author: {
		firstname: "Mentor",
		lastname: "Palokaj",
		email: "mentor@palokaj.co",
		twitter: "@actuallymentor",
		// facebook profile id, used for retargeting ad permissions
		facebook: "1299359953416544",
		url: "https://www.skillcollector.com/"
	},
	track: {
		ga: "UA-XXXXXXXX-XX"
	}
}