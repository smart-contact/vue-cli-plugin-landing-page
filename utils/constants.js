exports.getLivelandingConstants = (landingConfig) => ({
	LIVELANDING_CDN_CSS_URL: `"${landingConfig.cdnBaseURL}/css"`,
	LIVELANDING_CDN_JS_URL: `"${landingConfig.cdnBaseURL}/js"`,
	LIVELANDING_CDN_IMAGES_URL: `"${landingConfig.cdnBaseURL}/images"`,
	LIVELANDING_CDN_FILES_URL: `"${landingConfig.cdnBaseURL}/file"`,
})