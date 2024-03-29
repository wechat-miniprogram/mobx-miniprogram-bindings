module.exports = {
  appId: 'wx1a116dcfe0c2de16',
  app: 'src/app',
  compileType: 'miniprogram',
  plugins: ["@mpflow/plugin-babel", "@mpflow/plugin-typescript"],
  settings: {
		urlCheck: true,
		es6: false,
		enhance: false,
		postcss: false,
		preloadBackgroundData: false,
		minified: false,
		newFeature: false,
		coverView: true,
		nodeModules: false,
		autoAudits: false,
		showShadowRootInWxmlPanel: true,
		scopeDataCheck: false,
		uglifyFileName: false,
		checkInvalidKey: true,
		checkSiteMap: true,
		uploadWithSourceMap: true,
		compileHotReLoad: false,
		babelSetting: {
			ignore: [],
			disablePlugins: [],
			outputPath: "",
		},
		useIsolateContext: true,
		useCompilerModule: false,
		userConfirmedUseCompilerModuleSwitch: false,
	},
}
