module.exports = {
	apps: [
		{
			name: "React Typescript GraphQL boilerplate",
			script: "./src/index.ts",
			instances: 2,
			cwd: __dirname,
			autorestart: true,
			max_memory_restart: "1G",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production",
			},
		},
	],
	deploy: {
		production: {
			host: "127.0.0.1",
			user: "deploy",
			ssh_options: ["ForwardAgent=yes"],
			ref: "origin/master",
			repo: "git@github:repo/repo.git",
			path: "/path/to/project",
			"post-deploy":
				"cd /path/to/project && NODE_ENV=production yarn --production=false;yarn build;pm2 startOrReload ecosystem.config.js",
			env: {
				NODE_ENV: "production",
			},
		},

		staging: {
			user: "deploy",
			host: "xx.yy.zz.vv",
			ref: "origin/develop",
			repo: "git@github.com:repo/repo.git",
			path: "/path/to/project",
			ssh_options: ["PasswordAuthentication=no", "StrictHostKeyChecking=no"],
			"post-deploy":
				"cd /path/to/project && yarn --production=false;yarn build;pm2 startOrReload ecosystem.config.js",
			env: {
				NODE_ENV: "production",
			},
		},
	},
};
