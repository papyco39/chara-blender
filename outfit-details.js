// Bilingual garment-only designs. No accessories, colors or rendering-style tags.
// Each design is a coherent set; parts are never mixed across designs.
function garmentDesign(neck, shoulders, upper, sleeves, waist, lower, shoes, decoration) {
  const part=(value,region,minRange,frontOnly=false)=>{
    const [ja,en]=value.split('|');return {ja,en,region,minRange,frontOnly};
  };
  return {
    neck:part(neck,'neck',0), shoulders:part(shoulders,'shoulders',0),
    upper:part(upper,'upper',1), sleeves:part(sleeves,'sleeves',1),
    waist:part(waist,'waist',2), lower:part(lower,'lower',3), shoes:part(shoes,'shoes',4),
    decoration:part(decoration,'decoration',1,true)
  };
}
const GARMENT_DESIGNS = {
  '現代・カジュアル': [
    garmentDesign('開いたシャツ襟|open shirt collar','柔らかい肩のライン|soft shoulder tailoring','軽いシャツジャケット|lightweight shirt jacket','ゆったりした袖|relaxed sleeves','自然な腰のシルエット|relaxed waist silhouette','ストレートパンツ|straight-cut trousers','カジュアルスニーカー|casual sneakers','控えめなステッチ|subtle stitching'),
    garmentDesign('丸い襟ぐり|round neckline','ラグランの肩周り|raglan shoulder seams','ニットのプルオーバー|knitted pullover','リブ編みの袖|ribbed sleeves','リブ編みの裾|ribbed waist hem','テーパードパンツ|tapered trousers','シンプルなローファー|simple loafers','胸元の織り模様|woven chest pattern')
  ],
  'ストリート・治安悪め': [
    garmentDesign('フード付きの襟元|hooded neckline','ドロップショルダー|dropped shoulders','オーバーサイズのストリートジャケット|oversized street jacket','ゆったりした袖|loose sleeves','伸縮性のある腰の裾|elasticated waist hem','ワイドカーゴパンツ|wide cargo trousers','ハイトップスニーカー|high-top sneakers','胸元のパネル切替|contrasting chest panels'),
    garmentDesign('立ち襟|stand collar','構築的な肩周り|structured shoulders','短丈のボンバージャケット|cropped bomber jacket','ボリュームのある袖|voluminous sleeves','フィットした腰の裾|fitted waist hem','ストレートのストリートパンツ|straight streetwear trousers','厚底のストリートブーツ|chunky street boots','控えめな縫い目|subtle seam detailing')
  ],
  'フォーマル・制服': [
    garmentDesign('整ったシャツ襟|neat shirt collar','仕立てのよい肩周り|tailored shoulders','テーラードジャケット|tailored jacket','細身の袖|slim jacket sleeves','絞ったウエストライン|shaped waistline','スーツパンツ|suit trousers','革のドレスシューズ|leather dress shoes','控えめな前ボタン|subtle front buttons'),
    garmentDesign('コンパクトな襟元|compact collar','角張った肩のライン|square shoulder tailoring','制服風ブレザー|uniform blazer','すっきりした袖|clean-cut sleeves','腰に沿ったジャケット裾|waist-fitted jacket hem','プリーツ入りパンツ|pleated uniform trousers','磨かれたローファー|polished loafers','胸元のパイピング|chest piping')
  ],
  '和装・伝統・民族': [
    garmentDesign('重なった着物襟|layered kimono collar','ゆるやかな和装の肩周り|relaxed kimono shoulders','重ねた着物の上衣|layered kimono jacket','幅広の和袖|wide kimono sleeves','整った帯|neatly fitted obi sash','袴|pleated hakama trousers','和装の草履|traditional zori sandals','控えめな織り柄|subtle woven pattern'),
    garmentDesign('折り返した和装襟|folded traditional collar','ゆったりした肩のライン|loose traditional shoulders','短い羽織|short haori jacket','直線的な和袖|straight-cut traditional sleeves','布の腰帯|fabric waist sash','ゆったりした和装パンツ|loose traditional trousers','伝統的な布靴|traditional cloth shoes','襟元の織り模様|woven collar detailing')
  ],
  'ファンタジー': [
    garmentDesign('旅装の立ち襟|traveler stand collar','重ねた布の肩周り|layered fabric shoulders','冒険者のチュニック|adventurer tunic','実用的な長袖|practical long sleeves','シンプルな腰ベルト|simple waist belt','丈夫な旅装パンツ|sturdy traveling trousers','旅人のブーツ|traveler boots','控えめな胸元の刺繍|subtle chest embroidery'),
    garmentDesign('折り返したチュニック襟|folded tunic collar','仕立てた肩のライン|fitted fabric shoulders','重ね着のファンタジー上衣|layered fantasy jacket','細身の布袖|fitted fabric sleeves','布の腰帯|cloth waist sash','動きやすいファンタジーパンツ|flexible fantasy trousers','柔らかい革のブーツ|soft leather boots','胸元の縫い模様|decorative chest seams')
  ],
  'ダークファンタジー': [
    garmentDesign('高い貴族風の襟|high noble collar','整った肩のライン|structured noble shoulders','ダークな貴族風ジャケット|dark noble jacket','細身の長袖|fitted long sleeves','絞った腰のシルエット|cinched waist silhouette','仕立てのよいパンツ|tailored noble trousers','ダークファンタジーブーツ|dark fantasy boots','胸元の控えめな刺繍|restrained chest embroidery'),
    garmentDesign('重なった高襟|layered high collar','重厚な布の肩周り|heavy fabric shoulders','長い貴族風の上衣|long noble coat','ゆったりした袖|loose coat sleeves','布のウエスト帯|fabric waist band','流れるようなロングスカート|flowing long skirt','編み上げのブーツ|lace-up boots','胸元のレース縁|lace-trimmed chest panel')
  ],
  'SF・近未来': [
    garmentDesign('未来的な立ち襟|futuristic stand collar','立体的な肩パネル|sculpted shoulder panels','近未来のユーティリティジャケット|futuristic utility jacket','分割された袖パネル|segmented sleeve panels','すっきりした腰パネル|streamlined waist panels','近未来のフィットパンツ|fitted futuristic trousers','テックブーツ|tech boots','控えめな胸元のパネル線|subtle chest panel seams'),
    garmentDesign('低いテック襟|low tech collar','丸みのある肩パネル|rounded shoulder panels','近未来のクルー上衣|futuristic crew jacket','滑らかな袖|smooth fitted sleeves','一体型のウエストライン|integrated waist tailoring','宇宙船クルーパンツ|space crew trousers','クルー用ブーツ|space crew boots','胸元の非発光ライン|non-luminous chest trim')
  ],
  '現代×ファンタジー': [
    garmentDesign('現代的な高襟|modern high collar','布を重ねた肩周り|layered fabric shoulders','現代風のファンタジージャケット|modern fantasy jacket','すっきりした長袖|clean-cut long sleeves','フィットした腰帯|fitted waist sash','仕立てたファンタジーパンツ|tailored fantasy trousers','現代風の革ブーツ|modern leather boots','控えめな胸元の刺繍|subtle chest embroidery'),
    garmentDesign('柔らかい折り襟|soft folded collar','自然な肩のライン|natural shoulder tailoring','街着風のファンタジー上衣|urban fantasy coat','ゆったりした布袖|relaxed fabric sleeves','整ったウエストライン|neat waist tailoring','細身の街着パンツ|slim urban trousers','街歩き用のブーツ|urban walking boots','胸元の織り模様|woven chest pattern')
  ],
  'スポーツ・その他': [
    garmentDesign('スポーツ用の丸い襟ぐり|athletic round neckline','動きやすい肩周り|flexible athletic shoulders','スポーツジャージ|athletic jersey','短いスポーツ袖|short athletic sleeves','伸縮性のある腰回り|elasticated waistband','スポーツショーツ|athletic shorts','スポーツシューズ|athletic shoes','胸元の控えめな切替|subtle chest paneling'),
    garmentDesign('低いスポーツ襟|low athletic collar','ラグランの肩周り|raglan athletic shoulders','トラックジャケット|track jacket','伸縮性のある長袖|stretch long sleeves','フィットした腰の裾|fitted athletic waist hem','トラックパンツ|track pants','ランニングシューズ|running shoes','胸元の細い切替線|narrow chest seam detailing')
  ]
};
GARMENT_DESIGNS.gothic = [
  garmentDesign('高襟のブラウス|high-neck blouse collar','仕立てた肩周り|tailored gothic shoulders','フィットしたゴシックジャケット|fitted gothic jacket','細身のゴシック袖|fitted gothic sleeves','絞ったウエストライン|shaped gothic waistline','テーラードパンツ|tailored trousers','ゴシックブーツ|gothic boots','装飾的な前ボタン|decorative front buttons'),
  garmentDesign('レース縁の襟元|lace-trimmed neckline','丸みのある肩周り|rounded gothic shoulders','ゴシックの長い上衣|long gothic jacket','ゆったりしたゴシック袖|loose gothic sleeves','布の腰帯|gothic fabric waist sash','ゴシックのロングスカート|gothic long skirt','編み上げゴシックブーツ|lace-up gothic boots','控えめな胸元のレース|subtle chest lace')
];
GARMENT_DESIGNS.military = [
  garmentDesign('構築的な軍服襟|structured military collar','軍服の肩章|shoulder epaulettes','仕立てた軍服ジャケット|tailored military jacket','細身の軍服袖|fitted military sleeves','整った軍服の腰回り|fitted military waistline','フィットした軍服パンツ|fitted military trousers','磨かれたブーツ|polished boots','装飾的な軍服ボタン|decorative military buttons'),
  garmentDesign('軍服の立ち襟|military stand collar','すっきりした軍服の肩周り|clean military shoulders','短い軍服上衣|short military tunic','直線的な軍服袖|straight military sleeves','シンプルな軍服ベルト|simple military waist belt','ストレート軍服パンツ|straight military trousers','軍用ブーツ|military boots','控えめな前パネル|subtle front uniform panel')
];
GARMENT_DESIGNS.kimonoUniform = [
  garmentDesign('構築的な高襟|structured high collar','和装制服の肩周り|kimono-uniform shoulders','重ねた着物風ジャケット|layered kimono-style jacket','すっきりした和袖|clean-cut kimono sleeves','フィットした腰帯|fitted waist sash','プリーツ入り袴|pleated hakama trousers','伝統的なブーツ|traditional boots','控えめな胸元の刺繍|subtle chest embroidery'),
  garmentDesign('折り重なった和風襟|folded Japanese collar','自然な和装の肩周り|natural kimono shoulders','短い和風制服上衣|short Japanese uniform jacket','幅広の制服袖|wide uniform sleeves','整った腰の帯|neat waist sash','ストレートの袴|straight hakama trousers','和風の革ブーツ|Japanese-style leather boots','胸元の織り模様|woven chest pattern')
];
GARMENT_DESIGNS.robe = [
  garmentDesign('ローブの高襟|high robe collar','布を重ねたローブの肩周り|layered robe shoulders','重ねたローブ上部|layered robe bodice','幅広のローブ袖|wide robe sleeves','布の腰帯|robe waist sash','流れるローブ裾|flowing lower robe','柔らかい革靴|soft leather shoes','胸元の控えめな刺繍|subtle robe chest embroidery'),
  garmentDesign('折り重なったローブ襟|folded robe collar','ゆるやかなローブの肩周り|relaxed robe shoulders','仕立てたローブ上部|tailored robe bodice','長い布の袖|long fabric sleeves','フィットした布の帯|fitted cloth sash','重ねたローブ裾|layered lower robe','ローブ用の布靴|cloth shoes','控えめな胸元の織り模様|subtle woven chest pattern')
];
GARMENT_DESIGNS.armor = [
  garmentDesign('鎧の首元|armored gorget','肩の装甲|shoulder armor','胸部プレート|fitted breastplate','上腕の装甲|upper-arm armor','腰の装甲|waist armor plates','腿の装甲|thigh armor','鎧のブーツ|armored boots','胸部の控えめな浮彫|subtle breastplate relief'),
  garmentDesign('鎧の高い首当て|high armored collar','重ねた肩の装甲|layered shoulder armor','重ねた胸部装甲|layered chest armor','分割された腕装甲|segmented arm armor','関節のある腰装甲|articulated waist armor','脚部装甲|fitted leg armor','装甲付きブーツ|plated boots','胸部の控えめな刻み|subtle chest engraving')
];
GARMENT_DESIGNS.techArmor = [
  garmentDesign('テック装甲の襟元|tech armor collar','近未来の肩装甲|futuristic shoulder armor','テック胸部装甲|tech chest armor','近未来の腕装甲|futuristic arm armor','一体型の腰装甲|integrated waist armor','近未来の腿装甲|futuristic thigh armor','テック装甲ブーツ|tech armored boots','胸部の非発光パネル線|non-luminous chest panel seams'),
  garmentDesign('低い装甲襟|low armored collar','丸いテック肩装甲|rounded tech shoulder armor','分割されたテック胸部装甲|segmented tech chest armor','柔軟なテック袖|flexible tech sleeves','分割された腰パネル|segmented waist panels','フィットしたテックパンツ|fitted tech trousers','近未来の装甲ブーツ|futuristic armored boots','控えめな胸部の縫い線|subtle chest seam detailing')
];
GARMENT_DESIGNS.bodysuit = [
  garmentDesign('ボディスーツの高襟|high bodysuit collar','一体型の肩周り|integrated bodysuit shoulders','フィットしたボディスーツ上部|fitted bodysuit torso','滑らかなスーツ袖|smooth bodysuit sleeves','一体型の腰パネル|integrated waist panels','ボディスーツの脚部|fitted bodysuit legs','一体型のテックブーツ|integrated tech boots','胸元の非発光の縫い線|non-luminous chest seams'),
  garmentDesign('ボディスーツの低い襟元|low bodysuit neckline','立体的なスーツ肩周り|sculpted bodysuit shoulders','分割パネルのスーツ上部|paneled bodysuit torso','伸縮性のある袖|stretch bodysuit sleeves','腰に沿ったスーツパネル|waist-fitted suit panels','すっきりしたスーツ脚部|streamlined bodysuit legs','ボディスーツ用のブーツ|bodysuit boots','胸元の控えめなパネル線|subtle chest panel lines')
];
GARMENT_DESIGNS.chinese = [
  garmentDesign('中華風の立ち襟|Chinese-style stand collar','すっきりした肩周り|clean Chinese-style shoulders','中華風の上衣|Chinese-style jacket','直線的な袖|straight-cut sleeves','整った腰のライン|neat waist tailoring','伝統的なストレートパンツ|traditional straight trousers','中華風の布靴|Chinese-style cloth shoes','胸元の控えめな刺繍|subtle chest embroidery'),
  garmentDesign('丸い中華風襟|rounded Chinese collar','自然な肩のライン|natural shoulder tailoring','長めの中華風上衣|long Chinese-style tunic','幅広の伝統的な袖|wide traditional sleeves','布の腰帯|fabric waist sash','ゆったりした伝統的パンツ|loose traditional trousers','伝統的な革靴|traditional leather shoes','控えめな前の結び留め|subtle front knot fastenings')
];
GARMENT_DESIGNS.lolita = [
  garmentDesign('レース縁のブラウス襟|lace-trimmed blouse collar','丸いドレスの肩周り|rounded dress shoulders','ゴシックロリータの身頃|gothic lolita dress bodice','ふんわりしたドレス袖|puffed dress sleeves','絞ったドレスの腰|fitted dress waist','広がるドレススカート|flared dress skirt','ゴシックのストラップシューズ|gothic strap shoes','胸元の控えめなレース|subtle chest lace'),
  garmentDesign('高襟のドレス|high dress collar','すっきりしたドレスの肩周り|neat dress shoulders','仕立てたロリータの身頃|tailored lolita bodice','細身のドレス袖|fitted dress sleeves','ドレスのウエスト帯|dress waist band','プリーツのロリータスカート|pleated lolita skirt','編み上げの靴|lace-up shoes','控えめな前ボタン|subtle front buttons')
];

// Specific garments retain their silhouette while using the existing visibility filter.
GARMENT_DESIGNS["ハーフジップニット"] = [garmentDesign("半開きのジップ襟|half-open zip collar","衣装に沿った肩のライン|garment-shaped shoulder seams","リブ編みのニット上衣|rib-knit sweater","リブ編みの袖|rib-knit sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["ムートンジャケット"] = [garmentDesign("ボアの折り襟|shearling fold-over collar","衣装に沿った肩のライン|garment-shaped shoulder seams","裏ボアのジャケット|shearling-lined jacket","厚手の革袖|thick leather sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["MA-1"] = [garmentDesign("リブの丸襟|ribbed bomber collar","衣装に沿った肩のライン|garment-shaped shoulder seams","ナイロンのボンバージャケット|nylon bomber jacket","リブ袖口の袖|sleeves with ribbed cuffs","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["ライダースジャケット"] = [garmentDesign("非対称の革ラペル|asymmetric leather lapels","衣装に沿った肩のライン|garment-shaped shoulder seams","斜めジップの革ジャケット|diagonal-zip leather jacket","細身の革袖|fitted leather sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["ダメージニット"] = [garmentDesign("ほつれた丸襟|frayed round neckline","衣装に沿った肩のライン|garment-shaped shoulder seams","控えめなダメージのニット|lightly distressed knit sweater","ほつれたニット袖|frayed knit sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["ハーネスファッション"] = [garmentDesign("シンプルな丸襟|simple round neckline","衣装に沿った肩のライン|garment-shaped shoulder seams","細いハーネスを重ねた上衣|top with a single minimal fashion harness","すっきりした布袖|clean fabric sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["韓国ストリート"] = [garmentDesign("すっきりしたシャツ襟|clean shirt collar","衣装に沿った肩のライン|garment-shaped shoulder seams","ゆったりした短丈ジャケット|relaxed cropped street jacket","ゆったりした袖|relaxed sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["Y2Kストリート"] = [garmentDesign("コンパクトな襟|compact collar","衣装に沿った肩のライン|garment-shaped shoulder seams","Y2K風の短丈上衣|Y2K cropped top","フィットした袖|fitted sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["レーシングジャケット"] = [garmentDesign("低い立ち襟|low stand collar","衣装に沿った肩のライン|garment-shaped shoulder seams","切替パネルのレーシングジャケット|panelled racing jacket","切替パネルの袖|panelled racing sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["スリーピーススーツ"] = [garmentDesign("整ったシャツ襟|neat shirt collar","衣装に沿った肩のライン|garment-shaped shoulder seams","ベストを重ねたスーツジャケット|suit jacket over a matching waistcoat","仕立てたジャケット袖|tailored jacket sleeves","自然な腰のライン|natural waist silhouette","仕立てたパンツ|tailored trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["陰陽師装束"] = [garmentDesign("重なった和装襟|layered Japanese robe collar","衣装に沿った肩のライン|garment-shaped shoulder seams","陰陽師の重ね衣|layered onmyoji robes","幅広の和袖|wide Japanese robe sleeves","布の腰帯|fabric waist sash","袴|pleated hakama","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["武侠風衣装"] = [garmentDesign("交差した中華襟|crossed Chinese robe collar","衣装に沿った肩のライン|garment-shaped shoulder seams","重ねた武侠の上衣|layered wuxia robes","流れる布袖|flowing fabric sleeves","布の腰帯|fabric waist sash","ゆったりした布パンツ|loose cloth trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
GARMENT_DESIGNS["砂漠の旅人"] = [garmentDesign("重ね布の襟元|layered cloth neckline","衣装に沿った肩のライン|garment-shaped shoulder seams","軽い砂漠の旅装|lightweight desert traveler tunic","通気性のよい布袖|breathable fabric sleeves","自然な腰のライン|natural waist silhouette","ゆったりした布パンツ|loose cloth trousers","シンプルな靴|simple footwear","控えめな縫い目|subtle seam detailing")];
