module.exports = {
    base: '/blog/',
    title: 'lmh的前端记录',
    description: 'lmh的前端学习笔记',
    head: [
        ['link', 
            { rel: 'icon', href: '/pen.png' }
        ],  
    ],
    themeConfig: {
        repo: 'lmhcoding/blog',
        editLinks: true,
        docsDir: 'docs',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
            {text: '首页', link: '/'},
            {text: 'Vue2.x', link: '/vue/v2/prepare/'}
        ],
        sidebar: {
            '/vue/v2/': [
                {
                    title: '准备工作',
                    collapsable: false,
                    children: [
                        ['prepare/', '介绍'],
                        'prepare/directory',
                        'prepare/build',
                        'prepare/constructor'
                    ]
                }
            ]
        }
    },
    plugins: ['vuepress-plugin-table-of-contents']
}