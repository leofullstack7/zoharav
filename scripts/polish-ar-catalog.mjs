/**
 * Completes missing ar-catalog entries and applies brand/glossary fixes.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enList = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "en-strings.json"), "utf8"),
);
const outPath = path.join(root, "content", "translations", "ar-catalog.json");
const catalog = JSON.parse(fs.readFileSync(outPath, "utf8"));

/** Professional MSA for strings that failed machine translation (429). */
const manual = {
  "We work with chief executives on transformation strategies that improve position and resilience in resource and industrial markets. The work is the strategy and the change itself.":
    "نعمل مع الرؤساء التنفيذيين على استراتيجيات تحول تعزّز المكانة والمرونة في أسواق الموارد والصناعة. العمل يشمل الاستراتيجية والتغيير ذاته.",
  "We work with oil and gas companies, power generators, manufacturers, and logistics firms that are integrating more responsible energy practices. The work is advisory. We do not operate assets or trade energy products.":
    "نعمل مع شركات النفط والغاز، ومولّدي الكهرباء، والمصنّعين، وشركات الخدمات اللوجستية التي تدمج ممارسات طاقة أكثر مسؤولية. العمل استشاري. لا نشغّل الأصول ولا نتاجر بمنتجات الطاقة.",
  "What credentials and experience back Zoharav's team?":
    "ما الشهادات والخبرات التي يستند إليها فريق Zoharav؟",
  "What guarantees does Zoharav offer regarding consulting results?":
    "ما الضمانات التي تقدّمها Zoharav بشأن نتائج الاستشارة؟",
  "What industries can benefit from your energy transition advisory?":
    "ما القطاعات التي تستفيد من استشاراتكم في تحول الطاقة؟",
  "What is Zoharav's working methodology with corporate clients?":
    "ما منهجية عمل Zoharav مع العملاء من الشركات؟",
  "What is measured is what gets tended.":
    "ما يُقاس هو ما يُعتنى به.",
  "What is the difference between the initial reservation and the complete project?":
    "ما الفرق بين الحجز الأولي والمشروع الكامل؟",
  "What is the scope of Zoharav's strategic consulting services?":
    "ما نطاق خدمات Zoharav للاستشارات الاستراتيجية؟",
  "What kinds of projects do you finance-advise?":
    "ما أنواع المشاريع التي تقدّمون فيها استشارات تمويلية؟",
  "What still holds in ten years.":
    "ما يبقى صالحاً بعد عشر سنوات.",
  "What type of organizations comprise Zoharav's client portfolio?":
    "ما أنواع المنظمات التي تضمّها محفظة عملاء Zoharav؟",
  "When a resource project or its sponsor is under stress, we help restore liquidity, renegotiate the capital structure, and give stakeholders a plan they can monitor.":
    "عندما يكون مشروع موارد أو راعيه تحت ضغط، نساعد على استعادة السيولة، وإعادة التفاوض على هيكل رأس المال، وتقديم خطة يمكن لأصحاب المصلحة متابعتها.",
  "Where the opening actually is.":
    "أين تكمن الفرصة فعلياً.",
  "Where to go, and how to arrive.":
    "إلى أين تتجهون، وكيف تصلون.",
  "Whether the need is a repositioning, an operating redesign, or a renewal, the method is there so the change reaches its aim.":
    "سواء كانت الحاجة إلى إعادة تموضع، أو إعادة تصميم تشغيلي، أو تجديد، فالمنهج موجود كي يبلغ التغيير هدفه.",
  "Which reporting frameworks do you work with?":
    "ما أُطر الإفصاح التي تعملون بها؟",
  "Who is in the room":
    "من في الغرفة",
  "With sponsors, governments, and lenders, we shape financings that are viable, sustainable, and faithful to the project’s economics.":
    "مع الرعاة والحكومات والمقرضين، نشكّل تمويلات قابلة للتطبيق ومستدامة ووفية باقتصاديات المشروع.",
  "Work precise enough for a transaction and calm enough for a long cycle.":
    "عمل دقيق بما يكفي لصفقة، وهادئ بما يكفي لدورة طويلة.",
  "Yes, as advisory on environmental and occupational-safety management systems and on readiness for those standards. We do not claim that Zoharav itself is certified under them, and we are not a certification body.":
    "نعم، استشارة في أنظمة الإدارة البيئية والسلامة المهنية وفي الجاهزية لتلك المعايير. لا ندّعي أن Zoharav نفسها معتمدة بموجبها، وليست جهة اعتماد.",
  "Yes. Market-entry work covers where the opportunity sits, what the regulation requires, and how a partnership should be structured. The client remains the operator or the investor. We remain the advisor.":
    "نعم. عمل دخول السوق يغطي مكان الفرصة، ومتطلبات التنظيم، وكيف يُهيكَل الشريك. يبقى العميل المشغّل أو المستثمر. ونبقى نحن المستشار.",
  "Yes. Social license, community development, and ethical practice sit beside emissions and disclosure. A number without a community is not a strategy.":
    "نعم. الترخيص المجتمعي وتنمية المجتمع والممارسة الأخلاقية تقف إلى جانب الانبعاثات والإفصاح. رقم بلا مجتمع ليس استراتيجية.",
  "Yes. The session is a diagnostic and a proposal. If a mandate follows, the reservation is credited toward it. Financing advice after that point is scoped and contracted on its own terms.":
    "نعم. الجلسة تشخيص ومقترح. إن تلت ذلك تفويض، يُخصم الحجز منه. نصيحة التمويل بعد ذلك تُحدَّد نطاقها وتُتعاقد عليها بشروطها.",
  "Yes. We advise on supply-chain traceability and the standards buyers and financiers expect. We do not certify parcels and we do not intermediate the sale.":
    "نعم. نستشير في تتبّع سلسلة التوريد والمعايير التي يتوقعها المشترون والممولون. لا نعتمد الدفعات ولا نتوسط البيع.",
  "Yes. We align strategies with recognized benchmarks, including the UN Sustainable Development Goals and the EU taxonomy, and with reporting frameworks such as GRI, SASB, TCFD/ISSB, and CSRD where they apply to the mandate.":
    "نعم. نوائم الاستراتيجيات مع معايير معترف بها، بما فيها أهداف التنمية المستدامة للأمم المتحدة وتصنيف الاتحاد الأوروبي، وأُطر إفصاح مثل GRI وSASB وTCFD/ISSB وCSRD حيث تنطبق على التفويض.",
  "Yes. We prepare capital structures, return projections, and risk assessments for clean-energy investments, so sponsors and lenders can judge a project before capital is committed.":
    "نعم. نعد هياكل رأس المال وتوقعات العائد وتقييمات المخاطر لاستثمارات الطاقة النظيفة، كي يحكم الرعاة والمقرضون على المشروع قبل تخصيص رأس المال.",
  "ZOHARAV & CO. advises across eight sectors where natural resources, capital, and policy meet — oil and gas, mining, energy and utilities, manufacturing, logistics, agriculture, financial services, and the public institutions that regulate them. Every mandate draws on the same six advisory lines — energy transition, oil & energy, mining & natural resources, sustainability & ESG, investment & financial advisory, and strategic & operational consulting — applied to the facts of that sector, not offered as a fixed package.":
    "تقدّم ZOHARAV & CO. استشارات عبر ثمانية قطاعات يلتقي فيها الموارد الطبيعية ورأس المال والسياسة — النفط والغاز، والتعدين، والطاقة والمرافق، والتصنيع، واللوجستيات، والزراعة، والخدمات المالية، والمؤسسات العامة المنظِّمة لها. كل تفويض يستند إلى ستة خطوط استشارية واحدة — تحول الطاقة، والنفط والطاقة، والتعدين والموارد الطبيعية، والاستدامة وESG، والاستشارات الاستثمارية والمالية، والاستشارات الاستراتيجية والتشغيلية — مُطبَّقة على واقع ذلك القطاع، لا كحزمة ثابتة.",
  "ZOHARAV & CO. is a global consulting and investment advisory firm specialized in the oil & energy, mining, and natural resources sectors. We connect capital, expertise, and opportunities to create sustainable value across borders.":
    "ZOHARAV & CO. شركة استشارات واستشارات استثمار عالمية متخصصة في قطاعات النفط والطاقة والتعدين والموارد الطبيعية. نربط رأس المال والخبرة والفرص لخلق قيمة مستدامة عبر الحدود.",
  "ZOHARAV & CO. | Global Consulting & Investments":
    "ZOHARAV & CO. | استشارات واستثمارات عالمية",
  "Zoharav advises large corporations and organizations with international operations. Our portfolio has six lines: Energy Transition & Decarbonization, Oil & Energy Advisory, Mining & Natural Resources, Sustainability & ESG, Investment & Financial Advisory, and Strategic & Operational Consulting. Each engagement follows a proven method and a mandate shaped to the organization, with results that are meant to be measured and sustained. We advise. We do not extract, sell, or transport natural resources.":
    "تقدّم Zoharav استشارات للشركات الكبرى والمنظمات ذات العمليات الدولية. محفظتنا ستة خطوط: تحول الطاقة وإزالة الكربون، واستشارات النفط والطاقة، والتعدين والموارد الطبيعية، والاستدامة وESG، والاستشارات الاستثمارية والمالية، والاستشارات الاستراتيجية والتشغيلية. كل تفويض يتبع منهجاً مُجرَّباً وتفويضاً مُصاغاً للمنظمة، بنتائج مُقاسة ومستدامة. نستشير. لا نستخرج ولا نبيع ولا ننقل الموارد الطبيعية.",
  "Zoharav is a business consulting firm.":
    "Zoharav شركة استشارات أعمال.",
  "Zoharav is a business consulting firm. We do not engage in the sale, distribution, supply, marketing, trading, or brokerage of petroleum, gas, or energy products. Furthermore, we do not participate in any activities involving the exploration, extraction, refining, or transportation of petroleum or gas.":
    "Zoharav شركة استشارات أعمال. لا نشارك في بيع أو توزيع أو توريد أو تسويق أو تداول أو وساطة المنتجات البترولية أو الغازية أو منتجات الطاقة. كما لا نشارك في أي أنشطة تتعلق بالاستكشاف أو الاستخراج أو التكرير أو نقل البترول أو الغاز.",
  "Zoharav is a business consulting firm. We do not trade, sell or transport energy products.":
    "Zoharav شركة استشارات أعمال. لا نتاجر ولا نبيع ولا ننقل منتجات الطاقة.",
  "Zoharav serves clients across the Americas, Europe, Asia-Pacific, and the Middle East. A multicultural team and a network of market specialists help us read the regulatory, cultural, and operating particularities of each region. Work is delivered in person or remotely, according to the mandate. Our principal desks are Medellín, Miami, and Puerto Rico.":
    "تخدم Zoharav عملاء في الأمريكتين وأوروبا وآسيا والمحيط الهادئ والشرق الأوسط. فريق متعدد الثقافات وشبكة مختصين بالأسواق تساعدنا على قراءة الخصوصيات التنظيمية والثقافية والتشغيلية لكل منطقة. يُنفَّذ العمل حضورياً أو عن بُعد بحسب التفويض. مكاتبنا الرئيسية في ميديين وMiami وبورتوريكو.",
};

for (const [en, ar] of Object.entries(manual)) {
  catalog[en] = ar;
}

function gloss(value) {
  if (!value) return value;
  let v = value;
  v = v.replace(/زوهاراف/g, "Zoharav");
  v = v.replace(/زوهاراڤ/g, "Zoharav");
  v = v.replace(/زوهارف/g, "Zoharav");
  v = v.replace(/ZOHARAV\s*&\s*CO\./g, "ZOHARAV & CO.");
  v = v.replace(/500 دولار أمريكي/g, "USD $500");
  v = v.replace(/500 دولارًا أمريكيًا/g, "USD $500");
  v = v.replace(/حجز بقيمة 500 دولار أمريكي/g, "حجز بقيمة USD $500");
  v = v.replace(/USD \$500/g, "USD $500");
  v = v.replace(/افتراضيا أو شخصيا/g, "افتراضياً أو حضورياً");
  v = v.replace(/افتراضيًا أو شخصيًا/g, "افتراضياً أو حضورياً");
  return v;
}

for (const key of Object.keys(catalog)) {
  catalog[key] = gloss(catalog[key]);
}

const out = {};
for (const key of enList) {
  if (key === "") {
    out[""] = "";
    continue;
  }
  const val = catalog[key];
  if (!val || !String(val).trim()) {
    console.error("STILL MISSING:", key.slice(0, 80));
    out[key] = "";
    continue;
  }
  out[key] = val;
}

fs.writeFileSync(outPath, JSON.stringify(out));
const missing = enList.filter((k) => k && !out[k]?.trim()).length;
console.log(`keys written: ${Object.keys(out).length}, missing: ${missing}`);