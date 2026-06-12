// ================================================================
// entries.js  ── 項目データ
// 新しい項目を追加するときはここにオブジェクトを追加してください
//
// 各フィールド:
//   id        : 一意な番号（整数、重複不可）
//   icon      : 絵文字
//   title     : 「○○したい」形式のタイトル
//   desc      : カード上の短い説明文
//   cats      : カテゴリ配列 action/physics/ui/input/enemy/audio/scene/data
//   genres    : ジャンル配列 2daction/shooting/puzzle/runner
//   diff      : 難易度 1=★☆☆ 2=★★☆ 3=★★★
//   components: 使うコンポーネント・クラス名の配列
//   idea      : 「考え方」の一言説明
//   code      : サンプルコード（HTMLスパンでシンタックスハイライト済み）
//   warn      : ハマりポイント
//   keywords  : キーワード解説配列（後述）
//   related   : 関連項目のid配列
//
// keywordsの各フィールド:
//   name    : メソッド名など
//   kind    : method/event/property/class/lifecycle
//   summary : 一行説明
//   desc    : 詳細説明
//   syntax  : 使い方の例
//   note    : 補足・注意（省略可）
// ================================================================


const ENTRIES = [
  {
    id: 1,
    icon: "🔫",
    title: "弾を撃ちたい",
    desc: "ボタンを押したらプレハブを前方に生成・飛ばす基本実装",
    cats: ["action","physics"],
    genres: ["2daction","shooting"],
    diff: 2,
    components: ["Rigidbody2D","Instantiate","Prefab"],
    idea: "弾はPrefabとして用意し、Instantiateで生成後にvelocityで速度を与えるのが基本パターンです。",
    code: `<span class="cm">// BulletShooter.cs</span>
<span class="kw">public class</span> <span class="type">BulletShooter</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> bulletPrefab;
    <span class="kw">public float</span> bulletSpeed = <span class="num">10f</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Space))
        {
            <span class="fn">Shoot</span>();
        }
    }

    <span class="kw">void</span> <span class="fn">Shoot</span>()
    {
        <span class="type">GameObject</span> bullet = <span class="type">Instantiate</span>(
            bulletPrefab,
            transform.position,
            transform.rotation
        );
        <span class="type">Rigidbody2D</span> rb = bullet.<span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
        rb.velocity = transform.right * bulletSpeed;

        <span class="cm">// 3秒後に自動削除</span>
        <span class="type">Destroy</span>(bullet, <span class="num">3f</span>);
    }
}`,
    warn: "弾が増えすぎるとメモリが逼迫します。Destroy()で消すか、Object Poolingを検討しましょう。",
    keywords: [
      { name:"Instantiate()", kind:"method", summary:"オブジェクトをゲーム中に生成する",
        desc:"PrefabやGameObjectのコピーをシーン上に生成します。引数に生成する元のオブジェクト・位置・回転を指定します。Destroy()とセットで使うのが基本です。",
        syntax:"GameObject obj = Instantiate(prefab, position, rotation);",
        note:"生成したオブジェクトはInstantiateの戻り値として受け取れます。" },
      { name:"GetComponent<T>()", kind:"method", summary:"同じオブジェクトのコンポーネントを取得する",
        desc:"自分（または引数のGameObject）にアタッチされているコンポーネントを取得します。取得したコンポーネントの変数やメソッドを操作するために使います。",
        syntax:"Rigidbody2D rb = GetComponent<Rigidbody2D>();",
        note:"対象コンポーネントがない場合はnullが返ります。NullReferenceExceptionに注意。" },
      { name:"Rigidbody2D.velocity", kind:"property", summary:"2Dオブジェクトの速度ベクトルを設定する",
        desc:"Vector2で速度を直接指定します。x成分が左右、y成分が上下の速度です。これに値を入れるだけで物理エンジンがその速さで動かしてくれます。",
        syntax:"rb.velocity = new Vector2(speedX, speedY);",
        note:"毎フレーム代入するとFixedUpdate()内で行うのが適切です。" },
      { name:"Destroy()", kind:"method", summary:"オブジェクトをシーンから削除する",
        desc:"引数のGameObjectをシーンから削除します。第2引数に秒数を指定すると、その時間後に削除されます。弾や敵の消去によく使います。",
        syntax:"Destroy(gameObject, 3f); // 3秒後に削除",
        note:"Destroy()は即座ではなくフレーム末に実行されます。" },
      { name:"Input.GetKeyDown()", kind:"method", summary:"キーが押された瞬間だけtrueを返す",
        desc:"指定したキーがそのフレームで押し始められたときだけtrueを返します。GetKey()は押し続けている間ずっとtrue、GetKeyDown()は押した瞬間の1フレームだけです。",
        syntax:"if (Input.GetKeyDown(KeyCode.Space)) { /* 押した瞬間の処理 */ }",
        note:"連射したい場合はGetKey()を使いましょう。" },
    ],
    related: [2, 5, 9]
  },
  {
    id: 2,
    icon: "🚶",
    title: "プレイヤーを左右に動かしたい",
    desc: "キー入力で左右移動。物理ベースと座標直接移動の2パターン紹介",
    cats: ["action","input"],
    genres: ["2daction","runner"],
    diff: 1,
    components: ["Rigidbody2D","Transform","Input"],
    idea: "物理で動かす(Rigidbody2D.velocity)か、座標を直接変える(Transform.Translate)か、どちらかを選びます。物理コリジョンが必要なら前者がオススメ。",
    code: `<span class="cm">// PlayerMove.cs（物理ベース）</span>
<span class="kw">public class</span> <span class="type">PlayerMove</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed = <span class="num">5f</span>;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
    }

    <span class="kw">void</span> <span class="fn">FixedUpdate</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
        rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(h * speed, rb.velocity.y);
    }
}`,
    warn: "移動処理はFixedUpdate()に書きましょう。Update()に書くとフレームレートによって速さが変わります。",
    keywords: [
      { name:"FixedUpdate()", kind:"lifecycle", summary:"物理演算と同じ一定間隔で呼ばれる",
        desc:"Unityの物理エンジン（PhysX）は一定時間ごとに更新されます。FixedUpdate()はその更新と同じタイミングで呼ばれるため、Rigidbodyへの操作はここに書くのが正解です。Update()は描画フレームに合わせて呼ばれるため、フレームレートが変わると挙動も変わります。",
        syntax:"void FixedUpdate() { /* 物理系の処理をここに */ }",
        note:"デフォルトでは0.02秒（50回/秒）ごとに呼ばれます。" },
      { name:"Input.GetAxis()", kind:"method", summary:"入力を-1〜1の連続値で取得する",
        desc:"キーボードやゲームパッドの入力を-1〜1の浮動小数点数で返します。「Horizontal」はA/Dキーや左右矢印キー、「Vertical」はW/Sキーや上下矢印キーに対応します。GetKeyDown()と違い、徐々に増減するため滑らかな動きになります。",
        syntax:"float h = Input.GetAxis(\"Horizontal\"); // -1(左)〜0〜1(右)",
        note:"即座に1/-1にしたい場合はGetAxisRaw()を使います。" },
      { name:"Update()", kind:"lifecycle", summary:"毎フレーム1回呼ばれるメインループ",
        desc:"ゲームが動いている間、毎フレーム1回呼ばれます。キー入力の検知、UIの更新、タイマーの計算などに使います。物理演算はFixedUpdate()に書くのがルールです。",
        syntax:"void Update() { /* 毎フレームの処理 */ }",
        note:"Start()はシーン開始時に1回だけ呼ばれます。" },
    ],
    related: [3, 4, 6]
  },
  {
    id: 3,
    icon: "⬆️",
    title: "ジャンプさせたい",
    desc: "地面判定つきジャンプ。2段ジャンプ防止の実装例",
    cats: ["action","physics"],
    genres: ["2daction"],
    diff: 2,
    components: ["Rigidbody2D","Collider2D","LayerMask"],
    idea: "地面に接触しているかを判定してからジャンプ力を与えます。isGroundedフラグを使うのが定番パターンです。",
    code: `<span class="cm">// PlayerJump.cs</span>
<span class="kw">public class</span> <span class="type">PlayerJump</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> jumpForce = <span class="num">8f</span>;
    <span class="kw">public</span> <span class="type">LayerMask</span> groundLayer;
    <span class="kw">private bool</span> isGrounded;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>() => rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="cm">// 足元に小さい円で地面チェック</span>
        isGrounded = <span class="type">Physics2D</span>.<span class="fn">OverlapCircle</span>(
            transform.position + <span class="type">Vector3</span>.down * <span class="num">0.5f</span>,
            <span class="num">0.2f</span>, groundLayer
        );

        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Space) && isGrounded)
        {
            rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(rb.velocity.x, jumpForce);
        }
    }
}`,
    warn: "LayerMaskの設定忘れに注意。InspectorでGround判定したいレイヤーを必ず指定してください。",
    keywords: [
      { name:"Physics2D.OverlapCircle()", kind:"method", summary:"指定した円の範囲内にColliderがあるか調べる",
        desc:"指定した中心点と半径の円の中にCollider2Dが存在するかを調べます。地面判定・範囲攻撃・アイテム取得判定など幅広く使えます。LayerMaskを指定すると特定のレイヤーだけを対象にできます。",
        syntax:"bool hit = Physics2D.OverlapCircle(center, radius, layerMask);",
        note:"OverlapCircle以外にもOverlapBox、OverlapCapsuleなど形状違いがあります。" },
      { name:"LayerMask", kind:"class", summary:"レイヤーを指定するためのビットフラグ型",
        desc:"Unityのレイヤーシステムを使って、物理判定や描画の対象を絞り込むための型です。Inspectorでチェックボックスから選択できます。「地面レイヤーだけを当たり判定の対象にする」といった絞り込みに使います。",
        syntax:"public LayerMask groundLayer; // Inspectorで設定",
        note:"Raycast・OverlapCircle・OverlapBoxなどの第3引数に渡します。" },
      { name:"Mathf.Clamp()", kind:"method", summary:"値を指定した範囲に収める",
        desc:"第1引数の値が、指定したmin〜maxの範囲を超えないように制限します。HPが0未満や最大値超えにならないようにするときによく使います。",
        syntax:"float clamped = Mathf.Clamp(value, min, max);",
        note:"Mathf.Clamp01()を使うと0〜1に収めることができます。" },
    ],
    related: [2, 8]
  },
  {
    id: 4,
    icon: "👾",
    title: "敵を踏んで倒したい",
    desc: "マリオ方式。上から乗ったら敵を消してプレイヤーを跳ね返す",
    cats: ["action","physics","enemy"],
    genres: ["2daction"],
    diff: 2,
    components: ["Collider2D","OnCollisionEnter2D","Rigidbody2D"],
    idea: "衝突点のY座標を比較します。プレイヤーが敵より上にいるときの衝突なら「踏んだ」と判定します。",
    code: `<span class="cm">// Enemy.cs（敵側に付ける）</span>
<span class="kw">public class</span> <span class="type">Enemy</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">void</span> <span class="fn">OnCollisionEnter2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="kw">if</span> (!col.gameObject.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;

        <span class="cm">// 衝突点がプレイヤーの足より下なら「踏んだ」</span>
        <span class="kw">float</span> hitY = col.contacts[<span class="num">0</span>].point.y;
        <span class="kw">float</span> playerFoot = col.transform.position.y - <span class="num">0.4f</span>;

        <span class="kw">if</span> (hitY < playerFoot)
        {
            <span class="cm">// プレイヤーを少し跳ね返す</span>
            <span class="type">Rigidbody2D</span> rb = col.<span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
            rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(rb.velocity.x, <span class="num">5f</span>);

            <span class="type">Destroy</span>(gameObject); <span class="cm">// 敵を消す</span>
        }
    }
}`,
    warn: "プレイヤーに「Player」タグを必ず設定してください。Collider2Dは「Is Trigger」をOFFにすること。",
    keywords: [
      { name:"OnCollisionEnter2D()", kind:"event", summary:"2Dコライダーが衝突した瞬間に呼ばれる",
        desc:"Is TriggerがOFFのCollider2D同士がぶつかった瞬間に呼ばれます。引数のCollision2Dから衝突相手のGameObjectや衝突点の座標を取得できます。物理的な衝突（壁・床・敵）の検知に使います。",
        syntax:"void OnCollisionEnter2D(Collision2D col) { }",
        note:"Is TriggerがONの場合はOnTriggerEnter2D()が呼ばれます。用途で使い分けましょう。" },
      { name:"CompareTag()", kind:"method", summary:"GameObjectのタグを文字列で比較する",
        desc:"gameObject.tagと文字列を==で比較するより高速で、タイプミスにも気づきやすいです。「Player」「Enemy」など自分で設定したタグと照合するときに使います。",
        syntax:"if (col.gameObject.CompareTag(\"Player\")) { }",
        note:"タグはInspectorの一番上のTag欄から設定します。" },
      { name:"Collision2D.contacts", kind:"property", summary:"衝突点の詳細情報の配列",
        desc:"衝突が発生した点（ContactPoint2D）の配列です。contacts[0].pointで衝突座標を取得できます。「上から踏んだか横からぶつかったか」を判定するのに使います。",
        syntax:"Vector2 hitPoint = col.contacts[0].point;",
        note:"複数点で衝突している場合はcontacts[1]以降にもデータがあります。" },
    ],
    related: [7, 10]
  },
  {
    id: 5,
    icon: "🚪",
    title: "スイッチを踏んだら扉を開けたい",
    desc: "トリガーエリアに乗ったら他のオブジェクトを動かす連動処理",
    cats: ["action","physics"],
    genres: ["2daction","puzzle"],
    diff: 2,
    components: ["OnTriggerEnter2D","GameObject.Find","Collider2D"],
    idea: "スイッチはIs TriggerのCollider2Dで判定。扉オブジェクトの参照をInspectorで直接つなぐのがシンプルです。",
    code: `<span class="cm">// Switch.cs</span>
<span class="kw">public class</span> <span class="type">Switch</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> door; <span class="cm">// InspectorでDoorをアサイン</span>
    <span class="kw">public</span> <span class="type">Vector3</span> doorOpenPos;

    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
        {
            <span class="fn">OpenDoor</span>();
        }
    }

    <span class="kw">void</span> <span class="fn">OpenDoor</span>()
    {
        <span class="cm">// 扉をスライドで開く</span>
        door.transform.position = doorOpenPos;

        <span class="cm">// またはSetActive(false)で消す場合：</span>
        <span class="cm">// door.SetActive(false);</span>
    }
}`,
    warn: "スイッチのCollider2DはIs TriggerをONに。扉のCollider2DはOFFのままにしてください。",
    keywords: [
      { name:"OnTriggerEnter2D()", kind:"event", summary:"Triggerエリアに入った瞬間に呼ばれる",
        desc:"Is TriggerがONのCollider2Dに他のCollider2Dが入った瞬間に呼ばれます。OnCollisionEnter2Dと違い、物理的な「ぶつかり」は発生せず、すり抜けながら判定だけ取ります。スイッチ・回復アイテム・チェックポイントなどに適しています。",
        syntax:"void OnTriggerEnter2D(Collider2D other) { }",
        note:"OnTriggerStay2Dはエリア内にいる間ずっと、OnTriggerExit2Dは出た瞬間に呼ばれます。" },
      { name:"transform.position", kind:"property", summary:"オブジェクトのワールド座標を取得・設定する",
        desc:"Vector3でオブジェクトのワールド座標を読み書きします。代入するとオブジェクトがその座標にワープします。Rigidbody2Dで動かす場合は直接position変更ではなくvelocityやMovePositionを使う方が物理的に安全です。",
        syntax:"transform.position = new Vector3(x, y, z);",
        note:"親子関係がある場合はtransform.localPositionで親からの相対座標を扱えます。" },
    ],
    related: [11, 2]
  },
  {
    id: 6,
    icon: "📊",
    title: "HPバーを表示したい",
    desc: "Sliderを使ったHPゲージ。ダメージで減らす処理つき",
    cats: ["ui"],
    genres: ["2daction"],
    diff: 2,
    components: ["Slider","UI","Canvas"],
    idea: "UnityのUI Sliderコンポーネントを使うのが最も簡単です。maxValue=最大HP、value=現在HPをセットするだけ。",
    code: `<span class="cm">// PlayerHealth.cs</span>
<span class="kw">using</span> UnityEngine.UI;

<span class="kw">public class</span> <span class="type">PlayerHealth</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public int</span> maxHP = <span class="num">100</span>;
    <span class="kw">public</span> <span class="type">Slider</span> hpSlider;
    <span class="kw">private int</span> currentHP;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        currentHP = maxHP;
        hpSlider.maxValue = maxHP;
        hpSlider.value = currentHP;
    }

    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> damage)
    {
        currentHP -= damage;
        currentHP = <span class="type">Mathf</span>.<span class="fn">Clamp</span>(currentHP, <span class="num">0</span>, maxHP);
        hpSlider.value = currentHP;

        <span class="kw">if</span> (currentHP <= <span class="num">0</span>) <span class="fn">Die</span>();
    }

    <span class="kw">void</span> <span class="fn">Die</span>()
    {
        <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"Game Over"</span>);
        <span class="cm">// シーン遷移などへ</span>
    }
}`,
    warn: "CanvasのRender ModeはScreen Space - Overlayに設定しておくとUI表示が安定します。",
    keywords: [
      { name:"Slider", kind:"class", summary:"0〜最大値の範囲を持つUIコンポーネント",
        desc:"UnityのUIシステムのコンポーネントで、HPゲージやボリュームバーに使います。minValue/maxValueで範囲を決め、valueで現在値をセットするだけでバーが更新されます。",
        syntax:"slider.value = currentHP; // 自動でバーの長さが変わる",
        note:"Sliderのfill色はInspectorのFill Areaの下のFill Imageから変えられます。" },
      { name:"Mathf.Clamp()", kind:"method", summary:"値を指定した範囲に収める",
        desc:"第1引数の値が指定したmin〜maxを超えないよう制限します。HPが0未満や最大値を超えないようにするときの定番です。",
        syntax:"currentHP = Mathf.Clamp(currentHP, 0, maxHP);",
        note:"Mathf.Clamp01()を使うと0〜1に収めることができます。" },
    ],
    related: [12, 13]
  },
  {
    id: 7,
    icon: "🤖",
    title: "敵がプレイヤーを追いかけたい",
    desc: "距離を判定して近づいたら追跡開始するシンプルな敵AI",
    cats: ["enemy","action"],
    genres: ["2daction"],
    diff: 2,
    components: ["Transform","Vector2.MoveTowards","Rigidbody2D"],
    idea: "プレイヤーとの距離がある範囲内に入ったら、プレイヤーの方向に向かって移動させます。",
    code: `<span class="cm">// EnemyChase.cs</span>
<span class="kw">public class</span> <span class="type">EnemyChase</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> player;
    <span class="kw">public float</span> speed = <span class="num">2f</span>;
    <span class="kw">public float</span> detectRange = <span class="num">5f</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> dist = <span class="type">Vector2</span>.<span class="fn">Distance</span>(
            transform.position, player.position
        );

        <span class="kw">if</span> (dist < detectRange)
        {
            <span class="cm">// プレイヤーに向かって移動</span>
            transform.position = <span class="type">Vector2</span>.<span class="fn">MoveTowards</span>(
                transform.position,
                player.position,
                speed * <span class="type">Time</span>.deltaTime
            );
        }
    }
}`,
    warn: "playerにPlayerのTransformをInspectorでアサインすることを忘れずに。",
    keywords: [
      { name:"Vector2.Distance()", kind:"method", summary:"2点間の距離を返す",
        desc:"2つのVector2の距離（長さ）を計算して返します。敵がプレイヤーに近いかどうかの判定や、攻撃範囲チェックなどに使います。",
        syntax:"float dist = Vector2.Distance(posA, posB);",
        note:"距離の比較だけならSqrMagnitudeを使う方が高速です（Distanceは平方根計算が入るため）。" },
      { name:"Vector2.MoveTowards()", kind:"method", summary:"目標位置へ一定速度で近づく",
        desc:"現在位置から目標位置へ、maxDistanceDeltaで指定した最大距離だけ移動した座標を返します。Time.deltaTimeを掛けることでフレームレートに依存しない一定速度の移動ができます。",
        syntax:"transform.position = Vector2.MoveTowards(current, target, speed * Time.deltaTime);",
        note:"目標に到達してもオーバーシュートしません。" },
      { name:"Time.deltaTime", kind:"property", summary:"前フレームからの経過時間（秒）",
        desc:"前フレームから今フレームまでの経過時間を秒で返します。移動量や回転量にこれを掛けることで、どんなフレームレートでも同じ速さになります。",
        syntax:"transform.position += direction * speed * Time.deltaTime;",
        note:"FixedUpdate()内ではTime.fixedDeltaTimeが代わりに使われます。" },
    ],
    related: [4, 8]
  },
  {
    id: 8,
    icon: "🎬",
    title: "ゲームオーバー画面に切り替えたい",
    desc: "HPが0になったらシーンを遷移する基本パターン",
    cats: ["scene"],
    genres: ["2daction","shooting","runner"],
    diff: 1,
    components: ["SceneManager","LoadScene"],
    idea: "SceneManager.LoadSceneでシーン名を指定するだけです。ただしBuild Settingsにシーンを追加しておく必要があります。",
    code: `<span class="cm">// GameOverManager.cs</span>
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">GameOverManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public void</span> <span class="fn">GameOver</span>()
    {
        <span class="cm">// シーン名で遷移</span>
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(<span class="str">"GameOver"</span>);
    }

    <span class="kw">public void</span> <span class="fn">RetryGame</span>()
    {
        <span class="cm">// 現在のシーンをリロード</span>
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(
            <span class="type">SceneManager</span>.GetActiveScene().name
        );
    }
}`,
    warn: "File > Build Settings でシーンリストに追加しないとエラーになります。必ず確認しましょう。",
    keywords: [
      { name:"SceneManager.LoadScene()", kind:"method", summary:"指定したシーンに切り替える",
        desc:"引数にシーン名またはビルドインデックスを指定してシーンを切り替えます。using UnityEngine.SceneManagement;が必要です。同じシーンを再ロードするとオブジェクトがリセットされるのでリトライ処理にも使えます。",
        syntax:"SceneManager.LoadScene(\"StageName\");",
        note:"非同期で読み込む場合はLoadSceneAsync()を使います。大きなシーンの読み込みに便利です。" },
      { name:"SceneManager.GetActiveScene()", kind:"method", summary:"現在のアクティブシーンを取得する",
        desc:"今実行中のシーンのSceneオブジェクトを返します。.nameでシーン名、.buildIndexでビルドインデックスを取得できます。現在のシーンをリロードするリトライ処理によく使います。",
        syntax:"string name = SceneManager.GetActiveScene().name;",
        note:"Build SettingsにシーンをAddしておかないとbuildIndexが-1になります。" },
    ],
    related: [13, 6]
  },
  {
    id: 9,
    icon: "💥",
    title: "爆発エフェクトを出したい",
    desc: "オブジェクト破壊時にパーティクルを生成して自動削除する",
    cats: ["audio","action"],
    genres: ["shooting","2daction"],
    diff: 2,
    components: ["ParticleSystem","Instantiate","Destroy"],
    idea: "爆発用ParticleSystemをPrefabにしておき、Instantiateで生成。再生後に自動で削除されるよう設定します。",
    code: `<span class="cm">// Explosion.cs</span>
<span class="kw">public class</span> <span class="type">Explosion</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> explosionPrefab;

    <span class="kw">void</span> <span class="fn">OnDestroy</span>()
    {
        <span class="kw">if</span> (explosionPrefab != <span class="kw">null</span>)
        {
            <span class="type">GameObject</span> fx = <span class="type">Instantiate</span>(
                explosionPrefab,
                transform.position,
                <span class="type">Quaternion</span>.identity
            );
            <span class="cm">// パーティクル終了後に自動削除</span>
            <span class="type">Destroy</span>(fx, <span class="num">2f</span>);
        }
    }
}`,
    warn: "OnDestroy()はシーン終了時にも呼ばれます。Application.isPlayingで条件分岐すると安全です。",
    keywords: [
      { name:"OnDestroy()", kind:"lifecycle", summary:"オブジェクトが削除される直前に呼ばれる",
        desc:"Destroy()で削除される直前、またはシーンが終了するときに呼ばれます。削除時にエフェクトを出したり、スコアを記録したりするのに使います。",
        syntax:"void OnDestroy() { /* 削除直前の処理 */ }",
        note:"シーン終了時にも呼ばれるため、Application.isPlayingで実行中かチェックすると安全です。" },
      { name:"Quaternion.identity", kind:"property", summary:"回転なし（初期回転）を表す値",
        desc:"回転が全くない状態（X,Y,Z,W = 0,0,0,1）を表します。Instantiateの第3引数などで「回転させずに生成したい」ときに渡します。",
        syntax:"Instantiate(prefab, position, Quaternion.identity);",
        note:"オイラー角から作る場合はQuaternion.Euler(x,y,z)を使います。" },
    ],
    related: [1, 10]
  },
  {
    id: 10,
    icon: "🎵",
    title: "効果音を鳴らしたい",
    desc: "特定のタイミングでSEを再生する基本パターン",
    cats: ["audio"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 1,
    components: ["AudioSource","AudioClip","PlayOneShot"],
    idea: "AudioSourceコンポーネントにAudioClipをアサインして、PlayOneShotで再生します。BGMとSEで別オブジェクトに分けると管理しやすい。",
    code: `<span class="cm">// SoundManager.cs</span>
<span class="kw">public class</span> <span class="type">SoundManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">AudioSource</span> audioSource;
    <span class="kw">public</span> <span class="type">AudioClip</span> jumpSE;
    <span class="kw">public</span> <span class="type">AudioClip</span> coinSE;
    <span class="kw">public</span> <span class="type">AudioClip</span> damageSE;

    <span class="kw">public void</span> <span class="fn">PlayJump</span>()  => audioSource.<span class="fn">PlayOneShot</span>(jumpSE);
    <span class="kw">public void</span> <span class="fn">PlayCoin</span>()  => audioSource.<span class="fn">PlayOneShot</span>(coinSE);
    <span class="kw">public void</span> <span class="fn">PlayDamage</span>()=> audioSource.<span class="fn">PlayOneShot</span>(damageSE);
}`,
    warn: "AudioSource.Play()は重ねて鳴らせません。SE用にはPlayOneShot()を使いましょう。",
    keywords: [
      { name:"AudioSource.PlayOneShot()", kind:"method", summary:"音声を重ねて再生できる",
        desc:"Play()は同じAudioSourceで1音しか鳴らせませんが、PlayOneShot()は同じAudioSourceでも複数の音を重ねて再生できます。ジャンプや攻撃など、連続して鳴る可能性があるSEに適しています。",
        syntax:"audioSource.PlayOneShot(audioClip);",
        note:"第2引数にvolumeScale(0〜1)を指定して音量を調整することもできます。" },
      { name:"AudioClip", kind:"class", summary:"音声データを参照するための型",
        desc:"mp3・wav・oggなどの音声ファイルをUnityにインポートしたときに生成されるアセットの型です。AudioSourceに渡して再生します。",
        syntax:"public AudioClip jumpSE; // InspectorでMP3/WAVをアサイン",
        note:"BGM用の長い音声はCompress設定を、SEは短いのでDecompress On Loadにすると高速です。" },
    ],
    related: [9, 6]
  },
  {
    id: 11,
    icon: "💾",
    title: "スコアを保存したい",
    desc: "PlayerPrefsでハイスコアをローカル保存・読み込みする",
    cats: ["data","ui"],
    genres: ["shooting","runner","2daction"],
    diff: 1,
    components: ["PlayerPrefs"],
    idea: "PlayerPrefsはアプリを閉じても消えない簡易保存機能です。ハイスコアや設定値の保存に使えます。大量データには向きません。",
    code: `<span class="cm">// ScoreManager.cs</span>
<span class="kw">public class</span> <span class="type">ScoreManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private int</span> score = <span class="num">0</span>;
    <span class="kw">private const string</span> KEY_HISCORE = <span class="str">"HighScore"</span>;

    <span class="kw">public void</span> <span class="fn">AddScore</span>(<span class="kw">int</span> point)
    {
        score += point;
    }

    <span class="kw">public void</span> <span class="fn">SaveHighScore</span>()
    {
        <span class="kw">int</span> hi = <span class="type">PlayerPrefs</span>.<span class="fn">GetInt</span>(KEY_HISCORE, <span class="num">0</span>);
        <span class="kw">if</span> (score > hi)
        {
            <span class="type">PlayerPrefs</span>.<span class="fn">SetInt</span>(KEY_HISCORE, score);
            <span class="type">PlayerPrefs</span>.<span class="fn">Save</span>();
        }
    }

    <span class="kw">public int</span> <span class="fn">LoadHighScore</span>()
    {
        <span class="kw">return</span> <span class="type">PlayerPrefs</span>.<span class="fn">GetInt</span>(KEY_HISCORE, <span class="num">0</span>);
    }
}`,
    warn: "PlayerPrefsはセキュリティが低いです。改ざん防止が必要なデータには向きません。",
    keywords: [
      { name:"PlayerPrefs.SetInt()", kind:"method", summary:"整数値をキー名で保存する",
        desc:"文字列のキーに対して整数値を保存します。SetFloat()・SetString()もあります。ゲームを終了しても残ります。Save()を呼ばないとタイミングによっては保存されないことがあります。",
        syntax:"PlayerPrefs.SetInt(\"HighScore\", score); PlayerPrefs.Save();",
        note:"Windowsではレジストリに、macOS/iOSではplistファイルに保存されます。" },
      { name:"PlayerPrefs.GetInt()", kind:"method", summary:"保存した整数値をキー名で読み出す",
        desc:"SetInt()で保存した値をキー名で読み出します。第2引数はデフォルト値で、まだ保存されていない場合に返ります。",
        syntax:"int hi = PlayerPrefs.GetInt(\"HighScore\", 0); // なければ0を返す",
        note:"HasKey()でキーが存在するか事前確認もできます。" },
    ],
    related: [6, 8]
  },
  {
    id: 12,
    icon: "♾️",
    title: "背景を無限スクロールさせたい",
    desc: "ランゲームで使う背景ループ処理",
    cats: ["action"],
    genres: ["runner"],
    diff: 2,
    components: ["Transform","Renderer","MeshRenderer"],
    idea: "背景テクスチャのUVオフセットをずらすか、背景オブジェクト2枚を交互にループさせる方法が一般的です。",
    code: `<span class="cm">// BackgroundScroll.cs（UVスクロール方式）</span>
<span class="kw">public class</span> <span class="type">BackgroundScroll</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> scrollSpeed = <span class="num">0.5f</span>;
    <span class="kw">private</span> <span class="type">Material</span> mat;
    <span class="kw">private float</span> offset;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        mat = <span class="fn">GetComponent</span>&lt;<span class="type">Renderer</span>&gt;().material;
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        offset += <span class="type">Time</span>.deltaTime * scrollSpeed;
        mat.mainTextureOffset = <span class="kw">new</span> <span class="type">Vector2</span>(offset, <span class="num">0</span>);
    }
}`,
    warn: "テクスチャのWrap ModeがRepeatになっていないとループしません。Inspectorで確認しましょう。",
    keywords: [
      { name:"Material.mainTextureOffset", kind:"property", summary:"マテリアルのテクスチャUV座標をずらす",
        desc:"テクスチャのUV座標の開始位置をVector2でずらします。これを毎フレーム更新することでテクスチャが流れるように見えます。テクスチャのWrap ModeをRepeatにすることで無限ループになります。",
        syntax:"material.mainTextureOffset = new Vector2(xOffset, yOffset);",
        note:"GetComponent<Renderer>().materialで取得したマテリアルはインスタンスのコピーです。元マテリアルを変えたい場合はsharedMaterialを使います。" },
      { name:"Renderer", kind:"class", summary:"オブジェクトの描画を担当するコンポーネント",
        desc:"MeshRenderer・SpriteRendererなどの基底クラスです。.materialでマテリアルを取得、.enabledでオブジェクトの表示/非表示を切り替えられます。",
        syntax:"Renderer r = GetComponent<Renderer>(); r.material.color = Color.red;",
        note:"SpriteRendererはUnity 2Dでよく使い、.spriteでスプライトの差し替えができます。" },
    ],
    related: [2, 13]
  },
  {
    id: 13,
    icon: "⏱️",
    title: "カウントダウンタイマーを作りたい",
    desc: "制限時間を表示して0になったらゲームオーバーにする",
    cats: ["ui","scene"],
    genres: ["shooting","runner","puzzle"],
    diff: 1,
    components: ["Time.deltaTime","TextMeshPro","UI"],
    idea: "Time.deltaTimeを引き続けるだけのシンプルな実装です。表示はTextMeshProUGUIに任せましょう。",
    code: `<span class="cm">// CountdownTimer.cs</span>
<span class="kw">using</span> TMPro;

<span class="kw">public class</span> <span class="type">CountdownTimer</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> timeLimit = <span class="num">60f</span>;
    <span class="kw">public</span> <span class="type">TextMeshProUGUI</span> timerText;
    <span class="kw">private float</span> remaining;
    <span class="kw">private bool</span> isRunning = <span class="kw">true</span>;

    <span class="kw">void</span> <span class="fn">Start</span>() => remaining = timeLimit;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (!isRunning) <span class="kw">return</span>;

        remaining -= <span class="type">Time</span>.deltaTime;
        remaining = <span class="type">Mathf</span>.<span class="fn">Max</span>(<span class="num">0</span>, remaining);

        timerText.text = remaining.<span class="fn">ToString</span>(<span class="str">"F1"</span>);

        <span class="kw">if</span> (remaining <= <span class="num">0</span>)
        {
            isRunning = <span class="kw">false</span>;
            <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"Time's Up!"</span>);
        }
    }
}`,
    warn: "TextMeshProを使うにはPackage ManagerからTextMeshProをインストールしてください。",
    keywords: [
      { name:"Time.deltaTime", kind:"property", summary:"前フレームからの経過時間（秒）",
        desc:"前フレームから今フレームまでの経過時間（秒）です。タイマーの減算や移動量の計算に使います。これを使うことでフレームレートが違うPCでも同じ速さで動作します。",
        syntax:"remaining -= Time.deltaTime; // 毎フレーム少しずつ減らす",
        note:"30fpsなら約0.033、60fpsなら約0.017が毎フレームの値になります。" },
      { name:"TextMeshProUGUI", kind:"class", summary:"高品質なUI用テキストコンポーネント",
        desc:"UnityデフォルトのTextより高品質で、日本語や数字も美しく表示できます。.textプロパティに文字列を代入するだけで表示が更新されます。using TMPro;が必要です。",
        syntax:"timerText.text = remaining.ToString(\"F1\"); // 小数1桁表示",
        note:"ToString(\"F0\")で整数、ToString(\"F2\")で小数2桁表示になります。" },
      { name:"Mathf.Max()", kind:"method", summary:"2値のうち大きい方を返す",
        desc:"引数のうち大きい方の値を返します。タイマーが0未満にならないよう下限を設けるのに使います。Mathf.Min()は小さい方を返します。",
        syntax:"remaining = Mathf.Max(0, remaining); // 0未満にしない",
        note:"Mathf.Clamp()は上限・下限の両方を同時に設定できます。" },
    ],
    related: [8, 11]
  },

  // ================================================================
  // 2Dアクション追加項目 (id: 14〜21)
  // ================================================================

  {
    id: 14,
    icon: "↔️",
    title: "キャラを左右反転させたい",
    desc: "移動方向に合わせてスプライトの向きを変える",
    cats: ["action"],
    genres: ["2daction"],
    diff: 1,
    components: ["SpriteRenderer","localScale","Transform"],
    idea: "SpriteRendererのflipXをtrueにするか、TransformのlocalScale.xを-1にする方法があります。flipXがシンプルでオススメ。",
    code: `<span class="cm">// PlayerFlip.cs</span>
<span class="kw">public class</span> <span class="type">PlayerFlip</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private</span> <span class="type">SpriteRenderer</span> sr;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        sr = <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;();
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);

        <span class="kw">if</span> (h > <span class="num">0f</span>) sr.flipX = <span class="kw">false</span>; <span class="cm">// 右向き</span>
        <span class="kw">if</span> (h < <span class="num">0f</span>) sr.flipX = <span class="kw">true</span>;  <span class="cm">// 左向き</span>
    }
}`,
    warn: "localScaleで反転する方法は子オブジェクトやColliderの位置もズレるので、flipXの方が安全です。",
    keywords: [
      { name:"SpriteRenderer.flipX", kind:"property", summary:"スプライトを水平方向に反転する",
        desc:"trueにするとスプライトが左右反転します。キャラの向き変更に使う定番プロパティです。flipYを使うと上下反転もできます。",
        syntax:"spriteRenderer.flipX = true; // 左右反転",
        note:"flipXはあくまで見た目の反転です。当たり判定の向きは変わりません。" },
      { name:"Transform.localScale", kind:"property", summary:"オブジェクトのローカルスケールを設定する",
        desc:"x成分を-1にすると左右反転、y成分を-1にすると上下反転になります。ただし子オブジェクトごとスケールが反転するので、flipXで済む場合はそちらを使いましょう。",
        syntax:"transform.localScale = new Vector3(-1f, 1f, 1f); // 左右反転",
        note:"元のスケールが1以外の場合は符号だけ変えてください：new Vector3(-Mathf.Abs(scale.x), scale.y, scale.z)" },
    ],
    related: [2, 15]
  },

  {
    id: 15,
    icon: "🎭",
    title: "アニメーションを切り替えたい",
    desc: "移動・ジャンプ・待機などの状態でアニメを変える基本パターン",
    cats: ["action"],
    genres: ["2daction"],
    diff: 2,
    components: ["Animator","AnimatorController","SetBool","SetFloat"],
    idea: "AnimatorControllerでステート（状態）を作り、C#からSetBool/SetFloatでパラメータを渡すとアニメが切り替わります。直接ステート名を指定するより、パラメータ経由が保守しやすい。",
    code: `<span class="cm">// PlayerAnimation.cs</span>
<span class="kw">public class</span> <span class="type">PlayerAnimation</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private</span> <span class="type">Animator</span> anim;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        anim = <span class="fn">GetComponent</span>&lt;<span class="type">Animator</span>&gt;();
        rb   = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="cm">// 横移動速度をAnimatorに渡す（0なら待機、非0なら歩き）</span>
        anim.<span class="fn">SetFloat</span>(<span class="str">"Speed"</span>, <span class="type">Mathf</span>.<span class="fn">Abs</span>(rb.velocity.x));

        <span class="cm">// 地面にいないときはジャンプアニメ</span>
        anim.<span class="fn">SetBool</span>(<span class="str">"IsJumping"</span>, rb.velocity.y > <span class="num">0.1f</span>);
        anim.<span class="fn">SetBool</span>(<span class="str">"IsFalling"</span>, rb.velocity.y < <span class="num">-0.1f</span>);
    }
}`,
    warn: "AnimatorControllerのパラメータ名（\"Speed\"など）とコードの文字列が一致していないと動きません。タイポに注意。",
    keywords: [
      { name:"Animator.SetFloat()", kind:"method", summary:"Animatorのfloatパラメータに値を渡す",
        desc:"AnimatorControllerのTransition条件に使うfloat型パラメータを設定します。移動速度など連続値の変化に使います。SetBool・SetInt・SetTriggerもあります。",
        syntax:"animator.SetFloat(\"Speed\", Mathf.Abs(rb.velocity.x));",
        note:"毎フレームUpdate()で更新するのが基本です。" },
      { name:"Animator.SetBool()", kind:"method", summary:"Animatorのboolパラメータに値を渡す",
        desc:"AnimatorControllerのTransition条件に使うbool型パラメータを設定します。「ジャンプ中か」「死亡したか」などOn/Offの状態に使います。",
        syntax:"animator.SetBool(\"IsJumping\", true);",
        note:"SetTrigger()は一瞬だけtrueになるパラメータで、攻撃・ダメージなど1回きりのアクションに適しています。" },
      { name:"Animator", kind:"class", summary:"アニメーションの再生・制御を担うコンポーネント",
        desc:"AnimatorControllerと連携してアニメーションの状態機械を動かします。GetComponent<Animator>()で取得して使います。",
        syntax:"Animator anim = GetComponent<Animator>();",
        note:"AnimatorControllerはProjectウィンドウで右クリック→Create→Animator Controllerで作成します。" },
    ],
    related: [2, 3, 14]
  },

  {
    id: 16,
    icon: "🧱",
    title: "壁ジャンプさせたい",
    desc: "壁に接触中にジャンプを押すと壁を蹴って飛べる実装",
    cats: ["action","physics"],
    genres: ["2daction"],
    diff: 3,
    components: ["Physics2D.OverlapCircle","Rigidbody2D","LayerMask"],
    idea: "地面判定と同様に、左右の壁接触を別々のOverlapCircleで検知します。壁に触れているときにジャンプを押したら、壁の反対方向に飛ばします。",
    code: `<span class="cm">// WallJump.cs</span>
<span class="kw">public class</span> <span class="type">WallJump</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> jumpForce  = <span class="num">8f</span>;
    <span class="kw">public float</span> wallJumpX  = <span class="num">4f</span>;  <span class="cm">// 壁を蹴る横方向の力</span>
    <span class="kw">public</span> <span class="type">LayerMask</span> wallLayer;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>() => rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">bool</span> onWallLeft  = <span class="type">Physics2D</span>.<span class="fn">OverlapCircle</span>(
            transform.position + <span class="type">Vector3</span>.left * <span class="num">0.4f</span>, <span class="num">0.15f</span>, wallLayer);
        <span class="kw">bool</span> onWallRight = <span class="type">Physics2D</span>.<span class="fn">OverlapCircle</span>(
            transform.position + <span class="type">Vector3</span>.right * <span class="num">0.4f</span>, <span class="num">0.15f</span>, wallLayer);

        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Space))
        {
            <span class="kw">if</span> (onWallLeft)   <span class="cm">// 左壁→右方向へ</span>
                rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>( wallJumpX, jumpForce);
            <span class="kw">else if</span> (onWallRight) <span class="cm">// 右壁→左方向へ</span>
                rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(-wallJumpX, jumpForce);
        }
    }
}`,
    warn: "壁と地面を同じレイヤーにすると地面でも壁ジャンプ判定が出てしまいます。WallレイヤーとGroundレイヤーを分けましょう。",
    keywords: [
      { name:"Vector3.left / right", kind:"property", summary:"左右方向の単位ベクトル定数",
        desc:"Vector3.left は (-1,0,0)、Vector3.right は (1,0,0) の定数です。transform.positionに足して「少し左の座標」「少し右の座標」を求めるのに使います。",
        syntax:"Vector3 leftPos = transform.position + Vector3.left * 0.4f;",
        note:"Vector3.up(0,1,0)・Vector3.down(0,-1,0)・Vector3.forward(0,0,1)なども同様に使えます。" },
    ],
    related: [3, 2]
  },

  {
    id: 17,
    icon: "💨",
    title: "ダッシュさせたい",
    desc: "ボタンを押した瞬間に素早く移動、クールタイムで連発防止",
    cats: ["action","input"],
    genres: ["2daction"],
    diff: 2,
    components: ["Rigidbody2D","Coroutine","IEnumerator"],
    idea: "ダッシュ中は通常移動を無効化して大きなvelocityを与えます。コルーチンでダッシュ時間とクールタイムを管理するのがスッキリします。",
    code: `<span class="cm">// PlayerDash.cs</span>
<span class="kw">public class</span> <span class="type">PlayerDash</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> dashSpeed    = <span class="num">15f</span>;
    <span class="kw">public float</span> dashDuration = <span class="num">0.15f</span>; <span class="cm">// ダッシュ持続秒</span>
    <span class="kw">public float</span> dashCooldown = <span class="num">1f</span>;   <span class="cm">// クールタイム秒</span>

    <span class="kw">private bool</span> isDashing  = <span class="kw">false</span>;
    <span class="kw">private bool</span> canDash    = <span class="kw">true</span>;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>() => rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.LeftShift) && canDash)
        {
            <span class="kw">float</span> dir = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
            <span class="kw">if</span> (dir == <span class="num">0</span>) dir = <span class="num">1f</span>; <span class="cm">// 入力なしは右方向</span>
            <span class="fn">StartCoroutine</span>(<span class="fn">DashRoutine</span>(dir));
        }
    }

    <span class="type">IEnumerator</span> <span class="fn">DashRoutine</span>(<span class="kw">float</span> dir)
    {
        isDashing = <span class="kw">true</span>;
        canDash   = <span class="kw">false</span>;
        rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(dir * dashSpeed, <span class="num">0f</span>);
        rb.gravityScale = <span class="num">0f</span>; <span class="cm">// ダッシュ中は重力を切る</span>

        <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(dashDuration);

        rb.gravityScale = <span class="num">1f</span>;
        isDashing = <span class="kw">false</span>;

        <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(dashCooldown);
        canDash = <span class="kw">true</span>;
    }
}`,
    warn: "ダッシュ中に重力を切り忘れると、弧を描いて飛んでしまいます。gravityScaleを0→1に戻すのを忘れずに。",
    keywords: [
      { name:"StartCoroutine()", kind:"method", summary:"コルーチンを開始する",
        desc:"IEnumeratorを返すメソッドをコルーチンとして非同期的に実行します。yield returnで処理を一時停止できるので、「○秒待つ→再開」という時間のある処理を書くときに使います。",
        syntax:"StartCoroutine(DashRoutine(dir));",
        note:"StopCoroutine()で途中停止もできます。" },
      { name:"IEnumerator", kind:"class", summary:"コルーチンの戻り値型",
        desc:"コルーチンとして使えるメソッドの戻り値型です。メソッド内でyield returnを使うことで処理を一時停止させられます。",
        syntax:"IEnumerator MyRoutine() { yield return new WaitForSeconds(1f); }",
        note:"using System.Collections;が必要です（MonoBehaviourを継承していれば自動でusingされています）。" },
      { name:"WaitForSeconds()", kind:"class", summary:"指定秒数だけコルーチンを一時停止する",
        desc:"yield returnと組み合わせて使います。引数に待機秒数を渡すと、その時間が経過するまで処理が止まり、再開します。",
        syntax:"yield return new WaitForSeconds(1.5f); // 1.5秒待つ",
        note:"フレーム単位で待ちたい場合はyield return null（1フレーム待機）を使います。" },
      { name:"Rigidbody2D.gravityScale", kind:"property", summary:"重力の強さを倍率で設定する",
        desc:"0にすると重力が完全に無効になります。1がデフォルト（通常重力）、2にすると2倍の重力が働きます。ダッシュ中や浮遊演出など一時的に重力を変えたいときに使います。",
        syntax:"rb.gravityScale = 0f; // 重力オフ",
        note:"gravityScaleを0にしても既存のvelocity.yは保持されます。念のためvelocity.yも0にするとより確実です。" },
    ],
    related: [2, 3]
  },

  {
    id: 18,
    icon: "🪙",
    title: "アイテムを取得したい",
    desc: "コインや回復アイテムに触れたら取得してスコア加算・HP回復する",
    cats: ["action","physics"],
    genres: ["2daction"],
    diff: 1,
    components: ["OnTriggerEnter2D","Destroy","Tag"],
    idea: "アイテム側にIs TriggerのCollider2Dをつけ、OnTriggerEnter2Dで取得処理を書きます。取得後はDestroyで消します。",
    code: `<span class="cm">// Item.cs（アイテム側に付ける）</span>
<span class="kw">public class</span> <span class="type">Item</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public enum</span> <span class="type">ItemType</span> { Coin, Heal }
    <span class="kw">public</span> <span class="type">ItemType</span> itemType = <span class="type">ItemType</span>.Coin;
    <span class="kw">public int</span> value = <span class="num">10</span>; <span class="cm">// スコア加算量 or 回復量</span>

    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (!other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;

        <span class="kw">if</span> (itemType == <span class="type">ItemType</span>.Coin)
        {
            <span class="cm">// ScoreManagerを探してスコア加算</span>
            <span class="fn">FindObjectOfType</span>&lt;<span class="type">ScoreManager</span>&gt;()?.<span class="fn">AddScore</span>(value);
        }
        <span class="kw">else if</span> (itemType == <span class="type">ItemType</span>.Heal)
        {
            other.<span class="fn">GetComponent</span>&lt;<span class="type">PlayerHealth</span>&gt;()?.<span class="fn">Heal</span>(value);
        }

        <span class="type">Destroy</span>(gameObject);
    }
}`,
    warn: "FindObjectOfType()は毎フレーム呼ぶと重いですが、取得時の1回だけなら問題ありません。",
    keywords: [
      { name:"enum", kind:"class", summary:"名前付き定数の集合を定義する",
        desc:"複数の選択肢を名前で扱えるようにする型です。ItemType.Coin、ItemType.Healのように書けるので、マジックナンバー（0や1）より読みやすくなります。",
        syntax:"public enum ItemType { Coin, Heal, PowerUp }",
        note:"Inspectorにドロップダウンで表示されるので、Unityとの相性も良いです。" },
      { name:"FindObjectOfType<T>()", kind:"method", summary:"シーン上の指定型コンポーネントを検索する",
        desc:"シーン全体を検索して、指定した型のコンポーネントを持つオブジェクトを1つ返します。参照をInspectorで持てない場合の代替手段ですが、毎フレーム呼ぶと負荷が高いです。",
        syntax:"ScoreManager sm = FindObjectOfType<ScoreManager>();",
        note:"Unity6以降はFindFirstObjectByType<T>()という名前に変わっています。" },
    ],
    related: [11, 6, 5]
  },

  {
    id: 19,
    icon: "☠️",
    title: "画面外に落ちたら死にたい",
    desc: "落下してY座標が一定以下になったらプレイヤーをリスポーンまたはゲームオーバーにする",
    cats: ["action","scene"],
    genres: ["2daction"],
    diff: 1,
    components: ["Transform","SceneManager","position"],
    idea: "Update()でY座標を監視するだけのシンプルな実装です。死亡ラインをInspectorで設定できるようにしておくと便利。",
    code: `<span class="cm">// FallDeath.cs</span>
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">FallDeath</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> deathY = <span class="num">-10f</span>; <span class="cm">// この高さより下に落ちたら死亡</span>
    <span class="kw">public</span> <span class="type">Transform</span> respawnPoint; <span class="cm">// リスポーン位置（任意）</span>

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (transform.position.y < deathY)
        {
            <span class="kw">if</span> (respawnPoint != <span class="kw">null</span>)
            {
                <span class="cm">// リスポーンポイントに戻す</span>
                transform.position = respawnPoint.position;
                <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;().velocity = <span class="type">Vector2</span>.zero;
            }
            <span class="kw">else</span>
            {
                <span class="cm">// ゲームオーバーシーンへ</span>
                <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(<span class="str">"GameOver"</span>);
            }
        }
    }
}`,
    warn: "リスポーン時にvelocityをゼロにしないと、落下中の速度を引き継いでしまいます。",
    keywords: [
      { name:"Vector2.zero", kind:"property", summary:"(0,0)のゼロベクトル定数",
        desc:"Vector2(0,0)と同じ意味の定数です。velocityのリセットや初期化に使います。Vector3.zeroも同様です。",
        syntax:"rb.velocity = Vector2.zero; // 速度をリセット",
        note:"Vector2.one は(1,1)、Vector2.up は(0,1)、Vector2.right は(1,0)も同様に使えます。" },
    ],
    related: [8, 3, 2]
  },

  {
    id: 20,
    icon: "🎥",
    title: "カメラをプレイヤーに追従させたい",
    desc: "プレイヤーを常にカメラ中央に映す。Cinemachineを使う方法も紹介",
    cats: ["action"],
    genres: ["2daction","runner"],
    diff: 1,
    components: ["Camera","Transform","Vector3.Lerp","Cinemachine"],
    idea: "シンプルな方法はカメラのpositionをプレイヤーのpositionに合わせるだけ。滑らかに追従させたいならVector3.Lerpか、Cinemachineパッケージが便利です。",
    code: `<span class="cm">// CameraFollow.cs（Cameraオブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">CameraFollow</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> target;      <span class="cm">// Inspectorでプレイヤーをセット</span>
    <span class="kw">public float</span>    smoothing = <span class="num">5f</span>; <span class="cm">// 追従のなめらかさ</span>
    <span class="kw">public</span> <span class="type">Vector3</span>   offset;       <span class="cm">// カメラのオフセット（例：0,1,-10）</span>

    <span class="kw">void</span> <span class="fn">LateUpdate</span>()
    {
        <span class="type">Vector3</span> targetPos = target.position + offset;

        <span class="cm">// Lerpで滑らかに近づく</span>
        transform.position = <span class="type">Vector3</span>.<span class="fn">Lerp</span>(
            transform.position,
            targetPos,
            smoothing * <span class="type">Time</span>.deltaTime
        );
    }
}`,
    warn: "Update()ではなくLateUpdate()に書きましょう。プレイヤーの移動が終わった後にカメラを動かすことでブレが防げます。",
    keywords: [
      { name:"LateUpdate()", kind:"lifecycle", summary:"全Update()が終わった後に呼ばれる",
        desc:"同フレーム内のすべてのUpdate()が終わった後に呼ばれます。カメラ追従など「他のオブジェクトが動いた後」に処理したいものに使います。",
        syntax:"void LateUpdate() { /* カメラ移動など */ }",
        note:"Update → LateUpdate の順番は保証されています。" },
      { name:"Vector3.Lerp()", kind:"method", summary:"2点間を補間した座標を返す",
        desc:"aからbへ、tの割合（0〜1）だけ進んだ点を返します。毎フレームtにTime.deltaTimeを掛けた値を渡すことで、目標位置に向かって徐々に近づく滑らかな動きが作れます。",
        syntax:"transform.position = Vector3.Lerp(current, target, smoothing * Time.deltaTime);",
        note:"tが1を超えてもbでクランプされます。オーバーシュートしません。" },
    ],
    related: [2, 3]
  },

  {
    id: 21,
    icon: "💢",
    title: "ダメージを受けてノックバックさせたい",
    desc: "攻撃を受けた瞬間に吹き飛び、無敵時間で連続ダメージを防ぐ",
    cats: ["action","physics"],
    genres: ["2daction"],
    diff: 2,
    components: ["Rigidbody2D","Coroutine","Physics2D.IgnoreLayerCollision"],
    idea: "ノックバック方向は「敵からプレイヤーへのベクトル」を正規化して求めます。無敵時間はコルーチンで管理し、その間はダメージを受けないようにフラグを立てます。",
    code: `<span class="cm">// PlayerKnockback.cs</span>
<span class="kw">public class</span> <span class="type">PlayerKnockback</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> knockbackForce  = <span class="num">5f</span>;
    <span class="kw">public float</span> invincibleTime  = <span class="num">1.5f</span>; <span class="cm">// 無敵時間（秒）</span>
    <span class="kw">private bool</span> isInvincible    = <span class="kw">false</span>;
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;
    <span class="kw">private</span> <span class="type">SpriteRenderer</span> sr;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
        sr = <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;();
    }

    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="type">Vector2</span> enemyPos)
    {
        <span class="kw">if</span> (isInvincible) <span class="kw">return</span>;

        <span class="cm">// 敵→プレイヤーの方向にノックバック</span>
        <span class="type">Vector2</span> dir = ((Vector2)transform.position - enemyPos).normalized;
        rb.velocity = dir * knockbackForce;

        <span class="fn">StartCoroutine</span>(<span class="fn">InvincibleRoutine</span>());
    }

    <span class="type">IEnumerator</span> <span class="fn">InvincibleRoutine</span>()
    {
        isInvincible = <span class="kw">true</span>;

        <span class="cm">// 点滅させて無敵中を視覚的に表現</span>
        <span class="kw">for</span> (<span class="kw">float</span> t = <span class="num">0</span>; t < invincibleTime; t += <span class="num">0.1f</span>)
        {
            sr.enabled = !sr.enabled;
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(<span class="num">0.1f</span>);
        }

        sr.enabled  = <span class="kw">true</span>;
        isInvincible = <span class="kw">false</span>;
    }
}`,
    warn: "ノックバック後にvelocityが残り続けることがあります。ノックバック終了後にvelocityをリセットしたい場合はコルーチン末尾でvelocity = Vector2.zeroを呼びましょう。",
    keywords: [
      { name:"Vector2.normalized", kind:"property", summary:"ベクトルを長さ1に正規化する",
        desc:"ベクトルの向きだけを保ち、長さを1にしたものを返します。「敵からプレイヤーへの方向だけ」が欲しいときに使います。これに力の大きさ（knockbackForce）を掛けることで、一定の力で吹き飛ばせます。",
        syntax:"Vector2 dir = (playerPos - enemyPos).normalized;",
        note:"ゼロベクトルをnormalizeするとNaNになるので、距離が0のときは注意が必要です。" },
      { name:"SpriteRenderer.enabled", kind:"property", summary:"スプライトの表示・非表示を切り替える",
        desc:"falseにするとスプライトが非表示になります（オブジェクト自体は存在する）。点滅演出はenabledをON/OFFするループで作るのが定番です。",
        syntax:"spriteRenderer.enabled = false; // 非表示",
        note:"GameObject.SetActive(false)とは違い、コンポーネントだけを無効化します。Colliderなどは残ります。" },
    ],
    related: [6, 4, 17]
  },

  // ================================================================
  // シューティング追加項目 (id: 22〜26)
  // ================================================================

  {
    id: 22,
    icon: "🌊",
    title: "敵を一定間隔でスポーンさせたい",
    desc: "InvokeRepeatingやコルーチンで敵をランダム位置に定期生成する",
    cats: ["enemy","action"],
    genres: ["shooting","runner"],
    diff: 2,
    components: ["InvokeRepeating","Instantiate","Random.Range"],
    idea: "InvokeRepeatingで定期的にスポーン関数を呼ぶのが最もシンプルです。出現位置はRandom.Rangeで画面上辺のX座標をランダムにします。",
    code: `<span class="cm">// EnemySpawner.cs</span>
<span class="kw">public class</span> <span class="type">EnemySpawner</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> enemyPrefab;
    <span class="kw">public float</span> spawnInterval = <span class="num">2f</span>;
    <span class="kw">public float</span> spawnY        = <span class="num">6f</span>;  <span class="cm">// 画面上端のY座標</span>
    <span class="kw">public float</span> spawnXMin     = <span class="num">-8f</span>;
    <span class="kw">public float</span> spawnXMax     = <span class="num"> 8f</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="cm">// 2秒後に開始、以降spawnInterval秒ごとに繰り返す</span>
        <span class="fn">InvokeRepeating</span>(<span class="str">"SpawnEnemy"</span>, <span class="num">2f</span>, spawnInterval);
    }

    <span class="kw">void</span> <span class="fn">SpawnEnemy</span>()
    {
        <span class="kw">float</span> x = <span class="type">Random</span>.<span class="fn">Range</span>(spawnXMin, spawnXMax);
        <span class="type">Vector3</span> pos = <span class="kw">new</span> <span class="type">Vector3</span>(x, spawnY, <span class="num">0f</span>);
        <span class="type">Instantiate</span>(enemyPrefab, pos, <span class="type">Quaternion</span>.identity);
    }

    <span class="kw">void</span> <span class="fn">OnDestroy</span>()
    {
        <span class="cm">// スポーナーが消えたときに繰り返しを止める</span>
        <span class="fn">CancelInvoke</span>();
    }
}`,
    warn: "InvokeRepeatingはメソッド名を文字列で指定するためタイポに気づきにくいです。コルーチン版の方がIDEの補完が効いて安全です。",
    keywords: [
      { name:"InvokeRepeating()", kind:"method", summary:"指定メソッドを一定間隔で繰り返し呼ぶ",
        desc:"第1引数にメソッド名（文字列）、第2引数に開始までの秒数、第3引数に繰り返し間隔（秒）を指定します。CancelInvoke()で停止できます。",
        syntax:`InvokeRepeating("SpawnEnemy", 2f, 1.5f); // 2秒後に開始、1.5秒ごと`,
        note:"メソッド名は文字列なのでtypoしてもエラーが出ません。コルーチンで書く方がより安全です。" },
      { name:"Random.Range()", kind:"method", summary:"指定範囲の乱数を返す",
        desc:"float版はmin以上max未満、int版はmin以上max以下の乱数を返します。敵の出現位置・ドロップアイテムの決定など幅広く使います。",
        syntax:`float x = Random.Range(-8f, 8f);  // float: min以上max未満
int   n = Random.Range(0, 5);     // int:   0〜4`,
        note:"intとfloatで上限の扱いが違うので注意。int版はmax-1が上限です。" },
      { name:"CancelInvoke()", kind:"method", summary:"InvokeRepeatingを停止する",
        desc:"引数なしで呼ぶとそのオブジェクトのすべてのInvokeを停止します。特定のメソッドだけ止めたいときはCancelInvoke(\"メソッド名\")と指定します。",
        syntax:"CancelInvoke(); // すべて停止",
        note:"オブジェクトがDestroyされると自動停止しますが、明示的にCancelInvokeを呼ぶ方が安全です。" },
    ],
    related: [1, 23, 9]
  },

  {
    id: 23,
    icon: "🎯",
    title: "敵にプレイヤーへ向かって弾を撃たせたい",
    desc: "敵がプレイヤーの方向を計算して弾を発射する",
    cats: ["enemy","action"],
    genres: ["shooting"],
    diff: 2,
    components: ["Vector2.normalized","Rigidbody2D","Instantiate"],
    idea: "「プレイヤー座標 − 敵座標」でベクトルを求め、normalizeして方向を出します。その方向に弾のvelocityを設定するだけです。",
    code: `<span class="cm">// EnemyShooter.cs</span>
<span class="kw">public class</span> <span class="type">EnemyShooter</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> bulletPrefab;
    <span class="kw">public float</span>    bulletSpeed   = <span class="num">5f</span>;
    <span class="kw">public float</span>    fireInterval  = <span class="num">2f</span>;
    <span class="kw">private</span> <span class="type">Transform</span> player;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        player = <span class="type">GameObject</span>.<span class="fn">FindWithTag</span>(<span class="str">"Player"</span>).transform;
        <span class="fn">InvokeRepeating</span>(<span class="str">"Fire"</span>, <span class="num">1f</span>, fireInterval);
    }

    <span class="kw">void</span> <span class="fn">Fire</span>()
    {
        <span class="cm">// プレイヤーへの方向を計算</span>
        <span class="type">Vector2</span> dir = ((Vector2)player.position
                       - (Vector2)transform.position).normalized;

        <span class="type">GameObject</span> bullet = <span class="type">Instantiate</span>(
            bulletPrefab, transform.position, <span class="type">Quaternion</span>.identity);

        bullet.<span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;().velocity = dir * bulletSpeed;

        <span class="type">Destroy</span>(bullet, <span class="num">4f</span>);
    }
}`,
    warn: "プレイヤーがいない状態でFire()が呼ばれるとNullReferenceExceptionになります。player != nullのチェックを入れましょう。",
    keywords: [
      { name:"GameObject.FindWithTag()", kind:"method", summary:"タグ名でGameObjectを検索する",
        desc:"シーン内から指定タグを持つGameObjectを1つ返します。FindObjectOfType()より高速です。見つからない場合はnullを返します。",
        syntax:`GameObject player = GameObject.FindWithTag("Player");`,
        note:"毎フレーム呼ぶのは避け、Start()で一度だけ呼んでキャッシュしましょう。" },
    ],
    related: [1, 7, 22]
  },

  {
    id: 24,
    icon: "📐",
    title: "自機を画面内に収めたい",
    desc: "移動範囲をClampで制限して画面外に出られないようにする",
    cats: ["action","input"],
    genres: ["shooting"],
    diff: 1,
    components: ["Mathf.Clamp","Camera.main","ViewportToWorldPoint"],
    idea: "Mathf.Clampで座標の上限・下限を設定するのが最もシンプルです。画面サイズに追従させたい場合はCamera.mainのViewportToWorldPointで画面端の座標を動的に取得します。",
    code: `<span class="cm">// PlayerBounds.cs</span>
<span class="kw">public class</span> <span class="type">PlayerBounds</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private float</span> xMin, xMax, yMin, yMax;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="cm">// カメラのビューポート端をワールド座標に変換</span>
        <span class="type">Camera</span> cam = <span class="type">Camera</span>.main;
        <span class="type">Vector3</span> bottomLeft = cam.<span class="fn">ViewportToWorldPoint</span>(
            <span class="kw">new</span> <span class="type">Vector3</span>(<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>));
        <span class="type">Vector3</span> topRight = cam.<span class="fn">ViewportToWorldPoint</span>(
            <span class="kw">new</span> <span class="type">Vector3</span>(<span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>));

        <span class="kw">float</span> pad = <span class="num">0.5f</span>; <span class="cm">// キャラサイズ分の余白</span>
        xMin = bottomLeft.x + pad;
        xMax = topRight.x  - pad;
        yMin = bottomLeft.y + pad;
        yMax = topRight.y  - pad;
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="type">Vector3</span> pos = transform.position;
        pos.x = <span class="type">Mathf</span>.<span class="fn">Clamp</span>(pos.x, xMin, xMax);
        pos.y = <span class="type">Mathf</span>.<span class="fn">Clamp</span>(pos.y, yMin, yMax);
        transform.position = pos;
    }
}`,
    warn: "padの値はキャラのサイズに合わせて調整してください。大きすぎると画面端に近づけなくなります。",
    keywords: [
      { name:"Camera.main", kind:"property", summary:"MainCameraタグを持つカメラを取得する",
        desc:"シーン内で「MainCamera」タグが付いたカメラを返します。毎フレーム呼ぶとやや重いため、Start()でキャッシュするのがベターです。",
        syntax:"Camera cam = Camera.main;",
        note:"複数カメラを使う場合はタグで管理するか、直接Inspectorで参照を渡しましょう。" },
      { name:"Camera.ViewportToWorldPoint()", kind:"method", summary:"ビューポート座標をワールド座標に変換する",
        desc:"ビューポート座標は(0,0)が画面左下、(1,1)が画面右上です。これをワールド座標に変換することで、解像度や画面サイズに依存しない画面端の座標が取得できます。",
        syntax:`Vector3 topRight = cam.ViewportToWorldPoint(new Vector3(1, 1, 0));`,
        note:"第3引数のzはカメラからの距離です。2Dゲームでは通常0を指定します。" },
    ],
    related: [2, 1, 13]
  },

  {
    id: 25,
    icon: "📋",
    title: "敵の出現パターンを波で管理したい",
    desc: "ウェーブごとに敵の種類・数・間隔を変えるウェーブシステム",
    cats: ["enemy","action"],
    genres: ["shooting"],
    diff: 3,
    components: ["Coroutine","List","ScriptableObject"],
    idea: "ウェーブのデータをListやStructで持ち、コルーチンで順番に処理します。ウェーブが終わったら次のウェーブに進む構造です。",
    code: `<span class="cm">// WaveManager.cs</span>
<span class="kw">using</span> System.Collections.Generic;

[<span class="type">System.Serializable</span>]
<span class="kw">public class</span> <span class="type">Wave</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> enemyPrefab;
    <span class="kw">public int</span>   count    = <span class="num">5</span>;   <span class="cm">// 敵の数</span>
    <span class="kw">public float</span> interval = <span class="num">1f</span>;  <span class="cm">// 出現間隔（秒）</span>
}

<span class="kw">public class</span> <span class="type">WaveManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">List</span>&lt;<span class="type">Wave</span>&gt; waves;
    <span class="kw">public</span> <span class="type">Transform</span>[] spawnPoints;
    <span class="kw">private int</span> currentWave = <span class="num">0</span>;

    <span class="kw">void</span> <span class="fn">Start</span>() => <span class="fn">StartCoroutine</span>(<span class="fn">RunWaves</span>());

    <span class="type">IEnumerator</span> <span class="fn">RunWaves</span>()
    {
        <span class="kw">foreach</span> (<span class="type">Wave</span> wave <span class="kw">in</span> waves)
        {
            <span class="kw">yield return</span> <span class="fn">StartCoroutine</span>(<span class="fn">SpawnWave</span>(wave));
            <span class="cm">// 全員倒されるまで待つなら Enemy の数を監視する処理を追加</span>
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(<span class="num">3f</span>); <span class="cm">// ウェーブ間の休憩</span>
            currentWave++;
        }
        <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"All waves cleared!"</span>);
    }

    <span class="type">IEnumerator</span> <span class="fn">SpawnWave</span>(<span class="type">Wave</span> wave)
    {
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < wave.count; i++)
        {
            <span class="type">Transform</span> sp = spawnPoints[
                <span class="type">Random</span>.<span class="fn">Range</span>(<span class="num">0</span>, spawnPoints.Length)];
            <span class="type">Instantiate</span>(wave.enemyPrefab, sp.position, <span class="type">Quaternion</span>.identity);
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(wave.interval);
        }
    }
}`,
    warn: "[System.Serializable]をWaveクラスに付けないとInspectorのListに表示されません。忘れやすいので注意。",
    keywords: [
      { name:"[System.Serializable]", kind:"class", summary:"クラスをInspectorに表示できるようにする属性",
        desc:"独自クラスのフィールドをUnityのInspectorに表示するために必要な属性です。これがないとList<Wave>などのカスタムクラスのリストがInspectorに出てきません。",
        syntax:"[System.Serializable]\npublic class Wave { public int count; }",
        note:"MonoBehaviourを継承していないクラスに付けます。継承していれば不要です。" },
      { name:"List<T>", kind:"class", summary:"可変長の配列コレクション",
        desc:"C#の標準コレクションで、要素を後から追加・削除できる配列です。[System.Serializable]なクラスに使うとInspectorで要素数を自由に変更できます。using System.Collections.Generic;が必要です。",
        syntax:"public List<Wave> waves; // Inspectorで何個でも追加できる",
        note:"配列（Wave[]）との違いは実行中に追加・削除できること。Inspectorでの使い勝手はどちらも同様です。" },
      { name:"foreach", kind:"class", summary:"コレクションの全要素を順番に処理する",
        desc:"ListやArrayの全要素を先頭から末尾まで順番に処理します。インデックス管理が不要でシンプルに書けます。",
        syntax:"foreach (Wave wave in waves) { /* 各ウェーブの処理 */ }",
        note:"foreach中にListの要素を追加・削除するとエラーになります。その場合はfor文を使いましょう。" },
    ],
    related: [22, 23, 8]
  },

  {
    id: 26,
    icon: "👑",
    title: "ボスに体力とフェーズを持たせたい",
    desc: "HPが一定以下になると攻撃パターンが変わるボス実装",
    cats: ["enemy","action"],
    genres: ["shooting","2daction"],
    diff: 3,
    components: ["enum","Coroutine","Mathf.Clamp"],
    idea: "ボスの状態をenumで管理し、HPが閾値を下回ったらフェーズを切り替えます。各フェーズの行動はコルーチンで実装すると管理しやすいです。",
    code: `<span class="cm">// BossController.cs</span>
<span class="kw">public class</span> <span class="type">BossController</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public enum</span> <span class="type">Phase</span> { Phase1, Phase2, Phase3 }
    <span class="kw">public</span> <span class="type">Phase</span> currentPhase = <span class="type">Phase</span>.Phase1;

    <span class="kw">public int</span> maxHP    = <span class="num">300</span>;
    <span class="kw">private int</span> currentHP;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        currentHP = maxHP;
        <span class="fn">StartCoroutine</span>(<span class="fn">BossRoutine</span>());
    }

    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> dmg)
    {
        currentHP = <span class="type">Mathf</span>.<span class="fn">Clamp</span>(currentHP - dmg, <span class="num">0</span>, maxHP);

        <span class="cm">// HPに応じてフェーズを切り替え</span>
        <span class="kw">if</span>      (currentHP < maxHP * <span class="num">0.3f</span>) currentPhase = <span class="type">Phase</span>.Phase3;
        <span class="kw">else if</span> (currentHP < maxHP * <span class="num">0.6f</span>) currentPhase = <span class="type">Phase</span>.Phase2;

        <span class="kw">if</span> (currentHP <= <span class="num">0</span>) <span class="fn">Die</span>();
    }

    <span class="type">IEnumerator</span> <span class="fn">BossRoutine</span>()
    {
        <span class="kw">while</span> (<span class="kw">true</span>)
        {
            <span class="kw">switch</span> (currentPhase)
            {
                <span class="kw">case</span> <span class="type">Phase</span>.Phase1:
                    <span class="kw">yield return</span> <span class="fn">StartCoroutine</span>(<span class="fn">AttackPattern1</span>());
                    <span class="kw">break</span>;
                <span class="kw">case</span> <span class="type">Phase</span>.Phase2:
                    <span class="kw">yield return</span> <span class="fn">StartCoroutine</span>(<span class="fn">AttackPattern2</span>());
                    <span class="kw">break</span>;
                <span class="kw">case</span> <span class="type">Phase</span>.Phase3:
                    <span class="kw">yield return</span> <span class="fn">StartCoroutine</span>(<span class="fn">AttackPattern3</span>());
                    <span class="kw">break</span>;
            }
        }
    }

    <span class="type">IEnumerator</span> <span class="fn">AttackPattern1</span>()
    {
        <span class="cm">// フェーズ1: ゆっくり正面に弾を撃つ</span>
        <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(<span class="num">2f</span>);
    }
    <span class="type">IEnumerator</span> <span class="fn">AttackPattern2</span>() { <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(<span class="num">1f</span>); }
    <span class="type">IEnumerator</span> <span class="fn">AttackPattern3</span>() { <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(<span class="num">0.5f</span>); }

    <span class="kw">void</span> <span class="fn">Die</span>() { <span class="type">Destroy</span>(gameObject); }
}`,
    warn: "while(true)のコルーチンはオブジェクトがDestroyされると自動停止します。ただし明示的にStopAllCoroutines()を呼ぶ方が安全です。",
    keywords: [
      { name:"switch", kind:"class", summary:"複数の条件分岐をスッキリ書く",
        desc:"if-else ifの連続よりも、複数の選択肢から1つを選ぶ処理をスッキリ書けます。enumと組み合わせると状態ごとの処理が読みやすくなります。",
        syntax:"switch (phase) { case Phase.Phase1: /* 処理 */; break; }",
        note:"caseにbreakを書き忘れると次のcaseに処理が流れるfall-throughが起きます（C#では通常エラー）。" },
      { name:"while(true)", kind:"class", summary:"無限ループでボスの行動を繰り返す",
        desc:"コルーチン内でwhile(true)を使うと、yield returnで処理を一時停止しながら無限に繰り返せます。ボスの攻撃ループやゲームのメインループに使います。",
        syntax:"while (true) { yield return StartCoroutine(Attack()); }",
        note:"コルーチン外でwhile(true)を使うと完全にフリーズします。必ずコルーチン内で使いましょう。" },
    ],
    related: [23, 6, 22]
  },

  // ================================================================
  // パズル・ギミック追加項目 (id: 27〜31)
  // ================================================================

  {
    id: 27,
    icon: "📦",
    title: "ブロックを押して動かしたい",
    desc: "プレイヤーが押すとブロックがスライドする倉庫番式ギミック",
    cats: ["physics","action"],
    genres: ["puzzle"],
    diff: 2,
    components: ["Rigidbody2D","OnCollisionStay2D","RigidbodyConstraints2D"],
    idea: "ブロック側のRigidbody2DにFreezeRotationをかけ、プレイヤーが押すと物理で自然にスライドします。Y軸移動も固定して横移動だけ許可するのがポイントです。",
    code: `<span class="cm">// PushBlock.cs（ブロック側に付ける）</span>
<span class="kw">public class</span> <span class="type">PushBlock</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private</span> <span class="type">Rigidbody2D</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody2D</span>&gt;();
        <span class="cm">// 回転を固定して横移動だけ許可</span>
        rb.constraints = <span class="type">RigidbodyConstraints2D</span>.FreezeRotation
                       | <span class="type">RigidbodyConstraints2D</span>.FreezePositionY;
    }

    <span class="kw">void</span> <span class="fn">OnCollisionStay2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="kw">if</span> (!col.gameObject.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;

        <span class="kw">float</span> pushDir = col.transform.position.x < transform.position.x
                        ? <span class="num">1f</span> : <span class="num">-1f</span>;
        rb.velocity = <span class="kw">new</span> <span class="type">Vector2</span>(pushDir * <span class="num">2f</span>, <span class="num">0f</span>);
    }

    <span class="kw">void</span> <span class="fn">OnCollisionExit2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="cm">// 押すのをやめたら停止</span>
        rb.velocity = <span class="type">Vector2</span>.zero;
    }
}`,
    warn: "Y軸の移動を固定しないとブロックが浮き上がることがあります。FreezePositionYを忘れずに設定しましょう。",
    keywords: [
      { name:"RigidbodyConstraints2D", kind:"class", summary:"Rigidbody2Dの移動・回転を軸ごとに固定する",
        desc:"特定の軸の移動や回転を無効化します。FreezeRotationで回転を止め、FreezePositionX/Yで各軸の移動を固定できます。複数指定するには|(ビットOR)で繋ぎます。",
        syntax:"rb.constraints = RigidbodyConstraints2D.FreezeRotation | RigidbodyConstraints2D.FreezePositionY;",
        note:"InspectorのConstraintsチェックボックスと同じ設定をコードから行えます。" },
      { name:"OnCollisionStay2D()", kind:"event", summary:"衝突し続けている間、毎フレーム呼ばれる",
        desc:"Enter（衝突開始）・Stay（接触中）・Exit（離れた瞬間）の3種類があります。押し続けている間の処理にはStayを使います。",
        syntax:"void OnCollisionStay2D(Collision2D col) { }",
        note:"処理が重い場合はフラグで間引くと良いです。" },
      { name:"OnCollisionExit2D()", kind:"event", summary:"衝突が終わった瞬間に呼ばれる",
        desc:"Colliderが離れた瞬間に1回だけ呼ばれます。押すのをやめたら止まる、触れていた間のエフェクトを消すなどに使います。",
        syntax:"void OnCollisionExit2D(Collision2D col) { }",
        note:"OnTriggerExit2D()はIs Triggerがオンのコライダーが離れたときに呼ばれる対応版です。" },
    ],
    related: [5, 29, 2]
  },

  {
    id: 28,
    icon: "🏃",
    title: "乗ると動く足場を作りたい",
    desc: "往復運動する足場。プレイヤーが乗ったら一緒に運ばれる",
    cats: ["action","physics"],
    genres: ["puzzle","2daction"],
    diff: 2,
    components: ["Vector3.Lerp","Transform.SetParent","Mathf.Clamp01"],
    idea: "足場自体はLerpで往復移動させます。プレイヤーが乗ったら足場の子オブジェクトにすることで一緒に動き、離れたらSetParent(null)で切り離します。",
    code: `<span class="cm">// MovingPlatform.cs（足場に付ける）</span>
<span class="kw">public class</span> <span class="type">MovingPlatform</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> pointA;
    <span class="kw">public</span> <span class="type">Transform</span> pointB;
    <span class="kw">public float</span>    speed = <span class="num">2f</span>;
    <span class="kw">private float</span>   t = <span class="num">0f</span>;
    <span class="kw">private bool</span>    forward = <span class="kw">true</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        t += <span class="type">Time</span>.deltaTime * speed * (forward ? <span class="num">1f</span> : <span class="num">-1f</span>);
        t  = <span class="type">Mathf</span>.<span class="fn">Clamp01</span>(t);
        transform.position = <span class="type">Vector3</span>.<span class="fn">Lerp</span>(pointA.position, pointB.position, t);

        <span class="kw">if</span> (t >= <span class="num">1f</span> || t <= <span class="num">0f</span>) forward = !forward;
    }

    <span class="kw">void</span> <span class="fn">OnCollisionEnter2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="kw">if</span> (col.gameObject.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
            col.transform.<span class="fn">SetParent</span>(transform);
    }

    <span class="kw">void</span> <span class="fn">OnCollisionExit2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="kw">if</span> (col.gameObject.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
            col.transform.<span class="fn">SetParent</span>(<span class="kw">null</span>);
    }
}`,
    warn: "SetParent(null)を忘れると足場を降りた後もプレイヤーが足場の座標系に縛られて動きがおかしくなります。",
    keywords: [
      { name:"Transform.SetParent()", kind:"method", summary:"オブジェクトの親子関係を動的に変更する",
        desc:"引数のTransformを親として設定します。nullを渡すと親子関係を解除してルートオブジェクトになります。親が動くと子も一緒に動くUnityの仕組みを利用した足場実装の定番テクニックです。",
        syntax:"col.transform.SetParent(this.transform); // 子にする\ncol.transform.SetParent(null);           // 独立させる",
        note:"SetParent(parent, worldPositionStays: true)にするとワールド座標を維持できます。" },
      { name:"Mathf.Clamp01()", kind:"method", summary:"値を0〜1の範囲に収める",
        desc:"Mathf.Clamp(value, 0f, 1f)と同じですが短く書けます。Lerp補間のt値が範囲を超えないよう制限するのに使います。",
        syntax:"t = Mathf.Clamp01(t);",
        note:"Lerpのt引数は0〜1を超えても動作しますが、安全のためClamp01で制限しましょう。" },
    ],
    related: [3, 5, 27]
  },

  {
    id: 29,
    icon: "🗝️",
    title: "鍵を取ったら扉を開けたい",
    desc: "アイテム取得を条件にした連動ギミック。staticフラグで状態管理",
    cats: ["action","scene"],
    genres: ["puzzle","2daction"],
    diff: 2,
    components: ["static","bool","OnTriggerEnter2D","SetActive"],
    idea: "鍵を持っているかをstaticなboolフラグで管理します。鍵取得時にtrueにし、扉側でフラグを確認して開く方法がシンプルです。",
    code: `<span class="cm">// GameState.cs（状態管理専用クラス）</span>
<span class="kw">public static class</span> <span class="type">GameState</span>
{
    <span class="kw">public static bool</span> hasKey = <span class="kw">false</span>;
}

<span class="cm">// Key.cs（鍵オブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">Key</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (!other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;
        <span class="type">GameState</span>.hasKey = <span class="kw">true</span>;
        <span class="type">Destroy</span>(gameObject);
    }
}

<span class="cm">// Door.cs（扉オブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">Door</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (!other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;

        <span class="kw">if</span> (<span class="type">GameState</span>.hasKey)
        {
            <span class="type">GameState</span>.hasKey = <span class="kw">false</span>;
            gameObject.<span class="fn">SetActive</span>(<span class="kw">false</span>);
        }
        <span class="kw">else</span>
        {
            <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"鍵がありません"</span>);
        }
    }
}`,
    warn: "staticフラグはシーンをまたいでもリセットされません。シーンロード時にhasKey = falseでリセットする処理を忘れずに。",
    keywords: [
      { name:"static", kind:"class", summary:"インスタンスなしでアクセスできるメンバーを定義する",
        desc:"staticなフィールドやメソッドは、クラス名.変数名で直接アクセスできます。GetComponent()なしにどこからでも参照できるグローバル変数的な使い方ができます。",
        syntax:"GameState.hasKey = true; // どのスクリプトからでもアクセス可",
        note:"使いすぎるとどこで変更されたか追いにくくなるので、シンプルなフラグ管理に限定するのが無難です。" },
      { name:"GameObject.SetActive()", kind:"method", summary:"GameObjectの有効・無効を切り替える",
        desc:"falseにするとオブジェクトが非表示になりUpdate()も止まります。Destroy()と違い、SetActive(true)で復活させられます。",
        syntax:"gameObject.SetActive(false); // 非表示＋停止\ngameObject.SetActive(true);  // 再表示＋再開",
        note:"親をSetActive(false)にすると子オブジェクトも連動して無効になります。" },
    ],
    related: [5, 30, 18]
  },

  {
    id: 30,
    icon: "🔀",
    title: "複数スイッチを全部踏んだら扉を開けたい",
    desc: "押されたスイッチ数をカウントして全部ONで扉が開く連動ギミック",
    cats: ["action","physics"],
    genres: ["puzzle"],
    diff: 3,
    components: ["UnityEvent","シングルトン","Awake"],
    idea: "スイッチがONになるたびにカウンターを増やし、総数と一致したら扉を開きます。UnityEventを使うと開く処理をInspectorから差し替えられます。",
    code: `<span class="cm">// SwitchManager.cs（空のGameObjectに付ける）</span>
<span class="kw">using</span> UnityEngine.Events;

<span class="kw">public class</span> <span class="type">SwitchManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public int</span>        totalSwitches = <span class="num">3</span>;
    <span class="kw">public</span> <span class="type">UnityEvent</span> onAllSwitchesOn;
    <span class="kw">private int</span>       activatedCount = <span class="num">0</span>;

    <span class="kw">public static</span> <span class="type">SwitchManager</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>() => Instance = <span class="kw">this</span>;

    <span class="kw">public void</span> <span class="fn">SwitchActivated</span>()
    {
        activatedCount++;
        <span class="kw">if</span> (activatedCount >= totalSwitches)
            onAllSwitchesOn.<span class="fn">Invoke</span>();
    }
}

<span class="cm">// PuzzleSwitch.cs（各スイッチに付ける）</span>
<span class="kw">public class</span> <span class="type">PuzzleSwitch</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private bool</span> isActivated = <span class="kw">false</span>;

    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (isActivated || !other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;

        isActivated = <span class="kw">true</span>;
        <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;().color = <span class="type">Color</span>.green;
        <span class="type">SwitchManager</span>.Instance.<span class="fn">SwitchActivated</span>();
    }
}`,
    warn: "totalSwitchesとシーン上のスイッチ数が一致しないと永遠に開きません。スイッチを増減したら数値も合わせてください。",
    keywords: [
      { name:"UnityEvent", kind:"class", summary:"Inspectorから呼び出す関数を設定できるイベント",
        desc:"using UnityEngine.Events;が必要です。publicで宣言するとInspectorにドロップダウンが表示され、呼び出す関数をGUIで設定できます。Invoke()で発火します。コードを変えずにInspectorから動作を差し替えられるのが強みです。",
        syntax:"public UnityEvent onAllSwitchesOn;\nonAllSwitchesOn.Invoke();",
        note:"引数ありのバージョンはUnityEvent<T>（例：UnityEvent<int>）で使えます。" },
      { name:"Awake()", kind:"lifecycle", summary:"Start()より前に呼ばれる初期化メソッド",
        desc:"Start()よりも早いタイミングで呼ばれます。シングルトンのInstance設定など、他のオブジェクトのStart()より先に済ませたい初期化処理に使います。",
        syntax:"void Awake() { Instance = this; }",
        note:"Awake → OnEnable → Start の順で呼ばれます。" },
      { name:"シングルトンパターン", kind:"class", summary:"クラスのインスタンスを1つだけ保証する設計",
        desc:"public static T Instanceとして自分自身を登録することで、どこからでもClassName.Instanceでアクセスできます。GameManager・ScoreManager・SoundManagerなど1つしか存在しない管理クラスに使います。",
        syntax:"public static SwitchManager Instance;\nvoid Awake() { Instance = this; }",
        note:"乱用するとコードの依存関係が複雑になります。管理クラスに限定して使いましょう。" },
    ],
    related: [5, 29, 27]
  },

  {
    id: 31,
    icon: "⏰",
    title: "一定時間で元に戻るギミックを作りたい",
    desc: "スイッチを踏むと足場が出現し、数秒後に消えるタイムギミック",
    cats: ["action","scene"],
    genres: ["puzzle","2daction"],
    diff: 2,
    components: ["Coroutine","SetActive","WaitForSeconds"],
    idea: "コルーチンで「出現→待機→消える」の流れを書きます。SetActive(true/false)で表示切り替えするのが最もシンプルです。",
    code: `<span class="cm">// TimedGimmick.cs（自動で点滅するタイプ）</span>
<span class="kw">public class</span> <span class="type">TimedGimmick</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> activeDuration  = <span class="num">3f</span>;
    <span class="kw">public float</span> cooldownDuration = <span class="num">2f</span>;

    <span class="kw">void</span> <span class="fn">Start</span>() => <span class="fn">StartCoroutine</span>(<span class="fn">CycleRoutine</span>());

    <span class="type">IEnumerator</span> <span class="fn">CycleRoutine</span>()
    {
        <span class="kw">while</span> (<span class="kw">true</span>)
        {
            gameObject.<span class="fn">SetActive</span>(<span class="kw">true</span>);
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(activeDuration);
            gameObject.<span class="fn">SetActive</span>(<span class="kw">false</span>);
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(cooldownDuration);
        }
    }
}

<span class="cm">// TriggerGimmick.cs（スイッチで起動するタイプ）</span>
<span class="kw">public class</span> <span class="type">TriggerGimmick</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> target;
    <span class="kw">public float</span>      duration = <span class="num">3f</span>;

    <span class="kw">void</span> <span class="fn">OnTriggerEnter2D</span>(<span class="type">Collider2D</span> other)
    {
        <span class="kw">if</span> (!other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="kw">return</span>;
        <span class="fn">StartCoroutine</span>(<span class="fn">ActivateTemporarily</span>());
    }

    <span class="type">IEnumerator</span> <span class="fn">ActivateTemporarily</span>()
    {
        target.<span class="fn">SetActive</span>(<span class="kw">true</span>);
        <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(duration);
        target.<span class="fn">SetActive</span>(<span class="kw">false</span>);
    }
}`,
    warn: "SetActive(false)されたオブジェクトのコルーチンは停止します。CycleRoutineは常駐オブジェクトに付けるか、OnEnableで再起動する設計にしましょう。",
    keywords: [
      { name:"OnEnable()", kind:"lifecycle", summary:"オブジェクトが有効になるたびに呼ばれる",
        desc:"SetActive(true)やコンポーネントのenabled = trueになるたびに呼ばれます。SetActive(false)でコルーチンが止まっても、OnEnable()でStartCoroutine()すれば再起動できます。",
        syntax:"void OnEnable() { StartCoroutine(CycleRoutine()); }",
        note:"対応するOnDisable()はSetActive(false)時に呼ばれます。" },
    ],
    related: [5, 28, 29]
  }
];


const GENRE_TAGS = {
  "2daction":  { label:"2Dアクション", ids:[1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20,21,26,28,29,31] },
  "shooting":  { label:"シューティング", ids:[1,9,10,11,13,22,23,24,25,26] },
  "puzzle":    { label:"パズル", ids:[5,10,13,27,28,29,30,31] },
  "runner":    { label:"ランゲーム", ids:[2,10,11,12,13,20,22] }
};
