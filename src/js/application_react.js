/**
 * application_react.js - Reactアプリケーションの管理を担当
 */

class ReactApplicationManager {
    constructor() {
        this.reactApps = [];
    }

    // Reactアプリケーションの登録
    registerReactApp(appConfig) {
        this.reactApps.push(appConfig);
    }

    // Reactアプリケーションの起動
    launchReactApp(app, windowId) {
        try {
            const window = windowManager.windows.get(windowId);
            if (!window) return;

            const iframe = window.querySelector('iframe');
            if (!iframe) return;

            // iframeのContent-Typeヘッダーを設定
            iframe.onload = () => {
                try {
                    // iframeのドキュメントにスタイルを適用
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // メタタグでContent-Typeを設定
                    const meta = document.createElement('meta');
                    meta.httpEquiv = 'Content-Type';
                    meta.content = 'text/html; charset=utf-8';
                    iframeDoc.head.appendChild(meta);

                    // スクリプトタグの設定
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.src = app.path;
                    iframeDoc.body.appendChild(script);

                    // CSSの読み込み
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = app.cssPath || `${app.path.replace('.js', '.css')}`;
                    iframeDoc.head.appendChild(link);

                    console.log(`React application ${app.name} loaded successfully`);
                } catch (error) {
                    console.error(`Error setting up React application ${app.name}:`, error);
                    AppNotification.show('エラー', 'アプリケーションの設定に失敗しました。', 'error');
                }
            };

            // 初期HTMLを設定
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <div id="root"></div>
                    </body>
                </html>
            `;

        } catch (error) {
            console.error('React application launch error:', error);
            AppNotification.show('エラー', 'アプリケーションの起動に失敗しました。', 'error');
        }
    }

    // Reactアプリケーションの終了
    closeReactApp(windowId) {
        const window = windowManager.windows.get(windowId);
        if (window) {
            const iframe = window.querySelector('iframe');
            if (iframe) {
                iframe.srcdoc = '';
                iframe.src = 'about:blank';
            }
        }
    }

    // Reactアプリケーションの検索
    findReactApp(appId) {
        return this.reactApps.find(app => app.id === appId);
    }

    // Reactアプリケーションの一覧取得
    getReactApps() {
        return this.reactApps;
    }
}

// グローバルなReactアプリケーションマネージャーのインスタンスを作成
const reactApplicationManager = new ReactApplicationManager();