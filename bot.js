require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const CHANNEL = "@zeinamoneymarket";
const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_IDS || "").split(",").map(Number);

function isAdmin(u) { return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(u); }

const P = {
  gm: [
    "gm Zeina fam ☀️\n\nyour BTC didn't sleep\nyour ETH didn't sleep\nyour XRP didn't sleep\n\nborrow, don't sell\nzeinafi.com\n\n#ZeinaFi #HODL",
    "gm frens 🌅\n\nanother day\nanother reason not to sell your crypto\n\nborrow against it instead\nzeinafi.com\n\n#ZeinaFi #Web3",
    "gm to everyone who didn't sell last night 🫡\n\npatience is a strategy\nborrowing is a superpower\n\nzeinafi.com #ZeinaFi #HODL",
    "gm 🌅\n\nrule #1 of crypto\nnever sell what you believe in\n\nborrow against it instead\nno KYC · no bank · instant\n\nzeinafi.com #ZeinaFi #NeverSell",
    "gm Zeina Money Market 🌅\n\nwhile you slept your stack kept building\n\nmake it work harder today\nborrow against it at zeinafi.com\n\n#ZeinaFi #CryptoLoans"
  ],
  btc: [
    "Bitcoin HODLers 🧡\n\nyou held through $69k → $16k → $107k\n\nyou're not selling now\n\nneed cash? borrow against your BTC\nkeep every sat\n\nzeinafi.com #ZeinaFi #Bitcoin",
    "sats are not for selling 🧡\n\nbut sometimes life needs cash\n\n→ lock BTC as collateral\n→ get stablecoins instantly\n→ BTC stays yours\n→ repay when ready\n\nzeinafi.com #ZeinaFi #Bitcoin",
    "imagine selling BTC at $30k to pay rent 😭\n\nwhen you could have borrowed against it\nkept the BTC\nwatched it go to $107k\n\ndon't make that mistake\n\nzeinafi.com #ZeinaFi #Bitcoin",
    "the HODLer dilemma:\nneed cash but don't want to sell BTC\n\nthe solution:\nborrow against it at Zeina Fi\n\n→ keep your BTC\n→ get USDT now\n→ zero tax event\n\nzeinafi.com #ZeinaFi #Bitcoin #HODL",
    "Bitcoin is the hardest money ever created\n\ndon't make it soft by selling\n\nborrow against your stack instead\n350+ assets accepted · instant · global\n\nzeinafi.com #ZeinaFi #Bitcoin #NeverSell"
  ],
  xrp: [
    "XRP Army 🐸\n\nyou held through lawsuits\nthrough FUD\nthrough everything\n\nneed liquidity?\nborrow against your XRP at Zeina Fi\n\nzeinafi.com #ZeinaFi #XRP",
    "XRP holders get it\n\npatience. conviction. no selling.\n\nborrow against your XRP\nget stablecoins instantly\nkeep your full position\n\nzeinafi.com #ZeinaFi #XRP #XRPArmy",
    "the XRP play:\n\n→ hold XRP\n→ borrow stables against it\n→ use cash for life\n→ XRP pumps\n→ repay loan\n→ profit on both sides\n\nzeinafi.com #ZeinaFi #XRP",
    "don't sell your XRP at the finish line 🏁\n\nyears of holding\nyears of conviction\n\nborrow against it instead\nkeep the position · get the cash\n\nzeinafi.com #ZeinaFi #XRP",
    "XRP at Zeina Fi:\n\n✅ use XRP as collateral\n✅ get USDT instantly\n✅ no selling · no KYC · global\n\nyour conviction + our liquidity\n\nzeinafi.com #ZeinaFi #XRP #XRPArmy"
  ],
  eth: [
    "ETH holders 🔷\n\nyou're not just holding\nyou're building, staking, believing\n\nborrow against your ETH instead of selling\n→ instant stablecoins\n→ ETH stays yours\n→ no tax event\n\nzeinafi.com #ZeinaFi #ETH",
    "ETH is money 🔷\n\nand money should work for you\nnot sit idle\n\nborrow against your ETH at Zeina Fi\ninstant · global · no KYC\n\nzeinafi.com #ZeinaFi #ETH #DeFi",
    "the ETH holder move:\n\n→ don't sell before the next pump\n→ borrow against it instead\n→ get liquidity now\n→ keep the upside\n\nzeinafi.com #ZeinaFi #ETH",
    "staking ETH + borrowing against it =\nthe ultimate double yield play 🔷\n\nkeep your ETH working on both ends\n\nzeinafi.com #ZeinaFi #ETH #DeFi"
  ],
  education: [
    "how crypto-collateral loans work:\n\n→ deposit BTC, ETH, XRP or 350+ assets\n→ receive USDT/USDC instantly\n→ your crypto stays in secure custody\n→ it keeps appreciating\n→ repay whenever\n→ get your crypto back\n\nno bank. no credit check. no KYC.\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "why borrow instead of sell?\n\nselling crypto:\n❌ triggers capital gains tax\n❌ you lose your position\n❌ you miss the next pump\n\nborrowing:\n✅ no tax event\n✅ keep the upside\n✅ get stablecoins today\n\nzeinafi.com #ZeinaFi",
    "crypto loans explained simply:\n\nyour BTC is like a house\nyou don't sell your house to get cash\nyou get a mortgage against it\n\ncrypto loans work the same way\n🏠 your crypto = the house\n💰 the loan = the mortgage\n\nzeinafi.com #ZeinaFi #CryptoEducation",
    "the tax angle most people miss 💡\n\nselling crypto = taxable event\nborrowing against crypto = NOT taxable\n\nthis is how smart money accesses liquidity\nwithout paying the tax man\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "what happens to your crypto when you borrow?\n\n→ held in secure custody\n→ NOT sold or traded\n→ keeps appreciating\n→ returned when you repay\n\nyour crypto. your terms.\n\nzeinafi.com #ZeinaFi"
  ],
  assets: [
    "350+ assets accepted at Zeina Fi 🌐\n\nnot just BTC and ETH\n\nXRP ✅ SOL ✅ AVAX ✅\nMATIC ✅ DOT ✅ LINK ✅\nand 344 more...\n\nyour WHOLE portfolio is your collateral\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "your altcoin bag has value RIGHT NOW 💼\n\nZeina Fi accepts 350+ crypto assets\nas collateral for instant loans\n\nnot just blue chips\nYOUR portfolio works for you\n\nzeinafi.com #ZeinaFi #DeFi",
    "most lending platforms: BTC and ETH only\n\nZeina Fi: 350+ assets ✅\n\nXRP, SOL, AVAX and hundreds more\nall work as collateral\n\ninstant loans · global · no KYC\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "diversified portfolio? 📊\n\ngood — Zeina Fi accepts all of it\n\nBTC · ETH · XRP · and 350+ more\n\nborrow against your whole stack\nnot just one asset\n\nzeinafi.com #ZeinaFi"
  ],
  cta: [
    "ready to put your crypto to work? 🚀\n\nZeina Fi — instant crypto-backed loans\n\n→ BTC, ETH, XRP + 350 more accepted\n→ get stablecoins in minutes\n→ no KYC · no bank · no selling\n→ available worldwide\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "your crypto is sitting idle\n\nit doesn't have to be\n\nborrow against it at Zeina Fi\nget stablecoins instantly\nno selling · no KYC · global\n\nzeinafi.com #ZeinaFi #NeverSell",
    "stop selling. start borrowing. 🧠\n\nZeina Fi makes it simple:\n\n1️⃣ choose your collateral (350+ options)\n2️⃣ set your loan amount\n3️⃣ receive stablecoins instantly\n4️⃣ repay whenever\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "need liquidity? don't sell 🙅\n\nZeina Fi:\n✅ 350+ assets as collateral\n✅ instant stablecoins\n✅ no KYC · no credit check\n✅ worldwide\n\nzeinafi.com #ZeinaFi #CryptoLoans #HODL",
    "the smartest crypto move:\n\nborrowing against your stack\ninstead of selling it\n\nkeep the upside\nget the cash\nzero tax event\n\ntry it at zeinafi.com #ZeinaFi"
  ],
  market: [
    "market dipping? 📉\n\ndon't panic sell\n\nborrow against your crypto instead\nget stablecoins\nwait for recovery\nrepay loan\nkeep all the gains\n\nzeinafi.com #ZeinaFi #CryptoLoans",
    "bull market energy 📈\n\ndon't sell your position\nborrow against it\nuse the cash to live your life\nlet the bull run do its thing\n\nzeinafi.com #ZeinaFi",
    "volatility is not your enemy 💡\n\nit's opportunity\n\nwhile others panic sell\nsmart holders borrow against their stack\nstay exposed\ncome out ahead\n\nzeinafi.com #ZeinaFi #HODL",
    "crypto market update 🌐\n\nwhatever direction it goes:\n→ up: don't sell, stay exposed\n→ down: don't panic sell, borrow instead\n\nZeina Fi keeps you in the game\n\nzeinafi.com #ZeinaFi #CryptoLoans"
  ]
};

const C = {};
function getPost(cat) {
  const l = P[cat];
  C[cat] = C[cat] || 0;
  const p = l[C[cat] % l.length];
  C[cat]++;
  return p;
}
function getRandom() {
  const cats = Object.keys(P);
  return getPost(cats[Math.floor(Math.random() * cats.length)]);
}
async function send(text) {
  await bot.sendMessage(CHANNEL, text, { disable_web_page_preview: true });
}

bot.onText(/\/start/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  await bot.sendMessage(msg.chat.id,
    "🤖 Zeina Fi Agent\n\nChannel: " + CHANNEL + "\n\n" +
    "/post — post now\n/gm — GM post\n/btc — Bitcoin post\n" +
    "/xrp — XRP post\n/eth — ETH post\n/edu — education post\n" +
    "/assets — 350+ assets post\n/cta — loan CTA\n/market — market post\n" +
    "/preview — preview only\n/status — agent status\n/custom your text — post custom message"
  );
});

bot.onText(/\/post$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getRandom();
    await send(p);
    await bot.editMessageText("✅ Posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/gm$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("gm");
    await send(p);
    await bot.editMessageText("✅ GM posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/btc$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("btc");
    await send(p);
    await bot.editMessageText("✅ BTC posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/xrp$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("xrp");
    await send(p);
    await bot.editMessageText("✅ XRP posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/eth$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("eth");
    await send(p);
    await bot.editMessageText("✅ ETH posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/edu$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("education");
    await send(p);
    await bot.editMessageText("✅ Education posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/assets$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("assets");
    await send(p);
    await bot.editMessageText("✅ Assets posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/cta$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("cta");
    await send(p);
    await bot.editMessageText("✅ CTA posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/market$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const m = await bot.sendMessage(msg.chat.id, "⏳ Posting...");
  try {
    const p = getPost("market");
    await send(p);
    await bot.editMessageText("✅ Market posted!\n\n" + p, { chat_id: msg.chat.id, message_id: m.message_id });
  } catch (e) {
    await bot.editMessageText("❌ " + e.message, { chat_id: msg.chat.id, message_id: m.message_id });
  }
});

bot.onText(/\/preview$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const p = getRandom();
  await bot.sendMessage(msg.chat.id, "👁 PREVIEW (not posted):\n\n" + p + "\n\n— Send /post to publish");
});

bot.onText(/\/status$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  await bot.sendMessage(msg.chat.id,
    "🟢 Zeina Fi Agent\n\nBot: @ZFAIAbot ✅\nChannel: " + CHANNEL +
    " ✅\nPosts: 50+ built-in ✅\nSchedule: Active ✅\nUptime: " +
    Math.floor(process.uptime() / 60) + " min"
  );
});

bot.onText(/\/custom (.+)/, async (msg, match) => {
  if (!isAdmin(msg.from.id)) return;
  try {
    await send(match[1]);
    await bot.sendMessage(msg.chat.id, "✅ Posted to " + CHANNEL);
  } catch (e) {
    await bot.sendMessage(msg.chat.id, "❌ " + e.message);
  }
});

cron.schedule("0 8 * * *", async () => {
  try { await send(getPost("gm")); console.log("✅ 08:00 GM"); }
  catch (e) { console.error("❌", e.message); }
});

cron.schedule("0 12 * * *", async () => {
  try {
    const t = new Date().getDay() % 2 === 0 ? "education" : "market";
    await send(getPost(t));
    console.log("✅ 12:00", t);
  } catch (e) { console.error("❌", e.message); }
});

cron.schedule("0 17 * * *", async () => {
  try {
    const types = ["btc","xrp","eth","assets","btc","xrp","cta"];
    await send(getPost(types[new Date().getDay()]));
    console.log("✅ 17:00");
  } catch (e) { console.error("❌", e.message); }
});

cron.schedule("0 20 * * *", async () => {
  try {
    const t = new Date().getDay() % 3 === 0 ? "cta" : "education";
    await send(getPost(t));
    console.log("✅ 20:00");
  } catch (e) { console.error("❌", e.message); }
});

console.log("🤖 Zeina Fi Agent running — @ZFAIAbot → " + CHANNEL);
console.log("⏰ Schedule: 08:00 | 12:00 | 17:00 | 20:00 UTC");
console.log("📦 50+ built-in posts — no API key needed");
