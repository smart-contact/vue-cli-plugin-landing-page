const fs = require("fs")

class File {
	constructor(filePath){
		this._splitter = /\r?\n/
		this.filePath = filePath
		this.file = fs.readFileSync(this.filePath, "utf-8")
		this.lines = this.file.split(this._splitter)
	}

	editLines(callback){
		callback(this.lines)
		this.file = this.lines.join("\n")
	}

	save(){
		fs.writeFileSync(this.filePath, this.file, "utf-8")
	}
}

module.exports = function(api){

	return {

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

			fs.writeFileSync(filePath, "module.exports = " + JSON.stringify(config, null, 2), "utf-8")
		},

		createLandingConfig(config = {name: ""}){
			const filePath = api.resolve("./landing.config.js")
			fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(config, null, 2)}`)
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

		injectImports(){
			const mainFile = new File(api.resolve("src/main.js"))

			mainFile.editLines((lines) => {
				//insert after Vue import
				let index = lines.findIndex(line => line.includes("vue"))
				lines.splice(index + 1, 0, "import \"@/plugins/index.js\"")

				//insert after bootstrap-vue import
				index = lines.findIndex(line => line.includes("bootstrap-vue"))
				lines.splice(index + 1, 0, "import \"@/plugins/smartland.js\"", "import \"@/plugins/smartify.js\"")
			})
			
			mainFile.save()
		},

		updateEslintConfig(){
			const file = new File(api.resolve("./.eslintrc.js"))

			file.editLines(lines => {
				if(!lines.find(line => line.includes("requireConfigFile"))){
					const index = lines.findIndex(line => line.includes("@babel/eslint-parser"))
					lines.splice(index + 1, 0, "\t\trequireConfigFile: false,")
				}
				
				//add globals
				let globalsIndex = lines.findIndex(line => line.includes("globals"))

				if(globalsIndex === -1){
					globalsIndex = lines.length - 2
					const globalLines = [
						"\tglobals: {",
						"\t}"
					]

					lines.splice(globalsIndex, 0, ...globalLines)
				}

				const globalVars = [
					"LIVELANDING_CDN_CSS_URL",
					"LIVELANDING_CDN_JS_URL",
					"LIVELANDING_CDN_IMAGES_URL",
					"LIVELANDING_CDN_FILES_URL",
				]
				
				globalVars.forEach((varName, i) => lines.splice((globalsIndex + 1) + i, 0, `\t\t${varName}: true,`))
			})

			file.save()
		},
		
		updateBrowserlist(){
			const file = new File(api.resolve('./.browserslistrc'))
			const queries = [
				'not ie 11'
			]

			file.editLines(lines => {
				queries.forEach(query => {
					if(!lines.includes(queries)){
						lines.splice(lines.length, 0, 'not ie 11')
					}
				})
			})

			file.save()
		}
	}
}