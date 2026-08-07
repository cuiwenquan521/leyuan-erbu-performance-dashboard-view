const DATE_KEY = "order-performance-dashboard-date-v2";
const GROUP_RANGE_KEY = "order-performance-dashboard-group-range-v1";
const STAFF_ROSTER = [
  { department: "乐源二部", name: "储玉岳" },
];
const PRODUCT_CATEGORIES = [
  { label: "洗护", pattern: /婴幼儿桃叶精华|幼然婴幼儿舒润|婴幼儿保湿霜/, hint: "婴幼儿桃叶精华、幼然婴幼儿舒润、婴幼儿保湿霜" },
  { label: "营养包", pattern: /多种维生素矿物质|妈妈钙/, hint: "多种维生素矿物质、妈妈钙" },
  { label: "益生菌", pattern: /益生菌/, hint: "产品名包含“益生菌”" },
  { label: "乳糖酶", pattern: /乳糖酶/, hint: "产品名包含“乳糖酶”" },
  { label: "DHA", pattern: /DHA/i, hint: "产品名包含“DHA”" },
  { label: "海藻钙", pattern: /海藻钙/, hint: "产品名包含“海藻钙”" },
  { label: "乳铁蛋白", pattern: /乳铁蛋白/, hint: "产品名包含“乳铁蛋白”" },
  { label: "接骨木莓", pattern: /接骨木莓/, hint: "产品名包含“接骨木莓”" },
  { label: "气血饮大盒", pattern: /高良姜礼盒手提袋|高良姜血蛋白多肽植物饮品\s*25\s*ml\s*[×x*]\s*60|L[-\s]?GLJ[-\s]?B\s*[（(]60[）)]/i, hint: "高良姜礼盒手提袋 350g、高良姜血蛋白多肽植物饮品 25mL×60（L-GLJ-D + L-GLJ-B（60）按同订单合并）" },
  { label: "气血饮小盒", pattern: /高良姜血蛋白多肽植物饮品\s*350\s*ml\s*[（(]25\s*ml\s*[×x*]\s*14\s*瓶[）)]|^L[-\s]?GLJ[-\s]?B$/i, hint: "高良姜血蛋白多肽植物饮品 350ml（25ml×14瓶），ERP 简称 L-GLJ-B" },
  { label: "减脂饮", pattern: /柑橘橘皮膳食纤维饮\s*500\s*mL\s*[（(]50\s*mL\s*[/／]袋\s*[＊*×x]\s*10\s*袋[）)]|^ZYSL-GJY$/i, hint: "柑橘橘皮膳食纤维饮 500mL（50mL/袋×10袋），ERP 简称 ZYSL-GJY；按订单编号去重" },
  { label: "胶原蛋白", pattern: /胶原蛋白(?!肽菁萃饮品)/, hint: "其他产品名包含“胶原蛋白”的产品，不含胶原蛋白青萃饮" },
  { label: "胶原蛋白青萃饮", pattern: /胶原蛋白肽菁萃饮品\s*350\s*ml\s*[（(]25\s*ml\s*[/／]\s*瓶\s*[×x*]\s*14\s*瓶[）)]|^L-CP-B$/i, hint: "胶原蛋白肽菁萃饮品 350ml（25ml/瓶×14瓶），ERP 简称 L-CP-B" },
  { label: "鲑鱼精", pattern: /固蕊鲑鱼精红石榴后生元凝胶糖果\s*21克\s*[（(]0\.7克\s*[×x*]\s*30粒[）)]|^S-GRH-G$/i, hint: "固蕊鲑鱼精红石榴后生元凝胶糖果 21克（0.7克×30粒），ERP 简称 S-GRH-G" },
];

function matchesProductCategory(category, product) {
  const name = String(product?.name || "");
  const code = String(product?.code || "");
  return category.pattern.test(name) || category.pattern.test(code);
}

const elements = {
  date: document.querySelector("#reportDate"),
  windowLabel: document.querySelector("#windowLabel"),
  connect: document.querySelector("#connectButton"),
  refresh: document.querySelector("#refreshButton"),
  source: document.querySelector("#sourceBadge"),
  updated: document.querySelector("#lastUpdated"),
  notice: document.querySelector("#notice"),
  noticeTitle: document.querySelector("#noticeTitle"),
  noticeText: document.querySelector("#noticeText"),
  reportTitle: document.querySelector("#reportTitle"),
  reportSubtitle: document.querySelector("#reportSubtitle"),
  archiveState: document.querySelector("#archiveState"),
  staffCount: document.querySelector("#staffCount"),
  orderCount: document.querySelector("#orderCount"),
  gross: document.querySelector("#grossPerformance"),
  refund: document.querySelector("#refundTotal"),
  net: document.querySelector("#netPerformance"),
  reportBody: document.querySelector("#reportBody"),
  empty: document.querySelector("#emptyState"),
  productKinds: document.querySelector("#productKinds"),
  productNetAverage: document.querySelector("#productNetAverage"),
  focusProductCount: document.querySelector("#focusProductCount"),
  overallRefundRate: document.querySelector("#overallRefundRate"),
  productMonth: document.querySelector("#productMonth"),
  allocationState: document.querySelector("#allocationState"),
  productBody: document.querySelector("#productBody"),
  productTotals: document.querySelector("#productTotals"),
  productMonthlySummary: document.querySelector("#productMonthlySummary"),
  staffNetAverage: document.querySelector("#staffNetAverage"),
  topStaffNet: document.querySelector("#topStaffNet"),
  teamOrderAverage: document.querySelector("#teamOrderAverage"),
  staffComparison: document.querySelector("#staffComparison"),
  staffAnalysisPeriod: document.querySelector("#staffAnalysisPeriod"),
  groupMonth: document.querySelector("#groupMonth"),
  groupPrefixFilter: document.querySelector("#groupPrefixFilter"),
  groupStartMonth: document.querySelector("#groupStartMonth"),
  groupEndMonth: document.querySelector("#groupEndMonth"),
  applyGroupRange: document.querySelector("#applyGroupRange"),
  useGroupJoinMonth: document.querySelector("#useGroupJoinMonth"),
  syncGroupRange: document.querySelector("#syncGroupRange"),
  syncGroupOrders: document.querySelector("#syncGroupOrders"),
  saveGroupAssignments: document.querySelector("#saveGroupAssignments"),
  groupDataState: document.querySelector("#groupDataState"),
  groupAssignmentBody: document.querySelector("#groupAssignmentBody"),
  groupConfigOrdersLabel: document.querySelector("#groupConfigOrdersLabel"),
  groupConfigValueLabel: document.querySelector("#groupConfigValueLabel"),
  configuredGroupCount: document.querySelector("#configuredGroupCount"),
  groupTotalValue: document.querySelector("#groupTotalValue"),
  groupAverageValue: document.querySelector("#groupAverageValue"),
  groupAverageOrders: document.querySelector("#groupAverageOrders"),
  groupComparison: document.querySelector("#groupComparison"),
  groupEmployeeAiAnalysis: document.querySelector("#groupEmployeeAiAnalysis"),
  groupStaffNames: document.querySelector("#groupStaffNames"),
  reportMonth: document.querySelector("#reportMonth"),
  teamTarget: document.querySelector("#teamTarget"),
  saveTargets: document.querySelector("#saveTargets"),
  monthlyGross: document.querySelector("#monthlyGross"),
  monthlyNet: document.querySelector("#monthlyNet"),
  monthlyTarget: document.querySelector("#monthlyTarget"),
  monthlyCompletion: document.querySelector("#monthlyCompletion"),
  monthlyOrdersProducts: document.querySelector("#monthlyOrdersProducts"),
  monthlyArchiveCount: document.querySelector("#monthlyArchiveCount"),
  monthlyTargetBody: document.querySelector("#monthlyTargetBody"),
  monthlyRankingSubtitle: document.querySelector("#monthlyRankingSubtitle"),
  monthlyRankingHead: document.querySelector("#monthlyRankingHead"),
  monthlyRankingBody: document.querySelector("#monthlyRankingBody"),
  phaseMonth: document.querySelector("#phaseMonth"),
  firstDayStart: document.querySelector("#firstDayStart"),
  cutoffTime: document.querySelector("#cutoffTime"),
  savePhaseSettings: document.querySelector("#savePhaseSettings"),
  phaseWindowHint: document.querySelector("#phaseWindowHint"),
  phasePeak: document.querySelector("#phasePeak"),
  phasePeakDate: document.querySelector("#phasePeakDate"),
  phaseChart: document.querySelector("#phaseChart"),
  phaseArchiveCount: document.querySelector("#phaseArchiveCount"),
  phaseTableHead: document.querySelector("#phaseTableHead"),
  phaseTableBody: document.querySelector("#phaseTableBody"),
  phaseTableFoot: document.querySelector("#phaseTableFoot"),
  archiveBody: document.querySelector("#archiveBody"),
  archiveEmpty: document.querySelector("#archiveEmpty"),
  archiveScheduleDescription: document.querySelector("#archiveScheduleDescription"),
  annualYear: document.querySelector("#annualYear"),
  syncAnnualPerformance: document.querySelector("#syncAnnualPerformance"),
  annualNet: document.querySelector("#annualNet"),
  annualMonthCount: document.querySelector("#annualMonthCount"),
  annualActiveCount: document.querySelector("#annualActiveCount"),
  annualFormerNet: document.querySelector("#annualFormerNet"),
  annualDataState: document.querySelector("#annualDataState"),
  annualMonthBody: document.querySelector("#annualMonthBody"),
  annualMonthFoot: document.querySelector("#annualMonthFoot"),
  toggleFormerStaff: document.querySelector("#toggleFormerStaff"),
  annualStaffHead: document.querySelector("#annualStaffHead"),
  annualStaffBody: document.querySelector("#annualStaffBody"),
  annualStaffFoot: document.querySelector("#annualStaffFoot"),
  autoScheduleText: document.querySelector("#autoScheduleText"),
  toast: document.querySelector("#toast"),
};

let currentRecords = [];
let currentSource = "演示数据";
let currentArchive = null;
let currentReport = null;
let monthlyReport = null;
let monthlyTargets = { teamTarget: 0, staffTargets: {} };
let monthlyRankMode = "performance";
let phaseReport = null;
let groupOrderSnapshot = { month: "", updatedAt: "", orders: [] };
let groupAssignments = { assignments: [] };
let groupRangeActive = false;
let annualReport = null;
let showFormerStaff = false;
let reportSettings = { firstDayStart: "00:00", cutoffTime: "18:00", autoDelayMinutes: 5 };
let archivesMeta = [];
let toastTimer;
let lastObservedAutoSync = "";
let partialSyncIntervalMinutes = 3;
let publicViewOnly = false;

function targetsEditable() {
  return !publicViewOnly || Boolean(window.STATIC_ARCHIVE_MODE && window.STATIC_USER_ROLE === "admin");
}

function groupAssignmentsEditable() {
  return !publicViewOnly || Boolean(window.STATIC_ARCHIVE_MODE && window.STATIC_USER_ROLE === "admin");
}

function staffWithRoster(staff) {
  const rows = [...staff];
  const names = new Set(rows.map(person => person.name));
  STAFF_ROSTER.forEach(person => {
    if (names.has(person.name)) return;
    rows.push({
      name: person.name,
      department: person.department,
      orders: new Set(),
      orderCount: 0,
      productCount: 0,
      gross: 0,
      refund: 0,
      net: 0,
      products: new Map(),
    });
  });
  return rows.sort((left, right) => right.net - left.net || right.orderCount - left.orderCount || left.name.localeCompare(right.name, "zh-CN"));
}

const demoData = [];

function localDateString(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function normalizeDateValue(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s].*)?$/)
    || raw.match(/^(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?$/)
    || raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const selected = new Date(year, month - 1, day, 12);
  if (selected.getFullYear() !== year || selected.getMonth() !== month - 1 || selected.getDate() !== day) return "";
  return localDateString(selected);
}

function reportWindow(dateString) {
  dateString = normalizeDateValue(dateString) || localDateString();
  const selected = new Date(`${dateString}T12:00:00`);
  const end = `${dateString} ${reportSettings.cutoffTime}:00`;
  const monthStart = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
  const firstReportingDay = monthStart.getDay() === 0 ? 2 : 1;
  if (selected.getDate() === firstReportingDay) {
    const firstDate = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-01`;
    return { start: `${firstDate} ${reportSettings.firstDayStart}:00`, end };
  }
  const previous = new Date(selected);
  previous.setDate(previous.getDate() - (selected.getDay() === 1 ? 2 : 1));
  return { start: `${localDateString(previous)} ${reportSettings.cutoffTime}:00`, end };
}

function normalizeReportingDate(dateString) {
  const normalized = normalizeDateValue(dateString) || localDateString();
  const selected = new Date(`${normalized}T12:00:00`);
  if (selected.getDay() !== 0) return normalized;
  selected.setDate(selected.getDate() + 1);
  return localDateString(selected);
}

function shortWindow(window) {
  const format = value => {
    const [date, time] = value.split(" ");
    const [, month, day] = date.split("-").map(Number);
    return `${month}月${day}日 ${time.slice(0, 5)}`;
  };
  return `${format(window.start)} - ${format(window.end)}`;
}

function amount(value) {
  const parsed = Number(String(value ?? 0).replace(/[¥￥,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function cents(value) { return amount(value) / 100; }
function firstValue(object, keys) {
  for (const key of keys) if (object?.[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
  return undefined;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function currency(value) {
  const numeric = amount(value);
  const rounded = Math.round((numeric + Math.sign(numeric || 1) * 1e-9) * 100) / 100;
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 2 }).format(rounded);
}

function percent(value) { return `${(Number.isFinite(value) ? value * 100 : 0).toFixed(1)}%`; }

function normalizeTime(value) {
  return String(value || "").replace("T", " ").slice(0, 19);
}

function productName(product, code) {
  if (typeof product === "string") return /[\u3400-\u9fff]/.test(product) ? product : `中文名称待匹配（${product}）`;
  const preferred = ["productName", "productSkuName", "skuName", "skuTypeName", "goodsName", "productTitle", "name", "productSimpleName"];
  for (const key of preferred) {
    const value = String(product?.[key] || "").trim();
    if (/[\u3400-\u9fff]/.test(value)) return value;
  }
  for (const value of Object.values(product || {})) {
    if (typeof value === "string" && /[\u3400-\u9fff]/.test(value) && value.length < 80) return value;
  }
  return `中文名称待匹配（${code || "未知编码"}）`;
}

function normalizeProducts(value) {
  const items = Array.isArray(value) ? value : String(value || "").split(/[|,，;；、]+/).filter(Boolean);
  return items.map((item, index) => {
    if (typeof item === "string") {
      const code = item.trim();
      return { name: productName(code, code), code, quantity: 1, lineGross: null, index };
    }
    const code = String(firstValue(item, ["productShortName", "skuCode", "productSku", "productCode", "skuId", "productSkuId", "code"]) || "").trim();
    const quantityValue = firstValue(item, ["purchaseQuantity", "quantity", "productQuantity", "buyCount", "count", "num"]);
    const quantity = quantityValue === undefined ? 1 : Math.max(0, amount(quantityValue));
    const directGross = firstValue(item, ["sellerReceivable", "lineAmount", "actualAmount"]);
    const centGross = firstValue(item, ["orderSellerReceivable", "productPayAmount", "payAmount", "totalPrice"]);
    return {
      name: productName(item, code),
      code,
      quantity,
      lineGross: directGross !== undefined ? amount(directGross) : centGross !== undefined ? cents(centGross) : null,
      index,
    };
  }).filter(item => item.name);
}

function normalizeRecord(record, index) {
  const directGross = firstValue(record, ["sellerReceivable", "performance", "业绩金额", "商家实收金额"]);
  const centGross = firstValue(record, ["orderSellerReceivable", "promotePerformance", "orderPayAmount"]);
  const directRefund = firstValue(record, ["refundAmount", "退款金额"]);
  const centRefund = firstValue(record, ["orderRefundAmount"]);
  const gross = directGross !== undefined ? amount(directGross) : cents(centGross);
  const refund = directRefund !== undefined ? amount(directRefund) : cents(centRefund);
  return {
    recordId: String(firstValue(record, ["recordId", "performanceFlowId", "flowId"]) || firstValue(record, ["orderNumber", "orderId"]) || `ROW-${index + 1}`),
    orderNumber: String(firstValue(record, ["orderNumber", "orderId", "订单号", "订单编号"]) || `ROW-${index + 1}`),
    orderTime: normalizeTime(firstValue(record, ["orderTime", "createTime", "下单时间", "订单时间"])),
    waiterName: String(firstValue(record, ["waiterName", "serviceName", "服务人员", "服务人员姓名"]) || "未填写"),
    department: String(firstValue(record, ["waiterDepartment", "departmentName", "部门"]) || "未分配部门"),
    products: normalizeProducts(firstValue(record, ["orderProducts", "products", "订单产品", "产品"])),
    gross,
    refund,
    performanceType: Number(record.performanceType || 0),
    countAsOrder: record.countAsOrder !== false && refund <= 0,
  };
}

function prepareOrders(records, window) {
  const unique = new Map();
  records.map(normalizeRecord).filter(order => order.orderTime >= window.start && order.orderTime < window.end).forEach(order => {
    if (!unique.has(order.recordId)) { unique.set(order.recordId, order); return; }
    const existing = unique.get(order.recordId);
    const productKeys = new Set(existing.products.map(product => `${product.name}|${product.code}|${product.quantity}`));
    order.products.forEach(product => {
      const key = `${product.name}|${product.code}|${product.quantity}`;
      if (!productKeys.has(key)) existing.products.push(product);
    });
    existing.gross = Math.max(existing.gross, order.gross);
    existing.refund = Math.max(existing.refund, order.refund);
  });

  return [...unique.values()].map(order => {
    if (order.products.length === 0) order.products = [{ name: "未识别中文产品", code: "", quantity: 1, lineGross: null }];
    const explicitTotal = order.products.reduce((sum, product) => sum + (product.lineGross || 0), 0);
    const quantityTotal = order.products.reduce((sum, product) => sum + product.quantity, 0);
    order.products = order.products.map(product => {
      const weight = explicitTotal > 0 ? (product.lineGross || 0) / explicitTotal : quantityTotal > 0 ? product.quantity / quantityTotal : 1 / order.products.length;
      return { ...product, allocatedGross: order.gross * weight, allocatedRefund: order.refund * weight, allocatedNet: (order.gross - order.refund) * weight, estimated: explicitTotal <= 0 && (order.gross > 0 || order.refund > 0) };
    });
    return order;
  });
}

function buildReportForWindow(records, window) {
  const orders = prepareOrders(records, window);
  const people = new Map();
  const products = new Map();
  const orderGroups = new Map();
  let estimatedProducts = false;

  orders.filter(order => order.countAsOrder).forEach(order => {
    if (!orderGroups.has(order.orderNumber)) orderGroups.set(order.orderNumber, []);
    orderGroups.get(order.orderNumber).push(order);
  });
  const orderOwners = new Map([...orderGroups].map(([orderNumber, candidates]) => {
    const ranked = [...candidates].sort((left, right) => {
      const leftPriority = left.performanceType === 1 ? 0 : left.gross > 0 ? 1 : 2;
      const rightPriority = right.performanceType === 1 ? 0 : right.gross > 0 ? 1 : 2;
      return leftPriority - rightPriority || right.gross - left.gross || left.orderTime.localeCompare(right.orderTime) || left.waiterName.localeCompare(right.waiterName, "zh-CN");
    });
    return [orderNumber, ranked[0]?.waiterName || "未填写"];
  }));
  const ordersWithOriginalPerformance = new Set([...orderGroups].filter(([, candidates]) => candidates.some(order => order.performanceType === 1)).map(([orderNumber]) => orderNumber));
  const businessOrders = new Set(orderOwners.keys());

  orders.forEach(order => {
    if (!people.has(order.waiterName)) people.set(order.waiterName, { name: order.waiterName, department: order.department, orders: new Set(), productCount: 0, gross: 0, refund: 0, net: 0, products: new Map() });
    const person = people.get(order.waiterName);
    const ownsOrder = order.countAsOrder && orderOwners.get(order.orderNumber) === order.waiterName;
    const countsProductQuantity = order.countAsOrder && (ordersWithOriginalPerformance.has(order.orderNumber) ? order.performanceType === 1 : ownsOrder);
    if (ownsOrder) {
      person.orders.add(order.orderNumber);
    }
    person.gross += order.gross;
    person.refund += order.refund;
    person.net += order.gross - order.refund;

    order.products.forEach(product => {
      estimatedProducts ||= product.estimated;
      const countedQuantity = countsProductQuantity ? product.quantity : 0;
      person.productCount += countedQuantity;
      const personProduct = person.products.get(product.name) || { quantity: 0, net: 0 };
      personProduct.quantity += countedQuantity;
      personProduct.net += product.allocatedNet;
      person.products.set(product.name, personProduct);

      const item = products.get(product.name) || { name: product.name, codes: new Set(), orders: new Set(), quantity: 0, gross: 0, refund: 0, net: 0, staff: new Map() };
      if (product.code) item.codes.add(product.code);
      if (order.countAsOrder) item.orders.add(order.orderNumber);
      item.quantity += countedQuantity;
      item.gross += product.allocatedGross;
      item.refund += product.allocatedRefund;
      item.net += product.allocatedNet;
      const staffItem = item.staff.get(order.waiterName) || { name: order.waiterName, orders: new Set(), quantity: 0, gross: 0, refund: 0, net: 0 };
      if (ownsOrder) staffItem.orders.add(order.orderNumber);
      staffItem.quantity += countedQuantity;
      staffItem.gross += product.allocatedGross;
      staffItem.refund += product.allocatedRefund;
      staffItem.net += product.allocatedNet;
      item.staff.set(order.waiterName, staffItem);
      products.set(product.name, item);
    });
  });

  const staff = [...people.values()].map(person => ({ ...person, orderCount: person.orders.size })).sort((a, b) => b.net - a.net || a.name.localeCompare(b.name, "zh-CN"));
  const productList = [...products.values()].map(item => ({ ...item, orderCount: item.orders.size, refundRate: item.gross > 0 ? item.refund / item.gross : 0 }));
  const totals = orders.reduce((sum, order) => ({ gross: sum.gross + order.gross, refund: sum.refund + order.refund, net: sum.net + order.gross - order.refund }), { gross: 0, refund: 0, net: 0 });
  const productNetAverage = productList.length ? totals.net / productList.length : 0;
  const productOrderAverage = productList.length ? productList.reduce((sum, item) => sum + item.orderCount, 0) / productList.length : 0;
  const orderCount = businessOrders.size;
  const orderNetAverage = orderCount ? totals.net / orderCount : 0;
  const overallRefundRate = totals.gross > 0 ? totals.refund / totals.gross : 0;

  productList.forEach(item => {
    const itemOrderNet = item.orderCount ? item.net / item.orderCount : 0;
    if (item.net >= productNetAverage && item.orderCount >= productOrderAverage) item.analysis = { type: "focus", text: "重点售卖方向" };
    else if (item.refundRate > Math.max(.1, overallRefundRate * 1.2)) item.analysis = { type: "warning", text: "退款率偏高，检查退款原因" };
    else if (item.orderCount < productOrderAverage) item.analysis = { type: "warning", text: "订单量低于均值，检查触达与推荐频次" };
    else if (itemOrderNet < orderNetAverage) item.analysis = { type: "warning", text: "单均净值偏低，检查组合与客单价" };
    else item.analysis = { type: "", text: "接近团队均值" };
  });
  productList.sort((a, b) => b.net - a.net || b.orderCount - a.orderCount);

  return { window, orders, orderCount, staff, products: productList, totals, productNetAverage, orderNetAverage, overallRefundRate, estimatedProducts };
}

function buildReport(records, dateString) {
  return buildReportForWindow(records, reportWindow(dateString));
}

function render() {
  const date = elements.date.value;
  const report = buildReport(currentRecords, date);
  currentReport = report;
  elements.windowLabel.textContent = shortWindow(report.window);
  elements.reportTitle.textContent = `${date} 人员明细`;
  elements.reportSubtitle.textContent = `${shortWindow(report.window)}，不与其他统计日叠加`;
  elements.staffCount.textContent = report.staff.length;
  elements.orderCount.textContent = report.orderCount;
  elements.gross.textContent = currency(report.totals.gross);
  elements.refund.textContent = currency(report.totals.refund);
  elements.net.textContent = currency(report.totals.net);

  elements.reportBody.innerHTML = report.staff.map(person => {
    const productTags = [...person.products.entries()].sort((a, b) => b[1].net - a[1].net).map(([name, data]) => `<span class="product-tag">${escapeHtml(name)} × ${data.quantity} · ${escapeHtml(currency(data.net))}</span>`).join("");
    return `<tr><td><div class="staff-cell"><span class="avatar">${escapeHtml(person.name.slice(0, 1))}</span><span>${escapeHtml(person.name)}</span></div></td><td class="number">${person.orderCount}</td><td class="number">${person.productCount}</td><td><div class="products">${productTags}</div></td><td class="number">${currency(person.gross)}</td><td class="number refund-amount">${currency(person.refund)}</td><td class="number net-amount">${currency(person.net)}</td></tr>`;
  }).join("");
  elements.empty.hidden = report.staff.length > 0;

  const analysisReport = monthlyReport || report;
  const focusCount = analysisReport.products.filter(item => item.analysis.type === "focus").length;
  elements.productKinds.textContent = analysisReport.products.length;
  elements.productNetAverage.textContent = currency(analysisReport.productNetAverage);
  elements.focusProductCount.textContent = focusCount;
  elements.overallRefundRate.textContent = percent(analysisReport.overallRefundRate);
  const analysisMonth = analysisReport.month || date.slice(0, 7);
  elements.allocationState.textContent = `${analysisMonth.replace("-", "年")}月｜${shortWindow(monthWindow(analysisMonth))} · ${analysisReport.estimatedProducts ? "含估算净值" : "ERP 流水金额"}`;
  elements.productBody.innerHTML = analysisReport.products.map((product, index) => {
    const staffDetails = [...product.staff.values()].sort((a, b) => b.net - a.net).map(item => `<div><span>${escapeHtml(item.name)}</span><strong>${item.orders.size} 单 / ${item.quantity} 件</strong><span>业绩 ${currency(item.gross)}</span><strong class="net-amount">净值 ${currency(item.net)}</strong></div>`).join("");
    return `<tr><td><button class="details-toggle" type="button" data-product-toggle="${index}" aria-expanded="false" title="查看员工产品明细">＋</button><span class="product-name">${escapeHtml(product.name)}</span>${product.codes.size ? `<span class="product-code">${escapeHtml([...product.codes].join(" / "))}</span>` : ""}</td><td class="number">${product.orderCount}</td><td class="number">${product.quantity}</td><td class="number">${currency(product.gross)}</td><td class="number refund-amount">${currency(product.refund)}</td><td class="number net-amount">${currency(product.net)}</td><td><span class="analysis-label ${product.analysis.type}">${escapeHtml(product.analysis.text)}</span></td></tr><tr class="detail-row" data-product-detail="${index}" hidden><td colspan="7"><div class="detail-panel"><h3>员工销售明细</h3><div class="detail-grid">${staffDetails}</div></div></td></tr>`;
  }).join("") || `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon" aria-hidden="true">月</div><strong>${escapeHtml(analysisMonth.replace("-", "年"))}月暂无产品数据</strong><span>该月份尚未生成每日存档，后续存档后会自动纳入月度产品分析。</span></div></td></tr>`;
  const totalQuantity = analysisReport.products.reduce((sum, product) => sum + product.quantity, 0);
  elements.productTotals.innerHTML = analysisReport.products.length
    ? `<tr><td><strong>本月合计（${analysisReport.products.length} 种）</strong></td><td class="number" title="整月去重订单数">${analysisReport.orderCount}</td><td class="number">${plainNumber(totalQuantity)}</td><td class="number">${currency(analysisReport.totals.gross)}</td><td class="number refund-amount">${currency(analysisReport.totals.refund)}</td><td class="number net-amount">${currency(analysisReport.totals.net)}</td><td>完整月汇总</td></tr>`
    : "";
  renderProductMonthlySummary(analysisReport, analysisMonth);

  const staffAverage = analysisReport.staff.length ? analysisReport.totals.net / analysisReport.staff.length : 0;
  const topNet = analysisReport.staff[0]?.net || 0;
  elements.staffNetAverage.textContent = currency(staffAverage);
  elements.topStaffNet.textContent = currency(topNet);
  elements.teamOrderAverage.textContent = currency(analysisReport.orderNetAverage);
  elements.staffAnalysisPeriod.textContent = `${analysisMonth.replace("-", "年")}月完整月累计`;
  if (analysisReport.staff.length) {
    const categoryColumns = PRODUCT_CATEGORIES;
    const categoryCounts = new Map(analysisReport.staff.map(person => {
      const personOrders = analysisReport.orders.filter(order => order.waiterName === person.name && order.countAsOrder);
      const counts = categoryColumns.map(category => {
        const { label } = category;
        const orderNumbers = new Set(personOrders.filter(order => (order.products || []).some(product => matchesProductCategory(category, product))).map(order => order.orderNumber));
        return [label, orderNumbers.size];
      });
      return [person.name, { counts: new Map(counts) }];
    }));
    const categoryStats = new Map(categoryColumns.map(({ label }) => {
      const values = analysisReport.staff.map(person => categoryCounts.get(person.name).counts.get(label) || 0);
      return [label, { average: values.reduce((sum, value) => sum + value, 0) / values.length, maximum: Math.max(...values) }];
    }));
    const headers = categoryColumns.map(({ label, hint }) => `<th class="matrix-product-head"><span>${escapeHtml(label)}</span><span class="matrix-info" title="按订单号去重；包含：${escapeHtml(hint)}" aria-label="${escapeHtml(label)}匹配规则">!</span></th>`).join("");
    const rows = analysisReport.staff.map(person => {
      const detail = categoryCounts.get(person.name);
      const cells = categoryColumns.map(({ label }) => {
        const quantity = detail.counts.get(label) || 0;
        const stats = categoryStats.get(label);
        const state = stats.maximum > 0 && quantity === stats.maximum ? " product-leader" : quantity < stats.average ? " product-below" : "";
        return `<td class="number matrix-product-value${state}" title="${escapeHtml(label)}：${quantity} 个订单；人员均值 ${plainNumber(stats.average, 1)} 个订单">${quantity}</td>`;
      }).join("");
      return `<tr><td class="matrix-fixed matrix-name"><strong>${escapeHtml(person.name)}</strong></td><td class="matrix-fixed matrix-department">${escapeHtml(person.department)}</td><td class="number matrix-order-count">${person.orderCount}</td><td class="number matrix-total-performance net-amount">${currency(person.net)}</td>${cells}</tr>`;
    }).join("");
    const averages = categoryColumns.map(({ label }) => `<td class="number matrix-average-value">${plainNumber(categoryStats.get(label).average, 1)}</td>`).join("");
    const tableWidth = 480 + categoryColumns.length * 118;
    elements.staffComparison.innerHTML = `<table class="staff-matrix-table staff-product-template-table" style="min-width:${tableWidth}px"><thead><tr><th class="matrix-fixed matrix-name">姓名</th><th class="matrix-fixed matrix-department">部门</th><th class="number">本月订单数</th><th class="number">本月总业绩</th>${headers}</tr></thead><tbody>${rows}</tbody><tfoot><tr><td class="matrix-fixed matrix-name"><strong>人员均值</strong></td><td class="matrix-fixed matrix-department"></td><td class="number">${plainNumber(analysisReport.staff.reduce((sum, person) => sum + person.orderCount, 0) / analysisReport.staff.length, 1)}</td><td class="number net-amount">${currency(analysisReport.staff.reduce((sum, person) => sum + person.net, 0) / analysisReport.staff.length)}</td>${averages}</tr></tfoot></table>`;
  } else {
    elements.staffComparison.innerHTML = '<div class="empty-state"><div class="empty-icon">人</div><strong>暂无员工数据</strong></div>';
  }

  elements.archiveState.textContent = currentArchive ? `已存档 · ${formatDateTime(currentArchive.updatedAt)}` : "当前为未存档数据";
  elements.archiveState.classList.toggle("saved", Boolean(currentArchive));
}

function renderProductMonthlySummary(report, month) {
  const products = report.products || [];
  const monthLabel = `${month.replace("-", "年")}月`;
  if (!products.length) {
    elements.productMonthlySummary.innerHTML = `<div class="product-ai-heading"><h3>${escapeHtml(monthLabel)}产品 AI 总结</h3><p>该月暂无产品数据，暂不能生成分析结论。</p></div>`;
    return;
  }
  const focus = products.filter(product => product.analysis.type === "focus").slice(0, 5);
  const refundRisks = [...products].filter(product => product.refund > 0).sort((left, right) => right.refundRate - left.refundRate || right.refund - left.refund).slice(0, 4);
  const refundNames = new Set(refundRisks.map(product => product.name));
  const opportunities = products.filter(product => product.analysis.type === "warning" && !refundNames.has(product.name)).sort((left, right) => left.orderCount - right.orderCount || left.net - right.net).slice(0, 5);
  const topProduct = products[0];
  const topShare = report.totals.net > 0 ? topProduct.net / report.totals.net : 0;
  const focusText = focus.length
    ? focus.map(product => `${product.name}（${product.quantity}件，净值${currency(product.net)}）`).join("；")
    : "本月暂无同时高于产品净值均值和订单均值的产品。";
  const refundText = refundRisks.length
    ? refundRisks.map(product => `${product.name}（退款率${percent(product.refundRate)}）`).join("；")
    : "本月产品暂无退款记录。";
  const opportunityText = opportunities.length
    ? opportunities.map(product => `${product.name}（${product.analysis.text}）`).join("；")
    : "其余产品整体接近团队均值。";
  const recommendations = [];
  if (focus.length) recommendations.push(`优先复盘“${focus[0].name}”的成交人员、客户需求和组合方式，并复制到同类产品。`);
  if (topShare >= .35) recommendations.push(`“${topProduct.name}”贡献本月${percent(topShare)}净值，产值集中度较高，建议同步培养第二重点产品。`);
  if (report.overallRefundRate > .1) recommendations.push(`整体退款率为${percent(report.overallRefundRate)}，建议优先核对退款产品的订单原因和售前匹配。`);
  else if (refundRisks.length) recommendations.push("整体退款率可控，但仍需逐单复盘退款率靠前的产品。");
  if (opportunities.length) recommendations.push("低订单产品建议从客户需求匹配、触达频次和关联组合三个方向逐项验证。");
  elements.productMonthlySummary.innerHTML = `<div class="product-ai-heading"><h3>${escapeHtml(monthLabel)}产品 AI 总结</h3><p>依据本月订单数、件数、净值与退款率自动归纳</p></div><div class="product-ai-grid"><div><strong>重点售卖产品</strong><p>${escapeHtml(focusText)}</p></div><div><strong>退款关注产品</strong><p>${escapeHtml(refundText)}</p></div><div><strong>增长机会产品</strong><p>${escapeHtml(opportunityText)}</p></div><div><strong>本月行动建议</strong><p>${escapeHtml(recommendations.join(" ") || "保持当前产品结构，并持续复盘高净值订单。")}</p></div></div>`;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("zh-CN", { hour12: false });
}

function scheduledSyncTime() {
  const [hour, minute] = reportSettings.cutoffTime.split(":").map(Number);
  const total = hour * 60 + minute + reportSettings.autoDelayMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function setConnection(connected) {
  elements.notice.classList.toggle("connected", connected);
  elements.noticeTitle.textContent = connected ? "ERP 已连接，只读保护生效" : "当前未连接 ERP";
  const schedule = scheduledSyncTime();
  elements.noticeText.textContent = connected ? `运行期间约每 ${partialSyncIntervalMinutes} 分钟补拉当前统计日；每天 ${schedule} 最终同步并存档，也可随时手动刷新。` : `请保持 ERP 登录有效；启动后约每 ${partialSyncIntervalMinutes} 分钟补拉，每天 ${schedule} 执行最终同步。`;
  elements.autoScheduleText.textContent = `刷新方式：约每 ${partialSyncIntervalMinutes} 分钟自动补拉 + 每天 ${schedule} 最终同步 + 手动刷新`;
  elements.archiveScheduleDescription.textContent = `约每 ${partialSyncIntervalMinutes} 分钟自动补拉；每天 ${schedule} 最终同步并覆盖该统计日最新快照`;
}

function setPublicViewOnly(enabled) {
  publicViewOnly = Boolean(enabled);
  const canEditTargets = targetsEditable();
  const canEditGroups = groupAssignmentsEditable();
  document.body.classList.toggle("public-view-only", publicViewOnly);
  document.body.classList.toggle("cloud-targets-editable", publicViewOnly && canEditTargets);
  [elements.connect, elements.refresh, elements.savePhaseSettings].forEach(control => {
    if (control) control.hidden = publicViewOnly;
  });
  [elements.syncGroupOrders, elements.syncGroupRange].forEach(control => {
    if (control) control.hidden = publicViewOnly;
  });
  if (elements.saveGroupAssignments) elements.saveGroupAssignments.hidden = publicViewOnly && !canEditGroups;
  if (elements.syncAnnualPerformance) elements.syncAnnualPerformance.hidden = publicViewOnly;
  if (elements.saveTargets) elements.saveTargets.hidden = publicViewOnly && !canEditTargets;
  if (elements.teamTarget) elements.teamTarget.disabled = !canEditTargets;
  document.querySelectorAll(".target-input").forEach(input => {
    input.disabled = !canEditTargets;
  });
  document.querySelectorAll("#firstDayStart, #cutoffTime").forEach(input => {
    input.disabled = publicViewOnly;
  });
  if (publicViewOnly) {
    elements.notice.classList.add("connected");
    elements.noticeTitle.textContent = window.STATIC_ARCHIVE_MODE ? "云端加密存档" : "公网只读查看";
    elements.noticeText.textContent = window.STATIC_ARCHIVE_MODE
      ? canEditTargets
        ? "同步电脑约每 3 分钟发布最新 ERP 存档；点击右上角“获取最新数据”可立即检查，月度目标和群维护配置可按权限保存。"
        : "同步电脑约每 3 分钟发布最新 ERP 加密存档；点击右上角“获取最新数据”可立即检查。"
      : "数据由本机 ERP 只读服务同步，当前链接不能连接、刷新或修改数据。";
  }
}

function setSource(source, updatedAt) {
  currentSource = source;
  const live = source.includes("ERP");
  elements.source.textContent = source;
  elements.source.classList.toggle("demo", !live);
  elements.updated.textContent = updatedAt ? `ERP同步时间：${formatDateTime(updatedAt)}` : "尚未同步";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  let body = {};
  try { body = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(body.message || `请求失败（${response.status}）`);
    error.status = response.status;
    throw error;
  }
  return body;
}

async function checkStatus() {
  try {
    const status = await fetchJson("/api/status");
    partialSyncIntervalMinutes = Number(status.autoSync?.partialIntervalMinutes) || partialSyncIntervalMinutes;
    setConnection(status.connected);
    setPublicViewOnly(status.publicViewOnly);
    return status;
  } catch {
    elements.noticeTitle.textContent = "只读连接服务未启动";
    elements.noticeText.textContent = "请使用 start-dashboard.ps1 启动新版页面服务。";
    return { connected: false };
  }
}

async function watchScheduledSync() {
  try {
    const status = await fetchJson("/api/status");
    const completedAt = status.autoSync?.lastSuccessAt || "";
    if (!completedAt || completedAt === lastObservedAutoSync) return;
    lastObservedAutoSync = completedAt;
    const syncDate = status.autoSync.lastAttemptDate;
    await loadArchives();
    if (syncDate === elements.date.value) {
      await openArchive(syncDate, { activate: false, notify: false });
      await loadMonthlyReport();
      showToast("ERP 自动补拉已完成，页面数据已更新");
    }
  } catch {}
}

async function connectErp() {
  elements.connect.disabled = true;
  try {
    const result = await fetchJson("/api/connect", { method: "POST", body: "{}" });
    setConnection(result.connected);
    showToast(result.connected ? "已识别 ERP 登录状态" : "请在弹出的 ERP 窗口中完成登录");
    return result;
  } catch (error) {
    if (String(error.message).includes("Failed to fetch")) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const status = await checkStatus();
      if (status.connected) { showToast("ERP 已连接"); return status; }
    }
    showToast(`连接失败：${error.message}`);
    return null;
  }
  finally { elements.connect.disabled = false; }
}

async function refreshErp() {
  elements.refresh.disabled = true;
  elements.refresh.classList.add("is-refreshing");
  try {
    const date = normalizeReportingDate(elements.date.value);
    elements.date.value = date;
    localStorage.setItem(DATE_KEY, date);
    const archive = await fetchJson("/api/sync", { method: "POST", body: JSON.stringify({ date }) });
    currentRecords = archive.records;
    currentArchive = archive;
    setSource(archive.source || "ERP 个人业绩流水", archive.updatedAt);
    setConnection(true);
    render();
    await loadArchives();
    await loadMonthlyReport();
    elements.groupMonth.value = date.slice(0, 7);
    groupRangeActive = false;
    await loadGroupAnalysis();
    showToast(archive.warning || `ERP同步完成：${formatDateTime(archive.updatedAt)}，读取 ${archive.flowCount} 条流水，按订单号去重为 ${archive.orderCount} 单`);
    return archive;
  } catch (error) {
    if (error.status === 401) setConnection(false);
    showToast(`刷新失败：${error.message}`);
    return null;
  } finally {
    elements.refresh.disabled = false;
    elements.refresh.classList.remove("is-refreshing");
  }
}

function monthWindow(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return { start: `${month}-01 00:00:00`, end: `${month}-${String(lastDay).padStart(2, "0")} 23:59:59` };
}

async function loadMonthlyReport() {
  const month = elements.reportMonth.value;
  if (!month) return;
  elements.productMonth.value = month;
  try {
    if (!archivesMeta.length) await loadArchives();
    const metas = archivesMeta.filter(archive => archive.date.startsWith(month) && isReportingDate(archive.date));
    const [targets, ...archives] = await Promise.all([
      fetchJson(`/api/targets?month=${encodeURIComponent(month)}`),
      ...metas.map(meta => fetchJson(`/api/archive/${encodeURIComponent(meta.date)}`)),
    ]);
    monthlyTargets = targets;
    const records = archives.flatMap(archive => archive.records || []);
    monthlyReport = buildReportForWindow(records, monthWindow(month));
    monthlyReport.staff = staffWithRoster(monthlyReport.staff);
    monthlyReport.month = month;
    monthlyReport.archiveCount = archives.length;
    renderMonthly();
    render();
    if (elements.groupMonth.value === month) await loadGroupAnalysis();
  } catch (error) { showToast(`月度汇总失败：${error.message}`); }
}

function renderMonthly() {
  if (!monthlyReport) return;
  const report = monthlyReport;
  const teamTarget = amount(monthlyTargets.teamTarget);
  elements.teamTarget.value = teamTarget || "";
  elements.monthlyGross.textContent = currency(report.totals.gross);
  elements.monthlyNet.textContent = currency(report.totals.net);
  elements.monthlyTarget.textContent = teamTarget ? currency(teamTarget) : "未设置";
  elements.monthlyCompletion.textContent = teamTarget ? percent(report.totals.net / teamTarget) : "未设置";
  elements.monthlyOrdersProducts.textContent = `${report.orderCount} / ${report.staff.reduce((sum, person) => sum + person.productCount, 0)}`;
  elements.monthlyArchiveCount.textContent = `${report.archiveCount} 个统计日存档`;

  elements.monthlyTargetBody.innerHTML = report.staff.map(person => {
    const target = amount(monthlyTargets.staffTargets?.[person.name]);
    const completion = target ? person.net / target : null;
    return `<tr><td><div class="staff-cell"><span class="avatar">${escapeHtml(person.name.slice(0, 1))}</span>${escapeHtml(person.name)}</div></td><td>${escapeHtml(person.department)}</td><td class="number">${person.orderCount}</td><td class="number net-amount">${currency(person.net)}</td><td class="number target-cell"><input class="target-input" type="number" min="0" step="1000" data-target-staff="${escapeHtml(person.name)}" value="${target || ""}" placeholder="未设置" ${targetsEditable() ? "" : "disabled"} /></td><td class="number completion-value">${completion === null ? "未设置" : percent(completion)}</td></tr>`;
  }).join("");
  renderMonthlyRanking();
}

function groupOrderNet(order) {
  return amount(order.sellerReceivable) - amount(order.refundAmount);
}

function normalizeGroupPrefix(prefix) {
  const value = String(prefix || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!value || value === "*" || value === "全部群号") return "";
  if (value === "其他") return value;
  return value.replace(/\*+$/, "");
}

function matchesGroupPrefix(groupNumber, prefix) {
  const normalizedPrefix = normalizeGroupPrefix(prefix);
  const normalizedGroup = String(groupNumber || "").trim().toUpperCase();
  if (!normalizedPrefix) return true;
  if (normalizedPrefix === "其他") return !/^[A-Z]/.test(normalizedGroup);
  return normalizedGroup.startsWith(normalizedPrefix);
}

function groupMonthSequence(startMonth, endMonth) {
  const startParts = String(startMonth).split("-").map(Number);
  const endParts = String(endMonth).split("-").map(Number);
  const validMonth = (value, parts) => /^\d{4}-\d{2}$/.test(value) && parts[0] >= 2020 && parts[0] <= 2100 && parts[1] >= 1 && parts[1] <= 12;
  if (!validMonth(startMonth, startParts) || !validMonth(endMonth, endParts) || startMonth > endMonth) {
    throw new Error("请选择有效的累计开始月份和结束月份");
  }
  const months = [];
  let [year, month] = startParts;
  const [endYear, endMonthNumber] = endParts;
  while (year < endYear || (year === endYear && month <= endMonthNumber)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    if (months.length > 12) throw new Error("累计区间最多选择 12 个月");
    month += 1;
    if (month > 12) { year += 1; month = 1; }
  }
  return months;
}

function mergeGroupOrderSnapshots(snapshots, months) {
  const orders = new Map();
  snapshots.forEach(snapshot => (snapshot.orders || []).forEach(order => orders.set(order.orderKey, order)));
  const syncedMonths = snapshots.filter(snapshot => snapshot.updatedAt).map(snapshot => snapshot.month);
  return {
    month: months.length === 1 ? months[0] : months.at(-1),
    startMonth: months[0],
    endMonth: months.at(-1),
    updatedAt: snapshots.map(snapshot => snapshot.updatedAt || "").sort().at(-1) || "",
    orders: [...orders.values()],
    syncedMonths,
    missingMonths: months.filter(month => !syncedMonths.includes(month)),
  };
}

function groupPeriodLabel(snapshot = groupOrderSnapshot) {
  const start = snapshot.startMonth || snapshot.month;
  const end = snapshot.endMonth || snapshot.month;
  if (!start) return "尚未选择月份";
  const display = month => `${month.slice(0, 4)}年${month.slice(5)}月`;
  return start === end ? display(start) : `${display(start)} - ${display(end)}`;
}

function mergeProductsIntoCategories(products) {
  const categories = new Map(PRODUCT_CATEGORIES.map(({ label }) => [label, { name: label, quantity: 0, value: 0 }]));
  products.forEach(product => {
    const category = PRODUCT_CATEGORIES.find(category => matchesProductCategory(category, product));
    if (!category) return;
    const item = categories.get(category.label);
    item.quantity += Math.max(0, amount(product.quantity));
    item.value += amount(product.value);
  });
  return new Map([...categories].filter(([, product]) => product.quantity > 0 || Math.abs(product.value) > .001));
}

function buildGroupReport(prefix = "") {
  const orders = Array.isArray(groupOrderSnapshot.orders) ? groupOrderSnapshot.orders : [];
  const assignments = Array.isArray(groupAssignments.assignments) ? groupAssignments.assignments : [];
  const configured = assignments.filter(item => item.groupNumber && item.employeeName && matchesGroupPrefix(item.groupNumber, prefix));
  const groups = configured.map(assignment => ({
    ...assignment,
    memberCount: Math.max(0, Math.trunc(amount(assignment.memberCount))),
    orders: new Set(),
    monthOrders: new Set(),
    value: 0,
    monthValue: 0,
    products: new Map(),
    monthProducts: new Map(),
  }));
  const byNumber = new Map(groups.map(group => [group.groupNumber, group]));
  orders.forEach(order => {
    const group = byNumber.get(order.groupNumber);
    if (!group) return;
    const net = groupOrderNet(order);
    group.orders.add(order.orderKey);
    group.value += net;
    const isCurrentMonth = String(order.orderTime || "").slice(0, 7) === elements.groupMonth.value;
    if (isCurrentMonth) {
      group.monthOrders.add(order.orderKey);
      group.monthValue += net;
    }
    const products = Array.isArray(order.products) ? order.products : [];
    const totalWeight = products.reduce((sum, product) => sum + Math.max(0, amount(product.apportionedAmount)), 0)
      || products.reduce((sum, product) => sum + Math.max(0, amount(product.quantity)), 0);
    products.forEach(product => {
      const weight = Math.max(0, amount(product.apportionedAmount)) || Math.max(0, amount(product.quantity));
      const allocated = totalWeight ? net * weight / totalWeight : 0;
      const item = group.products.get(product.name) || { name: product.name, quantity: 0, value: 0 };
      item.quantity += Math.max(0, amount(product.quantity));
      item.value += allocated;
      group.products.set(product.name, item);
      if (isCurrentMonth) {
        const monthItem = group.monthProducts.get(product.name) || { name: product.name, quantity: 0, value: 0 };
        monthItem.quantity += Math.max(0, amount(product.quantity));
        monthItem.value += allocated;
        group.monthProducts.set(product.name, monthItem);
      }
    });
  });
  const total = groups.reduce((sum, group) => sum + group.value, 0);
  const average = groups.length ? total / groups.length : 0;
  const averageOrders = groups.length ? groups.reduce((sum, group) => sum + group.orders.size, 0) / groups.length : 0;
  groups.forEach(group => {
    group.products = mergeProductsIntoCategories(group.products);
    group.monthProducts = mergeProductsIntoCategories(group.monthProducts);
    group.productQuantity = [...group.products.values()].reduce((sum, product) => sum + product.quantity, 0);
    group.productTypes = [...group.products.values()].filter(product => product.quantity > 0).length;
    group.developmentRate = group.memberCount > 0 ? group.orders.size / group.memberCount * 100 : null;
  });
  const productNames = PRODUCT_CATEGORIES.map(({ label }) => label);
  groups.forEach(group => { group.productShare = productNames.length ? group.productTypes / productNames.length * 100 : 0; });
  const productStats = new Map(productNames.map(name => {
    const quantities = groups.map(group => group.products.get(name)?.quantity || 0);
    return [name, {
      average: groups.length ? quantities.reduce((sum, value) => sum + value, 0) / groups.length : 0,
      maximum: Math.max(0, ...quantities),
    }];
  }));
  const ratedGroups = groups.filter(group => group.developmentRate !== null);
  const averageDevelopmentRate = ratedGroups.length ? ratedGroups.reduce((sum, group) => sum + group.developmentRate, 0) / ratedGroups.length : null;
  const averageProductShare = groups.length ? groups.reduce((sum, group) => sum + group.productShare, 0) / groups.length : 0;
  return { groups: groups.sort((left, right) => right.value - left.value), total, average, averageOrders, averageDevelopmentRate, averageProductShare, productNames, productStats };
}

function groupSuggestion(group, report) {
  const messages = [];
  if (group.value < report.average) messages.push(`群总产值低于群均值 ${currency(report.average - group.value)}`);
  else if (group.value === Math.max(...report.groups.map(item => item.value))) messages.push("所选区间群总产值排名第一，可复盘成交路径并复制到其他群");
  if (group.orders.size < report.averageOrders) messages.push(`群订单数低于均值 ${plainNumber(report.averageOrders, 1)} 单，建议检查活跃人数、触达频次和转化跟进`);
  if (!group.memberCount) messages.push("尚未填写群人数，暂时无法计算群内开发率");
  else if (report.averageDevelopmentRate !== null && group.developmentRate < report.averageDevelopmentRate) messages.push(`群内开发率低于群均值 ${plainNumber(report.averageDevelopmentRate, 1)}%，建议检查群活跃度和订单转化`);
  if (group.productShare < report.averageProductShare) messages.push(`产品开发占比低于群均值 ${plainNumber(report.averageProductShare, 1)}%，建议增加未覆盖单品的需求沟通`);
  const weak = report.productNames.filter(name => (group.products.get(name)?.quantity || 0) < report.productStats.get(name).average).slice(0, 4);
  if (weak.length) messages.push(`低于单品均值：${weak.join("、")}；建议核对客户需求匹配、产品讲解和组合推荐`);
  const products = [...group.products.values()].sort((left, right) => right.value - left.value);
  if (products[0] && group.value > 0 && products[0].value / group.value > .65) messages.push(`产值较集中于“${products[0].name}”，建议增加关联产品开发，降低单品依赖`);
  if (!messages.length) messages.push("群产值和产品开发接近或高于均值，建议保持触达节奏并复盘高产单品话术");
  return `AI分析建议（基于所选区间数据）\n${messages.join("\n")}`;
}

function groupProductSalesDirection(productName) {
  const name = String(productName || "");
  if (/DHA|藻油/i.test(name)) {
    return "DHA方向：先确认宝宝年龄、日常饮食和家长关注点，再讲清原料来源、产品规格、食用方式与保存方法；使用乐米倍优官方产品图、标签和资质材料，成交后回访食用便利度，不使用“提高智力、治疗或预防疾病”等表述。";
  }
  if (/益生菌|乳糖酶/.test(name)) {
    return "肠道营养方向：围绕使用场景、菌株或配方信息、冲调与保存要求做需求匹配；引用乐米倍优官方标签及已授权真实使用反馈，不把食品描述成治疗方案。";
  }
  if (/乳铁蛋白|铁|钙|锌|维生素/.test(name)) {
    return "营养补充方向：先了解现有膳食和同类产品使用情况，重点讲规格、营养成分与食用方法；不替客户诊断缺乏症，不承诺疾病预防或治疗效果。";
  }
  if (/米粉|辅食/.test(name)) {
    return "辅食方向：围绕适用月龄、配料信息、口感与冲调方法沟通，结合官方食用指南做首次尝试和复购回访，避免绝对化宣传。";
  }
  return "销售方向：先用需求问题确认适用场景，再讲清规格、配料或营养信息、食用方法和售后跟进；品牌内容仅使用乐米倍优官方素材、资质信息及已授权真实评价。";
}

function buildEmployeeGroupInsights(report) {
  const employees = new Map();
  report.groups.forEach(group => {
    const employee = employees.get(group.employeeName) || {
      name: group.employeeName,
      groups: 0,
      orders: new Set(),
      value: 0,
      monthValue: 0,
      products: new Map(),
      monthProducts: new Map(),
    };
    employee.groups += 1;
    group.orders.forEach(orderKey => employee.orders.add(orderKey));
    employee.value += group.value;
    employee.monthValue += group.monthValue;
    group.products.forEach(product => {
      const item = employee.products.get(product.name) || { name: product.name, quantity: 0, value: 0 };
      item.quantity += product.quantity;
      item.value += product.value;
      employee.products.set(product.name, item);
    });
    group.monthProducts.forEach(product => {
      const item = employee.monthProducts.get(product.name) || { name: product.name, quantity: 0, value: 0 };
      item.quantity += product.quantity;
      item.value += product.value;
      employee.monthProducts.set(product.name, item);
    });
    employees.set(group.employeeName, employee);
  });
  const rows = [...employees.values()];
  const average = rows.length ? rows.reduce((sum, employee) => sum + employee.value, 0) / rows.length : 0;
  const monthAverage = rows.length ? rows.reduce((sum, employee) => sum + employee.monthValue, 0) / rows.length : 0;
  const leader = rows.reduce((best, employee) => !best || employee.value > best.value ? employee : best, null);
  const monthLeader = rows.reduce((best, employee) => !best || employee.monthValue > best.monthValue ? employee : best, null);
  const productStats = new Map(report.productNames.map(name => {
    const quantities = rows.map(employee => employee.products.get(name)?.quantity || 0);
    const totalValue = rows.reduce((sum, employee) => sum + (employee.products.get(name)?.value || 0), 0);
    const totalQuantity = quantities.reduce((sum, quantity) => sum + quantity, 0);
    return [name, {
      averageQuantity: rows.length ? totalQuantity / rows.length : 0,
      maximumQuantity: Math.max(0, ...quantities),
      unitValue: totalQuantity > 0 ? totalValue / totalQuantity : 0,
      totalValue,
    }];
  }));
  const monthProductStats = new Map(report.productNames.map(name => {
    const quantities = rows.map(employee => employee.monthProducts.get(name)?.quantity || 0);
    const totalValue = rows.reduce((sum, employee) => sum + (employee.monthProducts.get(name)?.value || 0), 0);
    const totalQuantity = quantities.reduce((sum, quantity) => sum + quantity, 0);
    return [name, {
      averageQuantity: rows.length ? totalQuantity / rows.length : 0,
      maximumQuantity: Math.max(0, ...quantities),
      unitValue: totalQuantity > 0 ? totalValue / totalQuantity : 0,
      totalValue,
    }];
  }));
  rows.forEach(employee => {
    const candidates = report.productNames.map(name => {
      const monthlyStats = monthProductStats.get(name);
      const stats = monthlyStats.totalValue > 0 ? monthlyStats : productStats.get(name);
      const source = monthlyStats.totalValue > 0 ? employee.monthProducts : employee.products;
      const current = source.get(name)?.quantity || 0;
      const quantityGap = Math.max(0, stats.averageQuantity - current);
      const score = stats.totalValue * (1 + quantityGap / Math.max(1, stats.averageQuantity));
      return { name, current, quantityGap, ...stats, score };
    }).filter(item => item.unitValue > 0).sort((left, right) => right.score - left.score);
    const priority = candidates.find(item => item.quantityGap > 0) || candidates[0] || null;
    const gapToAverage = Math.max(0, average - employee.value);
    const monthGapToAverage = Math.max(0, monthAverage - employee.monthValue);
    const gapToLeader = leader && leader.name !== employee.name ? Math.max(0, leader.value - employee.value + 0.01) : 0;
    const monthGapToLeader = monthLeader && monthLeader.name !== employee.name ? Math.max(0, monthLeader.monthValue - employee.monthValue + 0.01) : 0;
    employee.gapToAverage = gapToAverage;
    employee.monthGapToAverage = monthGapToAverage;
    employee.gapToLeader = gapToLeader;
    employee.monthGapToLeader = monthGapToLeader;
    employee.priority = priority;
    employee.monthUnitsToAverage = priority && monthGapToAverage > 0 ? Math.ceil(monthGapToAverage / priority.unitValue) : 0;
    employee.monthUnitsToLeader = priority && monthGapToLeader > 0 ? Math.ceil(monthGapToLeader / priority.unitValue) : 0;
    employee.unitsToAverage = priority && gapToAverage > 0 ? Math.ceil(gapToAverage / priority.unitValue) : 0;
    employee.unitsToLeader = priority && gapToLeader > 0 ? Math.ceil(gapToLeader / priority.unitValue) : 0;
  });
  return { rows: rows.sort((left, right) => right.value - left.value), average, monthAverage, leader, monthLeader, productStats, monthProductStats };
}

function renderGroupEmployeeAiAnalysis(report) {
  if (!elements.groupEmployeeAiAnalysis) return;
  if (!report.groups.length) {
    elements.groupEmployeeAiAnalysis.innerHTML = "";
    return;
  }
  const insights = buildEmployeeGroupInsights(report);
  const rows = insights.rows.map(employee => {
    const priority = employee.priority;
    const productName = priority?.name || "暂无可计算单品";
    const productGap = priority ? Math.max(0, Math.ceil(priority.averageQuantity - priority.current)) : 0;
    const targetText = !priority
      ? "当前区间缺少产品明细"
      : employee.monthGapToAverage > 0
        ? `本月优先追 ${productGap || employee.monthUnitsToAverage} 件可补齐该单品均值；按当前净单价测算约 ${employee.monthUnitsToAverage} 件可达本月均值，累计约 ${employee.unitsToAverage || 0} 件可达年度均值`
        : employee.monthGapToLeader > 0
          ? `本月已达到员工均值；按当前净单价测算约 ${employee.monthUnitsToLeader} 件可超过本月第一名，累计距年度第一名仍需约 ${employee.unitsToLeader || 0} 件`
          : "当前排名第一，建议保持主力单品节奏，并复制成交方法到第二增长单品";
    const performance = employee.monthGapToAverage > 0
      ? `本月低于均值 ${currency(employee.monthGapToAverage)}；累计${employee.gapToAverage > 0 ? `低于均值 ${currency(employee.gapToAverage)}` : "已达到均值"}`
      : employee.gapToLeader > 0
        ? `高于均值，距第一名 ${currency(employee.gapToLeader)}`
        : "当前员工群产值第一";
    const direction = priority ? groupProductSalesDirection(priority.name) : "先补齐产品明细，再依据客户需求制定跟进方向。";
    return `<tr><td><strong>${escapeHtml(employee.name)}</strong></td><td class="number">${employee.groups}</td><td class="number">${employee.orders.size}</td><td class="number net-amount">${currency(employee.monthValue)}</td><td class="number net-amount">${currency(employee.value)}</td><td class="group-ai-performance${employee.monthGapToAverage > 0 ? " group-ai-warning" : employee.gapToLeader === 0 ? " group-ai-leading" : ""}">${escapeHtml(performance)}</td><td><strong>${escapeHtml(productName)}</strong>${priority ? `<span>当前 ${plainNumber(priority.current)} 件 · 单月均值 ${plainNumber(priority.averageQuantity, 1)} 件 · 最高 ${plainNumber(priority.maximumQuantity)} 件</span>` : ""}</td><td>${escapeHtml(targetText)}</td><td>${escapeHtml(direction)}</td></tr>`;
  }).join("");
  elements.groupEmployeeAiAnalysis.innerHTML = `<div class="group-ai-heading"><div><h3>员工 AI 业绩分析与跟进建议</h3><p>本月按 ${escapeHtml(elements.groupMonth.value)} 计算单月均值；年度总数据按所选年度、各微信群匹配到的ERP订单计算。推荐单品优先参考本月高产值且员工低于均值的产品。</p></div><span>本月均值 ${currency(insights.monthAverage)} · 年度均值 ${currency(insights.average)} · 年度第一名 ${escapeHtml(insights.leader?.name || "-")} ${currency(insights.leader?.value || 0)}</span></div><div class="table-wrap group-ai-table-wrap"><table class="group-ai-table"><thead><tr><th>员工</th><th class="number">群数</th><th class="number">订单</th><th class="number">本月群产值</th><th class="number">年度群产值</th><th>单月/年度业绩判断</th><th>优先追赶单品</th><th>详细追赶目标</th><th>针对性销售建议</th></tr></thead><tbody>${rows}</tbody></table></div><p class="group-ai-disclaimer">品牌建议原则：优先使用乐米倍优官方产品资料、标签、资质信息和已授权真实评价；不得编造好评，不作疾病治疗、预防或夸大功效承诺。</p>`;
}

function renderGroupAnalysis() {
  const orders = Array.isArray(groupOrderSnapshot.orders) ? groupOrderSnapshot.orders : [];
  const saved = new Map((groupAssignments.assignments || []).map(item => [item.groupNumber, item]));
  const discovered = [...new Set(orders.map(order => order.groupNumber).filter(Boolean))];
  const allGroupNumbers = [...new Set([...saved.keys(), ...discovered])].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const prefixes = [...new Set(allGroupNumbers.map(groupNumber => groupNumber.match(/^[A-Z]{2}/)?.[0] || groupNumber.match(/^[A-Z]/)?.[0] || "其他"))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const previousPrefix = elements.groupPrefixFilter.value;
  const prefixOptions = document.querySelector("#groupPrefixOptions");
  if (prefixOptions) prefixOptions.innerHTML = '<option value="">全部群号</option>' + prefixes.map(prefix => `<option value="${escapeHtml(prefix)}">${escapeHtml(prefix)} 开头</option>`).join("");
  elements.groupPrefixFilter.value = previousPrefix;
  const selectedPrefix = normalizeGroupPrefix(previousPrefix);
  const groupNumbers = allGroupNumbers.filter(groupNumber => matchesGroupPrefix(groupNumber, selectedPrefix));
  const visibleOrders = orders.filter(order => matchesGroupPrefix(order.groupNumber, selectedPrefix));
  const ordersByGroup = new Map();
  orders.forEach(order => {
    if (!ordersByGroup.has(order.groupNumber)) ordersByGroup.set(order.groupNumber, []);
    ordersByGroup.get(order.groupNumber).push(order);
  });
  const latestEmployee = new Map();
  [...orders].sort((a, b) => normalizeTime(a.orderTime).localeCompare(normalizeTime(b.orderTime))).forEach(order => latestEmployee.set(order.groupNumber, order.employeeName));
  const staffNames = [...new Set([...(monthlyReport?.staff || []).map(person => person.name), ...STAFF_ROSTER.map(person => person.name)])].filter(Boolean).sort((a, b) => a.localeCompare(b, "zh-CN"));
  elements.groupStaffNames.innerHTML = staffNames.map(name => `<option value="${escapeHtml(name)}"></option>`).join("");
  const editable = groupAssignmentsEditable();
  const rangeLabel = groupRangeActive ? "年度" : "本月";
  elements.groupConfigOrdersLabel.textContent = `${rangeLabel}订单`;
  elements.groupConfigValueLabel.textContent = `${rangeLabel}群产值`;
  elements.groupAssignmentBody.innerHTML = groupNumbers.map(groupNumber => {
    const setting = saved.get(groupNumber) || { groupNumber, employeeName: latestEmployee.get(groupNumber) || "", memberCount: 0 };
    const groupOrders = ordersByGroup.get(groupNumber) || [];
    const value = groupOrders.reduce((sum, order) => sum + groupOrderNet(order), 0);
    const choices = [...new Set([...staffNames, setting.employeeName].filter(Boolean))].map(name => `<option value="${escapeHtml(name)}"${name === setting.employeeName ? " selected" : ""}>${escapeHtml(name)}${!staffNames.includes(name) ? "（历史人员）" : ""}</option>`).join("");
    const memberCount = Math.max(0, Math.trunc(amount(setting.memberCount)));
    return `<tr data-group-assignment="${escapeHtml(groupNumber)}"><td>${editable ? `<select class="group-input" data-group-employee aria-label="${escapeHtml(groupNumber)} 维护员工"><option value="">未分配</option>${choices}</select>` : `<strong>${escapeHtml(setting.employeeName || "未填写")}</strong>`}</td><td>${editable ? `<input class="group-input group-number-input" data-group-number value="${escapeHtml(groupNumber)}" aria-label="微信群号" />` : `<strong class="group-number">${escapeHtml(groupNumber)}</strong>`}</td><td class="number">${editable ? `<input class="group-input group-member-input" data-group-members type="number" min="0" max="1000000" step="1" value="${memberCount || ""}" placeholder="未填写" aria-label="${escapeHtml(groupNumber)} 好友数量" />` : (memberCount || "-")}</td><td class="number">${new Set(groupOrders.map(order => order.orderKey)).size}</td><td class="number net-amount">${currency(value)}</td></tr>`;
  }).join("") || '<tr><td colspan="5"><div class="empty-state"><strong>本月尚未发现客户微信群号</strong><span>管理员可点击“同步订单管理”读取最新数据。</span></div></td></tr>';

  const report = buildGroupReport(selectedPrefix);
  elements.configuredGroupCount.textContent = report.groups.length;
  elements.groupTotalValue.textContent = currency(report.total);
  elements.groupAverageValue.textContent = currency(report.average);
  elements.groupAverageOrders.textContent = report.averageDevelopmentRate === null ? "-" : `${plainNumber(report.averageDevelopmentRate, 1)}%`;
  const missingText = groupOrderSnapshot.missingMonths?.length ? ` · ${groupOrderSnapshot.missingMonths.length} 个月尚未同步` : "";
  elements.groupDataState.textContent = groupOrderSnapshot.updatedAt
    ? `${selectedPrefix ? `${selectedPrefix} 开头 · ` : ""}${groupPeriodLabel()} · ${formatDateTime(groupOrderSnapshot.updatedAt)} · ${visibleOrders.length} 个有群号订单${missingText}`
    : `尚未同步${groupRangeActive ? "所选区间" : "该月"}订单管理数据`;
  if (!report.groups.length) {
    elements.groupComparison.innerHTML = '<div class="empty-state group-empty"><strong>请先填写维护员工和微信群号</strong><span>保存后会按微信群号匹配ERP订单，并分别展示本月与年度总数据。</span></div>';
    renderGroupEmployeeAiAnalysis(report);
    return;
  }
  const topValue = Math.max(...report.groups.map(group => group.value));
  const headers = report.productNames.map(name => {
    const category = PRODUCT_CATEGORIES.find(item => item.label === name);
    return `<th class="group-product-head"><span>${escapeHtml(name)}</span><span class="matrix-info" title="合并包含：${escapeHtml(category?.hint || name)}" aria-label="${escapeHtml(name)}匹配规则">!</span></th>`;
  }).join("");
  const rows = report.groups.map(group => {
    const totalClass = group.value === topValue && topValue > 0 ? " group-leader" : group.value < report.average ? " group-below" : "";
    const cells = report.productNames.map(name => {
      const product = group.products.get(name) || { quantity: 0, value: 0 };
      const stats = report.productStats.get(name);
      const state = stats.maximum > 0 && product.quantity === stats.maximum ? " group-leader" : product.quantity < stats.average ? " group-below" : "";
      return `<td class="number group-product-cell${state}" title="${escapeHtml(name)}：${plainNumber(product.quantity)} 件，产品产值 ${currency(product.value)}；群均 ${plainNumber(stats.average, 1)} 件">${plainNumber(product.quantity)}</td>`;
    }).join("");
    const insight = groupSuggestion(group, report);
    const rateClass = group.developmentRate !== null && report.averageDevelopmentRate !== null && group.developmentRate < report.averageDevelopmentRate ? " group-below" : "";
    return `<tr><td><strong>${escapeHtml(group.employeeName)}</strong></td><td><strong class="group-number">${escapeHtml(group.groupNumber)}</strong></td><td class="number">${group.memberCount || "-"}</td><td class="number">${group.orders.size}</td><td class="number">${currency(group.monthValue)}</td><td class="number${totalClass}"><button class="group-insight" type="button" title="${escapeHtml(insight)}">${escapeHtml(currency(group.value))}<span aria-hidden="true">i</span></button></td><td class="number">${plainNumber(group.productQuantity)}</td><td class="number">${group.productTypes}</td><td class="number">${plainNumber(group.productShare, 1)}%</td><td class="number${rateClass}" title="年度去重订单数 ${group.orders.size} ÷ 好友数量 ${group.memberCount || "未填写"}">${group.developmentRate === null ? "-" : `${plainNumber(group.developmentRate, 1)}%`}</td>${cells}</tr>`;
  }).join("");
  const averages = report.productNames.map(name => `<td class="number group-average-cell">${plainNumber(report.productStats.get(name).average)}</td>`).join("");
  const tableWidth = 1120 + report.productNames.length * 130;
  const averageQuantity = report.groups.length ? report.groups.reduce((sum, group) => sum + group.productQuantity, 0) / report.groups.length : 0;
  const averageTypes = report.groups.length ? report.groups.reduce((sum, group) => sum + group.productTypes, 0) / report.groups.length : 0;
  const averageMonthValue = report.groups.length ? report.groups.reduce((sum, group) => sum + group.monthValue, 0) / report.groups.length : 0;
  elements.groupComparison.innerHTML = `<div class="group-legend"><span><i class="legend-swatch below"></i>低于均值</span><span><i class="legend-swatch leader"></i>年度第一</span><span>产品列显示件数；累计总业绩可查看群级分析建议</span></div><div class="table-wrap"><table class="group-comparison-table" style="min-width:${tableWidth}px"><thead><tr><th>员工姓名</th><th>微信群</th><th class="number">好友数量</th><th class="number">年度订单</th><th class="number">本月业绩</th><th class="number">年度总业绩</th><th class="number">产品总件数</th><th class="number">开发单品种类</th><th class="number">产品开发占比</th><th class="number">群内开发率</th>${headers}</tr></thead><tbody>${rows}</tbody><tfoot><tr><td></td><td><strong>群均值</strong></td><td></td><td class="number">${plainNumber(report.averageOrders, 1)}</td><td class="number">${currency(averageMonthValue)}</td><td class="number">${currency(report.average)}</td><td class="number">${plainNumber(averageQuantity, 1)}</td><td class="number">${plainNumber(averageTypes, 1)}</td><td class="number">${plainNumber(report.averageProductShare, 1)}%</td><td class="number">${report.averageDevelopmentRate === null ? "-" : `${plainNumber(report.averageDevelopmentRate, 1)}%`}</td>${averages}</tr></tfoot></table></div>`;
  renderGroupEmployeeAiAnalysis(report);
}

function buildAnnualStaffRows(report) {
  const activeByName = new Map((report.activeEmployees || []).map(person => [person.name, person]));
  const rows = new Map([...activeByName].map(([name, person]) => [name, { name, department: person.department || "乐源服务二部", active: true, months: {}, total: 0 }]));
  Object.values(report.months || {}).forEach(month => (month.staff || []).forEach(person => {
    const row = rows.get(person.name) || { name: person.name, department: person.department || "历史部门", active: activeByName.has(person.name), months: {}, total: 0 };
    row.department = activeByName.get(person.name)?.department || person.department || row.department;
    row.months[month.month] = amount(person.net);
    row.total += amount(person.net);
    rows.set(person.name, row);
  }));
  return [...rows.values()].sort((left, right) => Number(right.active) - Number(left.active) || right.total - left.total || left.name.localeCompare(right.name, "zh-CN"));
}

function renderAnnualPerformance() {
  const report = annualReport || { year: Number(elements.annualYear.value), updatedAt: "", activeEmployees: [], months: {} };
  const monthKeys = Array.from({ length: 12 }, (_, index) => `${report.year}-${String(index + 1).padStart(2, "0")}`);
  const availableMonths = monthKeys.filter(month => report.months?.[month]);
  const rows = buildAnnualStaffRows(report);
  const activeRows = rows.filter(person => person.active);
  const formerRows = rows.filter(person => !person.active);
  const annualNet = availableMonths.reduce((sum, month) => sum + amount(report.months[month].net), 0);
  const formerNet = formerRows.reduce((sum, person) => sum + person.total, 0);
  elements.annualNet.textContent = currency(annualNet);
  elements.annualMonthCount.textContent = availableMonths.length;
  elements.annualActiveCount.textContent = activeRows.length;
  elements.annualFormerNet.textContent = currency(formerNet);
  elements.annualDataState.textContent = report.updatedAt ? `${report.year} 年 · ${formatDateTime(report.updatedAt)} · ${report.source}` : "尚未拉取年度数据";
  elements.annualMonthBody.innerHTML = monthKeys.map((month, index) => {
    const item = report.months?.[month];
    return `<tr><td><strong>${index + 1} 月</strong></td><td class="number net-amount">${item ? currency(item.net) : "-"}</td><td class="number">${item ? item.staff.length : "-"}</td></tr>`;
  }).join("");
  elements.annualMonthFoot.innerHTML = `<tr><td><strong>年度汇总（含离职）</strong></td><td class="number net-amount">${currency(annualNet)}</td><td class="number">${rows.length}</td></tr>`;

  elements.toggleFormerStaff.textContent = `${showFormerStaff ? "隐藏" : "显示"}离职人员（${formerRows.length}）`;
  elements.toggleFormerStaff.setAttribute("aria-expanded", String(showFormerStaff));
  elements.toggleFormerStaff.disabled = formerRows.length === 0;
  elements.annualStaffHead.innerHTML = `<tr><th>员工姓名</th><th>人员状态</th><th>所属部门</th>${monthKeys.map((_, index) => `<th class="number">${index + 1} 月</th>`).join("")}<th class="number">年度合计</th></tr>`;
  const visibleRows = showFormerStaff ? rows : activeRows;
  elements.annualStaffBody.innerHTML = visibleRows.map(person => `<tr class="${person.active ? "annual-active-row" : "annual-former-row"}"><td><strong>${escapeHtml(person.name)}</strong></td><td><span class="staff-status ${person.active ? "active" : "former"}">${person.active ? "在岗" : "离职"}</span></td><td title="${escapeHtml(person.department)}">${escapeHtml(person.department)}</td>${monthKeys.map(month => `<td class="number">${report.months?.[month] ? currency(person.months[month] || 0) : "-"}</td>`).join("")}<td class="number net-amount"><strong>${currency(person.total)}</strong></td></tr>`).join("") || '<tr><td colspan="16"><div class="empty-state"><strong>尚无年度人员数据</strong></div></td></tr>';
  elements.annualStaffFoot.innerHTML = `<tr><td><strong>合计（含离职）</strong></td><td></td><td></td>${monthKeys.map(month => `<td class="number">${report.months?.[month] ? currency(report.months[month].net) : "-"}</td>`).join("")}<td class="number">${currency(annualNet)}</td></tr>`;
}

async function loadAnnualPerformance() {
  const year = Number(elements.annualYear.value);
  if (!year) return;
  try {
    annualReport = await fetchJson(`/api/annual-performance?year=${encodeURIComponent(year)}`);
    showFormerStaff = false;
    renderAnnualPerformance();
  } catch (error) { showToast(`年度业绩加载失败：${error.message}`); }
}

async function syncAnnualPerformanceData() {
  const year = Number(elements.annualYear.value);
  elements.syncAnnualPerformance.disabled = true;
  elements.syncAnnualPerformance.classList.add("is-refreshing");
  try {
    annualReport = await fetchJson("/api/annual-sync", { method: "POST", body: JSON.stringify({ year }) });
    showFormerStaff = false;
    renderAnnualPerformance();
    showToast(`${year} 年度业绩已按月拉取完成，共 ${Object.keys(annualReport.months || {}).length} 个月`);
  } catch (error) { showToast(`年度业绩拉取失败：${error.message}`); }
  finally {
    elements.syncAnnualPerformance.disabled = false;
    elements.syncAnnualPerformance.classList.remove("is-refreshing");
  }
}

async function loadGroupAnalysis() {
  try {
    const month = elements.groupMonth.value || elements.reportMonth.value;
    const year = month.slice(0, 4);
    const months = groupRangeActive ? groupMonthSequence(`${year}-01`, `${year}-12`) : groupMonthSequence(month, month);
    const [snapshot, assignments] = await Promise.all([
      Promise.all(months.map(item => fetchJson(`/api/group-orders?month=${encodeURIComponent(item)}`))),
      fetchJson("/api/group-assignments"),
    ]);
    groupOrderSnapshot = mergeGroupOrderSnapshots(snapshot, months);
    groupAssignments = assignments;
    renderGroupAnalysis();
  } catch (error) { showToast(`群产值加载失败：${error.message}`); }
}

async function applyGroupRange() {
  try {
    groupRangeActive = false;
    await loadGroupAnalysis();
    showToast(`已切换到 ${elements.groupMonth.value} 本月数据`);
  } catch (error) { showToast(error.message); }
}

async function applyGroupJoinRange() {
  groupRangeActive = true;
  await loadGroupAnalysis();
  showToast(`已切换到 ${elements.groupMonth.value.slice(0, 4)} 年度群总数据`);
}

async function saveGroupAssignmentSettings() {
  const updates = [...document.querySelectorAll("[data-group-assignment]")].map(row => ({
    groupNumber: row.dataset.groupAssignment,
    employeeName: row.querySelector("[data-group-employee]")?.value.trim() || "",
    memberCount: Math.max(0, Math.trunc(amount(row.querySelector("[data-group-members]")?.value))),
  }));
  const merged = new Map((groupAssignments.assignments || []).map(item => [item.groupNumber, item]));
  updates.forEach(item => {
    const row = document.querySelector(`[data-group-assignment="${CSS.escape(item.groupNumber)}"]`);
    const editedGroupNumber = row?.querySelector("[data-group-number]")?.value.trim() || item.groupNumber;
    if (editedGroupNumber !== item.groupNumber) merged.delete(item.groupNumber);
    merged.set(editedGroupNumber, { ...item, groupNumber: editedGroupNumber });
  });
  const assignments = [...merged.values()];
  elements.saveGroupAssignments.disabled = true;
  try {
    groupAssignments = await fetchJson("/api/group-assignments", { method: "POST", body: JSON.stringify({ assignments }) });
    renderGroupAnalysis();
    showToast("维护员工、微信群和好友数量已保存，群数据已重新计算");
  } catch (error) { showToast(`保存失败：${error.message}`); }
  finally { elements.saveGroupAssignments.disabled = false; }
}

async function syncGroupOrderData() {
  elements.syncGroupOrders.disabled = true;
  elements.syncGroupOrders.classList.add("is-refreshing");
  try {
    groupRangeActive = false;
    groupOrderSnapshot = await fetchJson("/api/group-sync", { method: "POST", body: JSON.stringify({ month: elements.groupMonth.value }) });
    groupOrderSnapshot = mergeGroupOrderSnapshots([groupOrderSnapshot], [elements.groupMonth.value]);
    renderGroupAnalysis();
    showToast(`订单管理同步完成：读取 ${groupOrderSnapshot.orders.length} 个有群号订单`);
  } catch (error) { showToast(`订单管理同步失败：${error.message}`); }
  finally {
    elements.syncGroupOrders.disabled = false;
    elements.syncGroupOrders.classList.remove("is-refreshing");
  }
}

async function syncGroupRangeData() {
  const year = (elements.groupMonth.value || elements.reportMonth.value).slice(0, 4);
  const months = groupMonthSequence(`${year}-01`, `${year}-12`);
  groupRangeActive = true;
  elements.syncGroupRange.disabled = true;
  elements.syncGroupRange.classList.add("is-refreshing");
  const originalText = elements.syncGroupRange.textContent;
  try {
    for (let index = 0; index < months.length; index += 1) {
      elements.syncGroupRange.textContent = `同步 ${index + 1}/${months.length}`;
      await fetchJson("/api/group-sync", { method: "POST", body: JSON.stringify({ month: months[index] }) });
    }
    localStorage.setItem(GROUP_RANGE_KEY, JSON.stringify({ start: months[0], end: months.at(-1) }));
    await loadGroupAnalysis();
    showToast(`累计区间同步完成：${groupPeriodLabel()}，共 ${groupOrderSnapshot.orders.length} 个有群号订单`);
  } catch (error) { showToast(`累计区间同步失败：${error.message}`); }
  finally {
    elements.syncGroupRange.textContent = originalText;
    elements.syncGroupRange.disabled = false;
    elements.syncGroupRange.classList.remove("is-refreshing");
  }
}

function rankCell(index) {
  return `<span class="rank-number ${index < 3 ? "top" : ""}">${index + 1}</span>`;
}

function renderMonthlyRanking() {
  if (!monthlyReport) return;
  const report = monthlyReport;
  if (monthlyRankMode === "performance") {
    elements.monthlyRankingSubtitle.textContent = "按员工净业绩从高到低";
    elements.monthlyRankingHead.innerHTML = "<tr><th>排名</th><th>员工</th><th>部门</th><th class='number'>订单数</th><th class='number'>业绩</th><th class='number'>退款</th><th class='number'>净业绩</th></tr>";
    elements.monthlyRankingBody.innerHTML = report.staff.map((person, index) => `<tr><td>${rankCell(index)}</td><td>${escapeHtml(person.name)}</td><td>${escapeHtml(person.department)}</td><td class="number">${person.orderCount}</td><td class="number">${currency(person.gross)}</td><td class="number refund-amount">${currency(person.refund)}</td><td class="number net-amount">${currency(person.net)}</td></tr>`).join("");
    return;
  }
  if (monthlyRankMode === "completion") {
    const rows = report.staff.map(person => ({ ...person, target: amount(monthlyTargets.staffTargets?.[person.name]) })).filter(person => person.target > 0).map(person => ({ ...person, completion: person.net / person.target })).sort((a, b) => b.completion - a.completion || b.net - a.net);
    elements.monthlyRankingSubtitle.textContent = "仅统计已填写个人目标的员工";
    elements.monthlyRankingHead.innerHTML = "<tr><th>排名</th><th>员工</th><th>部门</th><th class='number'>净业绩</th><th class='number'>个人目标</th><th class='number'>完成率</th></tr>";
    elements.monthlyRankingBody.innerHTML = rows.length ? rows.map((person, index) => `<tr><td>${rankCell(index)}</td><td>${escapeHtml(person.name)}</td><td>${escapeHtml(person.department)}</td><td class="number">${currency(person.net)}</td><td class="number">${currency(person.target)}</td><td class="number completion-value">${percent(person.completion)}</td></tr>`).join("") : '<tr><td colspan="6"><div class="empty-state"><strong>尚未填写个人目标</strong></div></td></tr>';
    return;
  }
  if (monthlyRankMode === "products") {
    const rows = [...report.products].sort((a, b) => b.quantity - a.quantity || b.net - a.net);
    elements.monthlyRankingSubtitle.textContent = "按整月产品销售件数从高到低";
    elements.monthlyRankingHead.innerHTML = "<tr><th>排名</th><th>中文产品名称</th><th class='number'>订单数</th><th class='number'>销售件数</th><th class='number'>业绩</th><th class='number'>退款</th><th class='number'>产品净值</th></tr>";
    elements.monthlyRankingBody.innerHTML = rows.map((product, index) => `<tr><td>${rankCell(index)}</td><td>${escapeHtml(product.name)}</td><td class="number">${product.orderCount}</td><td class="number">${product.quantity}</td><td class="number">${currency(product.gross)}</td><td class="number refund-amount">${currency(product.refund)}</td><td class="number net-amount">${currency(product.net)}</td></tr>`).join("");
    return;
  }

  const departmentByStaff = new Map(report.staff.map(person => [person.name, person.department]));
  const grouped = new Map();
  report.products.forEach(product => product.staff.forEach(item => {
    const department = departmentByStaff.get(item.name) || "未分配部门";
    const key = `${department}|${product.name}`;
    const row = grouped.get(key) || { department, product: product.name, quantity: 0, orders: new Set(), gross: 0, net: 0 };
    row.quantity += item.quantity;
    item.orders.forEach(order => row.orders.add(order));
    row.gross += item.gross;
    row.net += item.net;
    grouped.set(key, row);
  }));
  const rows = [...grouped.values()].sort((a, b) => b.quantity - a.quantity || b.net - a.net);
  elements.monthlyRankingSubtitle.textContent = "按部门与单品销售件数从高到低";
  elements.monthlyRankingHead.innerHTML = "<tr><th>排名</th><th>部门</th><th>中文产品名称</th><th class='number'>订单数</th><th class='number'>销售件数</th><th class='number'>业绩</th><th class='number'>产品净值</th></tr>";
  elements.monthlyRankingBody.innerHTML = rows.map((row, index) => `<tr><td>${rankCell(index)}</td><td>${escapeHtml(row.department)}</td><td>${escapeHtml(row.product)}</td><td class="number">${row.orders.size}</td><td class="number">${row.quantity}</td><td class="number">${currency(row.gross)}</td><td class="number net-amount">${currency(row.net)}</td></tr>`).join("");
}

async function saveMonthlyTargets() {
  if (!monthlyReport) return;
  const staffTargets = {};
  document.querySelectorAll("[data-target-staff]").forEach(input => { staffTargets[input.dataset.targetStaff] = amount(input.value); });
  try {
    monthlyTargets = await fetchJson("/api/targets", { method: "POST", body: JSON.stringify({ month: elements.reportMonth.value, teamTarget: amount(elements.teamTarget.value), staffTargets }) });
    renderMonthly();
    showToast("月度业绩目标已保存");
  } catch (error) { showToast(`保存失败：${error.message}`); }
}

function reportingDays(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1;
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const value = new Date(`${date}T12:00:00`);
    return { date, day, weekday: "日一二三四五六"[value.getDay()], sunday: value.getDay() === 0 };
  }).filter(item => !item.sunday);
}

function isReportingDate(dateString) {
  return new Date(`${dateString}T12:00:00`).getDay() !== 0;
}

function plainNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits }).format(value || 0);
}

async function loadPhaseReport() {
  const month = elements.phaseMonth.value;
  if (!month) return;
  try {
    if (!archivesMeta.length) await loadArchives();
    const metas = archivesMeta.filter(archive => archive.date.startsWith(month) && isReportingDate(archive.date)).sort((a, b) => a.date.localeCompare(b.date));
    const [settings, targets, ...archives] = await Promise.all([
      fetchJson("/api/report-settings"),
      fetchJson(`/api/targets?month=${encodeURIComponent(month)}`),
      ...metas.map(meta => fetchJson(`/api/archive/${encodeURIComponent(meta.date)}`)),
    ]);
    reportSettings = settings;
    monthlyTargets = targets;
    const archiveReports = archives.map(archive => ({
      archive,
      report: buildReportForWindow(archive.records || [], archive.window || reportWindow(archive.date)),
    }));
    const combined = buildReportForWindow(archives.flatMap(archive => archive.records || []), monthWindow(month));
    combined.staff = staffWithRoster(combined.staff);
    phaseReport = { month, days: reportingDays(month), archiveReports, combined };
    renderPhaseReport();
  } catch (error) { showToast(`阶段报表加载失败：${error.message}`); }
}

function renderPhaseChart() {
  const entries = phaseReport.archiveReports.map(({ archive, report }) => ({ date: archive.date, value: report.totals.net }));
  if (!entries.length) {
    elements.phasePeak.textContent = currency(0);
    elements.phasePeakDate.textContent = "暂无数据";
    elements.phaseChart.innerHTML = '<div class="chart-empty">所选月份暂无每日存档</div>';
    return;
  }
  const peak = entries.reduce((best, item) => item.value > best.value ? item : best, entries[0]);
  const average = entries.reduce((sum, item) => sum + item.value, 0) / entries.length;
  elements.phasePeak.textContent = currency(peak.value);
  elements.phasePeakDate.textContent = `${Number(peak.date.slice(5, 7))}月${Number(peak.date.slice(8))}日`;

  const width = 1000, height = 270, left = 60, right = 28, top = 32, bottom = 48;
  const max = Math.max(...entries.map(item => item.value), 1) * 1.15;
  const x = index => entries.length === 1 ? (left + width - right) / 2 : left + index * (width - left - right) / (entries.length - 1);
  const y = value => top + (max - value) / max * (height - top - bottom);
  const points = entries.map((item, index) => [x(index), y(item.value)]);
  let line = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1], current = points[index];
    const middle = (previous[0] + current[0]) / 2;
    line += ` C ${middle} ${previous[1]}, ${middle} ${current[1]}, ${current[0]} ${current[1]}`;
  }
  const baseline = height - bottom;
  const area = `${line} L ${points.at(-1)[0]} ${baseline} L ${points[0][0]} ${baseline} Z`;
  const averageY = y(average);
  const grid = [0, .25, .5, .75, 1].map(rate => {
    const value = max * rate;
    const gridY = y(value);
    return `<line x1="${left}" y1="${gridY}" x2="${width - right}" y2="${gridY}" class="chart-grid"/><text x="${left - 10}" y="${gridY + 4}" text-anchor="end" class="chart-axis">${escapeHtml(plainNumber(value))}</text>`;
  }).join("");
  const dots = entries.map((item, index) => `<g><circle cx="${points[index][0]}" cy="${points[index][1]}" r="${item === peak ? 6 : 4}" class="chart-dot ${item === peak ? "peak" : ""}"><title>${escapeHtml(item.date)} 净业绩 ${escapeHtml(currency(item.value))}</title></circle><text x="${points[index][0]}" y="${baseline + 24}" text-anchor="middle" class="chart-axis">${Number(item.date.slice(8))}日</text>${item === peak ? `<text x="${points[index][0]}" y="${points[index][1] - 13}" text-anchor="middle" class="chart-peak-label">峰值 ${escapeHtml(plainNumber(item.value))}</text>` : ""}</g>`).join("");
  const chartMinWidth = Math.max(720, entries.length * 64);
  elements.phaseChart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" style="min-width:${chartMinWidth}px" role="img" aria-label="${escapeHtml(phaseReport.month)} 月净业绩趋势"><defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4d9b87" stop-opacity=".34"/><stop offset="1" stop-color="#4d9b87" stop-opacity=".03"/></linearGradient></defs>${grid}<path d="${area}" class="chart-area"/><line x1="${left}" y1="${averageY}" x2="${width - right}" y2="${averageY}" class="chart-average"/><text x="${width - right}" y="${averageY - 7}" text-anchor="end" class="chart-average-label">均值 ${escapeHtml(plainNumber(average))}</text><path d="${line}" class="chart-line"/>${dots}</svg>`;
  requestAnimationFrame(() => {
    const peakIndex = entries.indexOf(peak);
    const ratio = entries.length === 1 ? .5 : peakIndex / (entries.length - 1);
    elements.phaseChart.scrollLeft = Math.max(0, (elements.phaseChart.scrollWidth - elements.phaseChart.clientWidth) * ratio);
  });
}

function fixedCell(content, index, tag = "td", extraClass = "", attributes = "") {
  return `<${tag} class="phase-fixed phase-fixed-${index} ${extraClass}" ${attributes}>${content}</${tag}>`;
}

function groupedPerformanceOrders(orders, countedOrders = new Set()) {
  const grouped = new Map();
  orders.forEach(order => {
    const key = order.orderNumber || "未识别订单";
    const item = grouped.get(key) || {
      orderNumber: key,
      gross: 0,
      refund: 0,
      net: 0,
      products: new Set(),
      counted: countedOrders.has(key),
    };
    item.gross += order.gross;
    item.refund += order.refund;
    item.net += order.gross - order.refund;
    order.products.forEach(product => item.products.add(product.name));
    item.counted ||= countedOrders.has(key);
    grouped.set(key, item);
  });
  return [...grouped.values()].map(item => ({
    ...item,
    products: [...item.products],
  })).sort((left, right) => right.net - left.net || left.orderNumber.localeCompare(right.orderNumber));
}

function performanceBreakdown(value, orders, countedOrders, label) {
  const rows = groupedPerformanceOrders(orders, countedOrders);
  const detail = encodeURIComponent(JSON.stringify({
    label,
    total: amount(value),
    countedOrders: countedOrders.size,
    rows,
  }));
  return `<button type="button" class="performance-breakdown-trigger" data-performance-breakdown="${detail}" aria-label="查看${escapeHtml(label)}的订单明细"><span>${plainNumber(value)}</span><span class="performance-info" aria-hidden="true">i</span></button>`;
}

let performanceTooltip = null;
let performanceTooltipTimer = null;

function ensurePerformanceTooltip() {
  if (performanceTooltip) return performanceTooltip;
  performanceTooltip = document.createElement("section");
  performanceTooltip.className = "performance-tooltip";
  performanceTooltip.hidden = true;
  performanceTooltip.addEventListener("mouseenter", () => clearTimeout(performanceTooltipTimer));
  performanceTooltip.addEventListener("mouseleave", hidePerformanceTooltipSoon);
  document.body.appendChild(performanceTooltip);
  return performanceTooltip;
}

function hidePerformanceTooltipSoon() {
  clearTimeout(performanceTooltipTimer);
  performanceTooltipTimer = setTimeout(() => {
    if (performanceTooltip) performanceTooltip.hidden = true;
  }, 140);
}

function showPerformanceTooltip(trigger) {
  clearTimeout(performanceTooltipTimer);
  let detail;
  try { detail = JSON.parse(decodeURIComponent(trigger.dataset.performanceBreakdown)); }
  catch { return; }
  const tooltip = ensurePerformanceTooltip();
  const rows = detail.rows || [];
  tooltip.innerHTML = `
    <div class="performance-tooltip-heading">
      <div><strong>${escapeHtml(detail.label)}</strong><span>相同订单编号已合并</span></div>
      <b>${escapeHtml(currency(detail.total))}</b>
    </div>
    <div class="performance-tooltip-summary">共 ${rows.length} 个业绩订单编号，其中 ${detail.countedOrders} 个计入表格单量</div>
    <div class="performance-tooltip-table">
      <div class="performance-tooltip-row performance-tooltip-head"><span>订单编号</span><span>产品</span><span>业绩</span><span>退款</span><span>净业绩</span></div>
      ${rows.map(row => `<div class="performance-tooltip-row"><span class="performance-order-number">${escapeHtml(row.orderNumber)}${row.counted ? '<em>计单</em>' : '<em class="adjustment">调整</em>'}</span><span title="${escapeHtml(row.products.join("、"))}">${escapeHtml(row.products.join("、") || "未识别产品")}</span><span>${escapeHtml(currency(row.gross))}</span><span class="refund-amount">${escapeHtml(currency(row.refund))}</span><span class="net-amount">${escapeHtml(currency(row.net))}</span></div>`).join("") || '<div class="performance-tooltip-empty">该单元格暂无订单流水</div>'}
    </div>`;
  tooltip.hidden = false;
  const rect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = Math.min(Math.max(10, rect.right - tooltipRect.width), window.innerWidth - tooltipRect.width - 10);
  const below = rect.bottom + 8;
  const top = below + tooltipRect.height <= window.innerHeight - 10 ? below : Math.max(10, rect.top - tooltipRect.height - 8);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

document.addEventListener("mouseover", event => {
  const trigger = event.target.closest?.(".performance-breakdown-trigger");
  if (trigger && !trigger.contains(event.relatedTarget)) showPerformanceTooltip(trigger);
});
document.addEventListener("mouseout", event => {
  const trigger = event.target.closest?.(".performance-breakdown-trigger");
  if (trigger && !trigger.contains(event.relatedTarget)) hidePerformanceTooltipSoon();
});
document.addEventListener("focusin", event => {
  const trigger = event.target.closest?.(".performance-breakdown-trigger");
  if (trigger) showPerformanceTooltip(trigger);
});
document.addEventListener("focusout", event => {
  if (event.target.closest?.(".performance-breakdown-trigger")) hidePerformanceTooltipSoon();
});
document.addEventListener("click", event => {
  const trigger = event.target.closest?.(".performance-breakdown-trigger");
  if (trigger) {
    event.preventDefault();
    showPerformanceTooltip(trigger);
  } else if (performanceTooltip && !performanceTooltip.contains(event.target)) {
    performanceTooltip.hidden = true;
  }
});
window.addEventListener("resize", () => { if (performanceTooltip) performanceTooltip.hidden = true; });

function renderPhaseReport() {
  if (!phaseReport) return;
  const { month, days, archiveReports, combined } = phaseReport;
  elements.phaseMonth.value = month;
  elements.firstDayStart.value = reportSettings.firstDayStart;
  elements.cutoffTime.value = reportSettings.cutoffTime;
  elements.phaseWindowHint.textContent = `月初 ${reportSettings.firstDayStart} 起；周一统计周六至周一，周二至周六按日统计；每日 ${reportSettings.cutoffTime} 截止并于 ${reportSettings.autoDelayMinutes} 分钟后自动同步`;
  elements.autoScheduleText.textContent = `刷新方式：约每 ${partialSyncIntervalMinutes} 分钟自动补拉 + 每天 ${scheduledSyncTime()} 最终同步 + 手动刷新`;
  elements.phaseArchiveCount.textContent = `${archiveReports.length} 个统计日存档`;
  renderPhaseChart();

  const reportsByDate = new Map(archiveReports.map(item => [item.archive.date, item.report]));
  const dailyRankByDate = new Map(days.map(day => {
    const dayReport = reportsByDate.get(day.date);
    if (!dayReport) return [day.date, new Map()];
    const values = new Map((dayReport.staff || []).map(person => [person.name, person.net]));
    const ranked = combined.staff.map(person => ({ name: person.name, value: amount(values.get(person.name)) }))
      .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name, "zh-CN"));
    const top = new Set(ranked.slice(0, 2).map(item => item.name));
    const bottom = new Set(ranked.slice(-2).map(item => item.name));
    return [day.date, new Map(ranked.map(item => [item.name, top.has(item.name) ? "phase-rank-top" : bottom.has(item.name) ? "phase-rank-bottom" : ""]))];
  }));
  const firstHeaders = ["部门", "姓名", "目标", "日均目标", "已完成", "剩余", "完成率", "单量", "单价"];
  elements.phaseTableHead.innerHTML = `<tr>${firstHeaders.map((label, index) => fixedCell(label, index + 1, "th", "phase-left-head", 'rowspan="2"')).join("")}${days.map(day => `<th colspan="2" class="phase-date-head">${Number(month.slice(5))}.${day.day}/周${day.weekday}</th>`).join("")}</tr><tr>${days.map(() => '<th class="number phase-value-head">业绩</th><th class="number phase-order-head">单量</th>').join("")}</tr>`;

  const staffRows = combined.staff.map(person => {
    const target = amount(monthlyTargets.staffTargets?.[person.name]);
    const dailyTarget = days.length ? target / days.length : 0;
    const remaining = Math.max(0, target - person.net);
    const completion = target ? person.net / target : null;
    const averageOrder = person.orderCount ? person.net / person.orderCount : 0;
    const fixed = [
      escapeHtml(person.department),
      `<strong>${escapeHtml(person.name)}</strong>`,
      target ? plainNumber(target) : "未设置",
      target ? plainNumber(dailyTarget) : "-",
      `<strong class="net-amount">${performanceBreakdown(person.net, combined.orders.filter(order => order.waiterName === person.name), person.orders, `${person.name} · 整月净业绩`)}</strong>`,
      target ? plainNumber(remaining) : "-",
      completion === null ? "-" : percent(completion),
      person.orderCount,
      person.orderCount ? plainNumber(averageOrder) : "-",
    ].map((value, index) => fixedCell(value, index + 1, "td", index >= 2 ? "number" : "" )).join("");
    const daily = days.map(day => {
      const dayPerson = reportsByDate.get(day.date)?.staff.find(item => item.name === person.name);
      const dayReport = reportsByDate.get(day.date);
      const rankClass = dailyRankByDate.get(day.date)?.get(person.name) || "";
      const rankLabel = rankClass === "phase-rank-top" ? "当日前两名" : rankClass === "phase-rank-bottom" ? "当日后两名" : "";
      return dayPerson ? `<td class="number phase-daily-value ${rankClass}" title="${rankLabel}">${performanceBreakdown(dayPerson.net, dayReport.orders.filter(order => order.waiterName === person.name), dayPerson.orders, `${person.name} · ${day.date} 净业绩`)}</td><td class="number phase-daily-order ${rankClass}" title="${rankLabel}">${dayPerson.orderCount}</td>` : '<td class="number phase-daily-value">0</td><td class="number phase-daily-order">0</td>';
    }).join("");
    return `<tr>${fixed}${daily}</tr>`;
  }).join("");
  elements.phaseTableBody.innerHTML = staffRows || `<tr><td colspan="${9 + days.length * 2}"><div class="empty-state"><strong>所选月份暂无员工数据</strong></div></td></tr>`;

  const teamTarget = amount(monthlyTargets.teamTarget) || Object.values(monthlyTargets.staffTargets || {}).reduce((sum, value) => sum + amount(value), 0);
  const totalDailyTarget = days.length ? teamTarget / days.length : 0;
  const totalRemaining = Math.max(0, teamTarget - combined.totals.net);
  const totalCompletion = teamTarget ? percent(combined.totals.net / teamTarget) : "-";
  const totalOrders = combined.orderCount;
  const fixedTotal = ["", "汇总", teamTarget ? plainNumber(teamTarget) : "-", teamTarget ? plainNumber(totalDailyTarget) : "-", performanceBreakdown(combined.totals.net, combined.orders, new Set(combined.orders.filter(order => order.countAsOrder).map(order => order.orderNumber)), `${month} · 团队整月净业绩`), teamTarget ? plainNumber(totalRemaining) : "-", totalCompletion, totalOrders, totalOrders ? plainNumber(combined.totals.net / totalOrders) : "-"].map((value, index) => fixedCell(value, index + 1, "td", index >= 2 ? "number" : "")).join("");
  const dailyTotals = days.map(day => {
    const report = reportsByDate.get(day.date);
    return report ? `<td class="number">${performanceBreakdown(report.totals.net, report.orders, new Set(report.orders.filter(order => order.countAsOrder).map(order => order.orderNumber)), `${day.date} · 团队净业绩`)}</td><td class="number">${report.orderCount}</td>` : '<td class="number">0</td><td class="number">0</td>';
  }).join("");
  elements.phaseTableFoot.innerHTML = `<tr>${fixedTotal}${dailyTotals}</tr>`;
}

async function savePhaseSettings() {
  elements.savePhaseSettings.disabled = true;
  try {
    reportSettings = await fetchJson("/api/report-settings", { method: "POST", body: JSON.stringify({ firstDayStart: elements.firstDayStart.value, cutoffTime: elements.cutoffTime.value, autoDelayMinutes: 5 }) });
    elements.windowLabel.textContent = shortWindow(reportWindow(elements.date.value));
    await loadArchives();
    await loadPhaseReport();
    showToast(`时间设置已保存，自动同步时间为截止后 ${reportSettings.autoDelayMinutes} 分钟`);
  } catch (error) { showToast(`时间设置保存失败：${error.message}`); }
  finally { elements.savePhaseSettings.disabled = false; }
}

async function loadArchives() {
  try {
    const result = await fetchJson("/api/archives");
    archivesMeta = result.archives;
    const archiveMonth = elements.reportMonth.value || elements.date.value.slice(0, 7);
    const visibleArchives = result.archives.filter(archive => archive.date.startsWith(archiveMonth) && isReportingDate(archive.date));
    elements.archiveBody.innerHTML = visibleArchives.map(archive => {
      const window = archive.window || reportWindow(archive.date);
      return `<tr><td>${escapeHtml(archive.date)}</td><td>${escapeHtml(shortWindow(window))}</td><td>${escapeHtml(archive.source)}</td><td class="number">${archive.count}</td><td>${escapeHtml(formatDateTime(archive.updatedAt))}</td><td class="action-column"><button class="action-button" type="button" data-archive-date="${escapeHtml(archive.date)}">查看</button></td></tr>`;
    }).join("");
    elements.archiveEmpty.hidden = visibleArchives.length > 0;
  } catch { elements.archiveEmpty.hidden = false; }
}

async function openArchive(date, options = {}) {
  try {
    const archive = await fetchJson(`/api/archive/${encodeURIComponent(date)}`);
    elements.date.value = date;
    localStorage.setItem(DATE_KEY, date);
    currentRecords = archive.records;
    currentArchive = archive;
    setSource(`${archive.source}档案`, archive.updatedAt);
    elements.notice.classList.add("connected");
    elements.noticeTitle.textContent = "正在查看 ERP 只读档案";
    elements.noticeText.textContent = window.STATIC_ARCHIVE_MODE
      ? "当前显示云端加密存档；ERP同步时间以上方标记为准。"
      : `当前数据已在本机匿名化保存；每天 ${scheduledSyncTime()} 自动更新，也可手动刷新。`;
    render();
    if (options.activate !== false) activateView("overview");
    if (options.notify !== false) showToast(`已打开 ${date} 存档`);
    return true;
  } catch (error) {
    if (options.notify !== false) showToast(error.message);
    return false;
  }
}

function activateView(name) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.view === name));
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `${name}View`));
  if (name === "monthly") loadMonthlyReport();
  if (name === "phases") loadPhaseReport();
  if (name === "products" || name === "staff") loadMonthlyReport();
  if (name === "staff") {
    loadPhaseReport();
    loadGroupAnalysis();
  }
  if (name === "archives") loadArchives();
  if (name === "annual") loadAnnualPerformance();
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2800);
}

elements.connect.addEventListener("click", connectErp);
elements.refresh.addEventListener("click", refreshErp);
elements.date.addEventListener("change", async () => {
  const normalized = normalizeReportingDate(elements.date.value);
  if (normalized !== elements.date.value) {
    elements.date.value = normalized;
    showToast("星期日流水并入周一，已切换到周一统计日");
  }
  localStorage.setItem(DATE_KEY, elements.date.value);
  const selectedMonth = elements.date.value.slice(0, 7);
  elements.reportMonth.value = selectedMonth;
  elements.phaseMonth.value = selectedMonth;
  elements.groupMonth.value = selectedMonth;
  groupRangeActive = false;
  monthlyReport = null;
  currentRecords = [];
  currentArchive = null;
  render();
  const opened = await openArchive(elements.date.value, { activate: false, notify: false });
  if (!opened) {
    setSource("等待同步", null);
    elements.notice.classList.add("connected");
    elements.noticeTitle.textContent = "该统计日正在进行";
    elements.noticeText.textContent = window.STATIC_ARCHIVE_MODE
      ? "当前云端尚未收到该统计日存档，请稍后点击右上角“实时刷新”。"
      : "当前尚无该统计日存档，可点击“实时刷新”立即读取 ERP 只读数据。";
    render();
  }
  await loadArchives();
  await loadMonthlyReport();
});
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => activateView(tab.dataset.view)));
elements.archiveBody.addEventListener("click", event => {
  const button = event.target.closest("[data-archive-date]");
  if (button) openArchive(button.dataset.archiveDate);
});
elements.productBody.addEventListener("click", event => {
  const button = event.target.closest("[data-product-toggle]");
  if (!button) return;
  const detail = elements.productBody.querySelector(`[data-product-detail="${button.dataset.productToggle}"]`);
  if (!detail) return;
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  button.textContent = expanded ? "＋" : "−";
  detail.hidden = expanded;
});
elements.staffComparison.addEventListener("click", event => {
  const button = event.target.closest("[data-staff-toggle]");
  if (!button) return;
  const detail = [...elements.staffComparison.querySelectorAll("[data-staff-detail]")]
    .find(item => item.dataset.staffDetail === button.dataset.staffToggle);
  if (!detail) return;
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  const icon = button.querySelector(".matrix-toggle-icon");
  if (icon) icon.textContent = expanded ? "＋" : "−";
  detail.hidden = expanded;
});
elements.reportMonth.addEventListener("change", loadMonthlyReport);
elements.productMonth.addEventListener("change", async () => {
  if (!elements.productMonth.value) return;
  elements.reportMonth.value = elements.productMonth.value;
  await loadMonthlyReport();
});
elements.saveTargets.addEventListener("click", saveMonthlyTargets);
elements.groupMonth.addEventListener("change", () => {
  groupRangeActive = false;
  loadGroupAnalysis();
});
elements.groupPrefixFilter.addEventListener("change", renderGroupAnalysis);
elements.groupPrefixFilter.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  renderGroupAnalysis();
});
elements.applyGroupRange.addEventListener("click", applyGroupRange);
elements.useGroupJoinMonth.addEventListener("click", applyGroupJoinRange);
elements.syncGroupRange.addEventListener("click", syncGroupRangeData);
elements.syncGroupOrders.addEventListener("click", syncGroupOrderData);
elements.saveGroupAssignments.addEventListener("click", saveGroupAssignmentSettings);
elements.annualYear.addEventListener("change", loadAnnualPerformance);
elements.syncAnnualPerformance.addEventListener("click", syncAnnualPerformanceData);
elements.toggleFormerStaff.addEventListener("click", () => {
  showFormerStaff = !showFormerStaff;
  renderAnnualPerformance();
});
elements.phaseMonth.addEventListener("change", loadPhaseReport);
elements.savePhaseSettings.addEventListener("click", savePhaseSettings);
document.querySelectorAll(".rank-tab").forEach(tab => tab.addEventListener("click", () => {
  monthlyRankMode = tab.dataset.rank;
  document.querySelectorAll(".rank-tab").forEach(item => item.classList.toggle("active", item === tab));
  renderMonthlyRanking();
}));

const today = normalizeReportingDate(localDateString());
const savedDate = localStorage.getItem(DATE_KEY);
elements.date.value = normalizeReportingDate(window.STATIC_DEFAULT_DATE || (savedDate === today ? savedDate : today));
elements.reportMonth.value = elements.date.value.slice(0, 7);
elements.productMonth.value = elements.reportMonth.value;
elements.phaseMonth.value = elements.date.value.slice(0, 7);
elements.groupMonth.value = elements.date.value.slice(0, 7);
try {
  const savedGroupRange = JSON.parse(localStorage.getItem(GROUP_RANGE_KEY) || "null");
  elements.groupStartMonth.value = savedGroupRange?.start || elements.groupMonth.value;
  elements.groupEndMonth.value = savedGroupRange?.end || elements.groupMonth.value;
} catch {
  elements.groupStartMonth.value = elements.groupMonth.value;
  elements.groupEndMonth.value = elements.groupMonth.value;
}
elements.annualYear.value = String(new Date().getFullYear());
async function initialize() {
  try { reportSettings = await fetchJson("/api/report-settings"); } catch {}
  currentRecords = demoData;
  setSource("演示数据", null);
  setConnection(false);
  render();
  await checkStatus();
  await loadArchives();
  await openArchive(elements.date.value, { activate: false, notify: false });
  await loadMonthlyReport();
  await loadGroupAnalysis();
  const status = await checkStatus();
  lastObservedAutoSync = status.autoSync?.lastSuccessAt || "";
}

async function handleStartupAction() {
  if (window.STATIC_ARCHIVE_MODE) return;
  const params = new URLSearchParams(window.location.search);
  const isGroupConfigBridge = params.get("group-config") === "1" && params.get("bridge") === "1";
  if (isGroupConfigBridge) {
    history.replaceState(null, "", window.location.pathname);
    const allowedOrigins = new Set(["https://cuiwenquan521.github.io", "http://127.0.0.1:8770"]);
    const bridgeHost = window.opener || (window.parent !== window ? window.parent : null);
    const receiveGroupConfig = async event => {
      if (event.source !== bridgeHost || !allowedOrigins.has(event.origin) || event.data?.type !== "leyuan-group-config-save") return;
      window.removeEventListener("message", receiveGroupConfig);
      try {
        const result = await fetchJson("/api/group-assignments", { method: "POST", body: JSON.stringify({ assignments: event.data.assignments }) });
        bridgeHost?.postMessage({ type: "leyuan-group-config-saved", result }, event.origin);
        window.setTimeout(() => window.close(), 500);
      } catch (error) {
        bridgeHost?.postMessage({ type: "leyuan-group-config-error", message: error.message }, event.origin);
      }
    };
    window.addEventListener("message", receiveGroupConfig);
    bridgeHost?.postMessage({ type: "leyuan-group-config-ready" }, "*");
    return;
  }
  const shouldConnect = params.get("connect") === "1";
  const shouldSync = params.get("sync") === "1";
  const isBridge = params.get("bridge") === "1";
  const bridgeHost = window.opener || (window.parent !== window ? window.parent : null);
  if (!shouldConnect && !shouldSync) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
  if (shouldConnect) {
    const result = await connectErp();
    if (isBridge) {
      bridgeHost?.postMessage({ type: "leyuan-erp-connect-complete", connected: Boolean(result?.connected) }, "*");
      window.setTimeout(() => window.close(), 500);
    }
    return;
  }

  if (shouldSync && params.get("date")) {
    const requestedDate = normalizeReportingDate(params.get("date"));
    elements.date.value = requestedDate;
    localStorage.setItem(DATE_KEY, requestedDate);
  }
  const archive = await refreshErp();
  if (!isBridge) return;
  if (!archive) {
    bridgeHost?.postMessage({ type: "leyuan-erp-sync-error", message: "ERP 同步失败，请检查本机同步服务和 ERP 登录状态" }, "*");
    return;
  }
  const deadline = Date.now() + 120_000;
  let publishError = "";
  let publishComplete = false;
  while (Date.now() < deadline) {
    const status = await fetchJson("/api/status").catch(() => null);
    publishError = status?.cloudPublish?.lastError || "";
    const publishedAt = Date.parse(status?.cloudPublish?.lastSuccessAt || "");
    if (status?.cloudPublish && !status.cloudPublish.inProgress && publishedAt >= Date.parse(archive.updatedAt)) {
      publishComplete = true;
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (!publishComplete) {
    const message = publishError ? `云端发布失败：${publishError}` : "ERP 已同步，但等待云端发布超时";
    bridgeHost?.postMessage({ type: "leyuan-erp-sync-error", message }, "*");
    window.setTimeout(() => window.close(), 1500);
    return;
  }
  bridgeHost?.postMessage({ type: "leyuan-erp-sync-complete", updatedAt: archive.updatedAt }, "*");
  window.setTimeout(() => window.close(), 500);
}

initialize().then(handleStartupAction).catch(error => showToast(error.message || "页面初始化失败"));
setInterval(watchScheduledSync, 60_000);
