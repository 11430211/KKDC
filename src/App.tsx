/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import supabase from './supabase';
import ChangePassword from './ChangePassword';
import { 
  Shield, 
  Users, 
  Trophy, 
  Coins, 
  LogIn, 
  LogOut, 
  Plus, 
  Dice5, 
  Crown, 
  Skull, 
  Flame, 
  Zap,
  ChevronRight,
  History,
  TrendingUp,
  X,
  AlertCircle,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Data ---

const MYTHOLOGIES = ["虛無", "混沌", "墮落", "禁忌", "瘋狂", "終焉", "絕望", "羞恥", "自戀", "孤獨", "妄想", "沉淪", "崩壞", "寂滅", "哀慟", "悖論"];
const GROUP_PREFIXES = [
  "不知廉恥的舔狗收容所", 
  "被二次元老婆拋棄的荒原", 
  "社會性死亡審判所", 
  "深淵邊緣的單身狗之墓", 
  "混沌中的邊緣人聚落",
  "極度自戀的鏡中幻影",
  "被現實毒打的夢想家監獄",
  "永遠無法脫單的因果律孤島",
  "散發著處男臭的禁忌祭壇",
  "自以為是主角的妄想牢籠",
  "在廁所偷偷哭泣的弱者之巢",
  "對著螢幕發情的變態集中營",
  "被世界遺忘的啃老族地窖",
  "幻想與美少女接吻的白日夢工廠",
  "穿著洗到發黃內褲的勇者之塔",
  "在網路上尋求存在感的邊緣人荒漠",
  "對著紙片人喊老婆的悲哀聖域",
  "現實中連話都說不清楚的魔王殿",
  "存款只有三位數的救世主祭壇",
  "被鄰居報警投訴的噪音源頭"
];
const GROUP_SUFFIXES = ["禁域", "位面", "領地", "祭壇", "深淵", "神殿", "牢獄", "孤島", "荒原", "地窖", "墓穴", "聖域", "魔窟", "監獄", "死地", "幻境"];

const ALIAS_PREFIXES = [
  "漆黑的", "墮落的", "狂暴的", "虛無的", "永恆的", "禁忌的", "瘋狂的", "神聖的", "被詛咒的", "終焉的",
  "邪王真眼的", "爆裂的", "紅蓮的", "蒼穹的", "極寒的", "雷鳴的", "不死的", "孤高的", "背叛的", "救世的",
  "次元的", "深淵的", "星辰的", "幻影的", "鋼鐵的", "血色的", "黃金的", "白銀的", "翡翠的", "紫晶的",
  "被神遺棄的", "從地獄歸來的", "掌握真理的", "穿越時空的", "吞噬靈魂的", "斬斷因果的"
];
const ALIAS_TITLES = [
  "龍之使者", "暗影刺客", "魔眼持有者", "靈魂收割者", "時空旅人", "混沌領主", "深淵魔術師", "星辰守護者", "血色公爵", "虛空行者",
  "漆黑勇者", "紅蓮魔女", "蒼之騎士", "雷霆之怒", "不死之王", "孤高之狼", "背叛之刃", "救世之光", "次元之主", "深淵之影",
  "星辰之子", "幻影之舞", "鋼鐵之魂", "血色之瞳", "黃金之翼", "白銀之劍", "翡翠之夢", "紫晶之淚", "真理之門", "因果之鎖",
  "六花之盾", "惠惠之杖", "桐人之劍", "亞絲娜之光", "魯路修之眼", "夜神月之筆", "艾連之吼", "兵長之刃", "炭治郎之息", "禰豆子之箱"
];
const ALIAS_SUFFIXES = [];

const CHUNI_INTROS = [
  "這隻右手...快要按捺不住了...",
  "錯的不是我，是這個世界！",
  "在永恆的黑暗中，唯有我能看見真實。",
  "這就是命運的石之門嗎？",
  "消失吧，在這虛無的盡頭！",
  "我的真名早已被神遺忘，現在我只是個復仇者。",
  "契約已經成立，靈魂將歸於深淵。",
  "這場鬧劇，就由我來畫下句點。",
  "愚蠢的人類啊，感受這絕望的重量吧！",
  "我的魔眼，能看穿一切虛偽的偽裝。",
  "爆裂吧，現實！粉碎吧，精神！放逐這個世界！",
  "我，就是新世界的神！",
  "既然你誠心誠意的發問了，我就大發慈悲的告訴你。",
  "真相只有一個！",
  "我要成為海賊王！",
  "代表月亮懲罰你！",
  "你已經死了。",
  "我不是在生氣，我只是在對這個世界感到絕望。",
  "這就是我的忍道！",
  "安息吧，在我的劍下。",
  "我的心，早已如這冰雪般寒冷。",
  "不要問我從哪裡來，我的故鄉早已毀滅。",
  "這股力量...難道是傳說中的...？",
  "這只是我實力的百分之一而已。",
  "你，有被光速踢過嗎？",
  "我的夢想，是讓這個世界感受到痛楚。",
  "隱藏著黑暗力量的鑰匙啊，在我面前顯示你真正的力量！",
  "我只是個路過的假面騎士，給我記好了！",
  "這就是我的全盛時期！",
  "我的靈魂，正在燃燒！"
];

const CHUNI_ULTIMATES = [
  { name: "千本櫻景嚴", release: "散落吧，千本櫻。" },
  { name: "殘火太刀", release: "森羅萬象，皆為灰燼。" },
  { name: "大紅蓮冰輪丸", release: "霜天之上，冰龍降臨。" },
  { name: "神殺槍", release: "射殺他，神槍。" },
  { name: "黑繩天譴明王", release: "轟鳴吧，天譴。" },
  { name: "花天狂骨枯松心中", release: "凋零吧，花天狂骨。" },
  { name: "白霞罰", release: "凌駕於白雪之上。" },
  { name: "天鎖斬月", release: "月牙天衝！" },
  { name: "誓約勝利之劍", release: "Excalibur!!!" },
  { name: "天地乖離・初生之星", release: "Enuma Elish!!!" },
  { name: "無限劍製", release: "I am the bone of my sword." },
  { name: "星爆氣流斬", release: "更快...還要更快！" },
  { name: "邪王真眼・終焉之光", release: "爆裂吧，現實！粉碎吧，精神！" },
  { name: "地爆天星", release: "讓世界感受痛楚。" },
  { name: "世界・時間停止", release: "Za Warudo! Toki wo Tomare!" },
  { name: "認真系列・認真一拳", release: "我只是個興趣使然的英雄。" },
  { name: "死者之書", release: "寫下你的名字，你就已經死了。" },
  { name: "紅蓮螺巖・天元突破", release: "你的鑽頭是突破天際的鑽頭啊！" },
  { name: "絕對命令", release: "魯路修・維・不列顛尼亞命令你..." },
  { name: "王之財寶", release: "雜修，誰允許你直視本王的？" },
  { name: "次元斬", release: "連同空間一起斬斷！" },
  { name: "極死之七夜", release: "十七分割。" },
  { name: "直死之魔眼", release: "只要是活著的東西，就算是神也殺給你看。" },
  { name: "螺旋丸", release: "這就是我的忍道！" },
  { name: "龜派氣功", release: "KA-ME-HA-ME-HA!!!" },
  { name: "天照", release: "這黑炎將燃盡一切。" },
  { name: "月讀", release: "在我的世界裡，時間由我掌控。" },
  { name: "神威", release: "扭曲吧，空間！" },
  { name: "須佐能乎", release: "這就是神的力量。" },
  { name: "外道・輪迴天生", release: "跨越生死的界限。" },
  { name: "超大玉螺旋丸", release: "接招吧！" },
  { name: "麒麟", release: "隨雷鳴一起消散吧。" },
  { name: "八卦六十四掌", release: "你已經在我的領域內了。" },
  { name: "屍鬼封盡", release: "將靈魂獻祭給死神。" },
  { name: "裏蓮華", release: "綻放吧，青春！" },
  { name: "原子斬", release: "一瞬間斬出數千刀。" },
  { name: "流星爆發", release: "超越極限的崩星咆哮砲。" },
  { name: "超電磁砲", release: "這就是我的正義。" },
  { name: "幻想殺手", release: "粉碎這無聊的幻想！" },
  { name: "矢量操作", release: "所有的方向都由我決定。" },
  { name: "未元物質", release: "這是不存在於這世界的物質。" },
  { name: "心理掌握", release: "你的心靈，我收下了。" },
  { name: "超音速衝擊", release: "肉眼無法捕捉的速度。" },
  { name: "虛閃", release: "毀滅性的靈壓射線。" },
  { name: "黑虛閃", release: "絕望的黑色光芒。" },
  { name: "王虛的閃光", release: "最強的虛之射線。" },
  { name: "雷霆之槍", release: "連神都能貫穿的雷電。" },
  { name: "豹王之爪", release: "撕裂一切的狂暴。" },
  { name: "死亡氣息", release: "萬物皆會腐朽。" },
  { name: "歸刃・黑翼大魔", release: "封鎖吧，黑翼大魔。" },
  { name: "歸刃・豹王", release: "吱嘎作響吧，豹王。" },
  { name: "歸刃・邪淫妃", release: "啜飲吧，邪淫妃。" },
  { name: "歸刃・憤獸", release: "憤怒吧，憤獸。" },
  { name: "魔貫光殺砲", release: "貫穿吧！" },
  { name: "元氣彈", release: "請分給我一點元氣！" },
  { name: "終極閃光", release: "Final Flash!!!" },
  { name: "大爆炸攻擊", release: "Big Bang Attack!!!" },
  { name: "自在極意功", release: "身體自發的反應。" },
  { name: "破壞神之技", release: "消失吧。" },
  { name: "魔封波", release: "封印在電鍋裡吧！" },
  { name: "界王拳", release: "十倍界王拳！" },
  { name: "龍拳", release: "爆發吧，龍拳！" },
  { name: "邪王炎殺黑龍波", release: "不要小看魔界的力量。" },
  { name: "靈丸", release: "靈光波動拳奧義。" },
  { name: "次元刀", release: "切開次元的利刃。" },
  { name: "魔界植物召喚", release: "感受大自然的憤怒。" },
  { name: "玫瑰鞭", release: "華麗的處刑。" },
  { name: "飛影・炎殺劍", release: "灼熱的劍技。" },
  { name: "藏馬・魔界含羞草", release: "一旦被纏住就無法逃脫。" },
  { name: "桑原・靈劍", release: "這就是我的骨氣！" },
  { name: "戶愚呂・100%力量", release: "這就是最強的力量。" },
  { name: "仙水・聖光氣", release: "神聖的鬥氣。" },
  { name: "雷禪・狂暴", release: "飢餓的野獸。" },
  { name: "軀・次元切斷", release: "連同悲傷一起切斷。" },
  { name: "黃泉・魔古忌流煉破反衝壁", release: "絕對的防禦。" },
  { name: "天馬流星拳", release: "燃燒吧，小宇宙！" },
  { name: "廬山升龍霸", release: "逆流而上的神龍。" },
  { name: "鑽石星塵", release: "絕對零度的凍氣。" },
  { name: "鳳翼天翔", release: "不死鳥的羽翼。" },
  { name: "星塵旋風", release: "星辰的咆哮。" },
  { name: "銀河星爆", release: "銀河的崩毀。" },
  { name: "天舞寶輪", release: "剝奪你的五感。" },
  { name: "積屍氣冥界波", release: "通往黃泉的引導。" },
  { name: "閃電光速拳", release: "光速的打擊。" },
  { name: "巨型號角", release: "黃金野牛的衝擊。" },
  { name: "幻朧魔皇拳", release: "操控你的意志。" },
  { name: "雅典娜之驚嘆", release: "禁忌的影子戰法。" },
  { name: "冥王之劍", release: "神之審判。" },
  { name: "北斗百裂拳", release: "你已經死了。" },
  { name: "南斗水鳥拳", release: "華麗的切割。" },
  { name: "天破活殺", release: "北斗神拳奧義。" },
  { name: "無想轉生", release: "究極的虛無。" },
  { name: "橡膠槍亂打", release: "我要成為海賊王！" },
  { name: "三刀流・大千世界", release: "九山八海，無我不斷之物。" },
  { name: "惡魔風腳", release: "地獄的滋味。" },
  { name: "雷鳴八卦", release: "這就是四皇的力量。" },
  { name: "神避", release: "羅傑的劍技。" },
  { name: "冰河時代", release: "凍結吧，大海。" },
  { name: "八尺瓊勾玉", release: "光速的射擊。" },
  { name: "冥狗", release: "熔岩的鐵拳。" },
  { name: "佛之衝擊波", release: "神聖的震盪。" },
  { name: "震震果實・海震", release: "讓世界顫抖吧。" },
  { name: "黑洞", release: "吞噬一切的黑暗。" },
  { name: "手術果實・伽馬刀", release: "內部的破壞。" },
  { name: "鳥籠", release: "絕望的牢籠。" },
  { name: "雷神", release: "兩億伏特的制裁。" },
  { name: "毒龍", release: "劇毒的侵蝕。" },
  { name: "重力刀・猛虎", release: "隕石的降臨。" },
  { name: "魂之喪歌", release: "靈魂的收割。" },
  { name: "甜甜甘風", release: "石化吧，凡人。" },
  { name: "莫莫果實・一百倍速", release: "超越極限的速度。" },
  { name: "金金果實・黃金神罰", release: "黃金的制裁。" },
  { name: "合體果實・究極兵器", release: "最強的武裝。" },
  { name: "歌歌果實・世界終焉", release: "在歌聲中沉睡吧。" },
  { name: "天之鎖", release: "連神都能束縛的鎖鏈。" },
  { name: "乖離劍", release: "斬裂世界之物。" },
  { name: "王之財寶", release: "雜修，誰允許你直視本王的？" },
  { name: "熾天覆七重圓環", release: "擋下所有投擲武器的盾。" },
  { name: "幻想大劍・天叢雲劍", release: "斬斷一切邪惡。" },
  { name: "破戒百龍", release: "百龍齊鳴，毀天滅地。" },
  { name: "死之牙", release: "絕對無法逃脫的死亡。" },
  { name: "魔眼・石化", release: "直視我，然後化為石像。" },
  { name: "鮮血神殿", release: "將靈魂化為祭品。" },
  { name: "騎英之韁繩", release: "天馬啊，奔向星空。" },
  { name: "萬戒必破之符", release: "所有的契約都將失效。" },
  { name: "妄想心音", release: "捏碎你的心臟。" },
  { name: "妄想幻象", release: "無數的自我，無盡的殺意。" },
  { name: "王之軍勢", release: "此為我等共同之夢。" },
  { name: "螺湮城教本", release: "在瘋狂中顫抖吧。" },
  { name: "不凋落的花", release: "最強的防禦意志。" },
  { name: "流星一條", release: "將生命化為最後的一擊。" },
  { name: "天草四郎・雙腕・零次集束", release: "救贖此世的洗禮。" },
  { name: "紅蓮之聖女", release: "主啊，委身於此身。" },
  { name: "吾心即為永恆之槍", release: "貫穿真理的利刃。" },
  { name: "黃金劇場", release: "至高無上的讚美。" },
  { name: "童女謳歌的華麗帝政", release: "盛開吧，薔薇。" },
  { name: "不可視之劍", release: "風王結界，解放！" },
  { name: "羅德斯之門", release: "守護聖都的屏障。" },
  { name: "聖光之劍", release: "閃耀吧，聖劍。" },
  { name: "無二打", release: "一擊必殺。" },
  { name: "燕返", release: "秘劍，燕返。" },
  { name: "次元斬・絕", release: "連同因果一起斬斷。" },
  { name: "閻魔刀", release: "這就是我的力量。" },
  { name: "幻影劍", release: "守護我的意志。" },
  { name: "真魔人化", release: "覺醒吧，惡魔之血。" },
  { name: "審判之眼", release: "看穿你的罪孽。" },
  { name: "地獄之火", release: "燃盡靈魂的業火。" },
  { name: "靈魂收割", release: "你的靈魂，我收下了。" },
  { name: "虛無之境", release: "一切都歸於虛無。" },
  { name: "永恆之眠", release: "在黑暗中安息吧。" },
  { name: "禁忌之咒", release: "觸碰禁忌的力量。" },
  { name: "瘋狂之舞", release: "在混亂中起舞。" },
  { name: "神聖之光", release: "淨化一切邪惡。" },
  { name: "被詛咒的血脈", release: "覺醒吧，禁忌之力。" },
  { name: "終焉之鐘", release: "聽到了嗎，死亡的鐘聲？" },
  { name: "邪王真眼・改", release: "看穿命運的軌跡。" },
  { name: "爆裂魔法", release: "Explosion!!!" },
  { name: "紅蓮之翼", release: "翺翔於天際的紅蓮。" },
  { name: "蒼穹之怒", release: "天空的咆哮。" },
  { name: "極寒之域", release: "凍結時間的寒氣。" },
  { name: "雷鳴之巔", release: "掌控雷電的神明。" },
  { name: "不死之身", release: "跨越死亡的界限。" },
  { name: "孤高之王", release: "獨自站立於巔峰。" },
  { name: "背叛之刃", release: "斬斷信任的利刃。" },
  { name: "救世之光", release: "照亮黑暗的希望。" },
  { name: "次元之主", release: "掌控空間的王者。" },
  { name: "深淵之影", release: "潛伏於黑暗的陰影。" },
  { name: "星辰之子", release: "繼承星辰的意志。" },
  { name: "幻影之舞", release: "捉摸不透的身影。" },
  { name: "鋼鐵之魂", release: "堅不可摧的意志。" },
  { name: "血色之瞳", release: "看穿生死的雙眼。" },
  { name: "黃金之翼", release: "閃耀光芒的羽翼。" },
  { name: "白銀之劍", release: "守護正義的利刃。" },
  { name: "翡翠之夢", release: "沉溺於幻境之中。" },
  { name: "紫晶之淚", release: "悲傷的結晶。" },
  { name: "真理之門", release: "通往未知的出口。" },
  { name: "因果之鎖", release: "束縛命運的鎖鏈。" }
];

const EPIC_COMBINED_CHANTS = [
  "此為終焉之刻，萬象歸一。寶具解放，卍解・終焉奧義！",
  "跨越次元的界限，將靈魂化為最後的利刃。在此顯現吧，究極之姿！",
  "天與地將在此交匯，因果之環由我親手斬斷。這是超越神明的力量！",
  "聽到了嗎？那是世界崩壞的聲音。在絕望中沉睡，在光芒中重生！",
  "我身即為劍，我心即為理。萬物皆虛，萬事皆允。解放吧，禁忌之門！",
  "星辰之光與深淵之影，在此合而為一。這就是我的，最終解答！",
  "無盡的戰場，永恆的孤獨。以此一擊，終結這場無止境的夢境！",
  "神靈的嘆息，惡魔的狂笑。在混沌中起舞，在毀滅中永恆！",
  "看好了，這就是人類意志的最高傑作。貫穿吧，真實之槍！",
  "所有的契約都已失效，所有的命運都已註定。在此，宣告終結！"
];

const FGO_NOBLE_PHANTASMS = [
  { name: "誓約勝利之劍 (Excalibur)", chant: "集結眾星之吐息，閃耀生命之奔流！" },
  { name: "天地乖離・初生之星 (Enuma Elish)", chant: "由我來訴說原初。天與地將分開，虛無將以此祝賀。以此開天闢地之星，切割世界！" },
  { name: "無限劍製 (Unlimited Blade Works)", chant: "體為劍所成。血潮如鐵，心如琉璃。縱橫無數戰場而不敗。未曾一次敗退，未曾一次得勝。其姿常獨立於劍丘之上，醉於勝利之中。因此，此生已無意義。則此軀，定為劍所成！" },
  { name: "約束勝利之劍 (Excalibur Morgan)", chant: "卑王槌，反轉旭光。將光芒吞噬吧！" },
  { name: "熾天覆七重圓環 (Rho Aias)", chant: "投擲而出的必勝之槍，以此盾擋之！" },
  { name: "穿刺死棘之槍 (Gae Bolg)", chant: "其心臟，我收下了！" },
  { name: "刺穿死棘之槍 (Gae Bolg Alternative)", chant: "貫穿吧，死之棘！" },
  { name: "大神宣言 (Gungnir)", chant: "必中之神槍，貫穿命運！" },
  { name: "萬戒必破之符 (Rule Breaker)", chant: "切斷一切契約，回歸虛無！" },
  { name: "騎英之韁繩 (Bellerophon)", chant: "天馬啊，奔馳於星空之巔！" },
  { name: "鮮血神殿 (Blood Fort Andromeda)", chant: "化為祭壇，獻上鮮血！" },
  { name: "妄想心音 (Zabaniya)", chant: "咒殺之手，捏碎心臟！" },
  { name: "妄想幻象 (Zabaniya)", chant: "無數的自我，無盡的殺意！" },
  { name: "王之軍勢 (Ionian Hetairoi)", chant: "所謂王者，即是活得比任何人都更耀眼，讓眾人為之傾倒的存在！" },
  { name: "螺湮城教本 (Prelati's Spellbook)", chant: "瘋狂吧，深淵的怪物！" },
  { name: "破壞神之手 (Vasavi Shakti)", chant: "諸神之王啊，以此一擊，將一切化為灰燼！" },
  { name: "梵天呀，覆蓋大地 (Brahmastra)", chant: "燃燒吧，神之怒！" },
  { name: "梵天呀，詛咒我身 (Brahmastra Kundala)", chant: "以此身之痛，換取毀滅之光！" },
  { name: "日輪呀，順從死亡 (Vasavi Shakti)", chant: "領悟吧，這就是終焉！" },
  { name: "天草四郎・雙腕・零次集束", chant: "洗禮詠唱，救贖此世！" },
  { name: "貞德・紅蓮之聖女", chant: "主啊，委身於此身！" },
  { name: "吾心即為永恆之槍", chant: "貫穿吧，真理！" },
  { name: "黃金劇場 (Aestus Domus Aurea)", chant: "在此獻上，至高無上的讚美！" },
  { name: "童女謳歌的華麗帝政", chant: "盛開吧，薔薇之花！" },
  { name: "不可視之劍 (Invisible Air)", chant: "風王結界，解放！" },
  { name: "羅德斯之門", chant: "守護吧，聖都！" },
  { name: "聖光之劍", chant: "閃耀吧，聖劍！" },
  { name: "無二打", chant: "一擊必殺，絕無二打！" },
  { name: "燕返", chant: "秘劍，燕返！" },
  { name: "死告天使 (Azrael)", chant: "聽到了嗎，晚鐘的聲音？" },
  { name: "耀於至遠之槍 (Rhongomyniad)", chant: "閃耀吧，至遠之槍！" },
  { name: "山脈震撼明星之昴 (Galgallin)", chant: "這就是女神的憤怒！" },
  { name: "極刑王 (Kazikli Bey)", chant: "這就是我的領土，這就是我的正義！" },
  { name: "十二試煉 (God Hand)", chant: "我將跨越死亡，無數次地歸來！" },
  { name: "流星一條 (Stella)", chant: "將我的生命，化為最後的一擊！Stella!!!" },
  { name: "羅生門大怨起", chant: "將這怨念，化為羅生門的鬼火！" },
  { name: "人理之礎", chant: "為了守護這顆星球，為了守護人類的未來！" },
  { name: "天地震盪的咆哮", chant: "這就是我的憤怒，這就是我的力量！" },
  { name: "原始宇宙的咆哮", chant: "從宇宙的盡頭，降下毀滅的星辰！" },
  { name: "銀河星爆 (Galaxian Explosion)", chant: "銀河的崩毀，就在這一瞬間！" },
  { name: "天舞寶輪", chant: "剝奪你的五感，讓你墮入永恆的虛無！" },
  { name: "積屍氣冥界波", chant: "通往黃泉的引導，去死吧！" },
  { name: "閃電光速拳", chant: "光速的打擊，你無法躲避！" },
  { name: "巨型號角", chant: "黃金野牛的衝擊，粉碎一切！" },
  { name: "幻朧魔皇拳", chant: "操控你的意志，成為我的傀儡！" },
  { name: "雅典娜之驚嘆", chant: "禁忌的影子戰法，毀滅神明！" },
  { name: "冥王之劍", chant: "神之審判，降臨於此！" },
  { name: "北斗百裂拳", chant: "你已經死了，只是還沒感覺到而已。" },
  { name: "南斗水鳥拳", chant: "華麗的切割，這就是藝術！" },
  { name: "天破活殺", chant: "北斗神拳奧義，貫穿你的靈魂！" },
  { name: "無想轉生", chant: "究極的虛無，這就是最強的境界！" }
];

const BETTOR_NAMES = ["暗黑預言者", "命運編織者", "混沌觀察者", "虛無信徒", "星辰賭徒", "靈魂交易商"];

// --- Types ---

interface Member {
  id: string;
  name: string;
  alias: string;
  groupName: string;
  chuniIntro: string;
  bankai?: { name: string; release: string };
  noblePhantasm?: { name: string; chant: string };
  combinedUltimate?: { name: string; chant: string };
}

interface Match {
  id: string;
  p1: string | null; // memberId or "BYE"
  p2: string | null; // memberId or "BYE"
  winner: string | null;
  round: number;
  position: number;
}

interface Group {
  id: string;
  name: string;
  shortName: string;
  members: Member[];
  matches: Match[];
}

interface Bet {
  id: string;
  bettor: string;
  targetId: string;
  targetAlias: string;
  targetRealName: string;
  amount: number;
}

interface TournamentData {
  groups: Group[];
  allMembers: Member[];
  bets: Bet[];
  finalMatches: Match[];
}

// --- Utils ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateAlias = (existingAliases: Set<string>) => {
  let alias = "";
  do {
    const p = ALIAS_PREFIXES[Math.floor(Math.random() * ALIAS_PREFIXES.length)];
    const t = ALIAS_TITLES[Math.floor(Math.random() * ALIAS_TITLES.length)];
    alias = `${p}${t}`;
  } while (existingAliases.has(alias));
  existingAliases.add(alias);
  return alias;
};

const initializeBracket = (members: Member[]): Match[] => {
  const count = members.length;
  if (count === 0) return [];
  
  const rounds = Math.ceil(Math.log2(count));
  const totalSlots = Math.pow(2, rounds);
  
  const matches: Match[] = [];
  
  // Round 0 (Initial)
  // Standard tournament logic: 
  // Number of matches in Round 0 = count - (totalSlots / 2)
  // These matches reduce the count to exactly totalSlots / 2 for Round 1.
  const numMatchesInRound0 = totalSlots / 2;
  const numRealMatches = count - (totalSlots / 2);
  
  for (let i = 0; i < numMatchesInRound0; i++) {
    let p1: string | null = null;
    let p2: string | null = null;
    let winner: string | null = null;
    
    if (i < numRealMatches) {
      // Real match: Player vs Player
      p1 = members[i * 2].id;
      p2 = members[i * 2 + 1].id;
    } else {
      // BYE match: Player vs BYE
      const memberIdx = numRealMatches * 2 + (i - numRealMatches);
      p1 = members[memberIdx] ? members[memberIdx].id : "BYE";
      p2 = "BYE";
      winner = p1 === "BYE" ? null : p1;
    }
    
    matches.push({
      id: `r0-m${i}`,
      p1,
      p2,
      winner,
      round: 0,
      position: i
    });
  }

  // Subsequent rounds
  for (let r = 1; r < rounds; r++) {
    const slotsInRound = Math.pow(2, rounds - r - 1);
    for (let i = 0; i < slotsInRound; i++) {
      matches.push({
        id: `r${r}-m${i}`,
        p1: null,
        p2: null,
        winner: null,
        round: r,
        position: i
      });
    }
  }

  return propagateWinners(matches, rounds);
};

const propagateWinners = (matches: Match[], totalRounds: number): Match[] => {
  let updated = [...matches];
  let changed = true;

  while (changed) {
    changed = false;
    for (let r = 0; r < totalRounds - 1; r++) {
      const currentRoundMatches = updated.filter(m => m.round === r);
      const nextRoundMatches = updated.filter(m => m.round === r + 1);

      for (const match of currentRoundMatches) {
        if (match.winner) {
          const nextMatchPos = Math.floor(match.position / 2);
          const nextMatch = nextRoundMatches.find(m => m.position === nextMatchPos);
          if (nextMatch) {
            const isP1 = match.position % 2 === 0;
            const currentVal = isP1 ? nextMatch.p1 : nextMatch.p2;
            
            if (currentVal !== match.winner) {
              const matchIdx = updated.findIndex(m => m.id === nextMatch.id);
              const newNextMatch = { ...updated[matchIdx] };
              if (isP1) newNextMatch.p1 = match.winner;
              else newNextMatch.p2 = match.winner;

              // Auto-win if opponent is BYE
              if (newNextMatch.p1 && newNextMatch.p2) {
                if (newNextMatch.p1 === "BYE" && newNextMatch.p2 !== "BYE") newNextMatch.winner = newNextMatch.p2;
                else if (newNextMatch.p2 === "BYE" && newNextMatch.p1 !== "BYE") newNextMatch.winner = newNextMatch.p1;
              }

              updated[matchIdx] = newNextMatch;
              changed = true;
            }
          }
        }
      }
    }
  }
  return updated;
};

const clearDescendants = (matches: Match[], round: number, position: number): Match[] => {
  let updated = [...matches];
  let currentRound = round;
  let currentPos = position;

  const totalRounds = Math.max(...matches.map(m => m.round)) + 1;

  for (let r = currentRound + 1; r < totalRounds; r++) {
    const nextPos = Math.floor(currentPos / 2);
    const isP1 = currentPos % 2 === 0;
    const matchIdx = updated.findIndex(m => m.round === r && m.position === nextPos);
    
    if (matchIdx !== -1) {
      const match = { ...updated[matchIdx] };
      if (isP1) match.p1 = null;
      else match.p2 = null;
      match.winner = null;
      updated[matchIdx] = match;
      currentPos = nextPos;
    } else {
      break;
    }
  }
  return updated;
};

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-transparent">
          <h2 className="text-xl font-bold text-purple-100 flex items-center gap-2">
            <Skull className="w-5 h-5 text-purple-400" />
            {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const VerticalTreeBracket = ({ matches, members, isAdmin, onSelectWinner, groupName, isFinal = false }: { 
  matches: Match[], 
  members: Member[], 
  isAdmin: boolean, 
  onSelectWinner: (matchId: string, winnerId: string | null) => void,
  groupName: string,
  isFinal?: boolean
}) => {
  const rounds = useMemo(() => {
    const maxRound = Math.max(...matches.map(m => m.round));
    const r = [];
    for (let i = 0; i <= maxRound; i++) {
      r.push(matches.filter(m => m.round === i).sort((a, b) => a.position - b.position));
    }
    return r;
  }, [matches]);

  const getMember = (id: string | null) => {
    if (id === "BYE") return { id: "BYE", alias: "輪空 (BYE)", name: "BYE", chuniIntro: "深淵的沈默...", bankai: null, noblePhantasm: null, combinedUltimate: null };
    return members.find(m => m.id === id) || null;
  };

  const getGroupWinner = (group: Group) => {
    if (group.matches.length === 0) return null;
    const finalMatch = group.matches[group.matches.length - 1];
    if (!finalMatch.winner) return null;
    return group.members.find(m => m.id === finalMatch.winner);
  };

  return (
    <div className="flex gap-8 overflow-x-auto pb-8 px-4 min-h-[400px]">
      {rounds.map((roundMatches, rIdx) => (
        <div key={rIdx} className="flex flex-col justify-around gap-4 min-w-[280px]">
          <div className="text-center text-[10px] font-black text-purple-400/40 uppercase tracking-[0.3em] mb-2">
            Phase {rIdx + 1}
          </div>
          {roundMatches.map((match) => {
            const p1 = getMember(match.p1);
            const p2 = getMember(match.p2);
            
            return (
              <div key={match.id} className="relative py-4">
                <div className="flex flex-col gap-3">
                  {/* Player 1 */}
                  <div 
                    onClick={() => isAdmin && p1 && p1.id !== "BYE" && onSelectWinner(match.id, p1.id)}
                    className={`
                      relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20
                      ${match.winner === p1?.id && p1?.id ? 'bg-purple-600/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10' : 'bg-slate-800/50 border-white/10 hover:border-white/30'}
                      ${p1?.id === "BYE" ? 'opacity-30 grayscale' : ''}
                      ${isFinal ? 'border-l-4 border-l-amber-500 py-5 px-6' : ''}
                    `}
                  >
                    {isFinal && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />}
                    <div className="flex flex-col gap-1">
                      <div className={`font-black text-white truncate relative z-10 ${isFinal ? 'text-lg' : 'text-base'}`}>
                        {p1?.name || "???"}
                      </div>
                      {p1?.id !== "BYE" && (
                        <div className="text-xs text-slate-400 italic font-medium truncate opacity-70 group-hover:opacity-100 transition-opacity">
                          「{p1?.chuniIntro}」
                        </div>
                      )}
                      {p1?.combinedUltimate ? (
                        <div className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest mt-1 italic truncate">
                          畫具・解放。: {p1.combinedUltimate.name}
                        </div>
                      ) : (
                        <>
                          {p1?.bankai && (
                            <div className="text-[9px] font-black text-red-500/60 uppercase tracking-widest mt-1 italic truncate">
                              畫具・解放。: {p1.bankai.name}
                            </div>
                          )}
                          {p1?.noblePhantasm && (
                            <div className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest mt-1 italic truncate">
                              畫具・解放。: {p1.noblePhantasm.name}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {isFinal && p1?.id !== "BYE" && isAdmin && (
                      <div className="text-xs font-bold text-amber-400/80 truncate relative z-10 mt-2 uppercase tracking-widest">
                        {p1?.alias}
                      </div>
                    )}
                    {isAdmin && !isFinal && p1?.id !== "BYE" && (
                      <div className="text-[11px] font-mono text-slate-500 truncate relative z-10 mt-2 font-bold">
                        Alias: {p1?.alias}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div className={`w-px bg-white/10 ${isFinal ? 'h-8' : 'h-6'}`} />
                  </div>

                  {/* Player 2 */}
                  <div 
                    onClick={() => isAdmin && p2 && p2.id !== "BYE" && onSelectWinner(match.id, p2.id)}
                    className={`
                      relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20
                      ${match.winner === p2?.id && p2?.id ? 'bg-purple-600/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10' : 'bg-slate-800/50 border-white/10 hover:border-white/30'}
                      ${p2?.id === "BYE" ? 'opacity-30 grayscale' : ''}
                      ${isFinal ? 'border-l-4 border-l-amber-500 py-5 px-6' : ''}
                    `}
                  >
                    {isFinal && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />}
                    <div className="flex flex-col gap-1">
                      <div className={`font-black text-white truncate relative z-10 ${isFinal ? 'text-lg' : 'text-base'}`}>
                        {p2?.name || "???"}
                      </div>
                      {p2?.id !== "BYE" && (
                        <div className="text-xs text-slate-400 italic font-medium truncate opacity-70 group-hover:opacity-100 transition-opacity">
                          「{p2?.chuniIntro}」
                        </div>
                      )}
                      {p2?.combinedUltimate ? (
                        <div className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest mt-1 italic truncate">
                          畫具・解放。: {p2.combinedUltimate.name}
                        </div>
                      ) : (
                        <>
                          {p2?.bankai && (
                            <div className="text-[9px] font-black text-red-500/60 uppercase tracking-widest mt-1 italic truncate">
                              畫具・解放。: {p2.bankai.name}
                            </div>
                          )}
                          {p2?.noblePhantasm && (
                            <div className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest mt-1 italic truncate">
                              畫具・解放。: {p2.noblePhantasm.name}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {isFinal && p2?.id !== "BYE" && isAdmin && (
                      <div className="text-xs font-bold text-amber-400/80 truncate relative z-10 mt-2 uppercase tracking-widest">
                        {p2?.alias}
                      </div>
                    )}
                    {isAdmin && !isFinal && p2?.id !== "BYE" && (
                      <div className="text-[11px] font-mono text-slate-500 truncate relative z-10 mt-2 font-bold">
                        Alias: {p2?.alias}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connector to next round */}
                {rIdx < rounds.length - 1 && (
                  <div className="absolute top-1/2 -right-8 w-8 h-px bg-purple-500/30" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const UpwardTreeBracket = ({ matches, members, isAdmin, onSelectWinner }: { 
  matches: Match[], 
  members: Member[], 
  isAdmin: boolean, 
  onSelectWinner: (matchId: string, winnerId: string | null) => void
}) => {
  const rounds = useMemo(() => {
    if (matches.length === 0) return [];
    const maxRound = Math.max(...matches.map(m => m.round));
    const r = [];
    for (let i = 0; i <= maxRound; i++) {
      r.push(matches.filter(m => m.round === i).sort((a, b) => a.position - b.position));
    }
    return r.reverse(); // [Final, Semi, Quarter, ...]
  }, [matches]);

  const getMember = (id: string | null) => {
    if (id === "BYE") return { id: "BYE", name: "BYE", alias: "輪空", chuniIntro: "...", bankai: null, noblePhantasm: null, combinedUltimate: null };
    return members.find(m => m.id === id) || null;
  };

  if (rounds.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-16 py-20 min-w-max">
      {rounds.map((roundMatches, rIdx) => (
        <div key={rIdx} className="flex justify-around items-start w-full gap-8">
          {roundMatches.map((match) => {
            const p1 = getMember(match.p1);
            const p2 = getMember(match.p2);
            
            return (
              <div key={match.id} className="flex flex-col items-center relative">
                {/* Match Box */}
                <div className="bg-slate-900/90 border border-white/10 rounded-[2rem] p-8 w-72 shadow-2xl relative z-10 group hover:border-amber-500/50 transition-all hover:scale-105 hover:shadow-amber-500/10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] shadow-lg">
                    {rIdx === 0 ? "The Final" : `Phase ${rounds.length - rIdx}`}
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div 
                      onClick={() => isAdmin && p1 && p1.id !== "BYE" && onSelectWinner(match.id, p1.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${match.winner === p1?.id && p1?.id ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-black text-base text-white truncate">{p1?.name || "???"}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase truncate">{p1?.alias.replace(/・[改極零殤滅幻獄天真偽破急序終神]$/, '')}</span>
                          {p1?.combinedUltimate ? (
                            <span className="text-[9px] text-amber-500/80 font-black uppercase italic truncate mt-1">畫具・解放。: {p1.combinedUltimate.name}</span>
                          ) : (
                            <>
                              {p1?.bankai && (
                                <span className="text-[9px] text-red-500/60 font-black uppercase italic truncate mt-1">畫具・解放。: {p1.bankai.name}</span>
                              )}
                              {p1?.noblePhantasm && (
                                <span className="text-[9px] text-blue-500/60 font-black uppercase italic truncate mt-1">畫具・解放。: {p1.noblePhantasm.name}</span>
                              )}
                            </>
                          )}
                        </div>
                        {match.winner === p1?.id && p1?.id && <Crown className="w-5 h-5 text-amber-500" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/5"></div>
                      <div className="text-[10px] font-black text-slate-700 italic">VS</div>
                      <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    <div 
                      onClick={() => isAdmin && p2 && p2.id !== "BYE" && onSelectWinner(match.id, p2.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${match.winner === p2?.id && p2?.id ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-black text-base text-white truncate">{p2?.name || "???"}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase truncate">{p2?.alias.replace(/・[改極零殤滅幻獄天真偽破急序終神]$/, '')}</span>
                          {p2?.combinedUltimate ? (
                            <span className="text-[9px] text-amber-500/80 font-black uppercase italic truncate mt-1">畫具・解放。: {p2.combinedUltimate.name}</span>
                          ) : (
                            <>
                              {p2?.bankai && (
                                <span className="text-[9px] text-red-500/60 font-black uppercase italic truncate mt-1">畫具・解放。: {p2.bankai.name}</span>
                              )}
                              {p2?.noblePhantasm && (
                                <span className="text-[9px] text-blue-500/60 font-black uppercase italic truncate mt-1">畫具・解放。: {p2.noblePhantasm.name}</span>
                              )}
                            </>
                          )}
                        </div>
                        {match.winner === p2?.id && p2?.id && <Crown className="w-5 h-5 text-amber-500" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connectors to children (below) */}
                {rIdx < rounds.length - 1 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
                    <div className="w-px h-16 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betName, setBetName] = useState("");
  const [betAmount, setBetAmount] = useState(1000);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingResult, setRollingResult] = useState<Member | null>(null);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [grandWinner, setGrandWinner] = useState<Member | null>(null);
  const lastCelebratedId = useRef<string | null>(null);
  const [tournamentData, setTournamentData] = useState<TournamentData>(() => {
    const saved = localStorage.getItem('chuni_tournament_data');
    if (saved) return JSON.parse(saved);
    return { groups: [], allMembers: [], bets: [], finalMatches: [] };
  });

  // Supabase user state
  const [sbUser, setSbUser] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) setSbUser(data.session.user);
        // try to load remote data if user exists
        if (data?.session?.access_token) {
          const r = await fetch('/api/load', {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
          });
          if (r.ok) {
            const j = await r.json();
            if (j?.data?.content) {
              setTournamentData(j.data.content);
            }
          }
        }
      } catch (e) {
        console.error('supabase session check failed', e);
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem('chuni_tournament_data', JSON.stringify(tournamentData));

    // If user logged in via Supabase, sync to serverless API
    (async () => {
      try {
        const session = await supabase.auth.getSession();
        const token = session?.data?.session?.access_token;
        if (token) {
          await fetch('/api/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: tournamentData }),
          });
        }
      } catch (e) {
        // ignore sync errors
        console.error('Sync error', e);
      }
    })();
  }, [tournamentData]);

  // Sync Finals
  useEffect(() => {
    if (tournamentData.groups.length < 2) return;

    const groupWinners = tournamentData.groups.map(g => {
      const lastRound = Math.max(...g.matches.map(m => m.round));
      const finalMatch = g.matches.find(m => m.round === lastRound);
      return finalMatch?.winner ? tournamentData.allMembers.find(m => m.id === finalMatch.winner) : null;
    });

    const winnersExist = groupWinners.every(w => w !== null);
    if (!winnersExist) {
      if (tournamentData.finalMatches.length > 0) {
        setTournamentData(prev => ({ ...prev, finalMatches: [] }));
      }
      return;
    }

    // Check if winners changed
    const currentFinalists = new Set(tournamentData.finalMatches.flatMap(m => [m.p1, m.p2]).filter(id => id && id !== "BYE"));
    const newFinalists = groupWinners.map(w => w!.id);
    const finalistsChanged = newFinalists.some(id => !currentFinalists.has(id)) || newFinalists.length !== currentFinalists.size;

    if (finalistsChanged) {
      const finalBracket = initializeBracket(groupWinners as Member[]);
      setTournamentData(prev => ({ ...prev, finalMatches: finalBracket }));
    }
  }, [tournamentData.groups, tournamentData.allMembers]);

  const isWebCryptoAvailable = typeof crypto !== 'undefined' && !!(crypto as any).subtle;

  const hashString = async (str: string) => {
    if (isWebCryptoAvailable) {
      const buf = await (crypto as any).subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback: return the string itself (insecure) — used only for local network preview without HTTPS
    return str;
  };

  const getStoredHash = async () => {
    if (isWebCryptoAvailable) {
      const stored = localStorage.getItem('admin_password_hash');
      if (stored) return stored;
      return await hashString('admin');
    } else {
      const plain = localStorage.getItem('admin_password_plain');
      return plain || 'admin';
    }
  };

  const handleLogin = async () => {
    const stored = await getStoredHash();
    const inputVal = isWebCryptoAvailable ? await hashString(loginInput) : loginInput;
    if (inputVal === stored) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError("");
    } else {
      setLoginError("密碼錯誤，凡人不可窺視深淵！");
    }
  };

  // Supabase email sign-in (password)
  const supabaseSignIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        alert('Sign in error: ' + result.error.message);
        return;
      }
      if (result.data?.session?.user) {
        setSbUser(result.data.session.user);
        setIsAdmin(true);
      }
    } catch (e: any) {
      alert('Sign in failed: ' + e.message);
    }
  };

  const handleCreateTournament = () => {
    const names = membersInput.split('\n').map(n => n.trim()).filter(n => n !== "");
    if (names.length < 2) {
      alert("參賽者太少，無法開啟諸神黃昏！");
      return;
    }

    const existingAliases = new Set<string>();
    const shuffledUltimates = [...CHUNI_ULTIMATES].sort(() => Math.random() - 0.5);
    const allMembers: Member[] = names.map((name, idx) => ({
      id: generateId(),
      name,
      alias: generateAlias(existingAliases),
      groupName: "",
      chuniIntro: CHUNI_INTROS[Math.floor(Math.random() * CHUNI_INTROS.length)],
      bankai: shuffledUltimates[idx % shuffledUltimates.length]
    }));

    // Improved Grouping Logic: Ensure at least 4 members per group and power-of-2 groups
    let groupCount = 1;
    if (allMembers.length >= 32) groupCount = 8;
    else if (allMembers.length >= 16) groupCount = 4;
    else if (allMembers.length >= 8) groupCount = 2;
    else groupCount = 1;

    const groups: Group[] = [];
    const shuffledMyths = [...MYTHOLOGIES].sort(() => Math.random() - 0.5);
    const shuffledPrefixes = [...GROUP_PREFIXES].sort(() => Math.random() - 0.5);
    const shuffledSuffixes = [...GROUP_SUFFIXES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < groupCount; i++) {
      const myth = shuffledMyths[i % shuffledMyths.length];
      const prefix = shuffledPrefixes[i % shuffledPrefixes.length];
      const suffix = shuffledSuffixes[i % shuffledSuffixes.length];
      groups.push({
        id: generateId(),
        name: `${prefix}・${myth}${suffix}`,
        shortName: `${myth}${suffix}`,
        members: [],
        matches: []
      });
    }

    // Distribute members (shuffled for fairness)
    const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
    shuffled.forEach((member, idx) => {
      const groupIdx = idx % groupCount;
      member.groupName = groups[groupIdx].name;
      groups[groupIdx].members.push(member);
    });

    groups.forEach(group => {
      group.matches = initializeBracket(group.members);
    });

    setTournamentData({
      groups,
      allMembers,
      bets: [],
      finalMatches: []
    });
    setActiveTab("summary");
  };

  const handleSelectWinner = (groupId: string | "FINAL", matchId: string, winnerId: string | null) => {
    setTournamentData(prev => {
      const isFinal = groupId === "FINAL";
      let updatedMatches: Match[] = [];
      
      if (isFinal) {
        updatedMatches = [...prev.finalMatches];
      } else {
        const group = prev.groups.find(g => g.id === groupId);
        if (!group) return prev;
        updatedMatches = [...group.matches];
      }

      const matchIdx = updatedMatches.findIndex(m => m.id === matchId);
      if (matchIdx === -1) return prev;

      const match = updatedMatches[matchIdx];
      const newWinner = match.winner === winnerId ? null : winnerId;
      
      // Clear descendants if winner changes
      if (newWinner !== match.winner) {
        updatedMatches = clearDescendants(updatedMatches, match.round, match.position);
      }

      updatedMatches[matchIdx] = { ...match, winner: newWinner };
      
      const totalRounds = Math.max(...updatedMatches.map(m => m.round)) + 1;
      const propagated = propagateWinners(updatedMatches, totalRounds);

      let updatedAllMembers = [...prev.allMembers];
      
      // Assign Bankai or Noble Phantasm to Group Winners (Top 8)
      if (!isFinal && newWinner) {
        const lastRound = Math.max(...propagated.map(m => m.round), 0);
        const finalMatch = propagated.find(m => m.round === lastRound);
        if (finalMatch && finalMatch.winner === newWinner) {
          const memberIdx = updatedAllMembers.findIndex(m => m.id === newWinner);
          if (memberIdx !== -1) {
            const member = updatedAllMembers[memberIdx];
            let updatedMember = { ...member };
            
            // Guarantee Noble Phantasm for Top 8
            if (!updatedMember.noblePhantasm) {
              const randomNP = FGO_NOBLE_PHANTASMS[Math.floor(Math.random() * FGO_NOBLE_PHANTASMS.length)];
              updatedMember.noblePhantasm = randomNP;
            }
            
            // Merge into combinedUltimate
            if (updatedMember.bankai && updatedMember.noblePhantasm) {
              updatedMember.combinedUltimate = {
                name: `${updatedMember.bankai.name}・${updatedMember.noblePhantasm.name}`,
                chant: `${updatedMember.bankai.release} ${updatedMember.noblePhantasm.chant}`
              };
            } else if (updatedMember.noblePhantasm) {
              updatedMember.combinedUltimate = {
                name: updatedMember.noblePhantasm.name,
                chant: updatedMember.noblePhantasm.chant
              };
            } else if (updatedMember.bankai) {
              updatedMember.combinedUltimate = {
                name: updatedMember.bankai.name,
                chant: updatedMember.bankai.release
              };
            }
            
            updatedAllMembers[memberIdx] = updatedMember;
          }
        }
      }

      if (isFinal) {
        return { ...prev, finalMatches: propagated, allMembers: updatedAllMembers };
      } else {
        return {
          ...prev,
          allMembers: updatedAllMembers,
          groups: prev.groups.map(g => g.id === groupId ? { ...g, matches: propagated } : g)
        };
      }
    });
  };

  const handleFortuneBet = () => {
    if (tournamentData.allMembers.length === 0) return;
    setShowBetModal(true);
  };

  const confirmFortuneBet = () => {
    if (!betName.trim() || betAmount <= 0) return;
    setIsRolling(true);
    setRollingResult(null);

    // Animation simulation
    let count = 0;
    const interval = setInterval(() => {
      const tempMember = tournamentData.allMembers[Math.floor(Math.random() * tournamentData.allMembers.length)];
      setRollingResult(tempMember);
      count++;
      if (count > 20) {
        clearInterval(interval);
        const finalMember = tournamentData.allMembers[Math.floor(Math.random() * tournamentData.allMembers.length)];
        setRollingResult(finalMember);
        
        setTimeout(() => {
          const newBet: Bet = {
            id: generateId(),
            bettor: betName,
            targetId: finalMember.id,
            targetAlias: finalMember.alias,
            targetRealName: finalMember.name,
            amount: betAmount
          };
          setTournamentData(prev => ({ ...prev, bets: [newBet, ...prev.bets] }));
          setIsRolling(false);
          setShowBetModal(false);
          setBetName("");
          setBetAmount(1000);
        }, 1500);
      }
    }, 100);
  };

  const handleDeleteBet = (betId: string) => {
    setTournamentData(prev => ({
      ...prev,
      bets: prev.bets.filter(b => b.id !== betId)
    }));
  };

  const betLeaderboard = useMemo(() => {
    const totals: Record<string, { bettor: string, targetAlias: string, amount: number }> = {};
    tournamentData.bets.forEach(b => {
      if (!totals[b.bettor]) totals[b.bettor] = { bettor: b.bettor, targetAlias: b.targetAlias, amount: 0 };
      totals[b.bettor].amount += b.amount;
    });
    return Object.values(totals).sort((a, b) => b.amount - a.amount).slice(0, 4);
  }, [tournamentData.bets]);

  const finalWinner = useMemo(() => {
    if (tournamentData.finalMatches.length === 0) return null;
    const lastRound = Math.max(...tournamentData.finalMatches.map(m => m.round));
    const finalMatch = tournamentData.finalMatches.find(m => m.round === lastRound);
    return finalMatch?.winner ? tournamentData.allMembers.find(m => m.id === finalMatch.winner) : null;
  }, [tournamentData.finalMatches, tournamentData.allMembers]);

  const isRagnarokUnlocked = useMemo(() => {
    if (tournamentData.groups.length === 0) return false;
    return tournamentData.groups.every(g => {
      const lastRound = Math.max(...g.matches.map(m => m.round), 0);
      const finalMatch = g.matches.find(m => m.round === lastRound);
      return !!(finalMatch && finalMatch.winner);
    });
  }, [tournamentData.groups]);

  useEffect(() => {
    if (finalWinner && finalWinner.id !== lastCelebratedId.current) {
      setGrandWinner(finalWinner);
      lastCelebratedId.current = finalWinner.id;
    } else if (!finalWinner) {
      lastCelebratedId.current = null;
    }
  }, [finalWinner]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30 flex">
      {/* Sidebar Navigation */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 bg-slate-950/50 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-purple-600/5 to-transparent">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 rotate-3">
              <Shield className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter chuni-text-shadow leading-tight">KKMA<br/>生存系統</h1>
            </div>
          </div>
          <div className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] opacity-70">Ragnarok Protocol v2.0</div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">主要殿堂</div>
          <button 
            onClick={() => setActiveTab("summary")}
            className={`w-full px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-4 group ${activeTab === "summary" ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className={`w-5 h-5 ${activeTab === "summary" ? 'text-white' : 'text-purple-500 group-hover:scale-110 transition-transform'}`} /> 
            <span>列王殿堂</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => isRagnarokUnlocked && setActiveTab("final")}
              className={`w-full px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-4 group ${
                activeTab === "final" 
                  ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' 
                  : isRagnarokUnlocked 
                    ? 'text-slate-400 hover:bg-white/5 hover:text-white' 
                    : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              {isRagnarokUnlocked ? (
                <Trophy className={`w-5 h-5 ${activeTab === "final" ? 'text-white' : 'text-amber-500 group-hover:scale-110 transition-transform'}`} />
              ) : (
                <Lock className="w-5 h-5 text-slate-700" />
              )}
              <span>諸神黃昏</span>
              {!isRagnarokUnlocked && <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">封印中</span>}
            </button>
          )}

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-8 mb-4 px-2">分組賽區</div>
          <div className="space-y-2">
            {tournamentData.groups.map(g => (
              <button 
                key={g.id}
                onClick={() => setActiveTab(g.id)}
                className={`w-full px-5 py-3.5 rounded-xl text-sm font-bold transition-all text-left flex items-center gap-3 ${activeTab === g.id ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === g.id ? 'bg-purple-500 animate-pulse' : 'bg-slate-700'}`}></div>
                {g.shortName}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-8 mb-4 px-2">終焉之地</div>
          <button 
            onClick={() => setActiveTab("bets")}
            className={`w-full px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-4 group ${activeTab === "bets" ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Coins className={`w-5 h-5 ${activeTab === "bets" ? 'text-white' : 'text-blue-500 group-hover:scale-110 transition-transform'}`} /> 
            <span>黑暗遺物</span>
          </button>
        </nav>

        {/* Footer / Admin Section */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          {isAdmin ? (
            <div className="flex items-center justify-between bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ADMIN</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChangePassword(true)} className="text-slate-500 hover:text-white transition-colors" title="修改管理員密碼">
                  <Lock className="w-4 h-4" />
                </button>
                <button onClick={() => setIsAdmin(false)} className="text-slate-500 hover:text-white transition-colors" title="登出">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all border border-white/5 text-slate-400 hover:text-white"
            >
              <LogIn className="w-4 h-4" /> 管理員登入
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 ml-80 flex flex-col min-h-screen">
        <main className="flex-1 p-12">
          <div className="max-w-6xl mx-auto">
          {/* Content Area */}
          <div className="min-h-[60vh] pb-24">
            {activeTab === "summary" && (
              <div className="space-y-12">
                {/* Group Winners Section */}
                {(tournamentData.groups.some(g => {
                  const lastRound = Math.max(...g.matches.map(m => m.round), 0);
                  const finalMatch = g.matches.find(m => m.round === lastRound);
                  return finalMatch && finalMatch.winner;
                }) || finalWinner) && (
                  <div className="space-y-6">
                    {/* Ragnarok Champion */}
                    {finalWinner && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-12 bg-gradient-to-r from-amber-900/60 via-purple-900/60 to-amber-900/60 border-2 border-amber-500/50 rounded-[3rem] p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-20"></div>
                        <motion.div 
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute -top-10 -left-10 opacity-20"
                        >
                          <Crown className="w-48 h-48 text-amber-500" />
                        </motion.div>
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center justify-center gap-6 mb-2">
                            <div className="h-px w-16 bg-amber-500/50"></div>
                            <div className="text-base font-mono text-amber-400 uppercase tracking-[0.6em] font-black">諸神黃昏・唯一真王</div>
                            <div className="h-px w-16 bg-amber-500/50"></div>
                          </div>
                          <h2 className="text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.6)] chuni-text-shadow">
                            {finalWinner.name}
                          </h2>
                          <p className="text-3xl font-black text-amber-500 italic tracking-widest uppercase">
                            {finalWinner.alias.replace(/・[改極零殤滅幻獄天真偽破急序終神]$/, '')}
                          </p>
                          <div className="max-w-3xl mx-auto border-t border-amber-500/20 pt-8 mt-8 space-y-6">
                            <p className="text-xl text-slate-200 italic font-serif leading-relaxed px-4">
                              「{finalWinner.chuniIntro}」
                            </p>
                            {finalWinner.combinedUltimate ? (
                              <div className="bg-amber-950/30 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-transparent"></div>
                                <div className="relative z-10">
                                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                  <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{finalWinner.combinedUltimate.name}</div>
                                  <div className="text-sm text-amber-400 font-bold italic tracking-widest leading-relaxed">「{finalWinner.combinedUltimate.chant}」</div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {finalWinner.bankai && (
                                  <div className="bg-red-950/30 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent"></div>
                                    <div className="relative z-10">
                                      <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                      <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{finalWinner.bankai.name}</div>
                                      <div className="text-sm text-red-400 font-bold italic tracking-widest">「{finalWinner.bankai.release}」</div>
                                    </div>
                                  </div>
                                )}
                                {finalWinner.noblePhantasm && (
                                  <div className="bg-blue-950/30 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden mt-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent"></div>
                                    <div className="relative z-10">
                                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                      <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{finalWinner.noblePhantasm.name}</div>
                                      <div className="text-sm text-blue-400 font-bold italic tracking-widest">「{finalWinner.noblePhantasm.chant}」</div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            <button 
                              onClick={() => setGrandWinner(finalWinner)}
                              className="px-6 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest transition-all"
                            >
                              重溫榮耀時刻
                            </button>
                          </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-20 rotate-12">
                          <Trophy className="w-48 h-48 text-amber-500" />
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3">
                      <Crown className="text-amber-500 w-6 h-6" />
                      <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">各賽區霸主・現身</h2>
                    </div>
                    
                    {(() => {
                      const winnerCards = tournamentData.groups.map(g => {
                        const lastRound = Math.max(...g.matches.map(m => m.round), 0);
                        const finalMatch = g.matches.find(m => m.round === lastRound);
                        if (!finalMatch || !finalMatch.winner) return null;
                        const winner = tournamentData.allMembers.find(m => m.id === finalMatch.winner);
                        if (!winner) return null;
                        
                        return (
                          <motion.div 
                            key={g.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500 transition-all shadow-lg shadow-purple-500/5"
                          >
                            <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Crown className="w-24 h-24 text-amber-500" />
                            </div>
                            <div className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full w-fit">
                              <Trophy className="w-4 h-4" /> {g.shortName} 霸主
                            </div>
                            <div className="space-y-3 mb-6">
                              <div className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter break-words chuni-text-shadow leading-tight">
                                {winner.name}
                              </div>
                              <div className="text-sm sm:text-base font-bold text-purple-400 uppercase tracking-widest break-words opacity-80">
                                {winner.alias}
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 italic leading-relaxed line-clamp-3 border-t border-white/10 pt-5 font-medium">
                              「{winner.chuniIntro}」
                            </div>
                            {winner.combinedUltimate && (
                              <div className="mt-4 pt-4 border-t border-amber-500/20">
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">畫具・解放。</div>
                                <div className="text-xl font-black text-white italic tracking-tighter mb-1">{winner.combinedUltimate.name}</div>
                                <div className="text-[10px] text-amber-400 font-bold italic tracking-widest leading-relaxed">「{winner.combinedUltimate.chant}」</div>
                              </div>
                            )}
                          </motion.div>
                        );
                      }).filter(Boolean);

                      if (isRagnarokUnlocked) {
                        const mid = Math.ceil(winnerCards.length / 2);
                        const topHalf = winnerCards.slice(0, mid);
                        const bottomHalf = winnerCards.slice(mid);

                        return (
                          <div className="space-y-12">
                            <div className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-6 pb-6 no-scrollbar snap-x">
                              {topHalf.map((card: any) => (
                                <div key={card.key} className="flex-shrink-0 w-[300px] sm:w-auto snap-start">
                                  {card}
                                </div>
                              ))}
                            </div>
                            
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative py-4"
                            >
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-amber-500/30"></div>
                              </div>
                              <div className="relative flex justify-center">
                                <button 
                                  onClick={() => setActiveTab("final")}
                                  className="group relative w-full max-w-4xl px-12 py-8 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-900 rounded-3xl font-black text-white shadow-[0_0_50px_rgba(245,158,11,0.3)] hover:shadow-[0_0_80px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between overflow-hidden border border-amber-400/50"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                  <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/40 group-hover:rotate-12 transition-transform">
                                      <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
                                    </div>
                                    <div className="text-left">
                                      <span className="block text-xs uppercase tracking-[0.6em] text-amber-200/60 mb-1 font-mono">Protocol: Final Ragnarok</span>
                                      <span className="text-4xl tracking-tighter italic font-black uppercase chuni-text-shadow">開啟終焉決戰</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-amber-200/40 uppercase tracking-widest hidden sm:block">Enter the Void</span>
                                    <ChevronRight className="w-12 h-12 text-amber-400 group-hover:translate-x-2 transition-transform" />
                                  </div>
                                </button>
                              </div>
                            </motion.div>

                            <div className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-6 pb-6 no-scrollbar snap-x">
                              {bottomHalf.map((card: any) => (
                                <div key={card.key} className="flex-shrink-0 w-[300px] sm:w-auto snap-start">
                                  {card}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {winnerCards}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {isAdmin && (
                  <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 italic">
                      <Plus className="text-purple-500" /> 召喚參賽者
                    </h2>
                    <textarea 
                      value={membersInput}
                      onChange={(e) => setMembersInput(e.target.value)}
                      placeholder="每行輸入一個名字... 例如：&#10;佐藤和真&#10;菜月昴&#10;骨王"
                      className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-slate-200 focus:border-purple-500 outline-none transition-all font-mono text-sm mb-4"
                    />
                    <button 
                      onClick={handleCreateTournament}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 transition-all active:scale-95"
                    >
                      啟動諸神黃昏協議
                    </button>
                  </section>
                )}

                {tournamentData.allMembers.length > 0 && (
                  <div className="space-y-12">
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-white italic tracking-widest uppercase">命運的骰子</h3>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Random Destiny Selection</p>
                      </div>
                      <button 
                        onClick={handleFortuneBet}
                        className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-black text-xl text-white shadow-2xl shadow-orange-500/30 hover:scale-110 transition-all active:scale-95"
                      >
                        <Dice5 className="w-8 h-8" /> 命運占卜：隨機下注
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {tournamentData.groups.map(g => (
                        <div key={g.id} className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all group shadow-xl hover:shadow-purple-500/10">
                          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Skull className="w-12 h-12" />
                            </div>
                            <div className="text-xs font-mono text-purple-400 uppercase tracking-[0.3em] mb-3">{g.shortName}</div>
                            <h3 className="text-3xl font-black text-white italic truncate tracking-tight">{g.name}</h3>
                          </div>
                          <div className="px-8 pb-8 space-y-6">
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                              <span>參賽者</span>
                              <span>{g.members.length} 名</span>
                            </div>
                            <div className="space-y-3">
                              {g.members.slice(0, 3).map(m => (
                                <div key={m.id} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-300 font-medium">{m.name}</span>
                                  <span className="text-[10px] font-mono text-purple-500/50 uppercase">{m.alias.split('・')[0]}</span>
                                </div>
                              ))}
                              {g.members.length > 3 && (
                                <div className="text-[10px] text-slate-600 italic">...及其他 {g.members.length - 3} 位強者</div>
                              )}
                            </div>
                            <button 
                              onClick={() => setActiveTab(g.id)}
                              className="w-full py-3 bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 rounded-xl text-xs font-black text-slate-400 hover:text-purple-400 transition-all flex items-center justify-center gap-2 group"
                            >
                              進入賽區詳情 <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bet Leaderboard */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10">
                      <div className="flex items-center gap-4 mb-8">
                        <TrendingUp className="text-blue-500 w-6 h-6" />
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">預言者排行榜</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {betLeaderboard.map((b, i) => (
                          <div key={i} className="bg-black/40 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-2 -right-2 text-4xl font-black text-white/5 italic group-hover:text-blue-500/10 transition-colors">#{i+1}</div>
                            <div className="text-lg font-black text-white mb-3">{b.bettor}</div>
                            <div className="text-[10px] text-slate-500 mb-1">共鳴靈魂</div>
                            <div className="text-xs font-bold text-blue-400 mb-3">{b.targetAlias}</div>
                            <div className="text-[10px] text-slate-500 mb-1">能量規模</div>
                            <div className="text-xl font-mono font-black text-amber-500">{b.amount.toLocaleString()}</div>
                          </div>
                        ))}
                        {betLeaderboard.length === 0 && <div className="col-span-full text-center py-8 text-slate-500 italic">尚無預言者降臨...</div>}
                      </div>
                    </div>

                    {/* Participant List */}
                    <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-10">
                      <div className="flex items-center gap-4 mb-8">
                        <Users className="text-purple-500 w-6 h-6" />
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">參賽者名冊</h3>
                      </div>
                      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                        {tournamentData.allMembers.map(m => (
                          <div key={m.id} className="bg-black/40 p-4 rounded-xl border border-white/5 text-center group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col justify-center min-h-[100px] relative overflow-hidden">
                            <div className="relative z-10">
                              <div className="text-sm font-black text-white break-words mb-1 leading-tight">{m.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono break-words uppercase tracking-tighter opacity-70 mb-2">{m.alias.replace(/・[改極零殤滅幻獄天真偽破急序終神]$/, '')}</div>
                              {m.combinedUltimate ? (
                                <div className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest border-t border-amber-500/10 pt-2 mt-1 italic">
                                  畫具・解放。: {m.combinedUltimate.name}
                                </div>
                              ) : (
                                (m.bankai || m.noblePhantasm) && (
                                  <div className="text-[9px] font-black text-purple-500/80 uppercase tracking-widest border-t border-purple-500/10 pt-2 mt-1 italic">
                                    畫具・解放。: {m.bankai?.name}{m.bankai && m.noblePhantasm ? ' / ' : ''}{m.noblePhantasm?.name}
                                  </div>
                                )
                              )}
                            </div>
                            {m.bankai && (
                              <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-12 h-12 text-red-500" />
                              </div>
                            )}
                            {m.noblePhantasm && (
                              <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-12 h-12 text-blue-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Group Detail Tabs */}
            {tournamentData.groups.map(g => {
              if (activeTab !== g.id) return null;
              
              const lastRound = Math.max(...g.matches.map(m => m.round), 0);
              const finalMatch = g.matches.find(m => m.round === lastRound);
              const winner = finalMatch?.winner ? g.members.find(m => m.id === finalMatch.winner) : null;

              return (
                <div key={g.id} className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter">{g.name}</h2>
                    <p className="text-purple-400 font-mono text-sm uppercase tracking-[0.3em]">{g.shortName} Sector</p>
                  </div>

                  {winner ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-purple-900/60 to-slate-900/90 border-2 border-purple-500/50 rounded-[3rem] p-12 relative overflow-hidden group shadow-[0_0_50px_rgba(168,85,247,0.15)] text-center"
                    >
                      <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown className="w-64 h-64 text-amber-500" />
                      </div>
                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <div className="h-px w-12 bg-purple-500/30"></div>
                          <div className="text-xs font-black text-purple-400 uppercase tracking-[0.4em]">賽區霸主・降臨</div>
                          <div className="h-px w-12 bg-purple-500/30"></div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-7xl font-black text-white italic tracking-tighter chuni-text-shadow">
                            {winner.name}
                          </h3>
                          <p className="text-2xl font-black text-purple-400 italic tracking-widest uppercase opacity-80">
                            {winner.alias}
                          </p>
                        </div>
                        <div className="max-w-2xl mx-auto border-t border-white/10 pt-10 mt-10 space-y-8">
                          <p className="text-2xl text-slate-200 italic font-serif leading-relaxed">
                            「{winner.chuniIntro}」
                          </p>
                          {winner.combinedUltimate ? (
                            <div className="bg-amber-950/30 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-transparent"></div>
                              <div className="relative z-10">
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{winner.combinedUltimate.name}</div>
                                <div className="text-sm text-amber-400 font-bold italic tracking-widest leading-relaxed">「{winner.combinedUltimate.chant}」</div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {winner.bankai && (
                                <div className="bg-red-950/30 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent"></div>
                                  <div className="relative z-10">
                                    <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{winner.bankai.name}</div>
                                    <div className="text-sm text-red-400 font-bold italic tracking-widest">「{winner.bankai.release}」</div>
                                  </div>
                                </div>
                              )}
                              {winner.noblePhantasm && (
                                <div className="bg-blue-950/30 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden mt-4">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent"></div>
                                  <div className="relative z-10">
                                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">畫具・解放。</div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter mb-2 chuni-text-shadow">{winner.noblePhantasm.name}</div>
                                    <div className="text-sm text-blue-400 font-bold italic tracking-widest">「{winner.noblePhantasm.chant}」</div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="pt-8">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            命運已定 ・ 榮耀歸於此人
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-3xl p-8 overflow-x-auto">
                      <VerticalTreeBracket 
                        matches={g.matches} 
                        members={g.members} 
                        isAdmin={isAdmin} 
                        onSelectWinner={(matchId, winnerId) => handleSelectWinner(g.id, matchId, winnerId)}
                        groupName={g.shortName}
                      />
                    </div>
                  )}

                  {/* Always show bracket below for reference or admin changes */}
                  {winner && (
                    <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">賽事紀錄回顧</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                      </div>
                      <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-8 overflow-x-auto scale-95 origin-top">
                        <VerticalTreeBracket 
                          matches={g.matches} 
                          members={g.members} 
                          isAdmin={isAdmin} 
                          onSelectWinner={(matchId, winnerId) => handleSelectWinner(g.id, matchId, winnerId)}
                          groupName={g.shortName}
                        />
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-8">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <Zap className="text-purple-400" /> 賽區審判控制台
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {g.matches.filter(m => m.p1 && m.p2).map(m => (
                          <div key={m.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Match {m.id}</div>
                            <div className="flex flex-col gap-2">
                              <button 
                                disabled={m.p1 === "BYE"}
                                onClick={() => m.p1 && m.p1 !== "BYE" && handleSelectWinner(g.id, m.id, m.p1)}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${m.winner === m.p1 && m.p1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                              >
                                {g.members.find(mem => mem.id === m.p1)?.name || m.p1}
                              </button>
                              <div className="text-center text-[10px] font-black text-slate-600 italic">VS</div>
                              <button 
                                disabled={m.p2 === "BYE"}
                                onClick={() => m.p2 && m.p2 !== "BYE" && handleSelectWinner(g.id, m.id, m.p2)}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${m.winner === m.p2 && m.p2 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                              >
                                {g.members.find(mem => mem.id === m.p2)?.name || m.p2}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeTab === "final" && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter">諸神黃昏：終焉決戰</h2>
                  <p className="text-amber-500 font-mono text-sm uppercase tracking-[0.3em]">The Final Ragnarok</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Crown className="text-amber-500 w-6 h-6" />
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">決戰參賽者・霸主集結</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tournamentData.groups.map(g => {
                      const lastRound = Math.max(...g.matches.map(m => m.round), 0);
                      const finalMatch = g.matches.find(m => m.round === lastRound);
                      if (!finalMatch || !finalMatch.winner) return null;
                      const winner = g.members.find(m => m.id === finalMatch.winner);
                      if (!winner) return null;
                      
                      return (
                        <motion.div 
                          key={g.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500 transition-all shadow-lg shadow-purple-500/5"
                        >
                          <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Crown className="w-24 h-24 text-amber-500" />
                          </div>
                          <div className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full w-fit">
                            <Trophy className="w-4 h-4" /> {g.shortName} 霸主
                          </div>
                          <div className="space-y-3 mb-6">
                            <div className="text-4xl font-black text-white italic tracking-tighter truncate chuni-text-shadow">
                              {winner.name}
                            </div>
                            <div className="text-base font-bold text-purple-400 uppercase tracking-widest truncate opacity-80">
                              {winner.alias.replace(/・[改極零殤滅幻獄天真偽破急序終神]$/, '')}
                            </div>
                          </div>
                          <div className="text-sm text-slate-300 italic leading-relaxed line-clamp-3 border-t border-white/10 pt-5 font-medium mb-4">
                            「{winner.chuniIntro}」
                          </div>
                          {winner.combinedUltimate ? (
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic opacity-80">
                              畫具・解放。: {winner.combinedUltimate.name}
                            </div>
                          ) : (
                            <>
                              {winner.bankai && (
                                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest italic opacity-80">
                                  畫具・解放。: {winner.bankai.name}
                                </div>
                              )}
                              {winner.noblePhantasm && (
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic opacity-80">
                                  畫具・解放。: {winner.noblePhantasm.name}
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-amber-500/20 rounded-3xl p-8 overflow-x-auto">
                  <UpwardTreeBracket 
                    matches={tournamentData.finalMatches} 
                    members={tournamentData.allMembers} 
                    isAdmin={isAdmin} 
                    onSelectWinner={(matchId, winnerId) => handleSelectWinner("FINAL", matchId, winnerId)}
                  />
                </div>

                {isAdmin && tournamentData.finalMatches.length > 0 && (
                  <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                      <Trophy className="text-amber-400" /> 終焉審判控制台
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tournamentData.finalMatches.filter(m => m.p1 && m.p2).map(m => (
                        <div key={m.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <span>Match {m.id}</span>
                            {m.winner && <span className="text-amber-500 flex items-center gap-1"><Crown className="w-3 h-3" /> 審判已定</span>}
                          </div>
                          <div className="space-y-2">
                            {[m.p1, m.p2].map((pId, i) => {
                              const p = tournamentData.allMembers.find(mem => mem.id === pId);
                              return (
                                <div 
                                  key={pId || i}
                                  onClick={() => isAdmin && pId && pId !== "BYE" && handleSelectWinner("FINAL", m.id, pId)}
                                  className={`p-3 rounded-xl border transition-all ${isAdmin && pId !== "BYE" ? 'cursor-pointer' : ''} ${
                                    m.winner === pId && pId
                                      ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                      : 'bg-black/20 border-white/5 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`font-bold ${m.winner === pId ? 'text-amber-400' : 'text-slate-300'}`}>{p?.name || (pId === "BYE" ? "BYE" : "???")}</span>
                                    {m.winner === pId && pId && <Crown className="w-4 h-4 text-amber-500" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bets" && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter">黑暗遺物：契約紀錄</h2>
                  <p className="text-blue-400 font-mono text-sm uppercase tracking-[0.3em]">The Forbidden Records</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-8 py-5">契約主</th>
                        <th className="px-8 py-5">共鳴對象</th>
                        <th className="px-8 py-5">能量規模</th>
                        {isAdmin && <th className="px-8 py-5">操作</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tournamentData.bets.map(b => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-black text-white">{b.bettor}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-blue-400 font-bold">{b.targetAlias}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-mono text-amber-500 font-black">{b.amount.toLocaleString()}</div>
                          </td>
                          {isAdmin && (
                            <td className="px-8 py-6">
                              <button 
                                onClick={() => handleDeleteBet(b.id)}
                                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {tournamentData.bets.length === 0 && (
                        <tr>
                          <td colSpan={isAdmin ? 4 : 3} className="p-20 text-center text-slate-500 italic">
                            命運的輪盤尚未轉動...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bet Leaderboard */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h3 className="text-xl font-black text-white italic">預言者之巔</h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {betLeaderboard.map((b, idx) => (
                      <div key={idx} className="bg-black/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Trophy className="w-12 h-12 text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-white mb-3">{b.bettor}</div>
                        <div className="text-[10px] text-slate-500 mb-1">共鳴靈魂</div>
                        <div className="text-xs font-bold text-blue-400 mb-3">{b.targetAlias}</div>
                        <div className="text-[10px] text-slate-500 mb-1">能量規模</div>
                        <div className="text-xl font-mono font-black text-amber-500">{b.amount.toLocaleString()}</div>
                      </div>
                    ))}
                    {betLeaderboard.length === 0 && <div className="col-span-full text-center py-8 text-slate-500 italic">尚無預言者降臨...</div>}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </main>

        <footer className="border-t border-white/5 py-12 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <div className="flex justify-center gap-6">
              <Skull className="w-6 h-6 text-slate-700" />
              <Flame className="w-6 h-6 text-slate-700" />
              <Zap className="w-6 h-6 text-slate-700" />
            </div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              © 2026 諸神黃昏淘汰賽系統 ・ 命運在深淵中顫抖
            </p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        value={loginInput} 
        onChange={setLoginInput} 
        onLogin={handleLogin} 
        error={loginError} 
      />

      {showChangePassword && (
        <Modal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} title="修改管理員密碼">
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        </Modal>
      )}

      <AnimatePresence>
        {grandWinner && (
          <ExecutionPage 
            winner={grandWinner} 
            isAdmin={isAdmin}
            onClose={() => setGrandWinner(null)} 
          />
        )}
      </AnimatePresence>

      {/* Random Bet Modal */}
      <AnimatePresence>
        {showBetModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-[2.5rem] shadow-2xl shadow-amber-500/10 overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-amber-900/20 to-transparent flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Dice5 className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-black text-white italic tracking-tighter">命運占卜</h2>
                </div>
                <button onClick={() => !isRolling && setShowBetModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {!isRolling ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">預言者真名</label>
                        <input 
                          type="text" 
                          value={betName}
                          onChange={(e) => setBetName(e.target.value)}
                          placeholder="輸入你的稱號..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">共鳴能量 (金額)</label>
                        <input 
                          type="number" 
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={confirmFortuneBet}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-black text-lg text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                    >
                      啟動命運輪盤
                    </button>
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center space-y-8">
                    <motion.div 
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1],
                        boxShadow: ["0 0 20px rgba(245,158,11,0.2)", "0 0 40px rgba(245,158,11,0.5)", "0 0 20px rgba(245,158,11,0.2)"]
                      }}
                      transition={{ rotate: { repeat: Infinity, duration: 0.5, ease: "linear" }, scale: { repeat: Infinity, duration: 1 } }}
                      className="w-24 h-24 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent flex items-center justify-center"
                    >
                      <Zap className="w-10 h-10 text-amber-500" />
                    </motion.div>
                    
                    <div className="text-center space-y-4">
                      <div className="text-amber-500 font-mono text-xs animate-pulse tracking-[0.3em]">DESTINY CALCULATING...</div>
                      {rollingResult && (
                        <motion.div 
                          key={rollingResult.id}
                          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                          animate={{ 
                            scale: [0.5, 1.2, 1], 
                            opacity: 1, 
                            rotate: 0,
                            filter: isRolling ? "blur(0px)" : ["blur(0px)", "blur(10px)", "blur(0px)"]
                          }}
                          className="relative flex flex-col items-center justify-center p-10 rounded-3xl bg-black/80 border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden"
                        >
                          {/* Background Glow/Particles Effect */}
                          {!isRolling && (
                            <>
                              <motion.div 
                                animate={{ 
                                  scale: [1, 1.5, 1],
                                  opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-radial from-amber-500/20 to-transparent"
                              />
                              {[...Array(15)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ x: 0, y: 0, opacity: 0 }}
                                  animate={{ 
                                    x: (Math.random() - 0.5) * 400,
                                    y: (Math.random() - 0.5) * 400,
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0]
                                  }}
                                  transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    delay: i * 0.1,
                                    ease: "easeOut"
                                  }}
                                  className="absolute w-2 h-2 bg-amber-400 rounded-full blur-sm"
                                />
                              ))}
                            </>
                          )}

                          <div className="relative z-10 space-y-2 text-center">
                            <motion.div 
                              animate={!isRolling ? { textShadow: ["0 0 10px #f59e0b", "0 0 20px #f59e0b", "0 0 10px #f59e0b"] } : {}}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="text-4xl font-black text-white italic tracking-tight"
                            >
                              {rollingResult.name}
                            </motion.div>
                            <div className="text-sm text-amber-500 font-bold uppercase tracking-[0.4em]">
                              {rollingResult.alias}
                            </div>
                          </div>
                          
                          {!isRolling && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-6"
                            />
                          )}
                        </motion.div>
                      )}
                    </div>

                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: "50%", y: "50%", opacity: 1 }}
                          animate={{ 
                            x: `${Math.random() * 100}%`, 
                            y: `${Math.random() * 100}%`,
                            opacity: 0,
                            scale: [0, 1.5, 0]
                          }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="absolute w-1 h-1 bg-amber-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

const LoginModal = ({ isOpen, onClose, value, onChange, onLogin, error }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title="深淵通行證驗證">
    <div className="space-y-6">
      <p className="text-sm text-slate-400 italic leading-relaxed">請輸入管理員真名密鑰，凡人不可窺視此處的因果律。</p>
      <input 
        type="password" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onLogin()}
        placeholder="輸入密鑰..."
        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none transition-all text-lg font-mono tracking-widest"
      />
      {error && <div className="text-red-400 text-sm flex items-center gap-3 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
      </div>}
      <button 
        onClick={onLogin}
        className="w-full py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-lg text-white transition-all shadow-xl shadow-purple-600/30 active:scale-[0.98]"
      >
        解開禁忌封印
      </button>
    </div>
  </Modal>
);

const ExecutionPage = ({ winner, isAdmin, onClose }: { winner: Member, isAdmin: boolean, onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center overflow-y-auto no-scrollbar cursor-pointer"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 space-y-12 cursor-default"
      >
      <div className="space-y-4">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Crown className="w-24 h-24 text-amber-500 mx-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]" />
        </motion.div>
        <h2 className="text-2xl font-mono text-amber-500 uppercase tracking-[1em] font-black">王者降臨・公開處刑</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          {winner.name}
        </h3>
        <p className="text-3xl font-black text-purple-500 italic tracking-widest uppercase">
          {winner.alias}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-xl text-slate-400 italic font-serif leading-relaxed">
          「{winner.chuniIntro}」
        </p>
      </div>

      {winner.combinedUltimate ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-8 border-2 border-amber-600/50 bg-amber-950/20 rounded-3xl relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-2">畫具・解放。</div>
            <div className="text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              {winner.combinedUltimate.name}
            </div>
            <div className="text-lg text-amber-400 font-bold italic tracking-widest leading-relaxed">
              「{winner.combinedUltimate.chant}」
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {winner.bankai && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-8 border-2 border-red-600/50 bg-red-950/20 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="text-xs font-black text-red-500 uppercase tracking-[0.4em] mb-2">畫具・解放。</div>
                <div className="text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  {winner.bankai.name}
                </div>
                <div className="text-lg text-red-400 font-bold italic tracking-widest">
                  「{winner.bankai.release}」
                </div>
              </div>
            </motion.div>
          )}

          {winner.noblePhantasm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-8 border-2 border-blue-600/50 bg-blue-950/20 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-2">畫具・解放。</div>
                <div className="text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  {winner.noblePhantasm.name}
                </div>
                <div className="text-lg text-blue-400 font-bold italic tracking-widest">
                  「{winner.noblePhantasm.chant}」
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      <div className="pt-12">
        <button 
          onClick={onClose}
          className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-110 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          回歸現實世界
        </button>
      </div>
    </motion.div>

    {/* Floating Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: window.innerHeight + 100,
          opacity: Math.random()
        }}
        animate={{ 
          y: -100,
          rotate: 360
        }}
        transition={{ 
          duration: Math.random() * 10 + 5, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-1 h-1 bg-white/20 rounded-full pointer-events-none"
      />
    ))}
  </motion.div>
);
};
