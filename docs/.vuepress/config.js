module.exports = {
    base: '/blog/',
    title: '雨碎江南',
    description: 'lmh的前端学习笔记',
    head: [
        ['link', { rel: 'icon', href: '/pen.png' } ],  
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
        ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
        ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    theme: '@vuepress/vue',
    themeConfig: {
        repo: 'lmhcoding/blog',
        editLinks: true,
        docsDir: 'docs',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
            {text: '首页', link: '/'},
            {text: 'Vue2.x', link: '/vue_v2/'}
        ],
        sidebar: {
            '/vue_v2/': [
                {
                    title: 'Vue2.x源码阅读',
                    collapsable: false,
                    children: [
                        ['', '前言'],
                        'directory',
                        'build',
                        'constructor',
                        'new_vue',
                        'mergeOptions',
                        'strats'
                    ]
                }
            ]
        }
    },
    plugins: [
        ['@vuepress/back-to-top', true],
        ['@vuepress/medium-zoom'],
        ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: true
        }]
    ],
    markdown: {
        lineNumbers: true
    }
}