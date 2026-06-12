# Unity 逆引き辞典

「○○したい」から実装方法を逆引きできる、専門学校生向けUnityリファレンスサイトです。

## ファイル構成

```
unity-dict/
├── index.html        ← HTMLのみ。構造変更のとき以外は触らない
├── css/
│   └── style.css     ← デザイン。色・フォント・レイアウトの変更はここ
├── js/
│   └── app.js        ← UI ロジック。フィルタ・検索・モーダルの動作
└── data/
    └── entries.js    ← ★ 項目データ。新しい項目はここに追加する
```

## 項目を追加するには

`data/entries.js` を開いて、`ENTRIES` 配列の末尾に新しいオブジェクトを追記します。

```js
{
  id: 14,                          // 既存と重複しない番号
  icon: "🎯",
  title: "○○したい",
  desc:  "カードに表示される短い説明",
  cats:  ["action", "physics"],    // action/physics/ui/input/enemy/audio/scene/data
  genres:["2daction"],             // 2daction/shooting/puzzle/runner
  diff:  2,                        // 1=★☆☆ 2=★★☆ 3=★★★
  components: ["Rigidbody2D"],
  idea:  "実装の考え方を一言で",
  code:  `...`,                    // サンプルコード（スパンでシンタックスハイライト）
  warn:  "ハマりポイントを一言で",
  keywords: [
    {
      name:    "メソッド名()",
      kind:    "method",           // method/event/property/class/lifecycle
      summary: "一行説明",
      desc:    "詳細説明",
      syntax:  "使い方の例",
      note:    "補足（省略可）"
    }
  ],
  related: [1, 2]                  // 関連項目のid
}
```

## ジャンルを追加するには

1. `data/entries.js` の `GENRE_TAGS` オブジェクトに追加
2. `index.html` のサイドバーに `<button class="genre-btn" data-genre="new">新ジャンル</button>` を追加

## ローカルで開く

`index.html` をブラウザで直接開くだけで動作します（サーバー不要）。

## コードのシンタックスハイライト

`code` フィールドには以下のスパンを使って色付けします：

```
<span class="kw">  → キーワード（public, void, if など）    紫
<span class="type">→ 型名（MonoBehaviour, Vector2 など）     黄
<span class="fn">  → メソッド名                             青
<span class="str">  → 文字列リテラル                         緑
<span class="cm">  → コメント                               グレー（斜体）
<span class="num">  → 数値リテラル                           オレンジ
```
