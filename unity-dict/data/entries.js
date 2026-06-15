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
  },

  // ================================================================
  // UI・HUD追加項目 (id: 32〜38)
  // ================================================================

  {
    id: 32,
    icon: "🔢",
    title: "スコアをリアルタイム表示したい",
    desc: "加算されるたびにTextMeshProのスコア表示を更新する",
    cats: ["ui","data"],
    genres: ["2daction","shooting","runner","puzzle"],
    diff: 1,
    components: ["TextMeshProUGUI","static","シングルトン"],
    idea: "ScoreManagerをシングルトンにしてどこからでもAddScore()を呼べるようにし、加算のたびにTextを更新します。表示の更新はスコアを変えた瞬間だけ行うのがポイントです。",
    code: `<span class="cm">// ScoreUI.cs（CanvasのTextオブジェクトに付ける）</span>
<span class="kw">using</span> TMPro;

<span class="kw">public class</span> <span class="type">ScoreUI</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">TextMeshProUGUI</span> scoreText;
    <span class="kw">private int</span> score = <span class="num">0</span>;

    <span class="kw">public static</span> <span class="type">ScoreUI</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>() => Instance = <span class="kw">this</span>;

    <span class="kw">void</span> <span class="fn">Start</span>() => <span class="fn">UpdateDisplay</span>();

    <span class="kw">public void</span> <span class="fn">AddScore</span>(<span class="kw">int</span> point)
    {
        score += point;
        <span class="fn">UpdateDisplay</span>();
    }

    <span class="kw">void</span> <span class="fn">UpdateDisplay</span>()
    {
        <span class="cm">// D6で6桁ゼロ埋め表示（例: 000100）</span>
        scoreText.text = <span class="str">"SCORE: "</span> + score.<span class="fn">ToString</span>(<span class="str">"D6"</span>);
    }
}

<span class="cm">// 敵や硬貨など、スコア加算側からはこう呼ぶ</span>
<span class="cm">// ScoreUI.Instance.AddScore(100);</span>`,
    warn: "TextMeshProUGUIを使うにはPackage ManagerでText Mesh Proをインストールし、using TMPro;が必要です。",
    keywords: [
      { name:"ToString(\"D6\")", kind:"method", summary:"数値を書式指定して文字列に変換する",
        desc:"書式指定文字列で数値の見た目を制御します。\"D6\"は6桁のゼロ埋め整数、\"F1\"は小数1桁、\"N0\"はカンマ区切り整数などがよく使われます。",
        syntax:`score.ToString("D6");  // → "000100"
score.ToString("N0");  // → "1,000"
time.ToString("F1");   // → "12.3"`,
        note:"string.Format()や$\"{score:D6}\"（文字列補間）でも同じ書式が使えます。" },
    ],
    related: [11, 13, 33]
  },

  {
    id: 33,
    icon: "🎉",
    title: "ゲームクリア画面を作りたい",
    desc: "条件達成時にクリアUIを表示してリザルトを見せる",
    cats: ["ui","scene"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 1,
    components: ["SetActive","TextMeshProUGUI","Time.timeScale"],
    idea: "クリアパネル（CanvasのPanel）を最初はSetActive(false)にしておき、クリア条件を満たしたらSetActive(true)にします。同時にTime.timeScaleを0にするとゲームを止められます。",
    code: `<span class="cm">// GameClearManager.cs</span>
<span class="kw">using</span> TMPro;
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">GameClearManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span>        clearPanel;   <span class="cm">// クリアUIのPanel</span>
    <span class="kw">public</span> <span class="type">TextMeshProUGUI</span>   scoreText;    <span class="cm">// リザルトスコア表示</span>

    <span class="kw">public static</span> <span class="type">GameClearManager</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>()
    {
        Instance = <span class="kw">this</span>;
        clearPanel.<span class="fn">SetActive</span>(<span class="kw">false</span>); <span class="cm">// 最初は非表示</span>
    }

    <span class="kw">public void</span> <span class="fn">ShowClear</span>(<span class="kw">int</span> finalScore)
    {
        clearPanel.<span class="fn">SetActive</span>(<span class="kw">true</span>);
        scoreText.text = <span class="str">"SCORE: "</span> + finalScore.<span class="fn">ToString</span>(<span class="str">"N0"</span>);
        <span class="type">Time</span>.timeScale = <span class="num">0f</span>; <span class="cm">// ゲームを一時停止</span>
    }

    <span class="cm">// ボタンから呼ぶ</span>
    <span class="kw">public void</span> <span class="fn">OnRetryButton</span>()
    {
        <span class="type">Time</span>.timeScale = <span class="num">1f</span>; <span class="cm">// 必ず戻す！</span>
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(
            <span class="type">SceneManager</span>.GetActiveScene().name);
    }

    <span class="kw">public void</span> <span class="fn">OnTitleButton</span>()
    {
        <span class="type">Time</span>.timeScale = <span class="num">1f</span>;
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(<span class="str">"Title"</span>);
    }
}`,
    warn: "Time.timeScale = 0fにしたままシーンを移動するとずっとゲームが止まります。シーン移動前に必ず1fに戻してください。",
    keywords: [
      { name:"Time.timeScale", kind:"property", summary:"ゲーム全体の時間の流れる速さを制御する",
        desc:"0にするとUpdate()以外のすべての時間依存処理が止まります（ポーズ）。1が通常速度、2にすると2倍速になります。WaitForSecondsもtimeScaleの影響を受けます。",
        syntax:"Time.timeScale = 0f; // 一時停止\nTime.timeScale = 1f; // 再開",
        note:"timeScaleの影響を受けないタイマーにはTime.unscaledDeltaTimeを使います。" },
    ],
    related: [8, 35, 32]
  },

  {
    id: 34,
    icon: "🏠",
    title: "タイトル画面からゲームを始めたい",
    desc: "タイトルシーンにスタートボタンを置いてゲームシーンへ遷移する",
    cats: ["ui","scene"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 1,
    components: ["SceneManager","Button","OnClick"],
    idea: "UnityのUI Buttonコンポーネントを使い、OnClick()にシーン遷移メソッドを登録するだけです。Build Settingsへのシーン追加を忘れずに。",
    code: `<span class="cm">// TitleManager.cs（タイトルシーンのGameObjectに付ける）</span>
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">TitleManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="cm">// Buttonコンポーネントの OnClick() にこのメソッドを登録する</span>
    <span class="kw">public void</span> <span class="fn">OnStartButton</span>()
    {
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(<span class="str">"Game"</span>);
    }

    <span class="kw">public void</span> <span class="fn">OnQuitButton</span>()
    {
        <span class="cm">// エディタ上では動作しない（ビルド後のみ有効）</span>
        <span class="type">Application</span>.<span class="fn">Quit</span>();
    }
}`,
    warn: "File > Build Settings に「Title」「Game」などシーンを追加しないとLoadScene()でエラーになります。シーン0がゲーム起動時に最初に開くシーンです。",
    keywords: [
      { name:"Button.OnClick()", kind:"event", summary:"ボタンが押されたときに呼ぶ関数をInspectorで登録する",
        desc:"ButtonコンポーネントのInspectorにある「On Click()」リストに、呼び出したいGameObjectとメソッドを登録します。publicなメソッドのみ表示されます。コードからはbutton.onClick.AddListener(メソッド)でも登録できます。",
        syntax:"// Inspectorから登録する場合はpublicメソッドを作るだけ\npublic void OnStartButton() { }",
        note:"メソッドの引数はなし、またはint/float/string/boolの1つのみ受け付けます。" },
      { name:"Application.Quit()", kind:"method", summary:"アプリケーションを終了する",
        desc:"ビルドされたアプリを終了します。Unityエディタ上では動作しません（エディタ終了の代わりにUnityEditor.EditorApplication.isPlayingをfalseにする方法があります）。",
        syntax:"Application.Quit();",
        note:"エディタ上でテストしたい場合は#if UNITY_EDITORディレクティブで分岐させましょう。" },
    ],
    related: [8, 33, 35]
  },

  {
    id: 35,
    icon: "⏸️",
    title: "ポーズ（一時停止）を実装したい",
    desc: "ESCキーでゲームを止めてポーズメニューを表示する",
    cats: ["ui","scene"],
    genres: ["2daction","shooting","puzzle"],
    diff: 2,
    components: ["Time.timeScale","SetActive","Input.GetKeyDown"],
    idea: "Time.timeScale = 0fでゲームを止め、ポーズパネルをSetActive(true)で表示します。UIのアニメーションやコルーチンはtimeScaleの影響を受けるので注意が必要です。",
    code: `<span class="cm">// PauseManager.cs</span>
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">PauseManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span> pausePanel;
    <span class="kw">private bool</span>      isPaused = <span class="kw">false</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Escape))
            <span class="fn">TogglePause</span>();
    }

    <span class="kw">public void</span> <span class="fn">TogglePause</span>()
    {
        isPaused = !isPaused;
        <span class="type">Time</span>.timeScale = isPaused ? <span class="num">0f</span> : <span class="num">1f</span>;
        pausePanel.<span class="fn">SetActive</span>(isPaused);
    }

    <span class="cm">// ポーズパネルの「再開」ボタンから呼ぶ</span>
    <span class="kw">public void</span> <span class="fn">OnResumeButton</span>()
    {
        isPaused = <span class="kw">false</span>;
        <span class="type">Time</span>.timeScale = <span class="num">1f</span>;
        pausePanel.<span class="fn">SetActive</span>(<span class="kw">false</span>);
    }

    <span class="cm">// ポーズパネルの「タイトルへ」ボタンから呼ぶ</span>
    <span class="kw">public void</span> <span class="fn">OnTitleButton</span>()
    {
        <span class="type">Time</span>.timeScale = <span class="num">1f</span>; <span class="cm">// 必ず戻す</span>
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(<span class="str">"Title"</span>);
    }
}`,
    warn: "timeScale = 0fのままシーン遷移するとタイトルでもゲームが止まったままになります。OnTitleButtonでtimeScaleを1fに戻すのを忘れずに。",
    keywords: [
      { name:"三項演算子（? :）", kind:"class", summary:"if-elseを1行で書く条件式",
        desc:"「条件 ? trueの値 : falseの値」の形で書きます。isPaused ? 0f : 1fなら「isPausedがtrueなら0f、falseなら1f」という意味です。単純なif-elseを短く書くのに便利です。",
        syntax:"Time.timeScale = isPaused ? 0f : 1f;",
        note:"複雑な条件には通常のif-elseを使う方が読みやすいです。" },
    ],
    related: [33, 34, 8]
  },

  {
    id: 36,
    icon: "❤️",
    title: "残機をアイコンで表示したい",
    desc: "ハートアイコンを残機の数だけ並べて表示する",
    cats: ["ui"],
    genres: ["2daction","shooting"],
    diff: 2,
    components: ["Instantiate","Transform","List","LayoutGroup"],
    idea: "ハートアイコンのPrefabを残機分だけInstantiateしてHorizontalLayoutGroupの中に並べます。ダメージ時は末尾のアイコンをDestroyするだけで更新できます。",
    code: `<span class="cm">// LifeUI.cs</span>
<span class="kw">using</span> System.Collections.Generic;

<span class="kw">public class</span> <span class="type">LifeUI</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span>  heartPrefab;  <span class="cm">// ハートアイコンのPrefab</span>
    <span class="kw">public</span> <span class="type">Transform</span>   heartContainer; <span class="cm">// HorizontalLayoutGroupのTransform</span>
    <span class="kw">public int</span>         maxLives = <span class="num">3</span>;

    <span class="kw">private</span> <span class="type">List</span>&lt;<span class="type">GameObject</span>&gt; hearts = <span class="kw">new</span> <span class="type">List</span>&lt;<span class="type">GameObject</span>&gt;();

    <span class="kw">public static</span> <span class="type">LifeUI</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>() => Instance = <span class="kw">this</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="cm">// 最初に残機分のハートを生成</span>
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < maxLives; i++)
        {
            <span class="type">GameObject</span> h = <span class="type">Instantiate</span>(heartPrefab, heartContainer);
            hearts.<span class="fn">Add</span>(h);
        }
    }

    <span class="kw">public void</span> <span class="fn">LoseLife</span>()
    {
        <span class="kw">if</span> (hearts.Count == <span class="num">0</span>) <span class="kw">return</span>;

        <span class="cm">// 末尾のハートを削除</span>
        <span class="kw">int</span> last = hearts.Count - <span class="num">1</span>;
        <span class="type">Destroy</span>(hearts[last]);
        hearts.<span class="fn">RemoveAt</span>(last);

        <span class="kw">if</span> (hearts.Count == <span class="num">0</span>)
            <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"Game Over"</span>);
    }
}`,
    warn: "HorizontalLayoutGroupコンポーネントを付けたGameObjectをheartContainerに指定すると、ハートが自動で等間隔に並びます。忘れるとすべて重なって表示されます。",
    keywords: [
      { name:"HorizontalLayoutGroup", kind:"class", summary:"子オブジェクトを横一列に自動整列するUI",
        desc:"このコンポーネントを付けたオブジェクトの子オブジェクトが自動で横並びになります。SpacingやPaddingで間隔を調整できます。VerticalLayoutGroupは縦並びの版です。",
        syntax:"// Inspectorで付けるだけ。子オブジェクトが自動整列される",
        note:"LayoutGroupの付いたオブジェクトの子のRectTransformは自動管理されます。手動で位置を変更しても効きません。" },
      { name:"List.RemoveAt()", kind:"method", summary:"Listの指定インデックスの要素を削除する",
        desc:"引数のインデックスの要素をListから取り除きます。Remove(要素)で要素を指定して削除する方法もあります。",
        syntax:"hearts.RemoveAt(hearts.Count - 1); // 末尾を削除",
        note:"インデックスが範囲外だとArgumentOutOfRangeExceptionが発生します。Count > 0を確認してから使いましょう。" },
    ],
    related: [6, 33, 32]
  },

  {
    id: 37,
    icon: "🌑",
    title: "フェードイン・フェードアウトしたい",
    desc: "シーン開始・終了時に画面を暗くしてなめらかに切り替える",
    cats: ["ui","scene"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 2,
    components: ["CanvasGroup","Coroutine","Lerp"],
    idea: "全画面を覆う黒いImageにCanvasGroupをつけ、alphaを0↔1に変化させます。コルーチンでLerpすれば滑らかなフェードが作れます。",
    code: `<span class="cm">// FadeManager.cs（DontDestroyOnLoadな常駐オブジェクトに付ける）</span>
<span class="kw">using</span> UnityEngine.SceneManagement;

<span class="kw">public class</span> <span class="type">FadeManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">CanvasGroup</span> fadePanel; <span class="cm">// 黒いImageにCanvasGroupを付けたもの</span>
    <span class="kw">public float</span>      fadeDuration = <span class="num">1f</span>;

    <span class="kw">public static</span> <span class="type">FadeManager</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>()
    {
        Instance = <span class="kw">this</span>;
        <span class="type">DontDestroyOnLoad</span>(<span class="kw">this</span>);
    }

    <span class="kw">void</span> <span class="fn">Start</span>() => <span class="fn">StartCoroutine</span>(<span class="fn">FadeIn</span>());

    <span class="kw">public void</span> <span class="fn">LoadScene</span>(<span class="kw">string</span> sceneName)
    {
        <span class="fn">StartCoroutine</span>(<span class="fn">FadeOutAndLoad</span>(sceneName));
    }

    <span class="type">IEnumerator</span> <span class="fn">FadeIn</span>()
    {
        fadePanel.alpha = <span class="num">1f</span>;
        <span class="kw">for</span> (<span class="kw">float</span> t = <span class="num">0</span>; t < fadeDuration; t += <span class="type">Time</span>.deltaTime)
        {
            fadePanel.alpha = <span class="num">1f</span> - (t / fadeDuration);
            <span class="kw">yield return null</span>;
        }
        fadePanel.alpha = <span class="num">0f</span>;
    }

    <span class="type">IEnumerator</span> <span class="fn">FadeOutAndLoad</span>(<span class="kw">string</span> sceneName)
    {
        <span class="kw">for</span> (<span class="kw">float</span> t = <span class="num">0</span>; t < fadeDuration; t += <span class="type">Time</span>.deltaTime)
        {
            fadePanel.alpha = t / fadeDuration;
            <span class="kw">yield return null</span>;
        }
        fadePanel.alpha = <span class="num">1f</span>;
        <span class="type">SceneManager</span>.<span class="fn">LoadScene</span>(sceneName);
    }
}`,
    warn: "fadePanelのCanvasはSort Orderを高くして他のUIより前面に来るようにしてください。後ろに隠れるとフェードが見えません。",
    keywords: [
      { name:"CanvasGroup", kind:"class", summary:"Canvas配下のUIをまとめて透明度・操作可否を制御する",
        desc:"alphaで透明度（0〜1）、interactableでUI操作の可否、blocksRaycastsでクリック判定のON/OFFを一括制御できます。フェード演出や、ポーズ中にゲーム画面を操作不能にするなどに使います。",
        syntax:"canvasGroup.alpha = 0.5f;        // 半透明\ncanvasGroup.interactable = false;  // 操作不可",
        note:"個々のUIのalphaを変えるより、CanvasGroupで一括管理する方が効率的です。" },
      { name:"DontDestroyOnLoad()", kind:"method", summary:"シーンをまたいでもオブジェクトを破棄しない",
        desc:"このメソッドを呼んだGameObjectはシーン遷移後も消えずに残ります。BGMの管理やフェードパネルなど、シーンをまたいで使い続けたいものに使います。",
        syntax:"DontDestroyOnLoad(this.gameObject);",
        note:"シーンを戻ったときに重複生成されないよう、シングルトンと組み合わせて「既に存在したら自分をDestroyする」処理を入れるのが定番です。" },
      { name:"yield return null", kind:"lifecycle", summary:"1フレームだけ処理を中断して次フレームへ",
        desc:"コルーチン内でyield return nullすると、次のフレームまで処理が止まります。WaitForSeconds()と違い、フレーム単位で細かく処理を刻みたいときに使います。毎フレームalphaを更新するフェードアニメーションに適しています。",
        syntax:"yield return null; // 1フレーム待って次へ",
        note:"forループの中でyield return nullすることで、毎フレーム少しずつ変化させるアニメーションが作れます。" },
    ],
    related: [8, 33, 35]
  },

  {
    id: 38,
    icon: "🔴",
    title: "ダメージ時に画面を赤くフラッシュさせたい",
    desc: "被ダメージ演出として画面全体を一瞬赤く光らせる",
    cats: ["ui"],
    genres: ["2daction","shooting"],
    diff: 2,
    components: ["CanvasGroup","Image","Coroutine","Color"],
    idea: "全画面を覆う半透明の赤いImageをCanvasに置いておき、ダメージ時にalphaを一瞬上げてすぐ0に戻すコルーチンを呼びます。",
    code: `<span class="cm">// DamageFlash.cs</span>
<span class="kw">using</span> UnityEngine.UI;

<span class="kw">public class</span> <span class="type">DamageFlash</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Image</span>  flashImage;    <span class="cm">// 赤いImage（全画面サイズ）</span>
    <span class="kw">public float</span>  flashDuration = <span class="num">0.3f</span>;
    <span class="kw">public</span> <span class="type">Color</span>  flashColor    = <span class="kw">new</span> <span class="type">Color</span>(<span class="num">1f</span>, <span class="num">0f</span>, <span class="num">0f</span>, <span class="num">0.4f</span>);

    <span class="kw">public static</span> <span class="type">DamageFlash</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>()
    {
        Instance = <span class="kw">this</span>;
        flashImage.color = <span class="kw">new</span> <span class="type">Color</span>(<span class="num">1f</span>,<span class="num">0f</span>,<span class="num">0f</span>,<span class="num">0f</span>); <span class="cm">// 最初は透明</span>
    }

    <span class="kw">public void</span> <span class="fn">Flash</span>()
    {
        <span class="fn">StopAllCoroutines</span>();
        <span class="fn">StartCoroutine</span>(<span class="fn">FlashRoutine</span>());
    }

    <span class="type">IEnumerator</span> <span class="fn">FlashRoutine</span>()
    {
        <span class="cm">// 一瞬赤くして徐々に透明に戻す</span>
        flashImage.color = flashColor;

        <span class="kw">for</span> (<span class="kw">float</span> t = <span class="num">0</span>; t < flashDuration; t += <span class="type">Time</span>.deltaTime)
        {
            <span class="kw">float</span> alpha = <span class="type">Mathf</span>.<span class="fn">Lerp</span>(flashColor.a, <span class="num">0f</span>, t / flashDuration);
            flashImage.color = <span class="kw">new</span> <span class="type">Color</span>(<span class="num">1f</span>, <span class="num">0f</span>, <span class="num">0f</span>, alpha);
            <span class="kw">yield return null</span>;
        }
        flashImage.color = <span class="kw">new</span> <span class="type">Color</span>(<span class="num">1f</span>,<span class="num">0f</span>,<span class="num">0f</span>,<span class="num">0f</span>);
    }
}

<span class="cm">// ダメージを受けた側からはこう呼ぶ</span>
<span class="cm">// DamageFlash.Instance.Flash();</span>`,
    warn: "flashImageはCanvasのRaycast Targetをオフにしておかないと、画面クリックを遮断してボタンが押せなくなります。",
    keywords: [
      { name:"Color", kind:"class", summary:"RGBAで色を表す構造体",
        desc:"赤・緑・青・透明度をそれぞれ0〜1の小数で表します。Color.red（赤）・Color.white（白）・Color.clear（透明）などの定数もあります。",
        syntax:"new Color(1f, 0f, 0f, 0.4f); // 半透明の赤\nColor.red                   // 不透明な赤の定数",
        note:"255ベースの値を使う場合はColor32(255, 0, 0, 255)を使います。" },
      { name:"StopAllCoroutines()", kind:"method", summary:"そのオブジェクトで動いているコルーチンをすべて止める",
        desc:"新しいFlashが来たとき、前のFlashコルーチンが残っていると色がおかしくなります。StartCoroutineの前にStopAllCoroutines()を呼ぶことで常に最新のFlashだけを動かせます。",
        syntax:"StopAllCoroutines();\nStartCoroutine(FlashRoutine());",
        note:"特定のコルーチンだけ止めたい場合はStopCoroutine(coroutine)を使います。" },
    ],
    related: [21, 6, 37]
  },

  // ================================================================
  // 敵AI追加項目 (id: 39〜42)
  // ================================================================

  {
    id: 39,
    icon: "👮",
    title: "敵を左右にパトロールさせたい",
    desc: "一定距離を往復して歩き続けるシンプルな敵の動き",
    cats: ["enemy","action"],
    genres: ["2daction"],
    diff: 2,
    components: ["Transform","SpriteRenderer","Vector2.MoveTowards"],
    idea: "出発点からの移動距離を計測して折り返す方法と、Transformの2点間をLerpで往復させる方法があります。前者はどこに置いても動くので使いやすいです。",
    code: `<span class="cm">// EnemyPatrol.cs</span>
<span class="kw">public class</span> <span class="type">EnemyPatrol</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed       = <span class="num">2f</span>;
    <span class="kw">public float</span> patrolRange = <span class="num">3f</span>; <span class="cm">// 左右に動く距離</span>

    <span class="kw">private</span> <span class="type">Vector2</span>        startPos;
    <span class="kw">private</span> <span class="kw">float</span>          dir = <span class="num">1f</span>; <span class="cm">// 1=右, -1=左</span>
    <span class="kw">private</span> <span class="type">SpriteRenderer</span> sr;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        startPos = transform.position;
        sr = <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;();
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        transform.Translate(<span class="type">Vector2</span>.right * dir * speed * <span class="type">Time</span>.deltaTime);

        <span class="cm">// 出発点からの距離が限界を超えたら折り返す</span>
        <span class="kw">float</span> dist = transform.position.x - startPos.x;
        <span class="kw">if</span> (dist >  patrolRange) { dir = <span class="num">-1f</span>; sr.flipX = <span class="kw">true</span>;  }
        <span class="kw">if</span> (dist < -patrolRange) { dir =  <span class="num">1f</span>; sr.flipX = <span class="kw">false</span>; }
    }
}`,
    warn: "Rigidbody2Dを使っている場合はtransform.Translateではなくrb.velocityで動かしましょう。物理演算と座標直接操作が競合してぶれる原因になります。",
    keywords: [
      { name:"Transform.Translate()", kind:"method", summary:"現在位置から相対的に移動させる",
        desc:"引数のVector3/Vector2だけ現在位置から移動します。transform.position += …と同じ意味ですが短く書けます。第2引数でワールド座標基準かローカル座標基準かを選べます。",
        syntax:"transform.Translate(Vector2.right * speed * Time.deltaTime);",
        note:"Rigidbody2Dと併用するとめり込みなどの物理バグが起きます。物理オブジェクトはvelocityで動かしましょう。" },
    ],
    related: [7, 40, 42]
  },

  {
    id: 40,
    icon: "🔄",
    title: "壁に当たったら向きを変えさせたい",
    desc: "パトロール中に壁を検知して自動で折り返す",
    cats: ["enemy","physics"],
    genres: ["2daction"],
    diff: 1,
    components: ["OnCollisionEnter2D","Raycast","LayerMask"],
    idea: "OnCollisionEnter2Dで壁タグを検知して向きを反転する方法と、足元前方にRayを飛ばして地面の端を検知する方法があります。後者は崖から落ちない自然な動きになります。",
    code: `<span class="cm">// EnemyTurn.cs（壁衝突で折り返す方法）</span>
<span class="kw">public class</span> <span class="type">EnemyTurn</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed = <span class="num">2f</span>;
    <span class="kw">private float</span> dir  = <span class="num">1f</span>;
    <span class="kw">private</span> <span class="type">SpriteRenderer</span> sr;

    <span class="kw">void</span> <span class="fn">Start</span>() => sr = <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        transform.<span class="fn">Translate</span>(<span class="type">Vector2</span>.right * dir * speed * <span class="type">Time</span>.deltaTime);

        <span class="cm">// 前方足元に短いRayを飛ばして地面があるか確認</span>
        <span class="type">Vector2</span> checkPos = (Vector2)transform.position
                          + <span class="type">Vector2</span>.right * dir * <span class="num">0.5f</span>
                          + <span class="type">Vector2</span>.down  * <span class="num">0.6f</span>;

        <span class="kw">bool</span> groundAhead = <span class="type">Physics2D</span>.<span class="fn">OverlapCircle</span>(
            checkPos, <span class="num">0.1f</span>,
            <span class="type">LayerMask</span>.<span class="fn">GetMask</span>(<span class="str">"Ground"</span>)
        );

        <span class="kw">if</span> (!groundAhead) <span class="fn">Flip</span>(); <span class="cm">// 地面がなければ折り返す</span>
    }

    <span class="kw">void</span> <span class="fn">OnCollisionEnter2D</span>(<span class="type">Collision2D</span> col)
    {
        <span class="kw">if</span> (col.gameObject.<span class="fn">CompareTag</span>(<span class="str">"Wall"</span>)) <span class="fn">Flip</span>();
    }

    <span class="kw">void</span> <span class="fn">Flip</span>()
    {
        dir    *= <span class="num">-1f</span>;
        sr.flipX = dir < <span class="num">0f</span>;
    }
}`,
    warn: "LayerMask.GetMask(\"Ground\")はレイヤー名の文字列で指定します。Inspectorで設定したレイヤー名と一致しているか確認しましょう。",
    keywords: [
      { name:"LayerMask.GetMask()", kind:"method", summary:"レイヤー名からLayerMaskを生成する",
        desc:"文字列のレイヤー名からLayerMask値を生成します。Inspectorで設定するより、コード内で動的にレイヤーを指定したい場合に使います。複数指定もできます。",
        syntax:`LayerMask mask = LayerMask.GetMask("Ground");
LayerMask both = LayerMask.GetMask("Ground", "Wall"); // 複数指定`,
        note:"レイヤー名のtypoに注意。一致しないとLayerMask値が0になり、すべてのレイヤーが対象外になります。" },
      { name:"Physics2D.OverlapCircle()", kind:"method", summary:"円の範囲内にColliderがあるか調べる",
        desc:"指定した中心点と半径の円の中にCollider2Dが存在するかを調べます。足元前方に置いて「地面があるか」を確認するのに使います。",
        syntax:"bool hit = Physics2D.OverlapCircle(position, radius, layerMask);",
        note:"Gizmosを使ってSceneビューにOverlapCircleの位置を描画するとデバッグが楽になります。" },
    ],
    related: [39, 7, 3]
  },

  {
    id: 41,
    icon: "👁️",
    title: "視野角でプレイヤーを発見させたい",
    desc: "一定角度・距離の扇形視野にプレイヤーが入ったら追跡開始する",
    cats: ["enemy","physics"],
    genres: ["2daction","shooting"],
    diff: 3,
    components: ["Vector2.Angle","Physics2D.Raycast","Mathf.Abs"],
    idea: "プレイヤーへの方向ベクトルと敵の正面ベクトルの角度差を求め、視野角以内ならRaycastで障害物がないか確認します。角度チェック→Raycastの2段階判定が定番です。",
    code: `<span class="cm">// EnemySight.cs</span>
<span class="kw">public class</span> <span class="type">EnemySight</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span>     sightRange = <span class="num">6f</span>;    <span class="cm">// 視野距離</span>
    <span class="kw">public float</span>     sightAngle = <span class="num">60f</span>;   <span class="cm">// 視野角（片側）</span>
    <span class="kw">public</span> <span class="type">LayerMask</span> obstacleMask;       <span class="cm">// 障害物のレイヤー</span>
    <span class="kw">public</span> <span class="type">Transform</span> player;

    <span class="kw">private bool</span>     isChasing = <span class="kw">false</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        isChasing = <span class="fn">CanSeePlayer</span>();

        <span class="kw">if</span> (isChasing)
        {
            <span class="cm">// 追跡処理（項目7「敵がプレイヤーを追いかけたい」参照）</span>
            transform.position = <span class="type">Vector2</span>.<span class="fn">MoveTowards</span>(
                transform.position, player.position,
                <span class="num">3f</span> * <span class="type">Time</span>.deltaTime);
        }
    }

    <span class="kw">bool</span> <span class="fn">CanSeePlayer</span>()
    {
        <span class="type">Vector2</span> toPlayer = (Vector2)player.position - (Vector2)transform.position;

        <span class="cm">// ① 距離チェック</span>
        <span class="kw">if</span> (toPlayer.magnitude > sightRange) <span class="kw">return false</span>;

        <span class="cm">// ② 角度チェック（敵の正面との角度差）</span>
        <span class="type">Vector2</span> forward  = transform.right; <span class="cm">// 敵の正面方向</span>
        <span class="kw">float</span>   angle    = <span class="type">Vector2</span>.<span class="fn">Angle</span>(forward, toPlayer);
        <span class="kw">if</span> (angle > sightAngle) <span class="kw">return false</span>;

        <span class="cm">// ③ 障害物チェック（Raycastで壁越しに見えないか確認）</span>
        <span class="type">RaycastHit2D</span> hit = <span class="type">Physics2D</span>.<span class="fn">Raycast</span>(
            transform.position, toPlayer.normalized,
            sightRange, obstacleMask);

        <span class="cm">// 障害物に当たっていなければ見えている</span>
        <span class="kw">return</span> !hit;
    }

    <span class="cm">// Sceneビューに視野を描画（デバッグ用）</span>
    <span class="kw">void</span> <span class="fn">OnDrawGizmos</span>()
    {
        <span class="type">Gizmos</span>.color = isChasing ? <span class="type">Color</span>.red : <span class="type">Color</span>.yellow;
        <span class="type">Gizmos</span>.<span class="fn">DrawWireSphere</span>(transform.position, sightRange);
    }
}`,
    warn: "obstacleMaskにプレイヤーのレイヤーも含めてしまうと、Rayがプレイヤー自身に当たって「見えない」と判定されます。障害物専用のレイヤーを別に用意しましょう。",
    keywords: [
      { name:"Vector2.Angle()", kind:"method", summary:"2つのベクトルの間の角度を返す",
        desc:"2つのVector2の間の角度を0〜180度で返します。敵の正面ベクトルとプレイヤーへのベクトルの角度差を求めることで、視野角内かどうかを判定できます。",
        syntax:"float angle = Vector2.Angle(forward, toPlayer); // 0〜180度",
        note:"符号付きの角度（-180〜180）が必要な場合はVector2.SignedAngle()を使います。" },
      { name:"Physics2D.Raycast()", kind:"method", summary:"指定方向に光線を飛ばして最初に当たったColliderを返す",
        desc:"originから direction方向にdistanceの距離だけ光線を飛ばし、最初に当たったRaycastHit2Dを返します。壁越しに見えないかの判定や、地面までの距離測定などに使います。",
        syntax:"RaycastHit2D hit = Physics2D.Raycast(origin, direction, distance, layerMask);",
        note:"何にも当たらなかった場合、hit.colliderはnullになります。" },
      { name:"Vector2.magnitude", kind:"property", summary:"ベクトルの長さ（距離）を返す",
        desc:"ベクトルの長さを返します。2点間の距離を求めるときに使います。Vector2.Distance()と同じ計算ですが、差分ベクトルをすでに持っている場合はmagnitudeの方が効率的です。",
        syntax:"float dist = (playerPos - enemyPos).magnitude;",
        note:"比較だけなら平方根の計算が省けるsqrMagnitudeを使う方が高速です。" },
      { name:"OnDrawGizmos()", kind:"lifecycle", summary:"Sceneビューにデバッグ用の図形を描画する",
        desc:"Unityエディタのシーンビューにのみ描画されます。ビルドには含まれません。敵の視野範囲・攻撃範囲・当たり判定の確認など、見えない数値を視覚化するのに便利です。",
        syntax:"void OnDrawGizmos() { Gizmos.DrawWireSphere(transform.position, range); }",
        note:"OnDrawGizmosSelected()にするとオブジェクトを選択したときだけ描画されます。" },
    ],
    related: [7, 39, 42]
  },

  {
    id: 42,
    icon: "⚔️",
    title: "近づいたら攻撃させたい",
    desc: "一定距離内に入ったら攻撃モーションを出してダメージを与える",
    cats: ["enemy","action"],
    genres: ["2daction","shooting"],
    diff: 2,
    components: ["Vector2.Distance","Coroutine","OverlapCircle"],
    idea: "プレイヤーとの距離を毎フレーム監視して攻撃範囲内なら攻撃します。連続攻撃を防ぐためにisAttackingフラグとクールタイムをコルーチンで管理するのがポイントです。",
    code: `<span class="cm">// EnemyAttack.cs</span>
<span class="kw">public class</span> <span class="type">EnemyAttack</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span>     attackRange  = <span class="num">1.2f</span>;
    <span class="kw">public float</span>     attackCooldown = <span class="num">1.5f</span>;
    <span class="kw">public int</span>       damage       = <span class="num">10</span>;
    <span class="kw">public</span> <span class="type">LayerMask</span> playerLayer;
    <span class="kw">private bool</span>     canAttack    = <span class="kw">true</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (!canAttack) <span class="kw">return</span>;

        <span class="cm">// 攻撃範囲内にプレイヤーがいるか確認</span>
        <span class="type">Collider2D</span> hit = <span class="type">Physics2D</span>.<span class="fn">OverlapCircle</span>(
            transform.position, attackRange, playerLayer);

        <span class="kw">if</span> (hit != <span class="kw">null</span>)
        {
            <span class="fn">StartCoroutine</span>(<span class="fn">AttackRoutine</span>(hit));
        }
    }

    <span class="type">IEnumerator</span> <span class="fn">AttackRoutine</span>(<span class="type">Collider2D</span> target)
    {
        canAttack = <span class="kw">false</span>;

        <span class="cm">// ダメージを与える</span>
        <span class="type">PlayerHealth</span> ph = target.<span class="fn">GetComponent</span>&lt;<span class="type">PlayerHealth</span>&gt;();
        <span class="kw">if</span> (ph != <span class="kw">null</span>) ph.<span class="fn">TakeDamage</span>(damage);

        <span class="cm">// クールタイム</span>
        <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(attackCooldown);
        canAttack = <span class="kw">true</span>;
    }

    <span class="cm">// 攻撃範囲をSceneビューに表示</span>
    <span class="kw">void</span> <span class="fn">OnDrawGizmosSelected</span>()
    {
        <span class="type">Gizmos</span>.color = <span class="type">Color</span>.red;
        <span class="type">Gizmos</span>.<span class="fn">DrawWireSphere</span>(transform.position, attackRange);
    }
}`,
    warn: "playerLayerにプレイヤーのレイヤーを正しく設定しないと、敵自身や他のオブジェクトをターゲットにしてしまいます。Inspectorで必ず確認してください。",
    keywords: [
      { name:"Physics2D.OverlapCircle()の戻り値", kind:"method", summary:"範囲内の最初のColliderを返す（なければnull）",
        desc:"OverlapCircleはbool（当たったか）ではなくCollider2Dを返します。nullチェックで当たり判定をしつつ、そのままGetComponent()でコンポーネントを取得できます。複数ヒットを取得するにはOverlapCircleAll()を使います。",
        syntax:"Collider2D hit = Physics2D.OverlapCircle(pos, radius, mask);\nif (hit != null) { hit.GetComponent<PlayerHealth>(); }",
        note:"OverlapCircleAll()はCollider2D[]を返します。範囲内の全オブジェクトに当たり判定したいときに使います。" },
      { name:"OnDrawGizmosSelected()", kind:"lifecycle", summary:"オブジェクト選択時だけSceneビューに描画する",
        desc:"OnDrawGizmos()はシーン内の全オブジェクトが常に描画しますが、OnDrawGizmosSelected()は選択中のオブジェクトのみ描画します。攻撃範囲・視野角など個別に確認したいものに向いています。",
        syntax:"void OnDrawGizmosSelected() { Gizmos.DrawWireSphere(pos, range); }",
        note:"ビルドには含まれません。エディタ専用のデバッグ機能です。" },
    ],
    related: [7, 41, 39]
  },

  // ================================================================
  // 音・エフェクト・その他 (id: 43〜48)
  // ================================================================

  {
    id: 43,
    icon: "🎼",
    title: "BGMをループ再生したい",
    desc: "ゲーム開始からシーンをまたいで途切れずBGMを流し続ける",
    cats: ["audio"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 1,
    components: ["AudioSource","DontDestroyOnLoad","loop"],
    idea: "AudioSourceのloopをtrueにするだけで自動ループします。シーンをまたいで再生し続けたい場合はDontDestroyOnLoadと組み合わせます。シングルトンにして重複生成を防ぐのも忘れずに。",
    code: `<span class="cm">// BGMManager.cs（タイトルシーンの空オブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">BGMManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">AudioSource</span> audioSource;

    <span class="kw">public static</span> <span class="type">BGMManager</span> Instance;

    <span class="kw">void</span> <span class="fn">Awake</span>()
    {
        <span class="cm">// 既に存在するなら重複を防いで自分を削除</span>
        <span class="kw">if</span> (Instance != <span class="kw">null</span>)
        {
            <span class="type">Destroy</span>(gameObject);
            <span class="kw">return</span>;
        }
        Instance = <span class="kw">this</span>;
        <span class="type">DontDestroyOnLoad</span>(gameObject);

        audioSource.loop = <span class="kw">true</span>;
        audioSource.<span class="fn">Play</span>();
    }

    <span class="kw">public void</span> <span class="fn">ChangeBGM</span>(<span class="type">AudioClip</span> newClip)
    {
        audioSource.<span class="fn">Stop</span>();
        audioSource.clip = newClip;
        audioSource.<span class="fn">Play</span>();
    }
}`,
    warn: "DontDestroyOnLoadを使うとシーンを戻ったときに同じオブジェクトが2つになります。必ず「既に存在したらDestroyする」重複チェックを入れましょう。",
    keywords: [
      { name:"AudioSource.loop", kind:"property", summary:"音声を自動ループ再生する",
        desc:"trueにすると再生が終わった瞬間に先頭から自動で繰り返します。BGMに使う定番設定です。Inspectorのチェックボックスでも設定できます。",
        syntax:"audioSource.loop = true;\naudioSource.Play();",
        note:"PlayOneShot()で再生した音はloopの影響を受けません。ループ音はPlay()で再生しましょう。" },
      { name:"AudioSource.clip", kind:"property", summary:"再生するAudioClipを切り替える",
        desc:"再生中のAudioClipを別のものに差し替えます。Stop()してからclipを変えてPlay()するのがBGM切り替えの基本パターンです。",
        syntax:"audioSource.Stop();\naudioSource.clip = newClip;\naudioSource.Play();",
        note:"clip変更前にStop()しないと新しいclipが反映されないことがあります。" },
    ],
    related: [10, 44, 37]
  },

  {
    id: 44,
    icon: "🔊",
    title: "音量をスライダーで調整したい",
    desc: "設定画面でBGM・SE音量をスライダーUIで変更してPlayerPrefsに保存",
    cats: ["audio","ui","data"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 2,
    components: ["AudioMixer","Slider","PlayerPrefs","Mathf.Log10"],
    idea: "AudioMixerのExposed Parameterに音量を公開して、スライダー値をdB（デシベル）変換して渡します。PlayerPrefsで設定を保存すれば次回起動時に復元できます。",
    code: `<span class="cm">// VolumeSettings.cs</span>
<span class="kw">using</span> UnityEngine.Audio;
<span class="kw">using</span> UnityEngine.UI;

<span class="kw">public class</span> <span class="type">VolumeSettings</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">AudioMixer</span> mixer;
    <span class="kw">public</span> <span class="type">Slider</span>     bgmSlider;
    <span class="kw">public</span> <span class="type">Slider</span>     seSlider;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="cm">// 保存済みの値を読み込んでスライダーに反映</span>
        bgmSlider.value = <span class="type">PlayerPrefs</span>.<span class="fn">GetFloat</span>(<span class="str">"BGMVolume"</span>, <span class="num">0.8f</span>);
        seSlider.value  = <span class="type">PlayerPrefs</span>.<span class="fn">GetFloat</span>(<span class="str">"SEVolume"</span>,  <span class="num">0.8f</span>);

        <span class="fn">SetBGMVolume</span>(bgmSlider.value);
        <span class="fn">SetSEVolume</span>(seSlider.value);

        <span class="cm">// スライダー変更イベントを登録</span>
        bgmSlider.onValueChanged.<span class="fn">AddListener</span>(<span class="fn">SetBGMVolume</span>);
        seSlider.onValueChanged.<span class="fn">AddListener</span>(<span class="fn">SetSEVolume</span>);
    }

    <span class="kw">public void</span> <span class="fn">SetBGMVolume</span>(<span class="kw">float</span> value)
    {
        <span class="cm">// 0〜1の値をdBに変換（AudioMixerはdBで管理）</span>
        <span class="kw">float</span> db = <span class="type">Mathf</span>.<span class="fn">Log10</span>(<span class="type">Mathf</span>.<span class="fn">Max</span>(value, <span class="num">0.0001f</span>)) * <span class="num">20f</span>;
        mixer.<span class="fn">SetFloat</span>(<span class="str">"BGMVolume"</span>, db);
        <span class="type">PlayerPrefs</span>.<span class="fn">SetFloat</span>(<span class="str">"BGMVolume"</span>, value);
    }

    <span class="kw">public void</span> <span class="fn">SetSEVolume</span>(<span class="kw">float</span> value)
    {
        <span class="kw">float</span> db = <span class="type">Mathf</span>.<span class="fn">Log10</span>(<span class="type">Mathf</span>.<span class="fn">Max</span>(value, <span class="num">0.0001f</span>)) * <span class="num">20f</span>;
        mixer.<span class="fn">SetFloat</span>(<span class="str">"SEVolume"</span>, db);
        <span class="type">PlayerPrefs</span>.<span class="fn">SetFloat</span>(<span class="str">"SEVolume"</span>, value);
    }
}`,
    warn: "AudioMixerのパラメータ名（\"BGMVolume\"など）はExpose Parameter時に設定した名前と完全一致が必要です。AudioMixerウィンドウで右クリック→Expose Parameter→名前を確認してください。",
    keywords: [
      { name:"AudioMixer", kind:"class", summary:"複数の音声をグループ管理してエフェクトや音量を一括制御する",
        desc:"BGM・SE・ボイスなどを別グループにして、グループごとに音量やエフェクトを管理できます。Project右クリック→Create→Audio Mixerで作成します。",
        syntax:"mixer.SetFloat(\"BGMVolume\", dbValue);",
        note:"AudioSourceのOutputにAudioMixerGroupを設定することで、その音源がMixerの管理下に入ります。" },
      { name:"Slider.onValueChanged", kind:"event", summary:"スライダーの値が変わったときに呼ぶ関数を登録する",
        desc:"AddListener()でスライダー値変更イベントにメソッドを登録します。float引数を1つ受け取るメソッドを渡すと、変更後の値が自動で渡されます。",
        syntax:"slider.onValueChanged.AddListener(SetBGMVolume);",
        note:"InspectorのOn Value Changedに登録してもOKですが、コードからAddListenerする方法は動的に変更でき柔軟です。" },
      { name:"Mathf.Log10()", kind:"method", summary:"常用対数を計算する",
        desc:"人間の聴覚は音量を対数的に感じるため、AudioMixerはdB（デシベル）単位で管理します。スライダーの0〜1の線形値をdBに変換するにはLog10を使います。value=0のときLog10が-∞になるのでMathf.Max(value, 0.0001f)で下限を設けます。",
        syntax:"float db = Mathf.Log10(Mathf.Max(value, 0.0001f)) * 20f;",
        note:"この計算でvalue=1のときdb=0（最大）、value=0.1のときdb=-20となります。" },
    ],
    related: [43, 10, 11]
  },

  {
    id: 45,
    icon: "🌵",
    title: "障害物をランダムに生成したい",
    desc: "ランゲームで右から流れてくる障害物を一定間隔でスポーンする",
    cats: ["action","enemy"],
    genres: ["runner"],
    diff: 2,
    components: ["Instantiate","Random.Range","Destroy"],
    idea: "画面右端より外にスポーンして左へ移動させます。画面左端を越えたらDestroyします。Y座標をRandomにすることでバリエーションを出せます。",
    code: `<span class="cm">// ObstacleSpawner.cs</span>
<span class="kw">public class</span> <span class="type">ObstacleSpawner</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">GameObject</span>[] obstaclePrefabs; <span class="cm">// 複数種類の障害物</span>
    <span class="kw">public float</span> spawnInterval = <span class="num">2f</span>;
    <span class="kw">public float</span> spawnX        = <span class="num">10f</span>;   <span class="cm">// 画面右端より外</span>
    <span class="kw">public float</span> yMin          = <span class="num">-2f</span>;
    <span class="kw">public float</span> yMax          = <span class="num"> 2f</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="fn">InvokeRepeating</span>(<span class="str">"SpawnObstacle"</span>, <span class="num">1f</span>, spawnInterval);
    }

    <span class="kw">void</span> <span class="fn">SpawnObstacle</span>()
    {
        <span class="cm">// ランダムな種類・高さで生成</span>
        <span class="kw">int</span>     idx = <span class="type">Random</span>.<span class="fn">Range</span>(<span class="num">0</span>, obstaclePrefabs.Length);
        <span class="kw">float</span>   y   = <span class="type">Random</span>.<span class="fn">Range</span>(yMin, yMax);
        <span class="type">Vector3</span> pos = <span class="kw">new</span> <span class="type">Vector3</span>(spawnX, y, <span class="num">0f</span>);

        <span class="type">Instantiate</span>(obstaclePrefabs[idx], pos, <span class="type">Quaternion</span>.identity);
    }
}

<span class="cm">// Obstacle.cs（障害物自身に付ける）</span>
<span class="kw">public class</span> <span class="type">Obstacle</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed   = <span class="num">5f</span>;
    <span class="kw">public float</span> destroyX = <span class="num">-12f</span>; <span class="cm">// 画面外に出たら削除</span>

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        transform.<span class="fn">Translate</span>(<span class="type">Vector2</span>.left * speed * <span class="type">Time</span>.deltaTime);
        <span class="kw">if</span> (transform.position.x < destroyX) <span class="type">Destroy</span>(gameObject);
    }
}`,
    warn: "spawnIntervalを短くするほど障害物が増えてメモリを圧迫します。スコアに応じて徐々に短くする場合はObject Poolingも検討してください。",
    keywords: [
      { name:"配列の添字アクセス", kind:"class", summary:"配列の要素をインデックスで取得する",
        desc:"obstaclePrefabs[idx]のようにインデックスで要素を取得します。Random.Rangeと組み合わせてランダムな要素を選ぶのは定番パターンです。インデックスは0から始まります。",
        syntax:"int idx = Random.Range(0, array.Length); // 0〜Length-1\nvar item = array[idx];",
        note:"インデックスがLength以上だとIndexOutOfRangeExceptionが発生します。Random.Range(0, array.Length)のint版は上限が除外されるので安全です。" },
    ],
    related: [22, 46, 12]
  },

  {
    id: 46,
    icon: "⚡",
    title: "スコアに応じてゲームスピードを上げたい",
    desc: "スコアが増えるほど敵の速度・スポーン間隔が上がる難易度曲線",
    cats: ["action","data"],
    genres: ["runner","shooting"],
    diff: 2,
    components: ["Mathf.Clamp","Time.timeScale","AnimationCurve"],
    idea: "スコアに比例して速度を上げる方法と、AnimationCurveでデザイナーが難易度曲線を調整できる方法があります。後者はInspectorで視覚的に調整できて便利です。",
    code: `<span class="cm">// DifficultyManager.cs</span>
<span class="kw">public class</span> <span class="type">DifficultyManager</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">AnimationCurve</span> speedCurve;    <span class="cm">// Inspectorで曲線を編集</span>
    <span class="kw">public float</span>          maxScore = <span class="num">1000f</span>;

    <span class="kw">public static</span> <span class="type">DifficultyManager</span> Instance;
    <span class="kw">void</span> <span class="fn">Awake</span>() => Instance = <span class="kw">this</span>;

    <span class="cm">// スコアを0〜1に正規化して速度倍率を返す</span>
    <span class="kw">public float</span> <span class="fn">GetSpeedMultiplier</span>(<span class="kw">int</span> score)
    {
        <span class="kw">float</span> t = <span class="type">Mathf</span>.<span class="fn">Clamp01</span>((float)score / maxScore);
        <span class="kw">return</span> speedCurve.<span class="fn">Evaluate</span>(t);
    }
}

<span class="cm">// 障害物側での使い方</span>
<span class="cm">// float mult = DifficultyManager.Instance.GetSpeedMultiplier(score);</span>
<span class="cm">// speed = baseSpeed * mult;</span>

<span class="cm">// ── シンプル版（AnimationCurveなし）──</span>
<span class="kw">public class</span> <span class="type">SimpleDifficulty</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> baseSpeed   = <span class="num">3f</span>;
    <span class="kw">public float</span> speedPerScore = <span class="num">0.01f</span>; <span class="cm">// スコア1あたりの速度増加</span>
    <span class="kw">public float</span> maxSpeed    = <span class="num">10f</span>;

    <span class="kw">public float</span> <span class="fn">GetSpeed</span>(<span class="kw">int</span> score)
    {
        <span class="kw">return</span> <span class="type">Mathf</span>.<span class="fn">Clamp</span>(
            baseSpeed + score * speedPerScore,
            baseSpeed, maxSpeed);
    }
}`,
    warn: "Time.timeScaleでゲーム全体を加速する方法もありますが、UIアニメーションや音声も影響を受けます。個別オブジェクトの速度を上げる方が制御しやすいです。",
    keywords: [
      { name:"AnimationCurve", kind:"class", summary:"Inspector上でグラフ編集できる数値曲線",
        desc:"0〜1の入力に対して任意の出力値を返す曲線をInspectorのグラフUIで視覚的に編集できます。Evaluate(t)で指定したtの値を取得します。難易度曲線・フェード曲線など「なめらかな変化」の設計に便利です。",
        syntax:"public AnimationCurve speedCurve;\nfloat value = speedCurve.Evaluate(t); // t: 0〜1",
        note:"AnimationCurve.EaseInOut()などで定番の曲線を簡単に作ることもできます。" },
      { name:"キャスト（型変換）", kind:"class", summary:"整数をfloatに変換して割り算を正確に行う",
        desc:"C#では整数同士の割り算は整数になります。(float)score / maxScoreのように片方をfloatにキャストすることで小数の割り算になります。",
        syntax:"float t = (float)score / maxScore; // 0.0〜1.0になる\n// score / maxScore だと 0 か 1 になってしまう",
        note:"maxScoreをfloatで宣言しておけばキャスト不要です。どちらか片方がfloatなら自動的に浮動小数点演算になります。" },
    ],
    related: [45, 11, 22]
  },

  {
    id: 47,
    icon: "✨",
    title: "オブジェクトを点滅させたい",
    desc: "無敵中・特殊状態の演出としてスプライトを点滅させる",
    cats: ["action","audio"],
    genres: ["2daction","shooting"],
    diff: 1,
    components: ["SpriteRenderer","Coroutine","Color.Lerp"],
    idea: "SpriteRenderer.enabledをON/OFFする方法と、Color.aをLerpで変化させる方法があります。前者はパキッとした点滅、後者はフワッとした点滅になります。",
    code: `<span class="cm">// Blink.cs</span>
<span class="kw">public class</span> <span class="type">Blink</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">private</span> <span class="type">SpriteRenderer</span> sr;

    <span class="kw">void</span> <span class="fn">Start</span>() => sr = <span class="fn">GetComponent</span>&lt;<span class="type">SpriteRenderer</span>&gt;();

    <span class="cm">// ── パターン1: パキッと点滅（無敵時間などに）──</span>
    <span class="kw">public</span> <span class="type">IEnumerator</span> <span class="fn">BlinkFlash</span>(<span class="kw">float</span> duration, <span class="kw">float</span> interval = <span class="num">0.1f</span>)
    {
        <span class="kw">for</span> (<span class="kw">float</span> t = <span class="num">0</span>; t < duration; t += interval)
        {
            sr.enabled = !sr.enabled;
            <span class="kw">yield return new</span> <span class="type">WaitForSeconds</span>(interval);
        }
        sr.enabled = <span class="kw">true</span>; <span class="cm">// 必ず表示状態に戻す</span>
    }

    <span class="cm">// ── パターン2: フワッと点滅（アイテムなどに）──</span>
    <span class="kw">public</span> <span class="type">IEnumerator</span> <span class="fn">BlinkGlow</span>(<span class="kw">float</span> speed = <span class="num">3f</span>)
    {
        <span class="kw">while</span> (<span class="kw">true</span>)
        {
            <span class="cm">// Mathf.PingPongで0→1→0を繰り返す</span>
            <span class="kw">float</span> alpha = <span class="type">Mathf</span>.<span class="fn">PingPong</span>(<span class="type">Time</span>.time * speed, <span class="num">1f</span>);
            <span class="type">Color</span> c = sr.color;
            c.a = alpha;
            sr.color = c;
            <span class="kw">yield return null</span>;
        }
    }
}

<span class="cm">// 使い方</span>
<span class="cm">// StartCoroutine(blink.BlinkFlash(2f));       // 2秒間パキッと点滅</span>
<span class="cm">// StartCoroutine(blink.BlinkGlow());           // フワッと永続点滅</span>`,
    warn: "BlinkFlashはsrを最後にtrue（表示）に戻さないと、消えたままになります。コルーチン終了時のsr.enabled = trueを忘れないようにしましょう。",
    keywords: [
      { name:"Mathf.PingPong()", kind:"method", summary:"0〜lengthを往復する値を返す",
        desc:"Time.timeを渡すと時間とともに0→length→0→…と往復する値を返します。サイン波のように滑らかではなく線形に変化します。alpha値の往復などアニメーションに便利です。",
        syntax:"float alpha = Mathf.PingPong(Time.time * speed, 1f); // 0〜1を往復",
        note:"Mathf.Sin(Time.time)を使うとよりなめらかな往復になります（-1〜1なので0.5fかけて+0.5fで0〜1に変換）。" },
      { name:"Color.a", kind:"property", summary:"色の透明度（アルファ値）を取得・設定する",
        desc:"0が完全透明、1が完全不透明です。Color構造体はイミュータブルなので、sr.color.a = 0.5fとは書けません。一度Color変数に代入して.aを変えてからsr.colorに戻す必要があります。",
        syntax:"Color c = sr.color;\nc.a = 0.5f;\nsr.color = c;",
        note:"sr.color.a = 0.5fと直接書くとコンパイルエラーになります。必ず一時変数を使いましょう。" },
    ],
    related: [21, 38, 15]
  },

  {
    id: 48,
    icon: "🔗",
    title: "シーンをまたいでデータを引き継ぎたい",
    desc: "DontDestroyOnLoadまたはstaticでスコア・設定をシーン間で保持する",
    cats: ["data","scene"],
    genres: ["2daction","shooting","puzzle","runner"],
    diff: 2,
    components: ["DontDestroyOnLoad","static","PlayerPrefs"],
    idea: "一時的なデータ（現在のスコアなど）はDontDestroyOnLoadかstaticで渡します。永続データ（ハイスコア・設定）はPlayerPrefsに保存します。用途に応じて使い分けが大切です。",
    code: `<span class="cm">// ── 方法1: DontDestroyOnLoad ──</span>
<span class="cm">// GameData.cs（管理オブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">GameData</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public static</span> <span class="type">GameData</span> Instance;

    <span class="kw">public int</span>    score      = <span class="num">0</span>;
    <span class="kw">public int</span>    lives      = <span class="num">3</span>;
    <span class="kw">public string</span> playerName = <span class="str">""</span>;

    <span class="kw">void</span> <span class="fn">Awake</span>()
    {
        <span class="kw">if</span> (Instance != <span class="kw">null</span>) { <span class="type">Destroy</span>(gameObject); <span class="kw">return</span>; }
        Instance = <span class="kw">this</span>;
        <span class="type">DontDestroyOnLoad</span>(gameObject);
    }
}

<span class="cm">// 別シーンから参照: GameData.Instance.score</span>


<span class="cm">// ── 方法2: staticクラス（最もシンプル）──</span>
<span class="kw">public static class</span> <span class="type">SessionData</span>
{
    <span class="kw">public static int</span>    score      = <span class="num">0</span>;
    <span class="kw">public static int</span>    lives      = <span class="num">3</span>;
    <span class="kw">public static string</span> playerName = <span class="str">""</span>;

    <span class="cm">// ゲーム開始時にリセット</span>
    <span class="kw">public static void</span> <span class="fn">Reset</span>()
    {
        score = <span class="num">0</span>; lives = <span class="num">3</span>; playerName = <span class="str">""</span>;
    }
}

<span class="cm">// 別シーンから参照: SessionData.score</span>
<span class="cm">// シーン開始時にリセット: SessionData.Reset()</span>`,
    warn: "staticクラスの変数はアプリ終了まで消えません。ゲームリスタート時にReset()を呼ぶ処理を忘れると前回のスコアが残ったままになります。",
    keywords: [
      { name:"DontDestroyOnLoad()", kind:"method", summary:"シーン遷移後もGameObjectを保持する",
        desc:"このメソッドを呼んだGameObjectはシーンをまたいで存在し続けます。BGM・データ管理・フェードパネルなど継続が必要なものに使います。シングルトンと組み合わせて重複生成を防ぐのがセットです。",
        syntax:"DontDestroyOnLoad(this.gameObject);",
        note:"シーン遷移で消えないのは便利ですが、増えすぎると管理が難しくなります。本当に必要なものだけに使いましょう。" },
      { name:"staticクラス", kind:"class", summary:"インスタンス化できないクラス。グローバルなデータ保管に使う",
        desc:"static classはnewできません。クラス名.変数名でどこからでもアクセスでき、シーン遷移後も値が保持されます。MonoBehaviourを継承しないので軽量です。GameObjectが不要な純粋なデータ保管に向いています。",
        syntax:"public static class SessionData { public static int score = 0; }",
        note:"staticクラスはInspectorに表示できません。デバッグはDebug.Logで行います。" },
    ],
    related: [11, 37, 43]
  },

  // ================================================================
  // 3Dアクション項目 (id: 49〜61)
  // ================================================================

  {
    id: 49,
    icon: "🕹️",
    title: "3Dで前後左右に移動させたい",
    desc: "WASDキーで3D空間をXZ平面上に移動する基本実装",
    cats: ["action","input"],
    genres: ["3daction"],
    diff: 1,
    components: ["Rigidbody","CharacterController","Input.GetAxis"],
    idea: "3D移動はXZ平面で行います。Rigidbody版とCharacterController版があり、物理挙動が必要ならRigidbody、シンプルな移動ならCharacterControllerが向いています。",
    code: `<span class="cm">// PlayerMove3D.cs（Rigidbody版）</span>
<span class="kw">public class</span> <span class="type">PlayerMove3D</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed = <span class="num">5f</span>;
    <span class="kw">private</span> <span class="type">Rigidbody</span> rb;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody</span>&gt;();
        <span class="cm">// 物理で倒れないよう回転を固定</span>
        rb.freezeRotation = <span class="kw">true</span>;
    }

    <span class="kw">void</span> <span class="fn">FixedUpdate</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>); <span class="cm">// A/D</span>
        <span class="kw">float</span> v = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Vertical"</span>);   <span class="cm">// W/S</span>

        <span class="type">Vector3</span> move = <span class="kw">new</span> <span class="type">Vector3</span>(h, <span class="num">0f</span>, v) * speed;
        rb.velocity = <span class="kw">new</span> <span class="type">Vector3</span>(move.x, rb.velocity.y, move.z);
    }
}`,
    warn: "rb.freezeRotation = trueを忘れると、衝突時にキャラが物理で倒れます。3D移動では必須の設定です。",
    keywords: [
      { name:"Rigidbody", kind:"class", summary:"3D物理演算を担うコンポーネント（2DはRigidbody2D）",
        desc:"3Dの物理挙動（重力・衝突・力）を管理します。velocity・AddForce・MovePositionなどで動かします。2DのRigidbody2Dと使い方はほぼ同じですが、3D空間（Vector3）を使います。",
        syntax:"Rigidbody rb = GetComponent<Rigidbody>();\nrb.velocity = new Vector3(x, rb.velocity.y, z);",
        note:"FixedUpdate()内で操作するのが基本です。Update()では物理の更新タイミングとズレます。" },
      { name:"Rigidbody.freezeRotation", kind:"property", summary:"物理による回転を固定する",
        desc:"trueにすると物理演算による回転を無効にします。キャラクターが衝突で倒れるのを防ぎます。Inspectorの「Constraints > Freeze Rotation」と同じ設定です。",
        syntax:"rb.freezeRotation = true;",
        note:"特定軸だけ固定したい場合はrb.constraints = RigidbodyConstraints.FreezeRotationXを使います。" },
    ],
    related: [50, 51, 52]
  },

  {
    id: 50,
    icon: "🧭",
    title: "カメラの向きに合わせて移動させたい",
    desc: "カメラが向いている方向を前として移動する三人称操作の基本",
    cats: ["action","input"],
    genres: ["3daction"],
    diff: 2,
    components: ["Camera.main","Transform.forward","Vector3"],
    idea: "カメラのforwardとrightをXZ平面に投影して移動方向を求めます。これによりカメラを回しても「前」の方向が変わり、直感的な操作になります。",
    code: `<span class="cm">// CameraRelativeMove.cs</span>
<span class="kw">public class</span> <span class="type">CameraRelativeMove</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed = <span class="num">5f</span>;
    <span class="kw">private</span> <span class="type">Rigidbody</span> rb;
    <span class="kw">private</span> <span class="type">Transform</span> cam;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        rb  = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody</span>&gt;();
        rb.freezeRotation = <span class="kw">true</span>;
        cam = <span class="type">Camera</span>.main.transform;
    }

    <span class="kw">void</span> <span class="fn">FixedUpdate</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
        <span class="kw">float</span> v = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Vertical"</span>);

        <span class="cm">// カメラの前後左右をXZ平面に投影</span>
        <span class="type">Vector3</span> forward = <span class="type">Vector3</span>.<span class="fn">ProjectOnPlane</span>(cam.forward, <span class="type">Vector3</span>.up).normalized;
        <span class="type">Vector3</span> right   = <span class="type">Vector3</span>.<span class="fn">ProjectOnPlane</span>(cam.right,   <span class="type">Vector3</span>.up).normalized;

        <span class="type">Vector3</span> move = (forward * v + right * h) * speed;
        rb.velocity = <span class="kw">new</span> <span class="type">Vector3</span>(move.x, rb.velocity.y, move.z);
    }
}`,
    warn: "カメラが真下や真上を向いているとforward.normalizedがゼロになります。通常のゲームでは問題になりませんが、カメラ角度に制限を設けておくと安全です。",
    keywords: [
      { name:"Vector3.ProjectOnPlane()", kind:"method", summary:"ベクトルを平面に投影する",
        desc:"ベクトルを指定した法線の平面に投影します。カメラのforwardをXZ平面（法線=Vector3.up）に投影することで、カメラが上下に傾いていても水平方向の成分だけ取り出せます。",
        syntax:"Vector3 flat = Vector3.ProjectOnPlane(cam.forward, Vector3.up).normalized;",
        note:"投影後にnormalizedを忘れると斜め向きで大きさが変わり速度が変化します。" },
      { name:"Transform.forward", kind:"property", summary:"オブジェクトが向いているZ軸方向の単位ベクトル",
        desc:"オブジェクトのローカルZ軸をワールド座標に変換したものです。カメラの前方向・キャラの正面方向の取得に使います。transform.right（X軸）・transform.up（Y軸）も同様に使えます。",
        syntax:"Vector3 dir = transform.forward; // 前向きの単位ベクトル",
        note:"Quaternion.LookRotation(transform.forward)で向きをQuaternionに変換できます。" },
    ],
    related: [49, 53, 54]
  },

  {
    id: 51,
    icon: "⬆️",
    title: "3Dでジャンプさせたい",
    desc: "地面判定つき3Dジャンプ。SphereCastで接地を検知する",
    cats: ["action","physics"],
    genres: ["3daction"],
    diff: 2,
    components: ["Rigidbody","Physics.CheckSphere","LayerMask"],
    idea: "2Dと同様に接地判定が必要です。3DではPhysics.CheckSphere（3D版のOverlapCircle）で足元の地面を検知します。ジャンプ力はAddForceのImpulseモードで与えると自然です。",
    code: `<span class="cm">// PlayerJump3D.cs</span>
<span class="kw">public class</span> <span class="type">PlayerJump3D</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span>     jumpForce   = <span class="num">5f</span>;
    <span class="kw">public</span> <span class="type">Transform</span> groundCheck;  <span class="cm">// 足元の空オブジェクト</span>
    <span class="kw">public float</span>     checkRadius = <span class="num">0.2f</span>;
    <span class="kw">public</span> <span class="type">LayerMask</span> groundMask;
    <span class="kw">private</span> <span class="type">Rigidbody</span> rb;
    <span class="kw">private bool</span>     isGrounded;

    <span class="kw">void</span> <span class="fn">Start</span>() => rb = <span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="cm">// 足元の球で接地チェック</span>
        isGrounded = <span class="type">Physics</span>.<span class="fn">CheckSphere</span>(
            groundCheck.position, checkRadius, groundMask);

        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Space) && isGrounded)
        {
            <span class="cm">// 瞬間的な力でジャンプ</span>
            rb.velocity = <span class="kw">new</span> <span class="type">Vector3</span>(rb.velocity.x, <span class="num">0f</span>, rb.velocity.z);
            rb.<span class="fn">AddForce</span>(<span class="type">Vector3</span>.up * jumpForce, <span class="type">ForceMode</span>.Impulse);
        }
    }
}`,
    warn: "groundCheckの空オブジェクトをキャラの足元（少し下）に配置してください。キャラ本体の中心に置くと常にtrueになり空中でもジャンプできてしまいます。",
    keywords: [
      { name:"Physics.CheckSphere()", kind:"method", summary:"3D空間の球形範囲内にColliderがあるか調べる",
        desc:"2DのPhysics2D.OverlapCircle()の3D版です。中心座標・半径・LayerMaskを指定して、その球の中にColliderが存在するかをboolで返します。",
        syntax:"bool grounded = Physics.CheckSphere(groundCheck.position, 0.2f, groundMask);",
        note:"Gizmos.DrawWireSphere()でSceneビューに可視化するとデバッグが楽です。" },
      { name:"Rigidbody.AddForce()", kind:"method", summary:"Rigidbodyに力を加える",
        desc:"第1引数に力の方向と大きさ（Vector3）、第2引数にForceModeを指定します。ForceMode.Impulseは瞬間的な力（ジャンプ向き）、ForceMode.Forceは継続的な力（推進力向き）です。",
        syntax:"rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);",
        note:"ジャンプ前にvelocity.yを0にリセットすると、上昇中に再ジャンプしても跳び上がりすぎません。" },
      { name:"ForceMode", kind:"class", summary:"AddForceの力の加え方を指定する列挙型",
        desc:"Force（継続的な力）・Impulse（瞬間的な力、質量考慮）・VelocityChange（瞬間的な速度変化、質量無視）・Acceleration（継続的な加速度、質量無視）の4種類があります。",
        syntax:"rb.AddForce(dir * power, ForceMode.Impulse);",
        note:"ジャンプにはImpulse、移動にはForceまたはvelocity直接代入が一般的です。" },
    ],
    related: [49, 55, 50]
  },

  {
    id: 52,
    icon: "🔃",
    title: "キャラを移動方向に向かせたい",
    desc: "移動方向に合わせてキャラクターがスムーズに回転する",
    cats: ["action"],
    genres: ["3daction"],
    diff: 2,
    components: ["Quaternion.LookRotation","Quaternion.Slerp","Vector3"],
    idea: "移動方向のベクトルからLookRotationで目標回転を作り、Slerpで現在の回転から徐々に近づけます。これで急に向きが変わらないスムーズな回転になります。",
    code: `<span class="cm">// PlayerRotate3D.cs</span>
<span class="kw">public class</span> <span class="type">PlayerRotate3D</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> rotateSpeed = <span class="num">10f</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
        <span class="kw">float</span> v = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Vertical"</span>);

        <span class="type">Vector3</span> dir = <span class="kw">new</span> <span class="type">Vector3</span>(h, <span class="num">0f</span>, v);

        <span class="cm">// 移動入力がある場合のみ回転</span>
        <span class="kw">if</span> (dir.magnitude >= <span class="num">0.1f</span>)
        {
            <span class="cm">// 移動方向を向くQuaternionを計算</span>
            <span class="type">Quaternion</span> targetRot = <span class="type">Quaternion</span>.<span class="fn">LookRotation</span>(dir);

            <span class="cm">// 現在の回転から目標回転へ滑らかに補間</span>
            transform.rotation = <span class="type">Quaternion</span>.<span class="fn">Slerp</span>(
                transform.rotation,
                targetRot,
                rotateSpeed * <span class="type">Time</span>.deltaTime
            );
        }
    }
}`,
    warn: "dirがVector3.zeroのときLookRotationはエラーになります。magnitude >= 0.1fの条件チェックで入力がないときは回転処理をスキップしましょう。",
    keywords: [
      { name:"Quaternion.LookRotation()", kind:"method", summary:"指定した方向を向くQuaternionを返す",
        desc:"引数のVector3方向を正面（Z軸）として向くQuaternionを生成します。移動方向・敵の方向・カメラの方向などを渡すことで、その方向を向く回転を簡単に作れます。",
        syntax:"Quaternion rot = Quaternion.LookRotation(direction);",
        note:"第2引数にupwardを指定できます。省略するとVector3.upが使われます。" },
      { name:"Quaternion.Slerp()", kind:"method", summary:"2つのQuaternion間を球面補間する",
        desc:"Vector3.Lerpの回転版です。aからbへ、tの割合で球面補間した回転を返します。毎フレームtにTime.deltaTimeを掛けることで滑らかな回転アニメーションになります。",
        syntax:"transform.rotation = Quaternion.Slerp(from, to, speed * Time.deltaTime);",
        note:"Quaternion.Lerp()より計算が正確ですが、速度が遅い場合の差は小さいです。" },
      { name:"Quaternion", kind:"class", summary:"3D回転を表す4次元の数値型",
        desc:"3Dの回転を表す型です。直接数値を扱うのは難しいので、LookRotation・Euler・Slerpなどのメソッドを使って操作するのが基本です。transform.rotationはQuaternion型です。",
        syntax:"transform.rotation = Quaternion.Euler(0f, 90f, 0f); // Y軸90度回転",
        note:"オイラー角（X/Y/Z度数）への変換はtransform.eulerAnglesで取得できます。" },
    ],
    related: [49, 50, 53]
  },

  {
    id: 53,
    icon: "🎥",
    title: "三人称視点カメラを作りたい",
    desc: "プレイヤーの後ろからついてくるカメラ。Cinemachineも紹介",
    cats: ["action"],
    genres: ["3daction"],
    diff: 2,
    components: ["LateUpdate","Vector3.Lerp","Cinemachine"],
    idea: "カメラをプレイヤーからoffset分だけ離した位置に置き、LateUpdate()で追従させます。実際のゲームではCinemachineパッケージを使うと壁抜けや衝突回避も自動で処理してくれます。",
    code: `<span class="cm">// ThirdPersonCamera.cs（Cameraオブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">ThirdPersonCamera</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> target;                          <span class="cm">// プレイヤー</span>
    <span class="kw">public</span> <span class="type">Vector3</span>   offset  = <span class="kw">new</span> <span class="type">Vector3</span>(<span class="num">0</span>, <span class="num">3</span>, <span class="num">-6</span>); <span class="cm">// 後ろ上から</span>
    <span class="kw">public float</span>    smooth  = <span class="num">5f</span>;

    <span class="kw">void</span> <span class="fn">LateUpdate</span>()
    {
        <span class="cm">// プレイヤーの向きに合わせてオフセットを回転させる</span>
        <span class="type">Vector3</span> targetPos = target.position
                           + target.rotation * offset;

        transform.position = <span class="type">Vector3</span>.<span class="fn">Lerp</span>(
            transform.position, targetPos, smooth * <span class="type">Time</span>.deltaTime);

        <span class="cm">// 常にプレイヤーを見続ける</span>
        transform.<span class="fn">LookAt</span>(target.position + <span class="type">Vector3</span>.up * <span class="num">1f</span>);
    }
}`,
    warn: "壁の中にカメラが入り込む問題はこのコードでは解決しません。本格的に対処するにはCinemachineのCinemachineColliderコンポーネントを使いましょう。",
    keywords: [
      { name:"Transform.LookAt()", kind:"method", summary:"指定したターゲットの方向を向く",
        desc:"引数のTransformまたはVector3の方向にオブジェクトのZ軸を向けます。カメラが常にプレイヤーを見続ける・砲台が敵を追跡するなど「常に特定の方向を向く」処理に使います。",
        syntax:"transform.LookAt(target.position);        // Transformを渡す\ntransform.LookAt(new Vector3(0, 0, 0));  // 座標を直接渡す",
        note:"LookAt()は即座に向きを変えます。滑らかに向かせたい場合はQuaternion.Slerpと組み合わせましょう。" },
      { name:"Rotation * Vector3（クォータニオンとベクトルの乗算）", kind:"class", summary:"回転をベクトルに適用してローカル方向をワールド座標に変換する",
        desc:"target.rotation * offsetとすると、offsetベクトルをtargetの回転に合わせて変換できます。「プレイヤーの後ろ」という相対的な位置をワールド座標に変換するのに使います。",
        syntax:"Vector3 worldOffset = target.rotation * localOffset;",
        note:"Vector3をQuaternionに掛ける（Quaternion * Vector3）の順番は逆にできません。" },
    ],
    related: [54, 50, 52]
  },

  {
    id: 54,
    icon: "🖱️",
    title: "マウスでカメラを回転させたい",
    desc: "マウスの動きに合わせて視点を上下左右に動かす一人称・三人称カメラ",
    cats: ["action","input"],
    genres: ["3daction"],
    diff: 2,
    components: ["Input.GetAxis MouseX","Cursor.lockState","Mathf.Clamp"],
    idea: "マウスのデルタ値をX/Y軸の回転に変換します。水平回転はプレイヤー本体を回し、垂直回転はカメラだけを回すのが一般的です。上下の回転角度はClampで制限します。",
    code: `<span class="cm">// MouseLook.cs（Cameraに付ける。プレイヤーのTransformを渡す）</span>
<span class="kw">public class</span> <span class="type">MouseLook</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> playerBody;      <span class="cm">// プレイヤー本体</span>
    <span class="kw">public float</span>    sensitivity = <span class="num">2f</span>;
    <span class="kw">public float</span>    xClampMin   = <span class="num">-80f</span>; <span class="cm">// 見下ろし限界</span>
    <span class="kw">public float</span>    xClampMax   = <span class="num"> 80f</span>; <span class="cm">// 見上げ限界</span>
    <span class="kw">private float</span>   xRotation   = <span class="num">0f</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        <span class="cm">// カーソルを非表示にして画面中央に固定</span>
        <span class="type">Cursor</span>.lockState = <span class="type">CursorLockMode</span>.Locked;
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> mouseX = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Mouse X"</span>) * sensitivity;
        <span class="kw">float</span> mouseY = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Mouse Y"</span>) * sensitivity;

        <span class="cm">// 上下回転（カメラのみ）</span>
        xRotation -= mouseY;
        xRotation  = <span class="type">Mathf</span>.<span class="fn">Clamp</span>(xRotation, xClampMin, xClampMax);
        transform.localRotation = <span class="type">Quaternion</span>.<span class="fn">Euler</span>(xRotation, <span class="num">0f</span>, <span class="num">0f</span>);

        <span class="cm">// 左右回転（プレイヤー本体ごと回す）</span>
        playerBody.<span class="fn">Rotate</span>(<span class="type">Vector3</span>.up * mouseX);
    }
}`,
    warn: "Cursor.lockStateをLockedにしたままゲームを終了するとカーソルが戻らなくなります。OnApplicationQuitでCursorLockMode.Noneに戻す処理を入れましょう。",
    keywords: [
      { name:"Input.GetAxis(\"Mouse X/Y\")", kind:"method", summary:"マウスの移動量を取得する",
        desc:"\"Mouse X\"で水平、\"Mouse Y\"で垂直方向のマウスの移動量を返します。フレームごとの差分（デルタ値）なので、感度（sensitivity）を掛けて使います。",
        syntax:"float mouseX = Input.GetAxis(\"Mouse X\") * sensitivity;",
        note:"新しいInput SystemではMouse.current.delta.ReadValue()で取得します。" },
      { name:"Cursor.lockState", kind:"property", summary:"カーソルの表示・固定状態を制御する",
        desc:"CursorLockMode.Lockedにするとカーソルが非表示になり画面中央に固定されます。FPSやTPSゲームで視点操作中にカーソルが動かないようにするのに必須です。",
        syntax:"Cursor.lockState = CursorLockMode.Locked;   // 固定・非表示\nCursor.lockState = CursorLockMode.None;    // 通常に戻す",
        note:"CursorLockMode.Confinedは表示したままウィンドウ内に固定します。" },
      { name:"Transform.Rotate()", kind:"method", summary:"相対的に回転を加える",
        desc:"現在の回転に対して追加で回転させます。transform.rotationに加算するイメージです。引数のVector3でX/Y/Z軸の回転角度（度）を指定します。",
        syntax:"transform.Rotate(Vector3.up * angle); // Y軸回転",
        note:"ワールド座標基準で回転する場合はtransform.Rotate(axis, angle, Space.World)と指定します。" },
    ],
    related: [53, 50, 49]
  },

  {
    id: 55,
    icon: "🌍",
    title: "3Dで地面判定をしたい",
    desc: "Raycastを真下に飛ばして接地しているか検知する",
    cats: ["physics","action"],
    genres: ["3daction"],
    diff: 2,
    components: ["Physics.Raycast","RaycastHit","LayerMask"],
    idea: "足元から真下にRayを飛ばして地面に当たるか確認します。Physics.CheckSphereより判定が細かく、当たった位置や法線も取得できます。傾斜地での接地判定にも使えます。",
    code: `<span class="cm">// GroundCheck3D.cs</span>
<span class="kw">public class</span> <span class="type">GroundCheck3D</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span>     rayLength  = <span class="num">1.1f</span>; <span class="cm">// キャラの半身より少し長く</span>
    <span class="kw">public</span> <span class="type">LayerMask</span> groundMask;
    <span class="kw">private bool</span>     isGrounded;
    <span class="kw">private</span> <span class="type">RaycastHit</span> hitInfo;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="cm">// 中心から真下にRayを飛ばす</span>
        isGrounded = <span class="type">Physics</span>.<span class="fn">Raycast</span>(
            transform.position,
            <span class="type">Vector3</span>.down,
            <span class="kw">out</span> hitInfo,
            rayLength,
            groundMask
        );

        <span class="kw">if</span> (isGrounded)
        {
            <span class="cm">// 地面の法線（傾き）も取得できる</span>
            <span class="type">Debug</span>.<span class="fn">DrawRay</span>(hitInfo.point, hitInfo.normal, <span class="type">Color</span>.green);
        }
    }

    <span class="cm">// Sceneビューにデバッグ描画</span>
    <span class="kw">void</span> <span class="fn">OnDrawGizmos</span>()
    {
        <span class="type">Gizmos</span>.color = isGrounded ? <span class="type">Color</span>.green : <span class="type">Color</span>.red;
        <span class="type">Gizmos</span>.<span class="fn">DrawLine</span>(
            transform.position,
            transform.position + <span class="type">Vector3</span>.down * rayLength);
    }
}`,
    warn: "rayLengthはキャラクターの半身より少し長めに設定します。短すぎると浮いているときでも接地判定になります。キャプセルコライダーのheight/2 + 0.1fが目安です。",
    keywords: [
      { name:"Physics.Raycast() with out", kind:"method", summary:"Rayを飛ばして当たった情報を詳しく取得する",
        desc:"outキーワードでRaycastHit変数を渡すと、当たった位置(point)・法線(normal)・距離(distance)・当たったCollider(collider)などの詳細情報を受け取れます。",
        syntax:"RaycastHit hit;\nbool grounded = Physics.Raycast(origin, direction, out hit, distance, mask);",
        note:"outキーワードを使う場合は宣言時に初期化不要ですが、変数の宣言自体は必要です。" },
      { name:"RaycastHit", kind:"class", summary:"Raycastの結果（当たった情報）を格納する構造体",
        desc:"当たった点の座標(point)、面の法線(normal)、距離(distance)、当たったCollider、当たったGameObjectなどの情報を持ちます。",
        syntax:"RaycastHit hit;\nhit.point;    // 当たった座標\nhit.normal;   // 当たった面の法線\nhit.collider; // 当たったCollider",
        note:"hit.collider.gameObjectで当たったGameObjectにアクセスできます。" },
      { name:"Debug.DrawRay()", kind:"method", summary:"SceneビューにRayを描画してデバッグする",
        desc:"指定した始点から方向にラインを描画します。Raycastの当たり判定のデバッグに使います。ゲームビューには表示されません。",
        syntax:"Debug.DrawRay(start, direction * length, Color.red);",
        note:"Debug.DrawLine(start, end, color)で2点間のラインも描けます。" },
    ],
    related: [51, 56, 49]
  },

  {
    id: 56,
    icon: "⛰️",
    title: "坂道をすべらずに歩かせたい",
    desc: "傾斜面でのスリップを防いでキャラを安定して歩かせる設定",
    cats: ["physics","action"],
    genres: ["3daction"],
    diff: 1,
    components: ["PhysicMaterial","slopeLimit","CharacterController"],
    idea: "RigidbodyにPhysicMaterialで摩擦を設定する方法と、CharacterControllerのslopeLimitを使う方法があります。CharacterControllerはスロープ処理が組み込みで楽です。",
    code: `<span class="cm">// CharacterControllerMove.cs（CharacterController版）</span>
<span class="kw">public class</span> <span class="type">CharacterControllerMove</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> speed     = <span class="num">5f</span>;
    <span class="kw">public float</span> gravity   = <span class="num">-9.81f</span>;
    <span class="kw">public float</span> jumpForce = <span class="num">3f</span>;

    <span class="kw">private</span> <span class="type">CharacterController</span> cc;
    <span class="kw">private</span> <span class="type">Vector3</span> velocity;

    <span class="kw">void</span> <span class="fn">Start</span>() => cc = <span class="fn">GetComponent</span>&lt;<span class="type">CharacterController</span>&gt;();

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> h = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
        <span class="kw">float</span> v = <span class="type">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Vertical"</span>);

        <span class="type">Vector3</span> move = transform.right * h + transform.forward * v;
        cc.<span class="fn">Move</span>(move * speed * <span class="type">Time</span>.deltaTime);

        <span class="cm">// 重力を手動で加える</span>
        <span class="kw">if</span> (cc.isGrounded && velocity.y < <span class="num">0f</span>)
            velocity.y = <span class="num">-2f</span>; <span class="cm">// 地面に押しつける小さな値</span>

        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.Space) && cc.isGrounded)
            velocity.y = jumpForce;

        velocity.y += gravity * <span class="type">Time</span>.deltaTime;
        cc.<span class="fn">Move</span>(velocity * <span class="type">Time</span>.deltaTime);
    }
}`,
    warn: "CharacterControllerはPhysicsの衝突イベント（OnCollisionEnter等）が発生しません。当たり判定が必要な場合はOnControllerColliderHitを使います。",
    keywords: [
      { name:"CharacterController", kind:"class", summary:"物理演算なしでキャラ移動を制御する専用コンポーネント",
        desc:"Rigidbodyを使わずにキャラクターの移動を制御します。スロープ(slopeLimit)・段差(stepOffset)の処理が組み込まれており、地面判定(isGrounded)も内蔵しています。物理挙動が不要なキャラ移動に向いています。",
        syntax:"CharacterController cc = GetComponent<CharacterController>();\ncc.Move(moveVector * Time.deltaTime);",
        note:"cc.isGroundedで接地判定を取得できます。ただし若干不安定なため追加の判定を組み合わせることもあります。" },
      { name:"CharacterController.Move()", kind:"method", summary:"CharacterControllerを指定ベクトル分移動させる",
        desc:"引数のVector3分だけキャラを移動します。衝突や段差・スロープを自動で考慮してくれます。毎フレームTime.deltaTimeを掛けたベクトルを渡します。",
        syntax:"cc.Move(direction * speed * Time.deltaTime);",
        note:"AddForceやvelocityは使えません。重力は自前でvelocity.yを計算してMove()に渡します。" },
      { name:"PhysicMaterial", kind:"class", summary:"Colliderの摩擦・反発を設定するマテリアル",
        desc:"DynamicFriction（動摩擦）・StaticFriction（静摩擦）・Bounciness（反発）を設定します。坂でスリップするのはFrictionが低いためです。Frictionを高く設定したPhysicMaterialをColliderに設定することで対処できます。",
        syntax:"// Inspectorで作成: Project右クリック→Create→Physic Material",
        note:"PhysicMaterial（3D）とPhysicsMaterial2D（2D）は別物です。" },
    ],
    related: [49, 51, 55]
  },

  {
    id: 57,
    icon: "👆",
    title: "3DオブジェクトをクリックしたいRaycast",
    desc: "マウスクリックで3D空間のオブジェクトを選択・操作する",
    cats: ["input","physics"],
    genres: ["3daction"],
    diff: 2,
    components: ["Camera.ScreenPointToRay","Physics.Raycast","RaycastHit"],
    idea: "カメラからマウスカーソル方向にRayを飛ばし、当たったオブジェクトを取得します。「クリックしたオブジェクトに命令する」「マウスの先にエフェクトを出す」など幅広く使えます。",
    code: `<span class="cm">// ClickObject.cs（Cameraに付ける）</span>
<span class="kw">public class</span> <span class="type">ClickObject</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span>     rayDistance = <span class="num">100f</span>;
    <span class="kw">public</span> <span class="type">LayerMask</span> clickMask;   <span class="cm">// クリック対象のレイヤー</span>

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">if</span> (!<span class="type">Input</span>.<span class="fn">GetMouseButtonDown</span>(<span class="num">0</span>)) <span class="kw">return</span>;

        <span class="cm">// スクリーン座標からRayを生成</span>
        <span class="type">Ray</span> ray = <span class="type">Camera</span>.main.<span class="fn">ScreenPointToRay</span>(<span class="type">Input</span>.mousePosition);
        <span class="type">RaycastHit</span> hit;

        <span class="kw">if</span> (<span class="type">Physics</span>.<span class="fn">Raycast</span>(ray, <span class="kw">out</span> hit, rayDistance, clickMask))
        {
            <span class="type">Debug</span>.<span class="fn">Log</span>(<span class="str">"クリック: "</span> + hit.collider.gameObject.name);

            <span class="cm">// クリックされたオブジェクトの処理を呼ぶ</span>
            <span class="type">IClickable</span> clickable = hit.collider.<span class="fn">GetComponent</span>&lt;<span class="type">IClickable</span>&gt;();
            clickable?.<span class="fn">OnClick</span>(hit.point);
        }
    }
}

<span class="cm">// クリック可能なオブジェクトに付けるインターフェース</span>
<span class="kw">public interface</span> <span class="type">IClickable</span>
{
    <span class="kw">void</span> <span class="fn">OnClick</span>(<span class="type">Vector3</span> hitPoint);
}`,
    warn: "UIのButtonとRaycastが重なるとゲームオブジェクトにもクリックが貫通することがあります。EventSystem.current.IsPointerOverGameObject()でUI上かチェックしてからRaycastすると安全です。",
    keywords: [
      { name:"Camera.ScreenPointToRay()", kind:"method", summary:"スクリーン座標からワールド空間へのRayを生成する",
        desc:"スクリーン上のピクセル座標（マウス位置など）からカメラを通してワールド空間へ飛ぶRayを生成します。3Dオブジェクトのクリック判定に必須のメソッドです。",
        syntax:"Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);",
        note:"Input.mousePositionはスクリーン左下が(0,0)、右上が(Screen.width, Screen.height)です。" },
      { name:"interface（インターフェース）", kind:"class", summary:"メソッドの型だけ定義して実装を強制する仕組み",
        desc:"IClickableのように「OnClick()を持つ」という契約だけ定義します。実装クラスはOnClick()の中身を自由に決められます。GetComponent<IClickable>()でインターフェースを実装したコンポーネントを取得でき、オブジェクトの種類に関わらず統一的に扱えます。",
        syntax:"public interface IClickable { void OnClick(Vector3 point); }\npublic class Enemy : MonoBehaviour, IClickable { public void OnClick(Vector3 p) { } }",
        note:"インターフェースはMonoBehaviourを継承できません。クラスに実装させて使います。" },
      { name:"Input.GetMouseButtonDown()", kind:"method", summary:"マウスボタンが押された瞬間を検知する",
        desc:"引数0が左クリック、1が右クリック、2が中クリックです。GetMouseButton()は押し続けている間、GetMouseButtonDown()は押した瞬間のみtrueを返します。",
        syntax:"if (Input.GetMouseButtonDown(0)) { // 左クリック }",
        note:"新しいInput SystemではMouse.current.leftButton.wasPressedThisFrameで取得します。" },
    ],
    related: [54, 55, 50]
  },

  {
    id: 58,
    icon: "🗺️",
    title: "NavMeshで敵をナビゲーションさせたい",
    desc: "NavMeshを焼き付けてNavMeshAgentで障害物を避けて移動させる基本設定",
    cats: ["enemy","action"],
    genres: ["3daction"],
    diff: 2,
    components: ["NavMeshAgent","NavMesh","SetDestination"],
    idea: "まずシーンのメッシュをNavMeshとしてベイクします。その後NavMeshAgentコンポーネントをつけてSetDestination()で目標を指定するだけで自動でパスを見つけて移動します。",
    code: `<span class="cm">// NavMeshEnemy.cs</span>
<span class="kw">using</span> UnityEngine.AI;

<span class="kw">public class</span> <span class="type">NavMeshEnemy</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> player;
    <span class="kw">public float</span>    updateInterval = <span class="num">0.5f</span>; <span class="cm">// パス再計算の間隔</span>

    <span class="kw">private</span> <span class="type">NavMeshAgent</span> agent;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        agent = <span class="fn">GetComponent</span>&lt;<span class="type">NavMeshAgent</span>&gt;();
        <span class="cm">// 一定間隔で目的地を更新（毎フレームは重い）</span>
        <span class="fn">InvokeRepeating</span>(<span class="str">"UpdateDestination"</span>, <span class="num">0f</span>, updateInterval);
    }

    <span class="kw">void</span> <span class="fn">UpdateDestination</span>()
    {
        <span class="kw">if</span> (player != <span class="kw">null</span>)
            agent.<span class="fn">SetDestination</span>(player.position);
    }

    <span class="cm">// 目的地まであとどれくらいか確認</span>
    <span class="kw">bool</span> <span class="fn">HasArrived</span>()
    {
        <span class="kw">return</span> !agent.pathPending
            && agent.remainingDistance <= agent.stoppingDistance;
    }
}`,
    warn: "NavMeshはWindow > AI > Navigationでベイクします。動く障害物（扉など）には通常のNavMeshは対応しません。NavMeshObstacleコンポーネントを使いましょう。",
    keywords: [
      { name:"NavMeshAgent", kind:"class", summary:"NavMesh上を自動でパスを見つけて移動するコンポーネント",
        desc:"SetDestination()で目的地を指定するだけで、障害物を避けながら自動でルートを探索・移動します。speed・angularSpeed・stoppingDistanceなどの移動パラメータをInspectorで設定できます。",
        syntax:"agent.SetDestination(targetPosition);",
        note:"using UnityEngine.AI;が必要です。" },
      { name:"NavMeshAgent.SetDestination()", kind:"method", summary:"NavMeshAgentの目標地点を設定する",
        desc:"引数のVector3座標をNavMesh上の最近傍点に向かって自動でパスを計算・移動します。毎フレーム呼ぶと計算が重いため、InvokeRepeatingやコルーチンで間隔を空けるのがポイントです。",
        syntax:"agent.SetDestination(player.position);",
        note:"agent.isStopped = trueで移動を一時停止、falseで再開できます。" },
      { name:"NavMeshのベイク", kind:"class", summary:"シーンの歩行可能エリアを事前計算して保存する",
        desc:"Window > AI > Navigationを開き、静的なオブジェクトをNavigation Static（InspectorのStaticフラグ）に設定して「Bake」ボタンを押します。これで青く表示された歩行可能エリア（NavMesh）が生成されます。",
        syntax:"// コードではなくエディタ操作: Window > AI > Navigation > Bake",
        note:"ランタイムで動的にNavMeshを変更するにはNavMeshSurfaceコンポーネント（AI Navigationパッケージ）を使います。" },
    ],
    related: [59, 7, 41]
  },

  {
    id: 59,
    icon: "🔍",
    title: "NavMeshで障害物を避けて追いかけさせたい",
    desc: "視野角判定と組み合わせてプレイヤーを発見したら追跡するAI",
    cats: ["enemy","action"],
    genres: ["3daction"],
    diff: 3,
    components: ["NavMeshAgent","enum","Vector3.Distance"],
    idea: "Patrol（巡回）とChase（追跡）の状態をenumで管理します。視野に入ったらChaseに切り替えてSetDestinationでプレイヤーを追い、見失ったらPatrolに戻します。",
    code: `<span class="cm">// NavMeshAI.cs</span>
<span class="kw">using</span> UnityEngine.AI;

<span class="kw">public class</span> <span class="type">NavMeshAI</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public enum</span> <span class="type">State</span> { Patrol, Chase }
    <span class="kw">public</span> <span class="type">State</span> state = <span class="type">State</span>.Patrol;

    <span class="kw">public</span> <span class="type">Transform</span>   player;
    <span class="kw">public</span> <span class="type">Transform</span>[] waypoints;    <span class="cm">// 巡回ポイント</span>
    <span class="kw">public float</span>      sightRange  = <span class="num">8f</span>;
    <span class="kw">public float</span>      loseRange   = <span class="num">12f</span>; <span class="cm">// 見失う距離</span>

    <span class="kw">private</span> <span class="type">NavMeshAgent</span> agent;
    <span class="kw">private int</span>          waypointIdx = <span class="num">0</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        agent = <span class="fn">GetComponent</span>&lt;<span class="type">NavMeshAgent</span>&gt;();
        <span class="fn">GoToNextWaypoint</span>();
    }

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="kw">float</span> dist = <span class="type">Vector3</span>.<span class="fn">Distance</span>(transform.position, player.position);

        <span class="kw">switch</span> (state)
        {
            <span class="kw">case</span> <span class="type">State</span>.Patrol:
                <span class="cm">// 巡回中：ウェイポイントを順番に移動</span>
                <span class="kw">if</span> (!agent.pathPending && agent.remainingDistance < <span class="num">0.5f</span>)
                    <span class="fn">GoToNextWaypoint</span>();

                <span class="kw">if</span> (dist < sightRange) state = <span class="type">State</span>.Chase;
                <span class="kw">break</span>;

            <span class="kw">case</span> <span class="type">State</span>.Chase:
                <span class="cm">// 追跡中：プレイヤーへ向かう</span>
                agent.<span class="fn">SetDestination</span>(player.position);

                <span class="kw">if</span> (dist > loseRange) state = <span class="type">State</span>.Patrol;
                <span class="kw">break</span>;
        }
    }

    <span class="kw">void</span> <span class="fn">GoToNextWaypoint</span>()
    {
        <span class="kw">if</span> (waypoints.Length == <span class="num">0</span>) <span class="kw">return</span>;
        agent.<span class="fn">SetDestination</span>(waypoints[waypointIdx].position);
        waypointIdx = (waypointIdx + <span class="num">1</span>) % waypoints.Length;
    }
}`,
    warn: "waypointsが空のまま実行するとGoToNextWaypoint()でエラーになります。Inspectorで必ず巡回ポイントをセットするか、コードでnullチェックを入れましょう。",
    keywords: [
      { name:"NavMeshAgent.remainingDistance", kind:"property", summary:"目的地までの残り距離を返す",
        desc:"現在のパス上の残り距離を返します。stoppingDistanceと比較して「目的地に着いたか」を判定するのに使います。pathPendingがtrueの間はパス計算中なので値が正確でない場合があります。",
        syntax:"if (!agent.pathPending && agent.remainingDistance < 0.5f) { // 到着 }",
        note:"remainingDistanceはNavMesh上の経路距離なので、直線距離のVector3.Distanceとは値が異なります。" },
      { name:"% 演算子（剰余）", kind:"class", summary:"割り算の余りを返す。配列のループに便利",
        desc:"waypointIdx % waypoints.Lengthとすることで、インデックスが配列の長さを超えると自動で0に戻ります。配列を無限にループさせるときの定番テクニックです。",
        syntax:"waypointIdx = (waypointIdx + 1) % waypoints.Length; // 0→1→2→0→…",
        note:"C#の%演算子は負の数でも余りを返します（例：-1 % 3 = -1）。インデックスが負にならないよう注意してください。" },
    ],
    related: [58, 41, 39]
  },

  {
    id: 60,
    icon: "🪃",
    title: "オブジェクトをつかんで投げたい",
    desc: "プレイヤーがオブジェクトに近づいてEキーでつかみ、クリックで投げる",
    cats: ["physics","action"],
    genres: ["3daction"],
    diff: 3,
    components: ["Rigidbody","SetParent","AddForce","isKinematic"],
    idea: "つかんでいる間はRigidbodyをisKinematic=trueにしてプレイヤーの子オブジェクトにします。投げるときはisKinematic=falseに戻してカメラの前方方向にAddForceします。",
    code: `<span class="cm">// Pickup.cs（プレイヤーに付ける）</span>
<span class="kw">public class</span> <span class="type">Pickup</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public</span> <span class="type">Transform</span> holdPoint;      <span class="cm">// 持つ位置（カメラ前方の空オブジェクト）</span>
    <span class="kw">public float</span>    pickupRange = <span class="num">2f</span>;
    <span class="kw">public float</span>    throwForce  = <span class="num">10f</span>;
    <span class="kw">public</span> <span class="type">LayerMask</span> pickupMask;

    <span class="kw">private</span> <span class="type">Rigidbody</span> heldObj = <span class="kw">null</span>;

    <span class="kw">void</span> <span class="fn">Update</span>()
    {
        <span class="cm">// Eキーでつかむ / 離す</span>
        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetKeyDown</span>(<span class="type">KeyCode</span>.E))
        {
            <span class="kw">if</span> (heldObj == <span class="kw">null</span>) <span class="fn">TryPickup</span>();
            <span class="kw">else</span>                  <span class="fn">Drop</span>();
        }

        <span class="cm">// 左クリックで投げる</span>
        <span class="kw">if</span> (<span class="type">Input</span>.<span class="fn">GetMouseButtonDown</span>(<span class="num">0</span>) && heldObj != <span class="kw">null</span>)
            <span class="fn">Throw</span>();
    }

    <span class="kw">void</span> <span class="fn">TryPickup</span>()
    {
        <span class="type">Collider</span>[] hits = <span class="type">Physics</span>.<span class="fn">OverlapSphere</span>(
            transform.position, pickupRange, pickupMask);

        <span class="kw">if</span> (hits.Length == <span class="num">0</span>) <span class="kw">return</span>;

        <span class="type">Rigidbody</span> rb = hits[<span class="num">0</span>].<span class="fn">GetComponent</span>&lt;<span class="type">Rigidbody</span>&gt;();
        <span class="kw">if</span> (rb == <span class="kw">null</span>) <span class="kw">return</span>;

        heldObj = rb;
        heldObj.isKinematic = <span class="kw">true</span>;            <span class="cm">// 物理を無効化</span>
        heldObj.transform.<span class="fn">SetParent</span>(holdPoint); <span class="cm">// 手の子に</span>
        heldObj.transform.localPosition = <span class="type">Vector3</span>.zero;
    }

    <span class="kw">void</span> <span class="fn">Drop</span>()
    {
        heldObj.transform.<span class="fn">SetParent</span>(<span class="kw">null</span>);
        heldObj.isKinematic = <span class="kw">false</span>;
        heldObj = <span class="kw">null</span>;
    }

    <span class="kw">void</span> <span class="fn">Throw</span>()
    {
        heldObj.transform.<span class="fn">SetParent</span>(<span class="kw">null</span>);
        heldObj.isKinematic = <span class="kw">false</span>;
        heldObj.<span class="fn">AddForce</span>(<span class="type">Camera</span>.main.transform.forward * throwForce,
                          <span class="type">ForceMode</span>.Impulse);
        heldObj = <span class="kw">null</span>;
    }
}`,
    warn: "isKinematic=trueのオブジェクトは物理演算を受けませんが、他のRigidbodyへの衝突は与えられます。持っている間に壁を貫通しないようholdPointの位置とpickupRangeを調整しましょう。",
    keywords: [
      { name:"Rigidbody.isKinematic", kind:"property", summary:"物理演算の影響を受けるかどうかを切り替える",
        desc:"trueにすると重力・衝突による力を受けなくなります（コードによる移動は可能）。falseで通常の物理演算に戻ります。オブジェクトを「手でつかむ」演出に使います。",
        syntax:"rb.isKinematic = true;  // 物理オフ（手で持つ）\nrb.isKinematic = false; // 物理オン（投げる）",
        note:"isKinematic=trueのままAddForce()を呼んでも効果がありません。投げる前にfalseに戻しましょう。" },
      { name:"Physics.OverlapSphere()", kind:"method", summary:"3D空間の球形範囲内のColliderを全て返す",
        desc:"2DのOverlapCircleAll()の3D版です。Collider[]を返します。近くのオブジェクトを一括取得したいときに使います。",
        syntax:"Collider[] hits = Physics.OverlapSphere(center, radius, layerMask);",
        note:"OverlapSphereNonAlloc()を使うと配列を事前に用意してGCアロケーションを抑えられます。" },
    ],
    related: [57, 51, 49]
  },

  {
    id: 61,
    icon: "🚪",
    title: "ドアをヒンジで開けたい",
    desc: "HingeJointを使ってドアが物理的にスイングして開く",
    cats: ["physics","action"],
    genres: ["3daction"],
    diff: 2,
    components: ["HingeJoint","JointMotor","JointLimits"],
    idea: "HingeJointをドアに付けてモーターで回転させます。スイングの上限・下限をJointLimitsで設定します。プレイヤーが触れたときにモーターをオンにするだけで開閉できます。",
    code: `<span class="cm">// Door3D.cs（ドアオブジェクトに付ける）</span>
<span class="kw">public class</span> <span class="type">Door3D</span> : <span class="type">MonoBehaviour</span>
{
    <span class="kw">public float</span> openAngle  = <span class="num">90f</span>; <span class="cm">// 開く角度</span>
    <span class="kw">public float</span> motorSpeed = <span class="num">60f</span>; <span class="cm">// 開く速度（度/秒）</span>
    <span class="kw">private</span> <span class="type">HingeJoint</span> hinge;
    <span class="kw">private bool</span>       isOpen = <span class="kw">false</span>;

    <span class="kw">void</span> <span class="fn">Start</span>()
    {
        hinge = <span class="fn">GetComponent</span>&lt;<span class="type">HingeJoint</span>&gt;();

        <span class="cm">// 回転範囲の上下限を設定</span>
        <span class="type">JointLimits</span> limits = hinge.limits;
        limits.min = <span class="num">0f</span>;
        limits.max = openAngle;
        hinge.limits     = limits;
        hinge.useLimits  = <span class="kw">true</span>;
    }

    <span class="kw">void</span> <span class="fn">OnTriggerEnter</span>(<span class="type">Collider</span> other)
    {
        <span class="kw">if</span> (other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) <span class="fn">OpenDoor</span>();
    }

    <span class="kw">void</span> <span class="fn">OpenDoor</span>()
    {
        <span class="kw">if</span> (isOpen) <span class="kw">return</span>;
        isOpen = <span class="kw">true</span>;

        <span class="cm">// モーターを使って自動で開く</span>
        <span class="type">JointMotor</span> motor = hinge.motor;
        motor.targetVelocity = motorSpeed;
        motor.force          = <span class="num">50f</span>;
        hinge.motor    = motor;
        hinge.useMotor = <span class="kw">true</span>;
    }
}`,
    warn: "HingeJointのAnchor（回転軸の支点）の位置がドアの中心だと、ドアが中心を軸に回転します。ドアのヒンジ側（端）にAnchorを設定してください。",
    keywords: [
      { name:"HingeJoint", kind:"class", summary:"2つのオブジェクトを1軸のヒンジで接続する物理コンポーネント",
        desc:"ドア・蓋・関節など「1軸を中心に回転する」物理挙動を実現します。Anchor（支点）・Axis（回転軸）・Limits（回転範囲）・Motor（自動回転）・Spring（バネ）を設定できます。",
        syntax:"HingeJoint hinge = GetComponent<HingeJoint>();\nhinge.useMotor = true;",
        note:"HingeJointはConnected Bodyに接続先を指定できます。指定しなければワールド空間に固定されます。" },
      { name:"JointMotor", kind:"class", summary:"Jointを自動で回転させるモーター設定",
        desc:"targetVelocity（目標回転速度）とforce（最大トルク）を設定してhinge.motorに代入し、useMotor=trueにすることでモーター動作が始まります。",
        syntax:"JointMotor motor = hinge.motor;\nmotor.targetVelocity = 60f;\nmotor.force = 50f;\nhinge.motor = motor;\nhinge.useMotor = true;",
        note:"JointMotorはstructなのでhinge.motorをローカル変数に取り出して変更し代入し直す必要があります（直接変更不可）。" },
      { name:"OnTriggerEnter()", kind:"event", summary:"3DのTriggerに入った瞬間に呼ばれる（引数はCollider）",
        desc:"2DのOnTriggerEnter2Dの3D版です。引数がCollider2DではなくColliderになります。Is TriggerがONのColliderに他のColliderが入った瞬間に呼ばれます。",
        syntax:"void OnTriggerEnter(Collider other) { }",
        note:"3DのコライダーイベントはすべてCollider型を引数に取ります（2Dと区別してください）。" },
    ],
    related: [5, 29, 60]
  }
];


const GENRE_TAGS = {
  "2daction":  { label:"2Dアクション", ids:[1,2,3,4,5,6,7,8,9,10,14,15,16,17,18,19,20,21,26,28,29,31,32,33,34,35,36,37,38,39,40,41,42,43,44,47,48] },
  "shooting":  { label:"シューティング", ids:[1,9,10,11,13,22,23,24,25,26,32,33,34,36,37,38,41,42,43,44,46,47,48] },
  "puzzle":    { label:"パズル", ids:[5,10,13,27,28,29,30,31,33,34,35,37,43,44,48] },
  "runner":    { label:"ランゲーム", ids:[2,10,11,12,13,20,22,32,33,34,37,43,44,45,46,48] },
  "3daction":  { label:"3Dアクション", ids:[49,50,51,52,53,54,55,56,57,58,59,60,61] }
};
