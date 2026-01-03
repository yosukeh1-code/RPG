# RPGアプリの公開方法 (デプロイの手順)

このアプリをインターネット上で誰でも遊べるように公開する手順です。
最も簡単で推奨される **Vercel** を使った方法を紹介します。

## 1. 準備 (GitHubへアップロード)

まず、手元のコードをGitHubのリポジトリにアップロードする必要があります。

1. GitHubで新しいリポジトリを作成します（例: `my-rpg-game`）。
2. ターミナルで以下のコマンドを実行して、GitHubにコードを送信します。

```bash
# gitがまだ初期化されていない場合
git init
git add .
git commit -m "Initial commit"

# リモートリポジトリを登録 (URLは自分のものに変えてください)
git remote add origin https://github.com/あなたのユーザー名/my-rpg-game.git
git branch -M main
git push -u origin main
```

## 2. Vercelで公開

1. [Vercel](https://vercel.com) にアクセスし、アカウントを作成またはログインします。
2. ダッシュボードの **"Add New..."** ボタンから **"Project"** を選択します。
3. 左側の **"Import Git Repository"** から、先ほど作成した GitHub リポジトリ (`my-rpg-game`) の横にある **"Import"** をクリックします。
4. 設定画面が表示されますが、Viteを使っているため自動的に設定が認識されます。設定はいじらず、そのまま **"Deploy"** をクリックします。
5. しばらく待つと、花吹雪のアニメーションと共にデプロイが完了します！
6. 表示されたURL (例: `https://my-rpg-game.vercel.app`) にアクセスすれば、スマホやPCから誰でも遊べるようになります。

## おまけ: GitHub Pagesで公開する場合

もしVercelを使わず、GitHubだけで完結させたい場合は `GitHub Pages` も使えますが、少し設定が必要です。

1. `vite.config.ts` を開き、`base` 設定を追加します。
   ```typescript
   export default defineConfig({
     base: '/my-rpg-game/', // リポジトリ名を入れる
     plugins: [react()],
   })
   ```
2. GitHubリポジトリの Settings > Pages で、公開元を `gh-pages` ブランチなどに設定する必要があります（通常は自動デプロイ設定を組む必要があります）。

手軽さでは **Vercel** が圧倒的におすすめです。
