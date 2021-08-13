const fs = require("fs")
module.exports = function(api){
	return {

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

		createStylelintConfig(){
			const filePath = api.resolve("./.stylelintrc.js")
			const config = {
				extends: "stylelint-config-recommended-scss",
				rules: {
					"selector-pseudo-element-no-unknown": [ true, { 
						ignorePseudoElements: ["v-deep"] 
					}],
					"max-empty-lines": 2,
					"no-missing-end-of-source-newline": null,
					"no-empty-source": null,
					"number-leading-zero": null,
				}
			}
      
			// if(config.processors){
			// 	const processors = Object.fromEntries(config.processors)

			// 	if("@mapbox/stylelint-processor-arbitrary-tags" in processors){
			// 		processors["@mapbox/stylelint-processor-arbitrary-tags"].fileFilterRegex = ["\.vue$"]
			// 	}


			// 	config.processors = Object.entries(processors)
			// }

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
		},

		disableFontawesome(){
			const main = fs.readFileSync(api.resolve("src/main.js"), "utf-8")
			const lines = main.split(/\r?\n/)
			const importLineIndex = lines.indexOf("import \"./plugins/fontawesome\";")
			lines[importLineIndex] = "//" + lines[importLineIndex]
			
			fs.writeFileSync(api.resolve("src/main.js"), lines.join("\n"))
		},

	/* 	injectImports(){
			const main = fs.readFileSync(api.resolve(api.entryFile), "utf-8")
			const lines = main.split("/r?/n")
			
			//insert after Vue import
			let index = lines.findIndex(line => line.includes("vue"))
			lines.splice(index, 0, "import \"@/plugins/index.js\"")

			//insert after bootstrap-vue import
			index = lines.findIndex(line => line.includes("bootstrap-vue"))
			lines.splice(index, 0, "import \"@/plugins/smartland.js\"", "import \"@/plugins/smartify.js\"")
			
			fs.writeFileSync(api.entryFile, lines.join("\n"))
		}*/
	} 
}