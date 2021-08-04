module.exports = [
	{
		type: "text",
		name: "cdnBaseURL",
		default: "https://smart-contact-cdn.livelanding.it"
	}, 
	{
		type: "select",
		name: "productsStrategy",
		options:[ 
			{ text: "Vuex", value: "vuex-module" },
			{ text: "Composition API", value: "composition"	}
		]
	}
]