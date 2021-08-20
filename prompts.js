module.exports = [
	{
		type: "text",
		name: "cdnBaseURL",
		default: "https://smart-contact-cdn.livelanding.it"
	},
	{
		type: "confirm",
		name: "useRouter",
		default: false
	},
	{
		type: "confirm",
		name: "useVuex",
		default: false	
	},
	{
		type: "confirm",
		name: "useProductsVuexModule",
		default: false,
		message: "Do you want to use products vuex module instead of compositionApi?"
	}
]