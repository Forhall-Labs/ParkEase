import { BrowserWindow as e, app as t, ipcMain as n, screen as r } from "electron";
import { dirname as i, join as a } from "path";
import { fileURLToPath as o } from "url";
import { appendFileSync as s, existsSync as c, mkdirSync as l } from "fs";
import u from "better-sqlite3";
import d from "crypto";
//#region node_modules/bcryptjs/index.js
var f = null;
function p(e) {
	try {
		return crypto.getRandomValues(new Uint8Array(e));
	} catch {}
	try {
		return d.randomBytes(e);
	} catch {}
	if (!f) throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
	return f(e);
}
function ee(e) {
	f = e;
}
function m(e, t) {
	if (e ||= D, typeof e != "number") throw Error("Illegal arguments: " + typeof e + ", " + typeof t);
	e < 4 ? e = 4 : e > 31 && (e = 31);
	var n = [];
	return n.push("$2b$"), e < 10 && n.push("0"), n.push(e.toString()), n.push("$"), n.push(w(p(E), E)), n.join("");
}
function h(e, t, n) {
	if (typeof t == "function" && (n = t, t = void 0), typeof e == "function" && (n = e, e = void 0), e === void 0) e = D;
	else if (typeof e != "number") throw Error("illegal arguments: " + typeof e);
	function r(t) {
		b(function() {
			try {
				t(null, m(e));
			} catch (e) {
				t(e);
			}
		});
	}
	if (n) {
		if (typeof n != "function") throw Error("Illegal callback: " + typeof n);
		r(n);
	} else return new Promise(function(e, t) {
		r(function(n, r) {
			if (n) {
				t(n);
				return;
			}
			e(r);
		});
	});
}
function g(e, t) {
	if (t === void 0 && (t = D), typeof t == "number" && (t = m(t)), typeof e != "string" || typeof t != "string") throw Error("Illegal arguments: " + typeof e + ", " + typeof t);
	return F(e, t);
}
function _(e, t, n, r) {
	function i(n) {
		typeof e == "string" && typeof t == "number" ? h(t, function(t, i) {
			F(e, i, n, r);
		}) : typeof e == "string" && typeof t == "string" ? F(e, t, n, r) : b(n.bind(this, Error("Illegal arguments: " + typeof e + ", " + typeof t)));
	}
	if (n) {
		if (typeof n != "function") throw Error("Illegal callback: " + typeof n);
		i(n);
	} else return new Promise(function(e, t) {
		i(function(n, r) {
			if (n) {
				t(n);
				return;
			}
			e(r);
		});
	});
}
function v(e, t) {
	for (var n = e.length ^ t.length, r = 0; r < e.length; ++r) n |= e.charCodeAt(r) ^ t.charCodeAt(r);
	return n === 0;
}
function te(e, t) {
	if (typeof e != "string" || typeof t != "string") throw Error("Illegal arguments: " + typeof e + ", " + typeof t);
	return t.length === 60 ? v(g(e, t.substring(0, t.length - 31)), t) : !1;
}
function ne(e, t, n, r) {
	function i(n) {
		if (typeof e != "string" || typeof t != "string") {
			b(n.bind(this, Error("Illegal arguments: " + typeof e + ", " + typeof t)));
			return;
		}
		if (t.length !== 60) {
			b(n.bind(this, null, !1));
			return;
		}
		_(e, t.substring(0, 29), function(e, r) {
			e ? n(e) : n(null, v(r, t));
		}, r);
	}
	if (n) {
		if (typeof n != "function") throw Error("Illegal callback: " + typeof n);
		i(n);
	} else return new Promise(function(e, t) {
		i(function(n, r) {
			if (n) {
				t(n);
				return;
			}
			e(r);
		});
	});
}
function re(e) {
	if (typeof e != "string") throw Error("Illegal arguments: " + typeof e);
	return parseInt(e.split("$")[2], 10);
}
function y(e) {
	if (typeof e != "string") throw Error("Illegal arguments: " + typeof e);
	if (e.length !== 60) throw Error("Illegal hash length: " + e.length + " != 60");
	return e.substring(0, 29);
}
function ie(e) {
	if (typeof e != "string") throw Error("Illegal arguments: " + typeof e);
	return x(e) > 72;
}
var b = typeof setImmediate == "function" ? setImmediate : typeof scheduler == "object" && typeof scheduler.postTask == "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
function x(e) {
	for (var t = 0, n = 0, r = 0; r < e.length; ++r) n = e.charCodeAt(r), n < 128 ? t += 1 : n < 2048 ? t += 2 : (n & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 ? (++r, t += 4) : t += 3;
	return t;
}
function ae(e) {
	for (var t = 0, n, r, i = Array(x(e)), a = 0, o = e.length; a < o; ++a) n = e.charCodeAt(a), n < 128 ? i[t++] = n : n < 2048 ? (i[t++] = n >> 6 | 192, i[t++] = n & 63 | 128) : (n & 64512) == 55296 && ((r = e.charCodeAt(a + 1)) & 64512) == 56320 ? (n = 65536 + ((n & 1023) << 10) + (r & 1023), ++a, i[t++] = n >> 18 | 240, i[t++] = n >> 12 & 63 | 128, i[t++] = n >> 6 & 63 | 128, i[t++] = n & 63 | 128) : (i[t++] = n >> 12 | 224, i[t++] = n >> 6 & 63 | 128, i[t++] = n & 63 | 128);
	return i;
}
var S = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), C = [
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	0,
	1,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	-1,
	-1,
	-1,
	-1,
	-1,
	-1,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51,
	52,
	53,
	-1,
	-1,
	-1,
	-1,
	-1
];
function w(e, t) {
	var n = 0, r = [], i, a;
	if (t <= 0 || t > e.length) throw Error("Illegal len: " + t);
	for (; n < t;) {
		if (i = e[n++] & 255, r.push(S[i >> 2 & 63]), i = (i & 3) << 4, n >= t) {
			r.push(S[i & 63]);
			break;
		}
		if (a = e[n++] & 255, i |= a >> 4 & 15, r.push(S[i & 63]), i = (a & 15) << 2, n >= t) {
			r.push(S[i & 63]);
			break;
		}
		a = e[n++] & 255, i |= a >> 6 & 3, r.push(S[i & 63]), r.push(S[a & 63]);
	}
	return r.join("");
}
function T(e, t) {
	var n = 0, r = e.length, i = 0, a = [], o, s, c, l, u, d;
	if (t <= 0) throw Error("Illegal len: " + t);
	for (; n < r - 1 && i < t && (d = e.charCodeAt(n++), o = d < C.length ? C[d] : -1, d = e.charCodeAt(n++), s = d < C.length ? C[d] : -1, !(o == -1 || s == -1 || (u = o << 2 >>> 0, u |= (s & 48) >> 4, a.push(String.fromCharCode(u)), ++i >= t || n >= r) || (d = e.charCodeAt(n++), c = d < C.length ? C[d] : -1, c == -1) || (u = (s & 15) << 4 >>> 0, u |= (c & 60) >> 2, a.push(String.fromCharCode(u)), ++i >= t || n >= r)));) d = e.charCodeAt(n++), l = d < C.length ? C[d] : -1, u = (c & 3) << 6 >>> 0, u |= l, a.push(String.fromCharCode(u)), ++i;
	var f = [];
	for (n = 0; n < i; n++) f.push(a[n].charCodeAt(0));
	return f;
}
var E = 16, D = 10, oe = 16, se = 100, O = [
	608135816,
	2242054355,
	320440878,
	57701188,
	2752067618,
	698298832,
	137296536,
	3964562569,
	1160258022,
	953160567,
	3193202383,
	887688300,
	3232508343,
	3380367581,
	1065670069,
	3041331479,
	2450970073,
	2306472731
], k = [
	3509652390,
	2564797868,
	805139163,
	3491422135,
	3101798381,
	1780907670,
	3128725573,
	4046225305,
	614570311,
	3012652279,
	134345442,
	2240740374,
	1667834072,
	1901547113,
	2757295779,
	4103290238,
	227898511,
	1921955416,
	1904987480,
	2182433518,
	2069144605,
	3260701109,
	2620446009,
	720527379,
	3318853667,
	677414384,
	3393288472,
	3101374703,
	2390351024,
	1614419982,
	1822297739,
	2954791486,
	3608508353,
	3174124327,
	2024746970,
	1432378464,
	3864339955,
	2857741204,
	1464375394,
	1676153920,
	1439316330,
	715854006,
	3033291828,
	289532110,
	2706671279,
	2087905683,
	3018724369,
	1668267050,
	732546397,
	1947742710,
	3462151702,
	2609353502,
	2950085171,
	1814351708,
	2050118529,
	680887927,
	999245976,
	1800124847,
	3300911131,
	1713906067,
	1641548236,
	4213287313,
	1216130144,
	1575780402,
	4018429277,
	3917837745,
	3693486850,
	3949271944,
	596196993,
	3549867205,
	258830323,
	2213823033,
	772490370,
	2760122372,
	1774776394,
	2652871518,
	566650946,
	4142492826,
	1728879713,
	2882767088,
	1783734482,
	3629395816,
	2517608232,
	2874225571,
	1861159788,
	326777828,
	3124490320,
	2130389656,
	2716951837,
	967770486,
	1724537150,
	2185432712,
	2364442137,
	1164943284,
	2105845187,
	998989502,
	3765401048,
	2244026483,
	1075463327,
	1455516326,
	1322494562,
	910128902,
	469688178,
	1117454909,
	936433444,
	3490320968,
	3675253459,
	1240580251,
	122909385,
	2157517691,
	634681816,
	4142456567,
	3825094682,
	3061402683,
	2540495037,
	79693498,
	3249098678,
	1084186820,
	1583128258,
	426386531,
	1761308591,
	1047286709,
	322548459,
	995290223,
	1845252383,
	2603652396,
	3431023940,
	2942221577,
	3202600964,
	3727903485,
	1712269319,
	422464435,
	3234572375,
	1170764815,
	3523960633,
	3117677531,
	1434042557,
	442511882,
	3600875718,
	1076654713,
	1738483198,
	4213154764,
	2393238008,
	3677496056,
	1014306527,
	4251020053,
	793779912,
	2902807211,
	842905082,
	4246964064,
	1395751752,
	1040244610,
	2656851899,
	3396308128,
	445077038,
	3742853595,
	3577915638,
	679411651,
	2892444358,
	2354009459,
	1767581616,
	3150600392,
	3791627101,
	3102740896,
	284835224,
	4246832056,
	1258075500,
	768725851,
	2589189241,
	3069724005,
	3532540348,
	1274779536,
	3789419226,
	2764799539,
	1660621633,
	3471099624,
	4011903706,
	913787905,
	3497959166,
	737222580,
	2514213453,
	2928710040,
	3937242737,
	1804850592,
	3499020752,
	2949064160,
	2386320175,
	2390070455,
	2415321851,
	4061277028,
	2290661394,
	2416832540,
	1336762016,
	1754252060,
	3520065937,
	3014181293,
	791618072,
	3188594551,
	3933548030,
	2332172193,
	3852520463,
	3043980520,
	413987798,
	3465142937,
	3030929376,
	4245938359,
	2093235073,
	3534596313,
	375366246,
	2157278981,
	2479649556,
	555357303,
	3870105701,
	2008414854,
	3344188149,
	4221384143,
	3956125452,
	2067696032,
	3594591187,
	2921233993,
	2428461,
	544322398,
	577241275,
	1471733935,
	610547355,
	4027169054,
	1432588573,
	1507829418,
	2025931657,
	3646575487,
	545086370,
	48609733,
	2200306550,
	1653985193,
	298326376,
	1316178497,
	3007786442,
	2064951626,
	458293330,
	2589141269,
	3591329599,
	3164325604,
	727753846,
	2179363840,
	146436021,
	1461446943,
	4069977195,
	705550613,
	3059967265,
	3887724982,
	4281599278,
	3313849956,
	1404054877,
	2845806497,
	146425753,
	1854211946,
	1266315497,
	3048417604,
	3681880366,
	3289982499,
	290971e4,
	1235738493,
	2632868024,
	2414719590,
	3970600049,
	1771706367,
	1449415276,
	3266420449,
	422970021,
	1963543593,
	2690192192,
	3826793022,
	1062508698,
	1531092325,
	1804592342,
	2583117782,
	2714934279,
	4024971509,
	1294809318,
	4028980673,
	1289560198,
	2221992742,
	1669523910,
	35572830,
	157838143,
	1052438473,
	1016535060,
	1802137761,
	1753167236,
	1386275462,
	3080475397,
	2857371447,
	1040679964,
	2145300060,
	2390574316,
	1461121720,
	2956646967,
	4031777805,
	4028374788,
	33600511,
	2920084762,
	1018524850,
	629373528,
	3691585981,
	3515945977,
	2091462646,
	2486323059,
	586499841,
	988145025,
	935516892,
	3367335476,
	2599673255,
	2839830854,
	265290510,
	3972581182,
	2759138881,
	3795373465,
	1005194799,
	847297441,
	406762289,
	1314163512,
	1332590856,
	1866599683,
	4127851711,
	750260880,
	613907577,
	1450815602,
	3165620655,
	3734664991,
	3650291728,
	3012275730,
	3704569646,
	1427272223,
	778793252,
	1343938022,
	2676280711,
	2052605720,
	1946737175,
	3164576444,
	3914038668,
	3967478842,
	3682934266,
	1661551462,
	3294938066,
	4011595847,
	840292616,
	3712170807,
	616741398,
	312560963,
	711312465,
	1351876610,
	322626781,
	1910503582,
	271666773,
	2175563734,
	1594956187,
	70604529,
	3617834859,
	1007753275,
	1495573769,
	4069517037,
	2549218298,
	2663038764,
	504708206,
	2263041392,
	3941167025,
	2249088522,
	1514023603,
	1998579484,
	1312622330,
	694541497,
	2582060303,
	2151582166,
	1382467621,
	776784248,
	2618340202,
	3323268794,
	2497899128,
	2784771155,
	503983604,
	4076293799,
	907881277,
	423175695,
	432175456,
	1378068232,
	4145222326,
	3954048622,
	3938656102,
	3820766613,
	2793130115,
	2977904593,
	26017576,
	3274890735,
	3194772133,
	1700274565,
	1756076034,
	4006520079,
	3677328699,
	720338349,
	1533947780,
	354530856,
	688349552,
	3973924725,
	1637815568,
	332179504,
	3949051286,
	53804574,
	2852348879,
	3044236432,
	1282449977,
	3583942155,
	3416972820,
	4006381244,
	1617046695,
	2628476075,
	3002303598,
	1686838959,
	431878346,
	2686675385,
	1700445008,
	1080580658,
	1009431731,
	832498133,
	3223435511,
	2605976345,
	2271191193,
	2516031870,
	1648197032,
	4164389018,
	2548247927,
	300782431,
	375919233,
	238389289,
	3353747414,
	2531188641,
	2019080857,
	1475708069,
	455242339,
	2609103871,
	448939670,
	3451063019,
	1395535956,
	2413381860,
	1841049896,
	1491858159,
	885456874,
	4264095073,
	4001119347,
	1565136089,
	3898914787,
	1108368660,
	540939232,
	1173283510,
	2745871338,
	3681308437,
	4207628240,
	3343053890,
	4016749493,
	1699691293,
	1103962373,
	3625875870,
	2256883143,
	3830138730,
	1031889488,
	3479347698,
	1535977030,
	4236805024,
	3251091107,
	2132092099,
	1774941330,
	1199868427,
	1452454533,
	157007616,
	2904115357,
	342012276,
	595725824,
	1480756522,
	206960106,
	497939518,
	591360097,
	863170706,
	2375253569,
	3596610801,
	1814182875,
	2094937945,
	3421402208,
	1082520231,
	3463918190,
	2785509508,
	435703966,
	3908032597,
	1641649973,
	2842273706,
	3305899714,
	1510255612,
	2148256476,
	2655287854,
	3276092548,
	4258621189,
	236887753,
	3681803219,
	274041037,
	1734335097,
	3815195456,
	3317970021,
	1899903192,
	1026095262,
	4050517792,
	356393447,
	2410691914,
	3873677099,
	3682840055,
	3913112168,
	2491498743,
	4132185628,
	2489919796,
	1091903735,
	1979897079,
	3170134830,
	3567386728,
	3557303409,
	857797738,
	1136121015,
	1342202287,
	507115054,
	2535736646,
	337727348,
	3213592640,
	1301675037,
	2528481711,
	1895095763,
	1721773893,
	3216771564,
	62756741,
	2142006736,
	835421444,
	2531993523,
	1442658625,
	3659876326,
	2882144922,
	676362277,
	1392781812,
	170690266,
	3921047035,
	1759253602,
	3611846912,
	1745797284,
	664899054,
	1329594018,
	3901205900,
	3045908486,
	2062866102,
	2865634940,
	3543621612,
	3464012697,
	1080764994,
	553557557,
	3656615353,
	3996768171,
	991055499,
	499776247,
	1265440854,
	648242737,
	3940784050,
	980351604,
	3713745714,
	1749149687,
	3396870395,
	4211799374,
	3640570775,
	1161844396,
	3125318951,
	1431517754,
	545492359,
	4268468663,
	3499529547,
	1437099964,
	2702547544,
	3433638243,
	2581715763,
	2787789398,
	1060185593,
	1593081372,
	2418618748,
	4260947970,
	69676912,
	2159744348,
	86519011,
	2512459080,
	3838209314,
	1220612927,
	3339683548,
	133810670,
	1090789135,
	1078426020,
	1569222167,
	845107691,
	3583754449,
	4072456591,
	1091646820,
	628848692,
	1613405280,
	3757631651,
	526609435,
	236106946,
	48312990,
	2942717905,
	3402727701,
	1797494240,
	859738849,
	992217954,
	4005476642,
	2243076622,
	3870952857,
	3732016268,
	765654824,
	3490871365,
	2511836413,
	1685915746,
	3888969200,
	1414112111,
	2273134842,
	3281911079,
	4080962846,
	172450625,
	2569994100,
	980381355,
	4109958455,
	2819808352,
	2716589560,
	2568741196,
	3681446669,
	3329971472,
	1835478071,
	660984891,
	3704678404,
	4045999559,
	3422617507,
	3040415634,
	1762651403,
	1719377915,
	3470491036,
	2693910283,
	3642056355,
	3138596744,
	1364962596,
	2073328063,
	1983633131,
	926494387,
	3423689081,
	2150032023,
	4096667949,
	1749200295,
	3328846651,
	309677260,
	2016342300,
	1779581495,
	3079819751,
	111262694,
	1274766160,
	443224088,
	298511866,
	1025883608,
	3806446537,
	1145181785,
	168956806,
	3641502830,
	3584813610,
	1689216846,
	3666258015,
	3200248200,
	1692713982,
	2646376535,
	4042768518,
	1618508792,
	1610833997,
	3523052358,
	4130873264,
	2001055236,
	3610705100,
	2202168115,
	4028541809,
	2961195399,
	1006657119,
	2006996926,
	3186142756,
	1430667929,
	3210227297,
	1314452623,
	4074634658,
	4101304120,
	2273951170,
	1399257539,
	3367210612,
	3027628629,
	1190975929,
	2062231137,
	2333990788,
	2221543033,
	2438960610,
	1181637006,
	548689776,
	2362791313,
	3372408396,
	3104550113,
	3145860560,
	296247880,
	1970579870,
	3078560182,
	3769228297,
	1714227617,
	3291629107,
	3898220290,
	166772364,
	1251581989,
	493813264,
	448347421,
	195405023,
	2709975567,
	677966185,
	3703036547,
	1463355134,
	2715995803,
	1338867538,
	1343315457,
	2802222074,
	2684532164,
	233230375,
	2599980071,
	2000651841,
	3277868038,
	1638401717,
	4028070440,
	3237316320,
	6314154,
	819756386,
	300326615,
	590932579,
	1405279636,
	3267499572,
	3150704214,
	2428286686,
	3959192993,
	3461946742,
	1862657033,
	1266418056,
	963775037,
	2089974820,
	2263052895,
	1917689273,
	448879540,
	3550394620,
	3981727096,
	150775221,
	3627908307,
	1303187396,
	508620638,
	2975983352,
	2726630617,
	1817252668,
	1876281319,
	1457606340,
	908771278,
	3720792119,
	3617206836,
	2455994898,
	1729034894,
	1080033504,
	976866871,
	3556439503,
	2881648439,
	1522871579,
	1555064734,
	1336096578,
	3548522304,
	2579274686,
	3574697629,
	3205460757,
	3593280638,
	3338716283,
	3079412587,
	564236357,
	2993598910,
	1781952180,
	1464380207,
	3163844217,
	3332601554,
	1699332808,
	1393555694,
	1183702653,
	3581086237,
	1288719814,
	691649499,
	2847557200,
	2895455976,
	3193889540,
	2717570544,
	1781354906,
	1676643554,
	2592534050,
	3230253752,
	1126444790,
	2770207658,
	2633158820,
	2210423226,
	2615765581,
	2414155088,
	3127139286,
	673620729,
	2805611233,
	1269405062,
	4015350505,
	3341807571,
	4149409754,
	1057255273,
	2012875353,
	2162469141,
	2276492801,
	2601117357,
	993977747,
	3918593370,
	2654263191,
	753973209,
	36408145,
	2530585658,
	25011837,
	3520020182,
	2088578344,
	530523599,
	2918365339,
	1524020338,
	1518925132,
	3760827505,
	3759777254,
	1202760957,
	3985898139,
	3906192525,
	674977740,
	4174734889,
	2031300136,
	2019492241,
	3983892565,
	4153806404,
	3822280332,
	352677332,
	2297720250,
	60907813,
	90501309,
	3286998549,
	1016092578,
	2535922412,
	2839152426,
	457141659,
	509813237,
	4120667899,
	652014361,
	1966332200,
	2975202805,
	55981186,
	2327461051,
	676427537,
	3255491064,
	2882294119,
	3433927263,
	1307055953,
	942726286,
	933058658,
	2468411793,
	3933900994,
	4215176142,
	1361170020,
	2001714738,
	2830558078,
	3274259782,
	1222529897,
	1679025792,
	2729314320,
	3714953764,
	1770335741,
	151462246,
	3013232138,
	1682292957,
	1483529935,
	471910574,
	1539241949,
	458788160,
	3436315007,
	1807016891,
	3718408830,
	978976581,
	1043663428,
	3165965781,
	1927990952,
	4200891579,
	2372276910,
	3208408903,
	3533431907,
	1412390302,
	2931980059,
	4132332400,
	1947078029,
	3881505623,
	4168226417,
	2941484381,
	1077988104,
	1320477388,
	886195818,
	18198404,
	3786409e3,
	2509781533,
	112762804,
	3463356488,
	1866414978,
	891333506,
	18488651,
	661792760,
	1628790961,
	3885187036,
	3141171499,
	876946877,
	2693282273,
	1372485963,
	791857591,
	2686433993,
	3759982718,
	3167212022,
	3472953795,
	2716379847,
	445679433,
	3561995674,
	3504004811,
	3574258232,
	54117162,
	3331405415,
	2381918588,
	3769707343,
	4154350007,
	1140177722,
	4074052095,
	668550556,
	3214352940,
	367459370,
	261225585,
	2610173221,
	4209349473,
	3468074219,
	3265815641,
	314222801,
	3066103646,
	3808782860,
	282218597,
	3406013506,
	3773591054,
	379116347,
	1285071038,
	846784868,
	2669647154,
	3771962079,
	3550491691,
	2305946142,
	453669953,
	1268987020,
	3317592352,
	3279303384,
	3744833421,
	2610507566,
	3859509063,
	266596637,
	3847019092,
	517658769,
	3462560207,
	3443424879,
	370717030,
	4247526661,
	2224018117,
	4143653529,
	4112773975,
	2788324899,
	2477274417,
	1456262402,
	2901442914,
	1517677493,
	1846949527,
	2295493580,
	3734397586,
	2176403920,
	1280348187,
	1908823572,
	3871786941,
	846861322,
	1172426758,
	3287448474,
	3383383037,
	1655181056,
	3139813346,
	901632758,
	1897031941,
	2986607138,
	3066810236,
	3447102507,
	1393639104,
	373351379,
	950779232,
	625454576,
	3124240540,
	4148612726,
	2007998917,
	544563296,
	2244738638,
	2330496472,
	2058025392,
	1291430526,
	424198748,
	50039436,
	29584100,
	3605783033,
	2429876329,
	2791104160,
	1057563949,
	3255363231,
	3075367218,
	3463963227,
	1469046755,
	985887462
], A = [
	1332899944,
	1700884034,
	1701343084,
	1684370003,
	1668446532,
	1869963892
];
function j(e, t, n, r) {
	var i, a = e[t], o = e[t + 1];
	return a ^= n[0], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[1], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[2], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[3], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[4], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[5], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[6], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[7], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[8], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[9], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[10], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[11], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[12], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[13], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[14], i = r[a >>> 24], i += r[256 | a >> 16 & 255], i ^= r[512 | a >> 8 & 255], i += r[768 | a & 255], o ^= i ^ n[15], i = r[o >>> 24], i += r[256 | o >> 16 & 255], i ^= r[512 | o >> 8 & 255], i += r[768 | o & 255], a ^= i ^ n[16], e[t] = o ^ n[oe + 1], e[t + 1] = a, e;
}
function M(e, t) {
	for (var n = 0, r = 0; n < 4; ++n) r = r << 8 | e[t] & 255, t = (t + 1) % e.length;
	return {
		key: r,
		offp: t
	};
}
function N(e, t, n) {
	for (var r = 0, i = [0, 0], a = t.length, o = n.length, s, c = 0; c < a; c++) s = M(e, r), r = s.offp, t[c] = t[c] ^ s.key;
	for (c = 0; c < a; c += 2) i = j(i, 0, t, n), t[c] = i[0], t[c + 1] = i[1];
	for (c = 0; c < o; c += 2) i = j(i, 0, t, n), n[c] = i[0], n[c + 1] = i[1];
}
function ce(e, t, n, r) {
	for (var i = 0, a = [0, 0], o = n.length, s = r.length, c, l = 0; l < o; l++) c = M(t, i), i = c.offp, n[l] = n[l] ^ c.key;
	for (i = 0, l = 0; l < o; l += 2) c = M(e, i), i = c.offp, a[0] ^= c.key, c = M(e, i), i = c.offp, a[1] ^= c.key, a = j(a, 0, n, r), n[l] = a[0], n[l + 1] = a[1];
	for (l = 0; l < s; l += 2) c = M(e, i), i = c.offp, a[0] ^= c.key, c = M(e, i), i = c.offp, a[1] ^= c.key, a = j(a, 0, n, r), r[l] = a[0], r[l + 1] = a[1];
}
function P(e, t, n, r, i) {
	var a = A.slice(), o = a.length, s;
	if (n < 4 || n > 31) if (s = Error("Illegal number of rounds (4-31): " + n), r) {
		b(r.bind(this, s));
		return;
	} else throw s;
	if (t.length !== E) if (s = Error("Illegal salt length: " + t.length + " != " + E), r) {
		b(r.bind(this, s));
		return;
	} else throw s;
	n = 1 << n >>> 0;
	var c, l, u = 0, d;
	typeof Int32Array == "function" ? (c = new Int32Array(O), l = new Int32Array(k)) : (c = O.slice(), l = k.slice()), ce(t, e, c, l);
	function f() {
		if (i && i(u / n), u < n) for (var s = Date.now(); u < n && (u += 1, N(e, c, l), N(t, c, l), !(Date.now() - s > se)););
		else {
			for (u = 0; u < 64; u++) for (d = 0; d < o >> 1; d++) j(a, d << 1, c, l);
			var p = [];
			for (u = 0; u < o; u++) p.push((a[u] >> 24 & 255) >>> 0), p.push((a[u] >> 16 & 255) >>> 0), p.push((a[u] >> 8 & 255) >>> 0), p.push((a[u] & 255) >>> 0);
			if (r) {
				r(null, p);
				return;
			} else return p;
		}
		r && b(f);
	}
	if (r !== void 0) f();
	else for (var p;;) if ((p = f()) !== void 0) return p || [];
}
function F(e, t, n, r) {
	var i;
	if (typeof e != "string" || typeof t != "string") if (i = Error("Invalid string / salt: Not a string"), n) {
		b(n.bind(this, i));
		return;
	} else throw i;
	var a, o;
	if (t.charAt(0) !== "$" || t.charAt(1) !== "2") if (i = Error("Invalid salt version: " + t.substring(0, 2)), n) {
		b(n.bind(this, i));
		return;
	} else throw i;
	if (t.charAt(2) === "$") a = "\0", o = 3;
	else {
		if (a = t.charAt(2), a !== "a" && a !== "b" && a !== "y" || t.charAt(3) !== "$") if (i = Error("Invalid salt revision: " + t.substring(2, 4)), n) {
			b(n.bind(this, i));
			return;
		} else throw i;
		o = 4;
	}
	if (t.charAt(o + 2) > "$") if (i = Error("Missing salt rounds"), n) {
		b(n.bind(this, i));
		return;
	} else throw i;
	var s = parseInt(t.substring(o, o + 1), 10) * 10 + parseInt(t.substring(o + 1, o + 2), 10), c = t.substring(o + 3, o + 25);
	e += a >= "a" ? "\0" : "";
	var l = ae(e), u = T(c, E);
	function d(e) {
		var t = [];
		return t.push("$2"), a >= "a" && t.push(a), t.push("$"), s < 10 && t.push("0"), t.push(s.toString()), t.push("$"), t.push(w(u, u.length)), t.push(w(e, A.length * 4 - 1)), t.join("");
	}
	if (n === void 0) return d(P(l, u, s));
	P(l, u, s, function(e, t) {
		e ? n(e, null) : n(null, d(t));
	}, r);
}
function le(e, t) {
	return w(e, t);
}
function ue(e, t) {
	return T(e, t);
}
var I = {
	setRandomFallback: ee,
	genSaltSync: m,
	genSalt: h,
	hashSync: g,
	hash: _,
	compareSync: te,
	compare: ne,
	getRounds: re,
	getSalt: y,
	truncates: ie,
	encodeBase64: le,
	decodeBase64: ue
}, L;
function R() {
	if (!L) throw Error("The database has not been initialized. Call initDatabase() first.");
	return L;
}
function de() {
	L = new u(a(t.getPath("userData"), "psm.db")), L.pragma("journal_mode = WAL"), L.pragma("foreign_keys = ON"), fe();
}
function fe() {
	L.exec("\n    CREATE TABLE IF NOT EXISTS psm_migrations (\n      id         INTEGER PRIMARY KEY AUTOINCREMENT,\n      name       TEXT    NOT NULL UNIQUE,\n      applied_at TEXT    NOT NULL DEFAULT (datetime('now'))\n    );\n  ");
	let e = {
		"001_create_parameters": () => L.exec("\n      CREATE TABLE IF NOT EXISTS psm_parameters (\n        par_id       INTEGER PRIMARY KEY AUTOINCREMENT,\n        par_quantity TEXT    NOT NULL,\n        par_tax      TEXT    NOT NULL,\n        version      INTEGER NOT NULL DEFAULT 1\n      );\n    "),
		"002_create_vehicles": () => L.exec("\n      CREATE TABLE IF NOT EXISTS psm_vehicles (\n        veh_id           INTEGER PRIMARY KEY AUTOINCREMENT,\n        veh_owner        TEXT,\n        veh_reference    TEXT    NOT NULL UNIQUE,\n        veh_plate        TEXT    NOT NULL UNIQUE,\n        veh_ingress_date TEXT    NOT NULL,\n        veh_egress_date  TEXT,\n        veh_status       TEXT    NOT NULL DEFAULT 'P'\n                                 CHECK (veh_status IN ('P', 'S')),\n        veh_tax          TEXT    NOT NULL,\n        veh_version      INTEGER NOT NULL DEFAULT 1\n      );\n    "),
		"003_create_users": () => L.exec("\n      CREATE TABLE IF NOT EXISTS psm_users (\n        user_id        INTEGER PRIMARY KEY AUTOINCREMENT,\n        user_name      TEXT    NOT NULL,\n        user_lastname  TEXT    NOT NULL,\n        user_username  TEXT    NOT NULL UNIQUE,\n        user_password  TEXT    NOT NULL,\n        user_email     TEXT    NOT NULL UNIQUE,\n        user_status    TEXT    NOT NULL DEFAULT 'A'\n                               CHECK (user_status IN ('A', 'I')),\n        user_version   INTEGER NOT NULL DEFAULT 1\n      );\n    "),
		"004_create_settings": () => L.exec("\n      CREATE TABLE IF NOT EXISTS psm_settings (\n        set_id         INTEGER PRIMARY KEY AUTOINCREMENT,\n        set_key        TEXT    NOT NULL UNIQUE,\n        set_value      TEXT    NOT NULL,\n        version        INTEGER NOT NULL DEFAULT 1\n      );\n    "),
		"005_parameter_tariffs_default": () => {
			L.exec("\n        ALTER TABLE psm_parameters ADD COLUMN par_name TEXT NOT NULL DEFAULT '';\n        ALTER TABLE psm_parameters ADD COLUMN par_amount TEXT NOT NULL DEFAULT '0';\n        ALTER TABLE psm_parameters ADD COLUMN par_is_default INTEGER NOT NULL DEFAULT 0\n          CHECK (par_is_default IN (0, 1));\n      "), L.exec("\n        UPDATE psm_parameters\n        SET\n          par_name = CASE\n            WHEN par_name IS NULL OR TRIM(par_name) = '' THEN 'Tarifa general'\n            ELSE par_name\n          END,\n          par_amount = CASE\n            WHEN par_amount IS NULL OR TRIM(par_amount) = '' THEN\n              CASE\n                WHEN par_quantity IS NOT NULL AND TRIM(par_quantity) <> '' THEN par_quantity\n                WHEN par_tax IS NOT NULL AND TRIM(par_tax) <> '' THEN par_tax\n                ELSE '0'\n              END\n            ELSE par_amount\n          END;\n      "), L.prepare("SELECT EXISTS(SELECT 1 FROM psm_parameters) as has_rows").get().has_rows ? L.exec("\n          UPDATE psm_parameters SET par_is_default = 0;\n          UPDATE psm_parameters\n          SET par_is_default = 1\n          WHERE par_id = (SELECT par_id FROM psm_parameters ORDER BY par_id ASC LIMIT 1);\n        ") : L.prepare("\n          INSERT INTO psm_parameters\n            (par_quantity, par_tax, par_name, par_amount, par_is_default, version)\n          VALUES\n            ('0', '0', 'Tarifa general', '0', 1, 1)\n        ").run(), L.exec("\n        CREATE UNIQUE INDEX IF NOT EXISTS idx_psm_parameters_single_default\n        ON psm_parameters (par_is_default)\n        WHERE par_is_default = 1;\n      ");
		},
		"006_add_user_role_and_seed_admin": () => {
			L.exec("ALTER TABLE psm_users ADD COLUMN user_role TEXT NOT NULL DEFAULT 'user' CHECK (user_role IN ('admin', 'user'));");
			let e = I.hashSync("admin123", 10);
			L.prepare("\n        INSERT INTO psm_users (user_name, user_lastname, user_username, user_password, user_email, user_status, user_role, user_version)\n        VALUES ('Administrador', 'Sistema', 'admin', ?, 'admin@psm.local', 'A', 'admin', 1)\n      ").run(e);
		}
	}, t = L.prepare("SELECT name FROM psm_migrations").all(), n = new Set(t.map((e) => e.name)), r = L.prepare("INSERT INTO psm_migrations (name) VALUES (?)");
	for (let [t, i] of Object.entries(e)) n.has(t) || (i(), r.run(t), console.log(`✓ Migration applied: ${t}`));
}
//#endregion
//#region electron/repositories/user.repository.ts
function pe() {
	return R().prepare("SELECT * FROM psm_users ORDER BY user_id ASC").all();
}
function z(e) {
	return R().prepare("SELECT * FROM psm_users WHERE user_id = ?").get(e);
}
function B(e) {
	return R().prepare("SELECT * FROM psm_users WHERE user_username = ?").get(e);
}
function V(e) {
	return R().prepare("SELECT * FROM psm_users WHERE user_email = ?").get(e);
}
function me(e) {
	return R().prepare("\n      INSERT INTO psm_users\n        (user_name, user_lastname, user_username, user_password, user_email)\n      VALUES\n        (@user_name, @user_lastname, @user_username, @user_password, @user_email)\n    ").run(e).lastInsertRowid;
}
function he(e, t) {
	let n = Object.keys(t).map((e) => `${e} = @${e}`).join(", ");
	return R().prepare(`UPDATE psm_users SET ${n} WHERE user_id = @id`).run({
		...t,
		id: e
	}).changes;
}
function H(e, t) {
	return R().prepare("UPDATE psm_users SET user_password = ? WHERE user_id = ?").run(t, e).changes;
}
function ge(e) {
	return R().prepare("UPDATE psm_users SET user_status = 'I' WHERE user_id = ?").run(e).changes;
}
function _e(e) {
	return R().prepare("DELETE FROM psm_users WHERE user_id = ?").run(e).changes;
}
function ve() {
	return R().prepare("SELECT * FROM psm_users WHERE user_role = 'admin' LIMIT 1").get();
}
function ye() {
	return R().prepare("UPDATE psm_users SET user_status = 'I' WHERE user_role = 'admin'").run().changes;
}
//#endregion
//#region electron/service/user.service.ts
function U(e) {
	return {
		user_id: e.user_id,
		user_name: e.user_name,
		user_lastname: e.user_lastname,
		user_username: e.user_username,
		user_email: e.user_email,
		user_status: e.user_status,
		user_role: e.user_role,
		user_version: e.user_version
	};
}
function be(e) {
	return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(e);
}
function xe() {
	return pe().map(U);
}
function Se(e) {
	let t = z(e);
	return t ? U(t) : void 0;
}
function Ce(e) {
	let t = B(e.user_username);
	if (!t) return {
		success: !1,
		message: "Credenciales inválidas."
	};
	if (t.user_status === "I") return {
		success: !1,
		message: "El usuario está inactivo."
	};
	if (be(t.user_password)) return I.compareSync(e.user_password, t.user_password) ? {
		success: !0,
		user: U(t)
	} : {
		success: !1,
		message: "Credenciales inválidas."
	};
	if (e.user_password !== t.user_password) return {
		success: !1,
		message: "Credenciales inválidas."
	};
	if (t.user_id != null) {
		let n = I.hashSync(e.user_password, 10);
		H(t.user_id, n);
	}
	return {
		success: !0,
		user: U(t)
	};
}
function we(e) {
	if (B(e.user_username)) return {
		success: !1,
		message: "El nombre de usuario ya está en uso."
	};
	if (V(e.user_email)) return {
		success: !1,
		message: "El correo electrónico ya está registrado."
	};
	let t = I.hashSync(e.user_password, 10), n = me({
		...e,
		user_password: t
	}), r = ve();
	return r && r.user_id !== n && ye(), {
		success: !0,
		id: n
	};
}
function Te(e, t) {
	if (!z(e)) return {
		success: !1,
		message: "Usuario no encontrado."
	};
	if (t.user_username) {
		let n = B(t.user_username);
		if (n && n.user_id !== e) return {
			success: !1,
			message: "El nombre de usuario ya está en uso."
		};
	}
	if (t.user_email) {
		let n = V(t.user_email);
		if (n && n.user_id !== e) return {
			success: !1,
			message: "El correo electrónico ya está registrado."
		};
	}
	return he(e, t), { success: !0 };
}
function Ee(e, t, n) {
	let r = z(e);
	return r ? I.compareSync(t, r.user_password) ? (H(e, I.hashSync(n, 10)), { success: !0 }) : {
		success: !1,
		message: "La contraseña actual es incorrecta."
	} : {
		success: !1,
		message: "Usuario no encontrado."
	};
}
function De(e) {
	return z(e) ? (ge(e), { success: !0 }) : {
		success: !1,
		message: "Usuario no encontrado."
	};
}
function Oe(e) {
	return z(e) ? (_e(e), { success: !0 }) : {
		success: !1,
		message: "Usuario no encontrado."
	};
}
//#endregion
//#region electron/handlers/user.handler.ts
function ke() {
	n.handle("users:getAll", () => xe()), n.handle("users:getOne", (e, t) => Se(t)), n.handle("users:login", (e, t) => Ce(t)), n.handle("users:create", (e, t) => we(t)), n.handle("users:update", (e, t, n) => Te(t, n)), n.handle("users:changePassword", (e, t, n, r) => Ee(t, n, r)), n.handle("users:deactivate", (e, t) => De(t)), n.handle("users:delete", (e, t) => Oe(t));
}
//#endregion
//#region electron/repositories/vehcile.repository.ts
var Ae = {
	daily: 1,
	weekly: 7,
	monthly: 30,
	yearly: 365
};
function je(e) {
	return e === "daily" || e === "weekly" || e === "monthly" || e === "yearly";
}
function Me(e) {
	let t = /* @__PURE__ */ new Date(`${e}T00:00:00Z`);
	return Number.isNaN(t.getTime()) ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : t.toISOString().slice(0, 10);
}
function Ne(e, t) {
	let n = Me(t), r = /* @__PURE__ */ new Date(`${n}T00:00:00Z`), i = Ae[e], a = new Date(r);
	return a.setUTCDate(r.getUTCDate() - (i - 1)), {
		rangeStart: a.toISOString().slice(0, 10),
		rangeEnd: n
	};
}
function Pe(e, t) {
	let n = je(e) ? e : "daily", { rangeStart: r, rangeEnd: i } = Ne(n, t), a = R(), o = a.prepare("\n      SELECT\n        veh_id,\n        veh_plate,\n        veh_owner,\n        veh_ingress_date,\n        veh_egress_date,\n        veh_tax\n      FROM psm_vehicles\n      WHERE veh_status = 'S'\n        AND veh_egress_date IS NOT NULL\n        AND DATE(veh_egress_date) BETWEEN @rangeStart AND @rangeEnd\n      ORDER BY veh_egress_date DESC, veh_id DESC\n    ").all({
		rangeStart: r,
		rangeEnd: i
	}), s = a.prepare("\n      SELECT\n        COUNT(*) AS totalVehicles,\n        COALESCE(SUM(CAST(veh_tax AS REAL)), 0) AS totalRevenue\n      FROM psm_vehicles\n      WHERE veh_status = 'S'\n        AND veh_egress_date IS NOT NULL\n        AND DATE(veh_egress_date) BETWEEN @rangeStart AND @rangeEnd\n    ").get({
		rangeStart: r,
		rangeEnd: i
	});
	return {
		period: n,
		rangeStart: r,
		rangeEnd: i,
		totalVehicles: s?.totalVehicles ?? o.length,
		totalRevenue: Number(s?.totalRevenue ?? 0),
		rows: o
	};
}
function Fe() {
	return R().prepare("SELECT * FROM psm_vehicles ORDER BY veh_ingress_date DESC").all();
}
function Ie() {
	return R().prepare("\n      SELECT * FROM psm_vehicles\n      WHERE veh_status = 'P'\n      ORDER BY veh_ingress_date DESC\n    ").all();
}
function W(e) {
	return R().prepare("SELECT * FROM psm_vehicles WHERE veh_id = ?").get(e);
}
function G(e) {
	return R().prepare("SELECT * FROM psm_vehicles WHERE veh_plate = ?").get(e);
}
function Le(e) {
	return R().prepare("SELECT * FROM psm_vehicles WHERE veh_reference = ?").get(e);
}
function Re(e) {
	return R().prepare("\n      INSERT INTO psm_vehicles\n        (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_tax, veh_version, veh_status)\n      VALUES\n        (@veh_owner, @veh_reference, @veh_plate, @veh_ingress_date, @veh_tax, @veh_version, 'P')\n    ").run(e).lastInsertRowid;
}
function ze(e, t, n) {
	return R().prepare("\n      UPDATE psm_vehicles\n      SET veh_status      = 'S',\n          veh_egress_date = @egress_date,\n          veh_tax         = COALESCE(@total, veh_tax),\n          veh_version     = veh_version + 1\n      WHERE veh_id = @id AND veh_status = 'P'\n    ").run({
		egress_date: t,
		id: e,
		total: n || null
	}).changes;
}
function Be(e, t) {
	let n = Object.keys(t).map((e) => `${e} = @${e}`).join(", ");
	return R().prepare(`UPDATE psm_vehicles SET ${n} WHERE veh_id = @id`).run({
		...t,
		id: e
	}).changes;
}
function Ve(e) {
	return R().prepare("DELETE FROM psm_vehicles WHERE veh_id = ?").run(e).changes;
}
//#endregion
//#region electron/service/vehicle.service.ts
function He() {
	return Fe();
}
function Ue() {
	return Ie();
}
function We(e) {
	return W(e);
}
function Ge(e) {
	let t = G(e.veh_plate);
	return t && t.veh_status === "P" ? {
		success: !1,
		message: `La placa ${e.veh_plate} ya tiene un ingreso activo.`
	} : Le(e.veh_reference) ? {
		success: !1,
		message: `La referencia ${e.veh_reference} ya existe.`
	} : {
		success: !0,
		id: Re(e)
	};
}
function Ke(e, t) {
	let n = W(e);
	return n ? n.veh_status === "S" ? {
		success: !1,
		message: "El vehículo ya registró su salida."
	} : ze(e, (/* @__PURE__ */ new Date()).toISOString(), t) === 0 ? {
		success: !1,
		message: "No se pudo registrar la salida."
	} : { success: !0 } : {
		success: !1,
		message: "Vehículo no encontrado."
	};
}
function qe(e, t) {
	if (!W(e)) return {
		success: !1,
		message: "Vehículo no encontrado."
	};
	if (t.veh_plate) {
		let n = G(t.veh_plate);
		if (n && n.veh_id !== e) return {
			success: !1,
			message: `La placa ${t.veh_plate} ya está registrada.`
		};
	}
	return Be(e, t), { success: !0 };
}
function Je(e) {
	return W(e) ? (Ve(e), { success: !0 }) : {
		success: !1,
		message: "Vehículo no encontrado."
	};
}
function Ye(e, t) {
	return Pe(e, t);
}
//#endregion
//#region electron/handlers/vehicle.handler.ts
function Xe(e) {
	if (!e) return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	let t = /* @__PURE__ */ new Date(`${e}T00:00:00Z`);
	return Number.isNaN(t.getTime()) ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : t.toISOString().slice(0, 10);
}
function Ze(e) {
	return e === "daily" || e === "weekly" || e === "monthly" || e === "yearly";
}
function Qe() {
	n.handle("vehicles:getAll", () => He()), n.handle("vehicles:getActive", () => Ue()), n.handle("vehicles:getOne", (e, t) => We(t)), n.handle("vehicles:create", (e, t) => Ge(t)), n.handle("vehicles:checkout", (e, t, n) => Ke(t, n)), n.handle("vehicles:update", (e, t, n) => qe(t, n)), n.handle("vehicles:delete", (e, t) => Je(t)), n.handle("vehicles:getStats", () => {
		let e = R(), t = e.prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'").get().count, n = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], r = 0;
		try {
			r = e.prepare("\n        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total \n        FROM psm_vehicles \n        WHERE veh_status = 'S' \n        AND DATE(veh_egress_date) = ?\n      ").get(n)?.total || 0;
		} catch {
			r = 0;
		}
		let i = 0;
		try {
			i = e.prepare("\n        SELECT COUNT(*) as count \n        FROM psm_vehicles \n        WHERE veh_status = 'S' \n        AND DATE(veh_egress_date) = ?\n      ").get(n).count;
		} catch {
			i = 0;
		}
		return {
			parkedCount: t,
			todayRevenue: r,
			todayVehicles: i
		};
	}), n.handle("vehicles:getParkedCount", () => R().prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'").get().count), n.handle("vehicles:getTodayRevenue", () => {
		let e = R(), t = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		try {
			return e.prepare("\n        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total \n        FROM psm_vehicles \n        WHERE veh_status = 'S' \n        AND DATE(veh_egress_date) = ?\n      ").get(t)?.total || 0;
		} catch {
			return 0;
		}
	}), n.handle("vehicles:getTodayVehicles", () => {
		let e = R(), t = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		try {
			return e.prepare("\n        SELECT COUNT(*) as count \n        FROM psm_vehicles \n        WHERE veh_status = 'S' \n        AND DATE(veh_egress_date) = ?\n      ").get(t)?.count || 0;
		} catch {
			return 0;
		}
	}), n.handle("vehicles:getReport", (e, t, n) => Ye(Ze(t) ? t : "daily", Xe(n)));
}
//#endregion
//#region electron/repositories/parameter.repository.ts
function $e() {
	return R().prepare("SELECT * FROM psm_parameters ORDER BY par_id ASC").all();
}
function K(e) {
	return R().prepare("SELECT * FROM psm_parameters WHERE par_id = ?").get(e);
}
function et(e) {
	return R().prepare("\n      INSERT INTO psm_parameters (par_name, par_amount, par_is_default, version, par_quantity, par_tax)\n      VALUES (@par_name, @par_amount, @par_is_default, @version, @par_amount, @par_amount)\n    ").run(e).lastInsertRowid;
}
function tt(e, t) {
	let n = Object.keys(t).map((e) => `${e} = @${e}`).join(", ");
	return R().prepare(`UPDATE psm_parameters SET ${n} WHERE par_id = @id`).run({
		...t,
		id: e
	}).changes;
}
function q() {
	return R().prepare("SELECT * FROM psm_parameters WHERE par_is_default = 1 LIMIT 1").get();
}
function J(e) {
	let t = R(), n = t.prepare("UPDATE psm_parameters SET par_is_default = 0 WHERE par_is_default = 1"), r = t.prepare("UPDATE psm_parameters SET par_is_default = 1 WHERE par_id = ?");
	return t.transaction((e) => (n.run(), r.run(e).changes))(e);
}
//#endregion
//#region electron/service/parameter.service.ts
function nt() {
	return $e();
}
function rt(e) {
	return K(e);
}
function it(e) {
	let t = e.par_name.trim();
	if (!t) return {
		success: !1,
		message: "El nombre de la tarifa es obligatorio."
	};
	let n = Number(e.par_amount);
	if (!Number.isFinite(n) || n <= 0) return {
		success: !1,
		message: "El monto de la tarifa debe ser un numero positivo."
	};
	let r = et({
		...e,
		par_name: t,
		par_amount: n.toString(),
		par_is_default: 0
	});
	if (e.par_is_default) {
		if (J(r) === 0) return {
			success: !1,
			message: "No se pudo establecer la tarifa general."
		};
	} else if (!q() && J(r) === 0) return {
		success: !1,
		message: "No se pudo crear una tarifa general valida."
	};
	return {
		success: !0,
		id: r
	};
}
function at(e, t) {
	let n = K(e);
	if (!n) return {
		success: !1,
		message: "Parámetro no encontrado."
	};
	let r = t.par_is_default === 1, i = t.par_is_default === 0;
	if (r && delete t.par_is_default, i && n.par_is_default === 1) return {
		success: !1,
		message: "Debe existir una tarifa general valida."
	};
	if (t.par_name !== void 0) {
		let e = t.par_name.trim();
		if (!e) return {
			success: !1,
			message: "El nombre de la tarifa es obligatorio."
		};
		t.par_name = e;
	}
	if (t.par_amount !== void 0) {
		let e = Number(t.par_amount);
		if (!Number.isFinite(e) || e <= 0) return {
			success: !1,
			message: "El monto de la tarifa debe ser un numero positivo."
		};
		t.par_amount = e.toString();
	}
	return Object.keys(t).length > 0 && tt(e, t), r && J(e) === 0 ? {
		success: !1,
		message: "No se pudo actualizar la tarifa general."
	} : q() ? { success: !0 } : {
		success: !1,
		message: "Debe existir una tarifa general valida."
	};
}
function Y() {
	return q();
}
function ot(e) {
	return K(e) ? J(e) === 0 ? {
		success: !1,
		message: "No se pudo actualizar la tarifa general."
	} : { success: !0 } : {
		success: !1,
		message: "Parámetro no encontrado."
	};
}
//#endregion
//#region electron/handlers/parameter.handler.ts
function st() {
	n.handle("parameters:getAll", () => nt()), n.handle("parameters:getOne", (e, t) => rt(t)), n.handle("parameters:create", (e, t) => it(t)), n.handle("parameters:update", (e, t, n) => at(t, n)), n.handle("parameters:getDefault", () => Y()), n.handle("parameters:setDefault", (e, t) => ot(t));
}
//#endregion
//#region electron/handlers/session.handler.ts
function ct() {
	R().exec("\n    CREATE TABLE IF NOT EXISTS psm_sessions (\n      id          INTEGER PRIMARY KEY,\n      user_id     INTEGER NOT NULL,\n      user_name   TEXT    NOT NULL,\n      user_lastname TEXT  NOT NULL,\n      user_username TEXT  NOT NULL,\n      user_email   TEXT   NOT NULL,\n      user_status  TEXT   NOT NULL,\n      user_version INTEGER NOT NULL,\n      saved_at     TEXT   NOT NULL DEFAULT (datetime('now'))\n    );\n  ");
}
function lt() {
	ct(), n.handle("session:save", (e, t) => {
		let n = R();
		return n.prepare("DELETE FROM psm_sessions").run(), n.prepare("\n      INSERT INTO psm_sessions \n        (user_id, user_name, user_lastname, user_username, user_email, user_status, user_role, user_version, saved_at)\n      VALUES \n        (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))\n    ").run(t.user_id, t.user_name, t.user_lastname, t.user_username, t.user_email, t.user_status, t.user_role, t.user_version), { success: !0 };
	}), n.handle("session:restore", () => {
		let e = R().prepare("\n      SELECT user_id, user_name, user_lastname, user_username, user_email, user_status, user_role, user_version\n      FROM psm_sessions\n      LIMIT 1\n    ").get();
		return e ? {
			user_id: e.user_id,
			user_name: e.user_name,
			user_lastname: e.user_lastname,
			user_username: e.user_username,
			user_email: e.user_email,
			user_status: e.user_status,
			user_role: e.user_role,
			user_version: e.user_version
		} : null;
	}), n.handle("session:clear", () => (R().prepare("DELETE FROM psm_sessions").run(), { success: !0 }));
}
//#endregion
//#region electron/repositories/setting.repository.ts
function ut() {
	return R().prepare("SELECT * FROM psm_settings").all();
}
function X(e) {
	return R().prepare("SELECT * FROM psm_settings WHERE set_key = ?").get(e);
}
function dt(e, t) {
	return X(e) ? R().prepare("UPDATE psm_settings SET set_value = ?, version = version + 1 WHERE set_key = ?").run(t, e).changes : R().prepare("INSERT INTO psm_settings (set_key, set_value) VALUES (?, ?)").run(e, t).changes;
}
//#endregion
//#region electron/service/setting.service.ts
function ft() {
	return ut();
}
function pt(e) {
	return X(e)?.set_value;
}
function mt(e, t) {
	try {
		return dt(e, t), { success: !0 };
	} catch (e) {
		return console.error("Error saving setting:", e), { success: !1 };
	}
}
//#endregion
//#region electron/handlers/setting.handler.ts
function ht() {
	n.handle("settings:getAll", () => ft()), n.handle("settings:get", (e, t) => pt(t)), n.handle("settings:save", (e, t, n) => mt(t, n));
}
//#endregion
//#region electron/main.ts
var Z = i(o(import.meta.url));
function Q(e) {
	try {
		let n = t.getPath("userData");
		l(n, { recursive: !0 }), s(a(n, "runtime.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] ${e}\n`, "utf8");
	} catch {}
}
function $() {
	let { width: t, height: n } = r.getPrimaryDisplay().workAreaSize, i = new e({
		width: t,
		height: n,
		minWidth: 800,
		minHeight: 600,
		resizable: !0,
		maximizable: !0,
		webPreferences: {
			preload: a(Z, "preload.js"),
			contextIsolation: !0,
			nodeIntegration: !1,
			sandbox: !1
		},
		titleBarStyle: "default",
		show: !1
	});
	i.webContents.on("did-finish-load", () => {
		i.webContents.setZoomFactor(1), Q("Renderer finished load successfully.");
	}), i.webContents.on("did-fail-load", (e, t, n, r) => {
		Q(`did-fail-load: code=${t} description=${n} url=${r}`);
	}), i.webContents.on("render-process-gone", (e, t) => {
		Q(`render-process-gone: reason=${t.reason} exitCode=${t.exitCode}`);
	}), i.webContents.on("console-message", (e, t, n, r, i) => {
		t >= 2 && Q(`renderer-console(level=${t}): ${n} (${i}:${r})`);
	}), i.once("ready-to-show", () => i.show());
	let o = process.env.VITE_DEV_SERVER_URL;
	if (o) i.loadURL(o), i.webContents.openDevTools();
	else {
		let e = a(process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(), "resources", "dist", "index.html"), t = a(Z, "../dist/index.html"), n = c(e) ? e : t;
		Q(`Loading production renderer from: ${n} (resourceExists=${c(e)}, bundledExists=${c(t)})`), i.loadFile(n).catch((e) => {
			Q(`loadFile failed: ${e instanceof Error ? e.message : String(e)}`);
		});
	}
}
t.whenReady().then(() => {
	Q(`App ready. version=${t.getVersion()} packaged=${t.isPackaged}`), de(), ke(), Qe(), st(), lt(), ht(), $(), t.on("activate", () => {
		e.getAllWindows().length === 0 && $();
	});
}).catch((e) => {
	Q(`Startup failure: ${e instanceof Error ? e.stack || e.message : String(e)}`), console.error("Failed to start Electron app:", e), t.quit();
}), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
});
//#endregion

//# sourceMappingURL=main.js.map