export const manifest = {
	appDir: "_app",
	assets: new Set(["MissingTexture.svg","favicon.png"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-8321deb5.js","imports":["_app/immutable/start-8321deb5.js","_app/immutable/chunks/index-e0186b66.js","_app/immutable/chunks/index-297b380d.js"],"stylesheets":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js'),
			() => import('./nodes/7.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0],
				leaf: 4
			},
			{
				type: 'page',
				id: "edit",
				pattern: /^\/edit\/?$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0,2],
				leaf: 5
			},
			{
				type: 'page',
				id: "kittens",
				pattern: /^\/kittens\/?$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0],
				leaf: 6
			},
			{
				type: 'page',
				id: "play",
				pattern: /^\/play\/?$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0,3],
				leaf: 7
			},
			{
				type: 'endpoint',
				id: "api/kittens",
				pattern: /^\/api\/kittens\/?$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/api/kittens/_server.js')
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
