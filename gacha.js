// The published app has no persistence. Keep results in memory and never touch browser storage.
const APP_VERSION = '1.0.0';
const S = {}, L = {};
const SCENE_FIELDS = ['ポーズ','人物の向き','表示範囲','カメラ角度','構図タイプ'];
const recentScenes = [];
function rememberScene() {
  recentScenes.push(Object.fromEntries(SCENE_FIELDS.map(k=>[k,S[k]])));
  if(recentScenes.length>5)recentScenes.shift();
}
function freshPool(key,pool) {
  const unused=pool.filter(value=>!recentScenes.some(scene=>scene[key]===value));
  return unused.length?unused:pool;
}
let gender = 'random', currentGender = 'male', outfitGenre = 'すべてのジャンル', poseGenre = 'すべて';
let promptLanguage = 'en', qualityEnabled = false;
let outfitDetails = {signature:'',parts:[],revision:0};
const pick = values => values[Math.floor(Math.random() * values.length)];
const entries = text => text.split('\n').filter(Boolean).map(line => line.split('|'));
const HAIR_COLORS = entries(`ブラック|black|dark
ダークブラウン|dark brown|dark
ブラウン|brown|brown
ライトブラウン|light brown|brown
ベージュ|beige|beige
アッシュブラウン|ash brown|brown
グレージュ|greige|beige
グレー|gray|gray
ホワイト|white|light
シルバー|silver|light
ピンクベージュ|pink beige|pink
ラベンダー|lavender|purple
ネイビー|navy blue|dark
カーキ|khaki|green
ブルー|blue|blue
グリーン|green|green
レッド|red|red
オレンジ|orange|orange
ゴールド|golden blonde|gold
パープル|purple|purple`);
const DESIGNS = entries(`単色||55
ツートン|two-tone hair|10
インナーカラー|inner hair color|10
毛先カラー|colored hair tips|7
グラデーション|gradient hair color|7
メッシュ|hair highlights|5
フェイスフレーミング|face-framing highlights|4
根元暗め|dark roots|2`);
const HAIR_SWATCHES = ['#111111','#453029','#795238','#B88762','#D8C3A5','#827367','#A69D90','#808080','#FFFFFF','#C0C0C0','#D8A7B1','#B57EDC','#192B55','#81815B','#397BD0','#448C59','#BF3545','#E68B37','#D4AF37','#8545AD'];
const EXPRESSIONS = entries(`優しい微笑み|gentle smile
満面の笑み|big smile
ニヤリ|smirk
いたずらっぽい笑顔|mischievous smile
無表情|expressionless
不機嫌|unamused expression
真剣|serious expression
気怠げ|languid expression
眠たげ|sleepy expression
照れ顔|shy smile, blush
挑発的な笑み|provocative smile
悲しげ|sad expression
泣き顔|crying
怒り顔|angry expression
驚き|surprised expression
困り顔|troubled expression
不敵な笑み|confident smirk
冷たい視線|cold stare
恥ずかしそう|embarrassed expression
恍惚|blissful expression`);
const ACCESSORIES = entries(`なし|
眼鏡|glasses
細フレーム眼鏡|thin frame glasses
サングラス|sunglasses
眼帯|eyepatch
複数ピアス|multiple ear piercings
イヤーカフ|ear cuff
リップピアス|lip piercing
ネックレス|necklace
チョーカー|choker
スカーフ|scarf
シルバーリング|silver rings
腕時計|wristwatch
ブレスレット|bracelet
手袋|gloves
ヘッドホン|headphones
ヘアピン|hairpin
帽子|hat
黒ネイル|black nails
タトゥー|tattoo`);
// Retain non-occupational legacy accessories; merge メガネ into 眼鏡.
const occupationalItems = new Set(['マイク','聴診器','工具','調理器具','カメラ','フィルムカメラ','万年筆','魔導書','羽根ペン','聖印','数珠','ロザリオ','スマートフォン','コーヒーカップ','ワイングラス','トランプ','タロットカード','魔法石','水晶','小瓶','手紙']);
DATA.common.小物.forEach(name => {
  if (name !== 'メガネ' && !occupationalItems.has(name) && !ACCESSORIES.some(x => x[0] === name)) ACCESSORIES.push([name, EN[name]]);
});
ACCESSORIES.push(['アームカバー','arm covers']);
const POSES = entries(`直立|standing upright
振り向き|looking back
壁にもたれる|leaning against wall
腕組み|arms crossed
座る|sitting
片手をポケットに|hand in pocket
髪をかき上げる|sweeping hair back
手を伸ばす|reaching toward viewer
頬杖|resting chin on hand
襟元を直す|adjusting collar
歩く|walking
走る|running
跳躍|jumping
身体をひねる|twisting torso
身を乗り出す|leaning forward
しゃがむ|crouching
膝をつく|kneeling
階段に座る|sitting on stairs
片手を腰に|hand on hip
両手を広げる|arms spread wide
自然に座る|sitting casually
眼鏡を直す|adjusting glasses
小物を自然に持つ|holding the accessory naturally
少し身体をこちらに向ける|turning slightly toward the viewer
自信のある立ち姿|confident standing pose
袖をまくる|rolling up sleeves
ネクタイを緩める|loosening tie
片膝をつく|kneeling on one knee
伸びをする|stretching`);
const DIRECTIONS = entries(`真正面|front view
斜め45度|three-quarter view
横顔・右向き|profile view, facing right
横顔・左向き|profile view, facing left
背面|back view
振り向き|looking back over shoulder
斜め後ろ|rear three-quarter view
顔だけ正面|body turned sideways, face toward viewer`);
const ANGLES = entries(`目線の高さ|eye-level shot
ローアングル|low angle
強めの煽り|extreme low angle
軽い俯瞰|slightly high angle
真上から|overhead shot
ダッチアングル|dutch angle
斜め下から|low three-quarter angle
斜め上から|high three-quarter angle
地面すれすれ|ground-level shot
肩越し|over-the-shoulder shot
俯瞰|high angle`);
const ATMOSPHERES = entries(`鮮やか・高彩度|vibrant atmosphere, vivid contrast
映画的|cinematic atmosphere
ダーク|dark moody atmosphere
幻想的|ethereal atmosphere
爽やか|fresh bright atmosphere
退廃的|decadent atmosphere
柔らかい|soft warm atmosphere
ネオン|neon lighting
重厚|dramatic atmosphere
ノスタルジック|nostalgic atmosphere`);
const OUTFITS = {
  '現代・カジュアル': ['モード系','カジュアル','ヴィンテージ','ミニマル'],
  'ストリート・治安悪め': ['ストリート','ロック','パンク'],
  'フォーマル・制服': ['クラシック','フォーマル','スーツスタイル','プレッピー','ミリタリー','軍服'],
  '和装・伝統・民族': ['和装','和モダン','チャイナスタイル'],
  'ファンタジー': ['王侯貴族風','ファンタジー衣装'],
  'ダークファンタジー': ['ゴシック','ゴシックロリータ','ダークファンタジー'],
  'SF・近未来': ['テックウェア','スチームパンク','サイバーパンク'],
  '現代×ファンタジー': [],
  'スポーツ・その他': ['スポーティ']
};
const newOutfits = {
  'ファンタジー': `冒険者|adventurer outfit
剣士|fantasy swordsman outfit
弓使い|fantasy archer outfit
盗賊|fantasy rogue outfit
錬金術師|alchemist outfit
召喚士|summoner robes
精霊使い|spirit tamer outfit
宮廷魔術師|court mage robes
聖騎士|paladin armor
傭兵|fantasy mercenary outfit
王国騎士|royal knight uniform
旅人|fantasy traveler outfit
竜騎士|dragoon armor
狩人|fantasy hunter outfit
吟遊詩人|bard outfit`,
  'ダークファンタジー': `呪術師|occult sorcerer robes
死神風衣装|grim reaper attire
堕天使風衣装|fallen angel attire
黒騎士|black knight armor
暗黒貴族|dark noble attire
魔剣士|cursed swordsman outfit
亡国の王子|fallen prince outfit
魔族貴族|demonic noble attire
葬儀司祭|funeral priest robes
退廃貴族|decadent aristocrat attire`,
  'SF・近未来': `未来都市の捜査官|futuristic detective outfit
近未来スーツ|futuristic bodysuit
サイバー傭兵|cyber mercenary outfit
宇宙船クルー|space crew uniform
宇宙軍士官|space officer uniform
ハッカー|cyber hacker outfit
強化兵|enhanced soldier armor
SF整備士|sci-fi mechanic outfit
未来研究員|futuristic researcher outfit
AIオペレーター|AI operator uniform`,
  '現代×ファンタジー': `現代魔法使い|modern mage outfit
現代退魔師|modern exorcist outfit
魔法学園制服|fantasy academy uniform
ストリート王子|street prince outfit
テック騎士|tech knight outfit
ゴシック神官|gothic priest outfit
現代吸血鬼|modern vampire attire
現代陰陽師|modern onmyoji outfit
サイバー神官|cyber priest outfit
和風幻想制服|fantasy japanese uniform`
};
Object.entries(newOutfits).forEach(([genre, text]) => entries(text).forEach(([name, tag]) => {
  OUTFITS[genre].push(name); EN[name] = tag;
}));
// Keep legacy labels for equivalent outfits (錬金術師 already exists).
const expandedOutfits = {
  '現代・カジュアル': `ハーフジップニット|half-zip knit sweater
ムートンジャケット|shearling jacket
MA-1|MA-1 bomber jacket
ライダースジャケット|biker leather jacket`,
  'ストリート・治安悪め': `ダメージニット|distressed knit sweater
ハーネスファッション|fashion harness outfit
韓国ストリート|Korean streetwear
Y2Kストリート|Y2K streetwear
レーシングジャケット|racing jacket`,
  'フォーマル・制服': `スリーピーススーツ|three-piece suit
礼装軍服|ceremonial military uniform`,
  '和装・伝統・民族': `陰陽師装束|onmyoji robes
武侠風衣装|wuxia warrior robes`,
  'ファンタジー': `砂漠の旅人|desert traveler outfit`
};
Object.entries(expandedOutfits).forEach(([genre,text])=>entries(text).forEach(([name,tag])=>{
  if(!Object.values(OUTFITS).flat().some(existing=>existing===name||EN[existing]===tag)){
    OUTFITS[genre].push(name);EN[name]=tag;
  }
}));
const FRONT_DIRECTIONS = ['真正面','斜め45度','横顔・右向き','横顔・左向き'];
const REAR_DIRECTIONS = ['振り向き','斜め後ろ'];
const MOBILE_DIRECTIONS = [...FRONT_DIRECTIONS,'背面'];
const POSE_DIRECTIONS = Object.fromEntries(POSES.map(([name])=>[name,[...FRONT_DIRECTIONS]]));
['振り向き'].forEach(name=>POSE_DIRECTIONS[name]=REAR_DIRECTIONS);
['歩く','走る','伸びをする','直立','腕組み','座る','自然に座る','両手を広げる','跳躍'].forEach(name=>POSE_DIRECTIONS[name]=MOBILE_DIRECTIONS);
['身体をひねる','少し身体をこちらに向ける'].forEach(name=>POSE_DIRECTIONS[name]=[...FRONT_DIRECTIONS,'顔だけ正面']);
function poseDirections(name) {return POSE_DIRECTIONS[name]||FRONT_DIRECTIONS;}
function compatiblePoses(pool) {
  const valid=pool.filter(name=>(!L.人物の向き||poseDirections(name).includes(S.人物の向き)) &&
    !(name==='眼鏡を直す'&&![S.小物1,S.小物2].some(x=>['眼鏡','細フレーム眼鏡','サングラス'].includes(x))) &&
    !(name==='小物を自然に持つ'&&[S.小物1,S.小物2].every(x=>x==='なし')));
  return valid.length?valid:pool;
}
const hairStyles = [...new Set(DATA.common.髪型.map(([length,,texture]) => `${length} × ${texture}`))];
const hairLengths = [...new Set(DATA.common.髪型.map(x=>x[0]))];
const hairTextures = [...new Set(DATA.common.髪型.map(x=>x[2]))];
const bangs = [...new Set(DATA.common.髪型.map(x => x[1]))];
const allOutfits = Object.values(OUTFITS).flat();
const ACTION_POSES = entries(`駆け出す|starting to run
全力疾走|sprinting
大きく跳躍|leaping through the air
身体をひねる|twisting torso
急旋回|sharp turning motion
振り向きざま|turning around suddenly
前に踏み込む|stepping forward forcefully
片膝で着地|landing on one knee
空中で回転|midair body rotation
身を翻す|pivoting body dynamically
後ろへ仰け反る|leaning backward
身を乗り出す|leaning forward
低い姿勢で構える|low crouching stance
横に飛び退く|jumping sideways
手を前方に突き出す|thrusting one hand forward
腕を大きく広げる|spreading arms wide
空中で膝を引き寄せる|airborne with knees bent
段差を飛び越える|vaulting over an obstacle
コートを翻して振り返る|turning around, coat flaring
地面に手をついて着地|landing with one hand on ground`);
ACTION_POSES.forEach(row=>{if(!POSES.some(x=>x[0]===row[0]||x[1]===row[1]))POSES.push(row);});
ACTION_POSES.forEach(([name])=>{if(!POSE_DIRECTIONS[name])POSE_DIRECTIONS[name]=MOBILE_DIRECTIONS;});
['振り向きざま','コートを翻して振り返る'].forEach(name=>POSE_DIRECTIONS[name]=REAR_DIRECTIONS);
const ACTION_NAMES = new Set(['袖をまくる','ネクタイを緩める','伸びをする','歩く','走る','跳躍','髪をかき上げる','襟元を直す',...ACTION_POSES.map(x=>x[0])]);
const FRAMINGS = entries(`指定なし|
全身|full-body composition
腰上|waist-up composition
太ももまで|cowboy shot
胸上|bust shot
顔アップ|close-up portrait`);
const COMPOSITIONS = entries(`斜め構図|diagonal composition
強い遠近感|exaggerated perspective
大胆な短縮法|dramatic foreshortening
前景強調|prominent foreground
非対称構図|asymmetrical composition
大胆なトリミング|dynamic cropping
奥行き構図|layered depth composition
対角線の動き|diagonal motion composition
画面いっぱいの人物|frame-filling composition
広い余白|intentional negative space
奥から手前への動き|movement toward camera
手前から奥への動き|movement away from camera
放射状構図|radial composition
S字の流れ|S-curve composition
背景と人物の一体構図|environmental composition
ダイナミック構図|dynamic composition
人物中心構図|character-focused composition
映画的構図|cinematic composition
環境ポートレート|environmental portrait`);
const additionalAtmospheres = entries(`ダイナミック|dynamic visual energy
ハイインパクト|high-impact composition
ビンテージ|vintage aesthetic
パステル|pastel color palette
モノクロ|monochromatic palette
ミステリアス|mysterious atmosphere
ゴシック|gothic atmosphere
夢幻的|dreamlike atmosphere`);
additionalAtmospheres.forEach(row=>{if(!ATMOSPHERES.some(x=>x[1]===row[1]))ATMOSPHERES.push(row);});
// Same-meaning themes retain their existing label and prompt tags.
const ATMOSPHERE_ALIASES = {シネマティック:'映画的',ドラマティック:'重厚',ヴィンテージ:'ビンテージ',高彩度:'鮮やか・高彩度'};
const STATIC_POSE_NAMES = POSES.filter(x=>!ACTION_NAMES.has(x[0])).map(x=>x[0]);
function accessoryConflict(a,b) {
  if (!a || !b || a==='なし' || b==='なし') return false;
  if (a===b) return true;
  const glasses=['眼鏡','細フレーム眼鏡','サングラス','モノクル'];
  return glasses.includes(a)&&glasses.includes(b);
}
function weightedChoice(pool, favored, strength=3) {
  return pick(pool.flatMap(name=>Array(favored.includes(name)?strength:1).fill(name)));
}
function weightedPose() {
  const pool=freshPool('ポーズ',compatiblePoses(available('ポーズ')));
  const theme=ATMOSPHERE_ALIASES[S.絵の雰囲気]||S.絵の雰囲気;
  const favored=theme==='ダイナミック'?['走る','跳躍','全力疾走','大きく跳躍','空中で回転']:theme==='ビンテージ'?[...STATIC_POSE_NAMES]:theme==='映画的'?['壁にもたれる','振り向き','歩く']:[];
  const coats=/コート|マント|旅人|探偵|捜査官/.test(S.服装||'');
  const obstacles=/路地|街|屋上|遺跡|廊下|駅|アジト/.test(S.背景||'');
  if(coats)favored.push('コートを翻して振り返る');
  if(obstacles)favored.push('段差を飛び越える');
  return weightedChoice(pool,favored);
}
function weightedComposition() {
  const theme=ATMOSPHERE_ALIASES[S.絵の雰囲気]||S.絵の雰囲気;
  const favored=theme==='ダイナミック'?['大胆な短縮法','対角線の動き','斜め構図']:theme==='映画的'?['奥行き構図','非対称構図','映画的構図']:theme==='ビンテージ'?['非対称構図','広い余白']:theme==='ハイインパクト'?['強い遠近感','前景強調']:[];
  if(ACTION_NAMES.has(S.ポーズ))favored.push('対角線の動き','奥から手前への動き');
  if(['背面','斜め後ろ'].includes(S.人物の向き))favored.push('奥行き構図');
  return weightedChoice(freshPool('構図タイプ',COMPOSITIONS.map(x=>x[0])),favored);
}
const BACKGROUND_THEMES = [
  [/アジト|地下施設/,['ダーク','映画的','重厚']],
  [/花|庭園/,['爽やか','柔らかい','幻想的']],
  [/遺跡|廃墟/,['退廃的','ダーク','映画的']],
  [/ネオン|サイバー/,['ネオン','鮮やか・高彩度','映画的']],
  [/神社/,['幻想的','ノスタルジック']],
  [/洋館|古城/,['ゴシック','ダーク','重厚']],
  [/屋上/,['爽やか','映画的','ノスタルジック']],
  [/幻想|星空|神殿/,['幻想的','夢幻的']],
  [/雨/,['映画的','ダーク','ノスタルジック']],
  [/カフェ|図書館|駅/,['ビンテージ','ノスタルジック','柔らかい']],
  [/海辺|夜明け/,['爽やか','映画的','ノスタルジック']]
];
function backgroundAtmosphere() {
  const favored=BACKGROUND_THEMES.find(([pattern])=>pattern.test(S.背景||''))?.[1]||[];
  return favored.length && Math.random()<.7 ? pick(favored) : pick(ATMOSPHERES.map(x=>x[0]));
}

const OUTFIT_DETAIL_FIELDS=['服装','表示範囲','人物の向き','カメラ角度','構図タイプ','ポーズ'];
function outfitProfile() {
  const name=S.服装||'';
  const actualGenre=Object.keys(OUTFITS).find(genre=>OUTFITS[genre].includes(name));
  if(!actualGenre)return null;
  // Respect a locked outfit outside the genre filter, rather than generating conflicting garments.
  const genre=outfitGenre!=='すべてのジャンル'&&OUTFITS[outfitGenre].includes(name)?outfitGenre:actualGenre;
  if(GARMENT_DESIGNS[name])return name;
  if(name==='和風幻想制服')return 'kimonoUniform';
  if(name==='チャイナスタイル')return 'chinese';
  if(name==='ゴシックロリータ')return 'lolita';
  if(name==='軍服'||name==='ミリタリー'||name==='礼装軍服')return 'military';
  if(name==='近未来スーツ')return 'bodysuit';
  if(/強化兵|テック騎士/.test(name))return 'techArmor';
  if(/聖騎士|黒騎士|竜騎士|王国騎士/.test(name))return 'armor';
  if(/召喚士|宮廷魔術師|呪術師|死神風|葬儀司祭|神官|錬金術師/.test(name))return 'robe';
  if(name==='ゴシック')return 'gothic';
  return genre;
}
function outfitVisibleRange() {
  const ranges={'顔アップ':0,'胸上':1,'バストアップ':1,'腰上':2,'太ももまで':3,'全身':4};
  let range=ranges[S.表示範囲]??1;
  // Cropping does not guarantee the lower body remains in view; be conservative with details.
  if(S.構図タイプ==='大胆なトリミング')range=Math.min(range,2);
  return range;
}
function updateOutfitDetails(force=false) {
  const signature=JSON.stringify([outfitGenre,...OUTFIT_DETAIL_FIELDS.map(key=>S[key]||'')]);
  if(!force&&signature===outfitDetails.signature)return;
  const profile=outfitProfile();
  const designs=GARMENT_DESIGNS[profile]||[];
  const design=designs.length?pick(designs):null;
  const range=outfitVisibleRange();
  const rear=['背面','斜め後ろ'].includes(S.人物の向き)||S.カメラ角度==='肩越し';
  const slots=range===0?['neck','shoulders']:range===1?['neck','upper','sleeves']:['upper','sleeves','waist',...(range>=3?['lower']:[]),...(range>=4?['shoes']:[])];
  if(range>=1&&Math.random()<.35)slots.push('decoration');
  const parts=design?slots.map(slot=>design[slot]).filter(part=>{
    const chestOnly=/breastplate|chest armor|bodice|torso/.test(part.en);
    return part.minRange<=range&&!(rear&&(part.frontOnly||chestOnly));
  }):[];
  outfitDetails={signature,profile,design:designs.indexOf(design),range,parts,revision:outfitDetails.revision+1};
}

const OPTIONS = {
  性別: ['男性','女性'], 種族: DATA.common.種族,
  髪の長さ: hairLengths, 髪型: hairTextures, 前髪: bangs, 髪色: HAIR_COLORS.map(x=>x[0]),
  髪色デザイン: DESIGNS.map(x=>x[0]), 第2髪色: HAIR_COLORS.map(x=>x[0]),
  目: DATA.common.目, 瞳色: EYE_COLORS.map(x=>x[0]), 表情: EXPRESSIONS.map(x=>x[0]),
  服装: allOutfits, 小物1: ACCESSORIES.map(x=>x[0]), 小物2: ACCESSORIES.map(x=>x[0]),
  表示範囲: FRAMINGS.map(x=>x[0]), 人物の向き: DIRECTIONS.map(x=>x[0]),
  カメラ角度: ANGLES.map(x=>x[0]), 構図タイプ: COMPOSITIONS.map(x=>x[0]),
  ポーズ: POSES.map(x=>x[0]), 背景: DATA.common.背景, 絵の雰囲気: ATMOSPHERES.map(x=>x[0])
};
const GROUPS = [
  ['キャラクター',['性別','種族','髪の長さ','髪型','前髪','髪色','髪色デザイン','第2髪色','目','瞳色','表情']],
  ['服装',['服装','小物1','小物2']],
  ['構図',['表示範囲','人物の向き','カメラ角度','構図タイプ']],
  ['ポーズ',['ポーズ']],
  ['背景',['背景']],
  ['絵の雰囲気・演出テーマ',['絵の雰囲気']],
  ['品質',[]]
];
const LABELS = {髪色:'メイン髪色',目:'目の形',瞳色:'瞳の色',表示範囲:'人物の表示範囲',絵の雰囲気:'絵の雰囲気・演出テーマ'};
const BG_LINKS = {
  '吸血鬼':['古城の大広間','月明かりの庭園','薄暗い地下施設'],
  '神':['荘厳な神殿','幻想的な星空の下'],
  'サイバーパンク':['ネオンが輝く未来都市','サイバーな繁華街','近未来的な研究施設'],
  'スチームパンク':['古い洋館の廊下','駅のホーム','薄暗い地下施設'],
  '和装':['桜が舞う神社','月明かりの庭園','霧に包まれた湖畔'],
  'ゴシック':['古城の大広間','月明かりの庭園','薄暗い地下施設']
};
function available(k) {
  if (k==='服装' && outfitGenre!=='すべてのジャンル') return OUTFITS[outfitGenre];
  if (k==='ポーズ' && poseGenre!=='すべて') return OPTIONS.ポーズ.filter(name=>(ACTION_NAMES.has(name)?'アクション系':'静的')===poseGenre);
  return OPTIONS[k];
}
function colorInfo(name) { return HAIR_COLORS.find(x=>x[0]===name); }
function similarColors(a,b) { return a===b || colorInfo(a)?.[2] === colorInfo(b)?.[2]; }
function validSecondary(base, secondary, design) {
  return !similarColors(base, secondary) && (design !== '根元暗め' || colorInfo(secondary)?.[2] === 'dark');
}
function weightedDesign() {
  let n = Math.random()*100;
  return DESIGNS.find(x => (n -= Number(x[2])) < 0)?.[0] || '単色';
}
function make(k) {
  if (k==='性別') return gender==='random' ? pick(OPTIONS.性別) : gender==='male' ? '男性' : '女性';
  if (k==='髪色デザイン') return weightedDesign();
  if (k==='第2髪色') return pick(OPTIONS[k].filter(c=>validSecondary(S.髪色,c,S.髪色デザイン))) || pick(OPTIONS[k]);
  if (k==='小物1'||k==='小物2') {
    const other=k==='小物1'?'小物2':'小物1';
    return pick(OPTIONS[k].filter(name=>!accessoryConflict(name,S[other])));
  }
  if (k==='ポーズ') return weightedPose();
  if (k==='人物の向き') return pick(freshPool(k,poseDirections(S.ポーズ)));
  if (k==='表示範囲') return pick(freshPool(k,OPTIONS[k]));
  if (k==='構図タイプ') return weightedComposition();
  if (k==='カメラ角度') return weightedChoice(freshPool(k,OPTIONS[k].filter(x=>x!=='肩越し'||['背面',...REAR_DIRECTIONS].includes(S.人物の向き))),S.絵の雰囲気==='映画的'?['ダッチアングル','ローアングル','斜め上から']:[]);
  if (k==='背景') {
    const linked = [...(BG_LINKS[S.服装]||[]),...(BG_LINKS[S.種族]||[])];
    return pick(OPTIONS[k].flatMap(x=>Array(linked.includes(x)?4:1).fill(x)));
  }
  if (k==='髪色' && L.第2髪色 && S.髪色デザイン!=='単色') {
    const compatible=OPTIONS[k].filter(c=>validSecondary(c,S.第2髪色,S.髪色デザイン));
    return pick(compatible.length ? compatible : OPTIONS[k]);
  }
  if (k==='髪色' && S.髪色デザイン==='根元暗め') return pick(OPTIONS[k].filter(c=>colorInfo(c)[2]!=='dark'));
  return pick(available(k));
}
// Only correct hard conflicts on unlocked fields. Manual choices are kept and explained.
function reconcile(changed, full=false) {
  if (accessoryConflict(S.小物1,S.小物2)) {
    if (!L.小物2 && (full || changed==='小物1')) S.小物2=make('小物2');
    else if (!L.小物1 && (full || changed==='小物2')) S.小物1=make('小物1');
  }
  if (S.髪色デザイン==='根元暗め' && !L.髪色デザイン && full && ((L.髪色 && colorInfo(S.髪色)?.[2]==='dark') || (L.第2髪色 && colorInfo(S.第2髪色)?.[2]!=='dark'))) {
    S.髪色デザイン=pick(DESIGNS.filter(x=>x[0]!=='根元暗め').flatMap(x=>Array(Number(x[2])).fill(x[0])));
  }
  if (S.髪色デザイン==='根元暗め' && colorInfo(S.髪色)?.[2]==='dark' && !L.髪色 && (full || changed==='髪色デザイン')) {
    S.髪色=pick(OPTIONS.髪色.filter(c=>colorInfo(c)[2]!=='dark' && (!L.第2髪色 || validSecondary(c,S.第2髪色,S.髪色デザイン))));
  }
  if (S.髪色デザイン!=='単色' && !validSecondary(S.髪色,S.第2髪色,S.髪色デザイン)) {
    if ((full || ['髪色','髪色デザイン'].includes(changed)) && !L.第2髪色) S.第2髪色=make('第2髪色');
  }
  reconcileScene(changed,full);
  if ((S.ポーズ==='眼鏡を直す' && ![S.小物1,S.小物2].some(x=>['眼鏡','細フレーム眼鏡','サングラス'].includes(x))) || (S.ポーズ==='小物を自然に持つ' && [S.小物1,S.小物2].every(x=>x==='なし'))) {
    if (!L.ポーズ && (full || changed==='ポーズ' || ['小物1','小物2'].includes(changed))) S.ポーズ=pick(available('ポーズ').filter(x=>!['眼鏡を直す','小物を自然に持つ'].includes(x)));
  }
  if(full || ['ポーズ','人物の向き','カメラ角度','小物1','小物2'].includes(changed)) reconcileScene(changed,full);
}
function reconcileScene(changed,full) {
  if(!full&&!['ポーズ','人物の向き','カメラ角度','小物1','小物2'].includes(changed))return;
  if(!poseDirections(S.ポーズ).includes(S.人物の向き)){
    if(!L.人物の向き && changed!=='人物の向き')S.人物の向き=make('人物の向き');
    else if(!L.ポーズ){
      const pool=available('ポーズ').filter(name=>poseDirections(name).includes(S.人物の向き));
      if(pool.length)S.ポーズ=pick(freshPool('ポーズ',compatiblePoses(pool)));
      else if(!L.人物の向き)S.人物の向き=make('人物の向き');
    }
  }
  if(S.カメラ角度==='肩越し'&&!['背面',...REAR_DIRECTIONS].includes(S.人物の向き)){
    const rear=poseDirections(S.ポーズ).filter(x=>['背面',...REAR_DIRECTIONS].includes(x));
    if(L.カメラ角度&&!L.人物の向き&&rear.length)S.人物の向き=pick(rear);
    else if(!L.カメラ角度)S.カメラ角度=make('カメラ角度');
    else if(!L.ポーズ&&!L.人物の向き){
      const pool=compatiblePoses(available('ポーズ')).filter(name=>poseDirections(name).some(x=>['背面',...REAR_DIRECTIONS].includes(x)));
      if(pool.length){
        S.ポーズ=pick(freshPool('ポーズ',pool));
        S.人物の向き=pick(poseDirections(S.ポーズ).filter(x=>['背面',...REAR_DIRECTIONS].includes(x)));
      }
    }
  }
}
function warnings() {
  const list=[];
  if (poseGenre!=='すべて' && !available('ポーズ').includes(S.ポーズ)) list.push('現在のポーズは選択分類外です。ロック・手動設定は保持します。');
  if (accessoryConflict(S.小物1,S.小物2)) list.push('小物1と小物2が重複、または同じ装着位置で競合しています。手動・ロック設定は保持します。');
  if (S.髪色デザイン!=='単色' && similarColors(S.髪色,S.第2髪色)) list.push('髪色と第2髪色が似ています。手動の組み合わせはそのまま使用できます。');
  if (S.髪色デザイン==='根元暗め' && colorInfo(S.第2髪色)?.[2]!=='dark') list.push('根元暗めには暗い根元色を推奨します。');
  if (!poseDirections(S.ポーズ).includes(S.人物の向き)) list.push('ポーズと人物の向きの指定が競合しています。ロック・手動設定は保持します。');
  if (S.カメラ角度==='肩越し' && !['背面',...REAR_DIRECTIONS].includes(S.人物の向き)) list.push('肩越しと真正面の指定が競合しています。ロック・手動設定は保持します。');
  if (S.ポーズ==='眼鏡を直す' && ![S.小物1,S.小物2].some(x=>['眼鏡','細フレーム眼鏡','サングラス'].includes(x))) list.push('眼鏡を直すポーズには眼鏡系の小物を推奨します。');
  if (S.ポーズ==='小物を自然に持つ' && [S.小物1,S.小物2].every(x=>x==='なし')) list.push('小物を持つポーズですが、小物が「なし」です。');
  if (outfitGenre!=='すべてのジャンル' && !OUTFITS[outfitGenre].includes(S.服装)) list.push('現在の衣装は選択ジャンル外です。衣装を変更するか、ロックを解除して再抽選してください。');
  return list;
}
function syncGender() { currentGender=S.性別==='男性'?'male':'female'; }
function avoidRecentScene(keys) {
  const repeats=()=>recentScenes.some(scene=>SCENE_FIELDS.every(k=>scene[k]===S[k]));
  if(!repeats())return;
  // Enumerate alternatives rather than retrying randomly: fixed/locked scenes cannot loop.
  for(const key of ['構図タイプ','表示範囲','カメラ角度','人物の向き','ポーズ'].filter(k=>keys.includes(k)&&!L[k])){
    const before=S[key];
    for(const value of freshPool(key,available(key))){
      S[key]=value;
      const valid=poseDirections(S.ポーズ).includes(S.人物の向き)&&
        (S.カメラ角度!=='肩越し'||['背面',...REAR_DIRECTIONS].includes(S.人物の向き));
      if(valid&&!repeats())return;
    }
    S[key]=before;
  }
}
function generate(full=true) {
  const order=Object.keys(OPTIONS).filter(k=>!['背景','絵の雰囲気',...SCENE_FIELDS].includes(k));
  order.forEach(k=>{if (!L[k] && (full || S[k]===undefined)) S[k]=make(k);});
  if (!L.背景 && (full || S.背景===undefined)) S.背景=make('背景');
  if (!L.絵の雰囲気 && (full || S.絵の雰囲気===undefined)) S.絵の雰囲気=backgroundAtmosphere();
  ['ポーズ','人物の向き','表示範囲','カメラ角度','構図タイプ'].forEach(k=>{if (!L[k] && (full || S[k]===undefined)) S[k]=make(k);});
  reconcile(null,true); avoidRecentScene(SCENE_FIELDS.filter(k=>!L[k])); rememberScene(); syncGender(); updateOutfitDetails(full && !L.服装); render();
}
function reroll(k) {
  if (!OPTIONS[k] || L[k] || (k==='第2髪色' && S.髪色デザイン==='単色')) return;
  S[k]=make(k);
  if (k==='背景' && !L.絵の雰囲気) S.絵の雰囲気=backgroundAtmosphere();
  reconcile(k); if(SCENE_FIELDS.includes(k)){avoidRecentScene([k]);rememberScene();} syncGender(); updateOutfitDetails(OUTFIT_DETAIL_FIELDS.includes(k)); render();
}
function manual(k,value) {
  if (!OPTIONS[k] || (k==='第2髪色' && S.髪色デザイン==='単色')) return;
  S[k]=value; syncGender(); updateOutfitDetails(); render();
}
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function field(k) {
  const inactive=k==='第2髪色' && S.髪色デザイン==='単色';
  const label=k==='第2髪色' && S.髪色デザイン==='根元暗め'?'根元色':LABELS[k]||k;
  const values=available(k);
  const options=inactive?['なし']:values.includes(S[k])?values:[S[k],...values];
  const hex=inactive?null:k==='瞳色'?EYE_COLORS.find(x=>x[0]===S[k])?.[1]:['髪色','第2髪色'].includes(k)?HAIR_SWATCHES[OPTIONS[k].indexOf(S[k])]:null;
  return `<div class="gacha-field ${['服装','背景','絵の雰囲気','ポーズ'].includes(k)?'wide':''}"><label for="field-${k}">${label}${hex?` <span class="field-swatch" style="background:${hex}" aria-hidden="true"></span>`:''}</label><div class="field-controls"><select id="field-${k}" data-field="${k}" aria-label="${label}"${inactive?' disabled':''}>${options.map(v=>`<option${v===S[k]||inactive?' selected':''} value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('')}</select><button type="button" data-reroll="${k}" aria-label="${label}を再抽選" title="${label}を再抽選"${L[k]||inactive?' disabled':''}>🔄</button><button type="button" data-lock="${k}" class="${L[k]?'locked':''}" aria-label="${label}のロック" aria-pressed="${Boolean(L[k])}" title="${label}のロック"${inactive?' disabled':''}>${L[k]?'🔒':'🔓'}</button></div></div>`;
}
function genreControl(id,label,values,current) {
  return `<label class="genre-label" for="${id}">${label}</label><select class="genre-select" id="${id}">${values.map(v=>`<option${v===current?' selected':''}>${v}</option>`).join('')}</select>`;
}
function characterLayout() {
  const rowsToHtml=rows=>rows.map(keys=>`<div class="gacha-grid character-row">${keys.map(k=>k?field(k):'<div class="field-placeholder" aria-hidden="true"></div>').join('')}</div>`).join('');
  return rowsToHtml([['性別','種族']])+
    `<section class="character-block" aria-label="髪型・髪色"><h3 class="category-bar">髪型・髪色</h3>${rowsToHtml([['髪の長さ','髪型'],['前髪','髪色'],['髪色デザイン','第2髪色']])}</section>`+
    `<section class="character-block" aria-label="瞳・表情"><h3 class="category-bar">瞳・表情</h3>${rowsToHtml([['目','瞳色'],['表情',null]])}</section>`;
}
function promptPanel() {
  return `<section class="prompt-panel" aria-label="完成プロンプト"><h2 class="category-bar">完成プロンプト</h2><div class="prompt-languages" role="group" aria-label="プロンプトの言語"><button type="button" data-language="ja" aria-pressed="${promptLanguage==='ja'}">日本語</button><button type="button" data-language="en" aria-pressed="${promptLanguage==='en'}">English</button></div><textarea id="completedPrompt" class="completed-prompt" aria-label="完成プロンプト本文" lang="${promptLanguage}" readonly spellcheck="false">${escapeHtml(displayedPrompt())}</textarea><button class="copy" id="copyPrompt">プロンプトをコピー</button><div class="copy-status" id="copyStatus" role="status"></div></section>`;
}
function updatePromptPreview() {
  const area=document.getElementById('completedPrompt');
  area.value=displayedPrompt(); area.lang=promptLanguage;
  document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===promptLanguage)));
  document.getElementById('copyStatus').textContent='';
  document.getElementById('copyPrompt').classList.remove('copied','copy-error');
}
function render() {
  const active=document.activeElement;
  const focusSelector=active?.dataset?.field ? `[data-field="${active.dataset.field}"]` : active?.dataset?.lock ? `[data-lock="${active.dataset.lock}"]` : active?.dataset?.reroll ? `[data-reroll="${active.dataset.reroll}"]` : ['outfitGenre','poseGenre'].includes(active?.id) ? '#'+active.id : null;
  const messages=warnings();
  document.getElementById('result').innerHTML=GROUPS.map(([title,keys])=>`<section class="gacha-group" aria-label="${title}"><h2 class="category-bar">${title}</h2>${title==='服装'?genreControl('outfitGenre','服装ジャンル（再抽選の範囲）',['すべてのジャンル',...Object.keys(OUTFITS)],outfitGenre):title==='ポーズ'?genreControl('poseGenre','ポーズ分類（再抽選の範囲）',['すべて','静的','アクション系'],poseGenre):''}${title==='キャラクター'?characterLayout():`<div class="gacha-grid">${keys.map(field).join('')}</div>`}${title==='品質'?`<label class="quality-control" for="qualityToggle"><input type="checkbox" id="qualityToggle" role="switch"${qualityEnabled?' checked':''}>品質 <span id="qualityState">${qualityEnabled?'ON':'OFF'}</span></label>`:''}</section>`).join('')+`${messages.length?`<div class="warnings" role="status">${messages.map(escapeHtml).join('<br>')}</div>`:''}`+promptPanel();
  document.querySelectorAll('[data-field]').forEach(el=>el.onchange=()=>manual(el.dataset.field,el.value));
  document.querySelectorAll('[data-reroll]').forEach(el=>el.onclick=()=>reroll(el.dataset.reroll));
  document.querySelectorAll('[data-lock]').forEach(el=>el.onclick=()=>{
    if(el.dataset.lock==='第2髪色'&&S.髪色デザイン==='単色')return;
    L[el.dataset.lock]=!L[el.dataset.lock];render();
  });
  document.getElementById('outfitGenre').onchange=event=>{
    outfitGenre=event.target.value;
    if (!L.服装 && !available('服装').includes(S.服装)) S.服装=make('服装');
    updateOutfitDetails(true); render();
  };
  document.getElementById('poseGenre').onchange=event=>{
    poseGenre=event.target.value;
    if(!L.ポーズ&&!available('ポーズ').includes(S.ポーズ)){S.ポーズ=make('ポーズ');reconcile('ポーズ');}
    updateOutfitDetails(); render();
  };
  document.getElementById('qualityToggle').onchange=event=>{qualityEnabled=event.target.checked;document.getElementById('qualityState').textContent=qualityEnabled?'ON':'OFF';updatePromptPreview();};
  document.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>{promptLanguage=button.dataset.language;updatePromptPreview();});
  document.getElementById('copyPrompt').onclick=()=>copyText(document.getElementById('completedPrompt').value,'copyPrompt');
  if (focusSelector) document.querySelector(focusSelector)?.focus({preventScroll:true});
}
function japaneseResult() {
  return japanesePrompt();
}

function englishText(t) {
  if (t==null || t==='') return '';
  if (EN[t]) return EN[t];
  return String(t).split(' × ').map(x=>EN[x]||x).join(', ');
}
function tagFor(options, value) { return options.find(x=>x[0]===value)?.[1] || ''; }
function hairPrompt() {
  const base=colorInfo(S.髪色)?.[1]||String(S.髪色).toLowerCase();
  const second=colorInfo(S.第2髪色)?.[1]||String(S.第2髪色).toLowerCase();
  if (S.髪色デザイン==='単色') return `${base} hair`;
  if (S.髪色デザイン==='ツートン') return `${base} hair, two-tone hair, ${second} secondary hair color`;
  if (S.髪色デザイン==='根元暗め') return `${base} hair, dark roots, ${second} roots`;
  return `${base} hair, ${second} ${tagFor(DESIGNS,S.髪色デザイン)}`;
}
function selectedHair() {
  const legacy=Array.isArray(S.髪型)?S.髪型:String(S.髪型||'').split(' × ');
  return legacy.length>1 ? {length:S.髪の長さ||legacy[0],style:legacy[legacy.length-1]} : {length:S.髪の長さ||'',style:S.髪型||''};
}
const EYE_COLOR_JA = entries(`Black|ブラック
Charcoal|チャコール
White|ホワイト
Silver|シルバー
Light Gray|ライトグレー
Beige|ベージュ
Cream|クリーム
Mocha|モカ
Cocoa|ココア
Brown|ブラウン
Camel|キャメル
Terracotta|テラコッタ
Rust|ラスト
Coral|コーラル
Peach|ピーチ
Amber|アンバー
Gold|ゴールド
Mustard|マスタード
Olive|オリーブ
Sage Green|セージグリーン
Moss Green|モスグリーン
Forest Green|フォレストグリーン
Emerald|エメラルド
Mint|ミント
Seafoam|シーフォーム
Teal|ティール
Aqua|アクア
Sky Blue|スカイブルー
Ice Blue|アイスブルー
Denim Blue|デニムブルー
Steel Blue|スチールブルー
Cobalt Blue|コバルトブルー
Royal Blue|ロイヤルブルー
Sapphire Blue|サファイアブルー
Deep Blue|ディープブルー
Midnight Blue|ミッドナイトブルー
Indigo|インディゴ
Violet|バイオレット
Plum|プラム
Lavender|ラベンダー
Magenta|マゼンタ
Raspberry|ラズベリー
Rose Pink|ローズピンク
Dusty Pink|ダスティピンク
Mauve|モーブ
Burgundy|バーガンディ
Wine Red|ワインレッド
Neon Pink|ネオンピンク
Neon Purple|ネオンパープル
Neon Green|ネオングリーン
Neon Yellow|ネオンイエロー
Neon Orange|ネオンオレンジ
Neon Red|ネオンレッド
Neon Blue|ネオンブルー
Lime|ライム
Dusty Rose|ダスティローズ`);
function japaneseHairColor() {
  if(!S.髪色)return '';
  const base=`${S.髪色}の髪`;
  if(!S.髪色デザイン||S.髪色デザイン==='単色')return base;
  return base+(S.第2髪色?`, ${S.第2髪色}の${S.髪色デザイン==='根元暗め'?'暗い根元':S.髪色デザイン}`:'');
}
// Keep weighted/nested tags intact when splitting top-level comma separators.
function splitPromptTags(text) {
  const tags=[];let depth=0,start=0;
  for(let i=0;i<text.length;i++) {
    if(text[i]==='(')depth++;
    else if(text[i]===')')depth=Math.max(0,depth-1);
    else if(text[i]===',' && depth===0){tags.push(text.slice(start,i).trim());start=i+1;}
  }
  tags.push(text.slice(start).trim());return tags.filter(Boolean);
}
function promptItems() {
  const subject=currentGender==='male'?'(((solo,1man))), adult man, handsome':'(((solo,1woman))), adult woman, beautiful';
  const subjectJa=currentGender==='male'?'男性1人, 成人男性, ハンサム':'女性1人, 成人女性, 美しい女性';
  const hair=selectedHair();
  const item=(ja,en)=>({ja:ja||'',en:en||''});
  const selected=(options,value)=>item(value,tagFor(options,value));
  let direction=tagFor(DIRECTIONS,S.人物の向き), pose=tagFor(POSES,S.ポーズ), angle=tagFor(ANGLES,S.カメラ角度);
  if(pose==='looking back' && direction==='looking back over shoulder')pose='';
  if(direction==='front view' && (pose==='looking back'||angle==='over-the-shoulder shot'))direction='';
  return [
    [item(S.性別?subjectJa:'',S.性別?subject:''),item(S.種族,englishText(S.種族)),item(hair.length,englishText(hair.length)),item(hair.style,englishText(hair.style)),item(S.前髪,englishText(S.前髪)),item(japaneseHairColor(),S.髪色?hairPrompt():''),item(S.目,englishText(S.目)),item(S.瞳色?`${EYE_COLOR_JA.find(x=>x[0]===S.瞳色)?.[1]||S.瞳色}の瞳`:'',S.瞳色?`${S.瞳色.toLowerCase()} eyes`:''),selected(EXPRESSIONS,S.表情)],
    [item(S.服装,englishText(S.服装)),...(S.服装?outfitDetails.parts:[]).map(part=>item(part.ja,part.en)),selected(ACCESSORIES,S.小物1),selected(ACCESSORIES,S.小物2)],
    [selected(FRAMINGS,S.表示範囲),item(S.人物の向き,direction),item(S.カメラ角度,angle),selected(COMPOSITIONS,S.構図タイプ)],
    [item(S.ポーズ,pose)],
    [item(S.背景,englishText(S.背景)),selected(ATMOSPHERES,ATMOSPHERE_ALIASES[S.絵の雰囲気]||S.絵の雰囲気)],
    qualityEnabled?[item('最高傑作','(masterpiece:1.2)'),item('最高品質','(best quality:1.2)'),item('高い美的品質','(very aesthetic:1.1)'),item('精緻な描写','highly detailed')]:[]
  ];
}
function promptCategories(language) {
  const seen=new Set();
  return promptItems().map(items=>items.flatMap(item=>{
    if(!item.en)return [];
    const tags=splitPromptTags(item.en).filter(tag=>!seen.has(tag));
    tags.forEach(tag=>seen.add(tag));
    return tags.length?[language==='ja'?item.ja:tags.join(', ')]:[];
  }).filter(Boolean).join(', '));
}
function englishCategories() { return promptCategories('en'); }
function englishPrompt() { return englishCategories().filter(Boolean).join('\n'); }
function japanesePrompt() { return promptCategories('ja').filter(Boolean).join('\n'); }
function displayedPrompt() { return promptLanguage==='ja'?japanesePrompt():englishPrompt(); }

async function copyText(value,id) {
  const button=document.getElementById(id);
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    else {
      const area=document.createElement('textarea'); area.value=value; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select();
      let copied=false; try { copied=document.execCommand('copy'); } finally { area.remove(); }
      if (!copied) throw new Error('copy failed');
    }
    button.classList.add('copied'); document.getElementById('copyStatus').textContent='コピーしました';
  } catch {
    button.classList.add('copy-error'); document.getElementById('copyStatus').textContent='コピーできませんでした。ブラウザのコピー許可をご確認ください。';
  }
}
document.querySelectorAll('[data-gender]').forEach(button=>button.onclick=()=>{
  gender=button.dataset.gender;
  document.querySelectorAll('[data-gender]').forEach(x=>x.classList.toggle('selected',x===button));
  generate(true);
});
document.getElementById('draw').onclick=()=>generate(true);
document.querySelector('[data-gender="random"]').classList.add('selected');
generate(true);
