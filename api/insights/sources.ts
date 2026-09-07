// 国内政策源定义
// cms-json：新华社 xhcloud CMS（政府站群通用），列表页 HTML 内含
//   data="datasource:<32位hex>" preview="ds_"，数据在 ./ds_<id>.json
// html-links：直接解析列表页 <a> 链接（title 属性或链接文本作为标题）

export interface PolicySource {
  name: string;
  listUrl: string;
  type: "cms-json" | "html-links";
}

export const POLICY_SOURCES: PolicySource[] = [
  {
    name: "国家能源局·最新文件",
    listUrl: "https://www.nea.gov.cn/policy/zxwj.htm",
    type: "cms-json",
  },
  {
    name: "国家能源局·项目核准",
    listUrl: "https://www.nea.gov.cn/policy/xmsp.htm",
    type: "cms-json",
  },
  {
    name: "国家核安全局",
    listUrl: "https://nnsa.mee.gov.cn/",
    type: "html-links",
  },
];

/** 标题关键词 → 分类（顺序即优先级，命中即停） */
export const CATEGORY_RULES: [RegExp, string][] = [
  [/核安全|核安保|辐射安全|核设施安全|核材料管制/, "nuclear"],
  [/核电|核准.*机组|机组.*核准|核电机组|小型堆|核反应堆/, "nuclear"],
  [/光伏|太阳能|钙钛矿|硅片|组件|分布式发电/, "solar"],
  [/风电|海上风电|陆上风电|风机|风能/, "wind"],
  [/储能|液流电池|固态电池|钠离子|锂离子|锂电池|压缩空气|飞轮|抽水蓄能/, "storage"],
  [/氢能|绿氢|电解槽|燃料电池|制氢|加氢站/, "hydrogen"],
  [/新材料|复合材料|薄膜材料/, "other"],
];

export function classifyTitle(title: string): string | null {
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(title)) return cat;
  }
  return null;
}
