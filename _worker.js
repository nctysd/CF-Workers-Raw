let token = "";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        let githubRawUrl = 'https://raw.githubusercontent.com';

        if (env.GH_NAME && env.GH_REPO) {
            githubRawUrl += `/${env.GH_NAME}/${env.GH_REPO}`;
            githubRawUrl += env.GH_BRANCH ? `/${env.GH_BRANCH}` : '/main';

            // 强制使用 FILENAME，隐藏实际路径
            if (env.FILENAME) {
                githubRawUrl += `/${env.FILENAME}`;
            } else {
                return new Response('环境变量 FILENAME 不能为空', { status: 400 });
            }
        } else {
            return new Response('环境变量 GH_NAME 和 GH_REPO 不能为空', { status: 400 });
        }

        // 处理 TOKEN 认证
        token = request.url.searchParams.get('token') || env.GH_TOKEN || env.TOKEN || "";
        if (!token) return new Response('TOKEN 不能为空', { status: 400 });

        const headers = new Headers();
        headers.append('Authorization', `Token ${token}`);

        // 发送请求到 GitHub Raw
        const response = await fetch(githubRawUrl, { headers });

        if (response.ok) {
            // 确保文件名正确
            const fileName = env.FILENAME;
            const responseHeaders = new Headers(response.headers);
            responseHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`);

            return new Response(response.body, {
                status: response.status,
                headers: responseHeaders
            });
        } else {
            return new Response('无法获取文件，检查 TOKEN 或文件路径是否正确。', { status: response.status });
        }
    }
};
