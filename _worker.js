让令牌=“”;
导出默认{
	异步获取（请求，环境）{
		const url = 新的 URL(请求.url);
		如果（url.pathname！=='/'）{
			让 githubRawUrl = 'https://raw.githubusercontent.com';
			如果（新的RegExp（githubRawUrl，'i'）。测试（url.pathname））{
				githubRawUrl += url.路径名.split(githubRawUrl)[1];
			} 别的 {
				如果（环境 GH_NAME）{
					githubRawUrl += '/' + env.GH_NAME;
					如果（环境 GH_REPO）{
						githubRawUrl += '/' + env.GH_REPO;
						如果（env.GH_BRANCH）githubRawUrl + ='/'+env.GH_BRANCH;
					}
				}
				githubRawUrl += url.路径名;
			}
			//控制台.log（githubRawUrl）；
			如果（环境.GH_TOKEN && 环境.TOKEN）{
				如果 (env.TOKEN == url.searchParams.get('token')) token = env.GH_TOKEN || token;
				否则 token = url.searchParams.get('token') || token;
			} 其他 token = url.searchParams.get('token') || env.GH_TOKEN || env.TOKEN || 令牌;
			
			const githubToken = 令牌;
			//控制台.log（githubToken）；
			if (!githubToken || githubToken == '') return new Response('TOKEN不能为空', { status: 400 });
			
			// 构建请求头
			const headers = new Headers();
			headers.append('授权', `令牌 ${githubToken}`);

			// 发起请求
			const response = await fetch(githubRawUrl， { headers });

			// 检查请求是否成功 (状态码 200 到 299)
			如果（响应.ok）{
				返回新的 Response（response.body，{
					状态：响应.状态，
					标头：response.headers
				});
			} 别的 {
				const errorText = env.ERROR || '无法获取文件，检查路径或TOKEN是否正确。';
				// 如果请求不成功，返回相应的错误响应
				返回新的Response（errorText，{status：response.status}）；
			}

		} 别的 {
			const envKey = env.URL302 ?'URL302' : (env.URL ?'URL' : null);
			如果（环境密钥）{
				const URLs = await ADD(env[envKey]);
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				返回 envKey === 'URL302' ?Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			//首页改成一个nginx伪装页
			返回新的响应（await nginx（），{
				标题：{
					'内容类型'：'text/html；字符集=UTF-8'，
				}，
			});
		}
	}
};

异步函数 nginx() {
	const 文本 = `
	<!DOCTYPE html>
	<html>
	<头部>
	<title>欢迎使用 nginx！</title>
	<样式>
		身体 {
			宽度：35em；
			边距：0 自动；
			字体系列：Tahoma、Verdana、Arial、sans-serif；
		}
	</style>
	</head>
	<主体>
	<h1>欢迎使用 nginx！</h1>
	<p>如果您看到此页面，则表示 nginx Web 服务器已成功安装，并且
	正在工作。需要进一步配置。</p>
	
	<p>有关在线文档和支持，请参阅
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	商业支持请访问
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>感谢您使用 nginx。</em></p>
	</主体>
	</html>
	`
	返回文本；
}

异步函数 ADD（envadd）{
	var addtext = envadd.replace(/[ |"'\r\n]+/g, ',').replace(/,+/g, ','); // 将空格、双引号、单引号和换行符替换为空格
	//控制台.log（添加文本）；
	如果 (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	如果 (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	const add = addtext.split('，');
	//控制台.log（添加）；
	返回添加；
        }
