/** 项目案例占位数据（design 定稿，上线前替换为真实经营数据） */

export type ProjectType = '光伏' | '风电' | '储能' | '风光储一体化'
export type BadgeTone = 'gold' | 'volt' | 'storage' | 'hydrogen'

export interface Project {
  id: string
  name: string
  type: ProjectType
  tone: BadgeTone
  province: string
  image: string
  /** 卡片 mono 数据行 */
  keyData: string
  capacity: string
  capacityNote: string
  annualGen: string
  hours: string
  gridYear: string
  co2: string
  highlight: string
  background: string
  deal: string
  operation: string
  /** 点阵地图上的位置（viewBox 1000×760 的百分比） */
  map: { x: number; y: number }
  status: '在运'
}

export const PROJECTS: Project[] = [
  {
    id: 'qinghai-pv',
    name: '青海戈壁光伏基地',
    type: '光伏',
    tone: 'gold',
    province: '青海 · 海西',
    image: '/project-qinghai-pv.jpg',
    keyData: '300MW · 2021 并网',
    capacity: '300',
    capacityNote: 'MW 装机',
    annualGen: '5.4 亿 kWh',
    hours: '1,800 h',
    gridYear: '2021',
    co2: '45 万吨',
    highlight: '高原戈壁上的百万千瓦级基地一期，年等效利用小时居全国光伏项目前列。',
    background:
      '项目位于青海海西州戈壁滩，光照资源一类地区，是国家大型风电光伏基地规划的组成部分。地块平整、接入条件优越，一期 300MW 于 2021 年全容量并网。',
    deal: '泰坦能源于开发中期完成控股收购，采用"并购 + 技改"模式介入：重新谈判组件供货与 EPC 尾款条款，并引入跟踪支架局部改造，建设周期压缩至 11 个月。',
    operation:
      '投运以来年均利用小时约 1,800 小时，电量通过青豫直流外送与省内市场化交易双通道消纳，综合电价优于区域平均。电站已实现无人值守 + 区域集控运营。',
    map: { x: 36.4, y: 44.2 },
    status: '在运',
  },
  {
    id: 'innermongolia-wind',
    name: '内蒙古草原风电场',
    type: '风电',
    tone: 'volt',
    province: '内蒙古 · 乌兰察布',
    image: '/project-innermongolia-wind.jpg',
    keyData: '200MW · 2020 并网',
    capacity: '200',
    capacityNote: 'MW 装机',
    annualGen: '6.2 亿 kWh',
    hours: '3,100 h',
    gridYear: '2020',
    co2: '52 万吨',
    highlight: '辉腾锡勒草原风廊核心区位，3,100 小时等效利用小时的优质风资源资产。',
    background:
      '项目位于乌兰察布辉腾锡勒草原，地处华北重要风廊，70 米年均风速 8.2m/s。200MW 装机配套 220kV 升压站，2020 年建成并网。',
    deal: '项目为在运资产并购：泰坦能源通过股权收购获得 100% 权益，交易定价基于实测风资源数据与剩余补贴回收曲线建模，交割周期 4 个月。',
    operation:
      '并网以来可利用率稳定在 99% 以上，参与蒙西电力现货市场与绿电交易，绿证溢价贡献增量收益。运维采用自主团队 + 厂家长协双轨模式。',
    map: { x: 62.0, y: 34.9 },
    status: '在运',
  },
  {
    id: 'jiangsu-storage',
    name: '江苏电网侧储能电站',
    type: '储能',
    tone: 'storage',
    province: '江苏 · 盐城',
    image: '/project-jiangsu-storage.jpg',
    keyData: '200MWh · 2023 投运',
    capacity: '200',
    capacityNote: 'MWh 容量',
    annualGen: '1.1 亿 kWh',
    hours: '550 次/年',
    gridYear: '2023',
    co2: '—',
    highlight: '参与电网调峰、容量租赁与现货套利的电网侧独立储能示范资产。',
    background:
      '项目位于江苏沿海负荷中心，是省内在运的电网侧独立储能电站之一，100MW/200MWh 磷酸铁锂系统，2023 年投运，接入 220kV 电网。',
    deal: '泰坦能源联合产业资本以股债结合方式投资建设，设备采用头部集成商方案并锁定长协质保，土地与接入手续在建设前全部闭合。',
    operation:
      '电站收入由三部分构成：电网调峰辅助服务、新能源场站容量租赁、以及江苏现货市场峰谷套利。年等效循环约 550 次，综合收益模型持续跑赢可研预期。',
    map: { x: 73.7, y: 52.5 },
    status: '在运',
  },
  {
    id: 'zhejiang-rooftop',
    name: '浙江工商业分布式集群',
    type: '光伏',
    tone: 'gold',
    province: '浙江 · 嘉兴/宁波',
    image: '/project-zhejiang-rooftop.jpg',
    keyData: '50MW · 2017–2019',
    capacity: '50',
    capacityNote: 'MW 装机',
    annualGen: '0.5 亿 kWh',
    hours: '1,050 h',
    gridYear: '2017–2019',
    co2: '4.2 万吨',
    highlight: '30+ 工商业屋顶打包运营的分布式集群，自发自用比例超 80%。',
    background:
      '集群覆盖嘉兴、宁波两地 30 余个工业园区厂房屋顶，总装机 50MW，2017 至 2019 年分批并网，以"自发自用、余电上网"模式服务园区企业。',
    deal: '泰坦能源以区域打包方式分批并购存量屋顶项目，统一重签屋顶租赁与购电协议，将分散小体量资产整合为可融资、可管理的标准化组合。',
    operation:
      '集群自发自用比例超过 80%，电价折扣模式锁定长期现金流。区域运维中心实现 2 小时响应圈，年均故障停机时间低于 0.5%。',
    map: { x: 73.7, y: 63.2 },
    status: '在运',
  },
  {
    id: 'guangdong-offshore',
    name: '广东近海风电项目',
    type: '风电',
    tone: 'volt',
    province: '广东 · 阳江',
    image: '/project-guangdong-offshore.jpg',
    keyData: '150MW · 2024 并网',
    capacity: '150',
    capacityNote: 'MW 装机',
    annualGen: '4.5 亿 kWh',
    hours: '3,000 h',
    gridYear: '2024',
    co2: '38 万吨',
    highlight: '南海晨雾中的近海风电场，泰坦首个海风资产，打开南方海域布局。',
    background:
      '项目位于广东阳江近海海域，装机 150MW，采用大兆瓦抗台机组，2024 年全容量并网，是泰坦能源在海上风电领域的首个在运资产。',
    deal: '项目以在建工程并购方式介入，泰坦能源在基础施工完成阶段进入，承接后续吊装与并网管理，有效控制海风建设高峰期成本。',
    operation:
      '投运首年等效利用小时约 3,000 小时，电量参与广东电力市场交易。抗台设计与海缆冗余配置在当年台风季通过实战检验，可利用率 98.6%。',
    map: { x: 64.9, y: 79.9 },
    status: '在运',
  },
  {
    id: 'gansu-hybrid',
    name: '甘肃风光储一体化基地',
    type: '风光储一体化',
    tone: 'hydrogen',
    province: '甘肃 · 酒泉',
    image: '/project-gansu-hybrid.jpg',
    keyData: '400MW · 2022',
    capacity: '400',
    capacityNote: 'MW 装机',
    annualGen: '9.0 亿 kWh',
    hours: '2,250 h',
    gridYear: '2022',
    co2: '75 万吨',
    highlight: '河西走廊风光储同场一体化基地，储能平滑出力后外送曲线接近基荷。',
    background:
      '基地位于甘肃河西走廊，300MW 风电 + 100MW 光伏 + 60MWh 储能同场建设，2022 年整体投运，通过酒湖特高压通道外送华中负荷中心。',
    deal: '泰坦能源作为控股股东牵头项目重组，整合原开发主体资源，引入储能系统供应商战略投资，实现"风光储"统一规划、统一建设、统一运营。',
    operation:
      '储能系统按调度指令平滑出力、参与调峰，外送曲线波动率下降 60% 以上。基地同步开展绿电交易与碳资产管理，年减排约 75 万吨 CO₂。',
    map: { x: 40.8, y: 38.4 },
    status: '在运',
  },
]

export const PROJECT_TABS: Array<'全部' | ProjectType> = [
  '全部',
  '光伏',
  '风电',
  '储能',
  '风光储一体化',
]

/** 汇总数据条（占位） */
export const SUMMARY_STATS = [
  { value: 1.2, decimals: 1, suffix: 'GW+', label: '总装机容量' },
  { value: 18, decimals: 0, suffix: '亿 kWh', label: '年发电量' },
  { value: 45, decimals: 0, suffix: '亿元', label: '累计投资' },
  { value: 150, decimals: 0, suffix: '万吨', label: '年减排 CO₂' },
  { value: 99.2, decimals: 1, suffix: '%', label: '平均可利用率' },
]
