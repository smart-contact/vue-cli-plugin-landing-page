const fs = require("fs")
const { findLastIndex } = require("lodash")

module.exports = function(api){
	return {
		extendsPackages({ productsStrategy  = "composition"}){
			const dependencies = {
				"@smart-contact/comparatore-api-service": "^2.x",
				"@smart-contact/smartify": "^0.x",
				// '@smart-contact/smartland': '^3.x',
				"@smart-contact/landing-js": "^2.7.x",
				"@smart-contact/validators": "^1.x",
				"vuelidate": "^0.7.x"
			}
			const devDependencies = {
				"@smart-contact/landing-params-webpack-plugin": "^1.x",
				"zip-webpack-plugin": "^4.x"
			}

			if(productsStrategy === "composition"){
				dependencies["@vue/composition-api"] = "latest"
			}

			api.extendPackage({
				dependencies,
				devDependencies
			})
		},

		renderProductsStrategy(strategy){
			switch(strategy){
			case "vuex-module":
				//install vuex if not installed
				//find the store/index.js file and add the products module
				break
			case "composition":
			default: {
				//find App.vue & add from /vue/composables useProducts

				const AppFile = fs.readFileSync(api.resolve("/src/App.vue"), "utf-8")
				const lines = AppFile.split(/\r?\n/)
				const injectLineIndex = findLastIndex(lines, (line) => line.startsWith("import"))
				lines.splice(injectLineIndex, 0, "\timport { useProducts } from \"@smart-contact/smartify/vue/composables\"")
				
				/**
				 * export default {
				 * 	setup(){
				 * 		const { products, buyers, selectedProduct, setSelectedProductIndex } = usePorducts()
				 * 		return { products, buyers, selectedProduct, setSelectedProductIndex }
				 * 	}
				 * }
				 */
				break
			}
			}
		},

		createJSConfig(){
			const filepath = api.resolve("./jsconfig.json")

			const config = {
				"compilerOptions": {
					"baseUrl": ".",
					"paths": {
						"@/*": [
							"src/*"
						]
					}
				}
			}

			fs.writeFileSync(filepath, JSON.stringify(config, null, 2), "utf-8")
		},

		updateStylelintConfig(){
			const filePath = api.resolve("./.stylelintrc.js")
			const config = require(filePath)
      
			if(config.processors){
				const processors = Object.fromEntries(config.processors)

				if("@mapbox/stylelint-processor-arbitrary-tags" in processors){
					processors["@mapbox/stylelint-processor-arbitrary-tags"].fileFilterRegex = ["\.vue$"]
				}


				config.processors = Object.entries(processors)
			}

			if(!config.rules){
				config.rules = {}
			}

			config.rules["max-empty-lines"] = 2
			config.rules["no-missing-end-of-source-newline"] = null
			config.rules["no-empty-source"] = null

			fs.writeFileSync(filePath, "module.exports = " + JSON.stringify(config, null, 2), "utf-8")
		},

		createLandingConfig(config = {name: ""}){
			const filePath = api.resolve("./landing.config.js")
			fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(config, null, 2)}`)
		},

		createLandingParamsJson(){
			const filePath = api.resolve("./landing-params.json")
			const config = {
				account: "prezzogiusto",
				accountLogoMobile: "logo-prezzogiusto-small.svg",
				accountLogo: "logo-prezzogiusto.svg",
				privacy_1: "Richiedendo il servizio confermo di aver letto e accettato i <a href=https://www.prezzogiusto.com/termini-e-condizioni target=blank> Termini e Condizioni del Sito</a> e di aver preso visione dell'<a href=https://www.prezzogiusto.com/privacy/ target=blank> Informativa sul trattamento dei dati personali</a>. Non tutti i consensi sono obbligatori,",
				privacy_2: "Confermo di dare il consenso al trattamento dei miei dati personali per le finalità di marketing di Smart Contact tramite telefonate automatizzate e modalità assimilate, quali e-mail, sms, mms, notifiche push, social media, nonché modalità tradizionali come posta cartacea e telefonate con operatore ai sensi del par. 2.2 (d) dell’Informativa (facoltativo).",
				privacy_3: "Confermo di dare il consenso al trattamento dei miei dati personali per le finalità di profilazione ai sensi del par. 2.2 (e) dell’Informativa (facoltativo).",
				privacy_4: "Confermo di dare il consenso al trattamento dei miei dati personali per la comunicazione a terzi per finalità di marketing tramite telefonate automatizzate e modalità assimilate, quali e-mail, sms, mms, notifiche push, social media, nonché modalità tradizionali come posta cartacea e telefonate con operatore ai sensi del par. 2.2 (f) dell’Informativa. (facoltativo)."
			}

			fs.writeFileSync(filePath, JSON.stringify(config, null, 2))
		},
		cleanProject(){
			const filesToRemove = [
				api.resolve("./public/favicon.ico"),
				api.resolve("./src/components/HelloWorld.vue"),
				api.resolve("./src/assets/logo.png"),
			]

			filesToRemove.forEach(filePath => {
				if(fs.existsSync(filePath)){
					fs.unlinkSync(filePath)
				}
			})
		}
	}
}