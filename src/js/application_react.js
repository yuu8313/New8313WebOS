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

            // Reactアプリケーションのパスを設定
            iframe.src = app.path;

            // iframeのロードイベントを監視
            iframe.addEventListener('load', () => {
                console.log(`React application ${app.name} loaded successfully`);
            });

            // エラーハンドリング
            iframe.addEventListener('error', (error) => {
                console.error(`Error loading React application ${app.name}:`, error);
                AppNotification.show('エラー', 'アプリケーションの読み込みに失敗しました。', 'error');
            });

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