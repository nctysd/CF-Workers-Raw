export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        let githubRawUrl = 'https://raw.githubusercontent.com';

        if (env.GH_NAME && env.GH_REPO) {
            githubRawUrl += `/${env.GH_NAME}/${env.GH_REPO}`;
            githubRawUrl += env.GH_BRANCH ? `/${env.GH_BRANCH}` : '/main';

            // 如果设置了 FILENAME，则固定下载该文件
            githubRawUrl += env.FILENAME ? `/${env.FILENAME}` : url.pathname;
        } else {
            return new Response('环境变量 GH_NAME 和 GH_REPO 不能为空', { status: 400 });
        }

        // 处理 TOKEN 认证，优先从环境变量获取
        let githubToken = env.GH_TOKEN || env.TOKEN;
        if (!githubToken) return new Response('TOKEN 不能为空', { status: 400 });

        const headers = new Headers();
        headers.append('Authorization', `Token ${githubToken}`);

        // 发送请求到 GitHub Raw
        const response = await fetch(githubRawUrl, { headers });

        if (response.ok) {
            // 设置下载文件名
            const fileName = env.FILENAME || url.pathname.split('/').pop();
            const responseHeaders = new Headers(response.headers);
            responseHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`);

            return new Response(response.body, {
                status: response.status,
                headers: responseHeaders
            });
        } else {
            return new Response('无法获取文件，检查路径或 TOKEN 是否正确。', { status: response.status });
        }
    }
};
