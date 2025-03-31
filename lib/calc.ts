// 输出
// 用户需要只输入selling中sol或者coin的数量，就可以得出：

// buying中预期coin或者sol的数量；
// Routing：dex和orderbook中buying结果占比（DEX: X%, ORDER: Y%）；
// Dex Comparison：假设资金全部在dex中成交后得到的结果（产品上有个小问号文案：Results of all buy in DEX.）
// Buymore：结合我们orderbook流动性后多购买的数量
// fee：收取上面buymore的40%

// 计算逻辑（新）
// 前置定义
// 交易方向：以用户「买入代币」为例（卖出逻辑镜像处理）
// 输入参数
// 用户投入金额sol：Δy
// DEX当下流动性参数：x（coin）、y（sol），x * y = k
// Raydium的费率，固定为0.25%
// orderbook档位及深度
// 计算步骤分解
// 1、模拟全部金额在DEX中成交：

// 模拟获得兑换量: Δx(dex)=(x * Δy)/(y + Δy)= (0.9975 * x * Δy)/(y + 0.9975 * Δy)
// 成交均价：P1=Δy/Δx(dex)
// 2、Orderbook询价，成交低于P1的挂单

// 获取Orderbook中所有价格 ≤ P1 的卖单，按价格从低到高排序
// 累加这些订单的代币量 Δx'和对应消耗金额 Δy',直到 挂单消耗光 或者 Δy' = Δy则停止；
// 3、剩余金额在DEX成交

// 输入金额：Δy" =（Δy-Δy'）
// 交换数量：Δx" = (0.9975 * x * Δy")/(y + 0.9975 * Δy")
// 最终结果输出
// buying总数：Δx = Δx' + Δx"
// Routing 百分比: DEX =Δx"/(Δx' + Δx"); order=Δx' /(Δx' + Δx")
// Buymore数量 = (Δx' + Δx") - Δx(dex)
// Fee = Buymore*40%
// 均价：
// 总均价：Δx / Δy
// DEX中的成交均价：Δx" / Δy"
// 订单簿中的成交均价：Δx' / Δy'

interface DexParams {
  x: number; // coin 数量
  y: number; // sol 数量
  fee: number; // 手续费率，例如 0.25% 输入为 0.0025
}

interface OrderbookOrder {
  price: number; // 价格（coin/sol）
  amount: number; // 代币数量（coin）
}

interface CalculationResult {
  buyingTotal: number; // Δx
  routing: { dex: number; order: number };
  dexComparison: number; // Δx(dex)
  buymore: number;
  fee: number;
  avgPriceTotal: number;
  avgPriceDex: number;
  avgPriceOrder: number;
}

// 计算 DEX 中的成交量和均价
const calculateDex = (Δy: number, dex: DexParams): { Δx: number; price: number } => {
  const effectiveΔy = Δy * (1 - dex.fee);
  const Δx = (dex.x * effectiveΔy) / (dex.y + effectiveΔy);
  const price = effectiveΔy / Δx;
  return { Δx, price };
};

function calculateNewLogic(
  inputΔy: number,
  dexParams: DexParams,
  orderbook: OrderbookOrder[]
): CalculationResult {
  // 1. 模拟全部金额在 DEX 成交
  const { Δx: Δx_dex, price: P1 } = calculateDex(inputΔy, dexParams);

  // 2. Orderbook 询价累加
  let ΔyUsedOrder = 0;
  let ΔxOrder = 0;
  const sortedOrders = orderbook
    .filter((order) => order.price <= P1)
    .sort((a, b) => a.price - b.price);

  for (const order of sortedOrders) {
    const requiredΔy = order.amount * order.price;
    const remainingΔy = inputΔy - ΔyUsedOrder;

    if (remainingΔy <= 0) break;

    if (requiredΔy <= remainingΔy) {
      ΔxOrder += order.amount;
      ΔyUsedOrder += requiredΔy;
    } else {
      ΔxOrder += remainingΔy / order.price;
      ΔyUsedOrder = inputΔy;
      break;
    }
  }

  // 3. 剩余金额在 DEX 成交
  const ΔyDex = inputΔy - ΔyUsedOrder;
  const { Δx: Δx_dex_remaining } = calculateDex(ΔyDex, dexParams);

  // 汇总结果
  const ΔxTotal = ΔxOrder + Δx_dex_remaining;
  const routingDex = Δx_dex_remaining / ΔxTotal;
  const routingOrder = ΔxOrder / ΔxTotal;
  const buymore = ΔxTotal - Δx_dex;

  return {
    buyingTotal: ΔxTotal,
    routing: { dex: routingDex, order: routingOrder },
    dexComparison: Δx_dex,
    buymore,
    fee: buymore * 0.4,
    avgPriceTotal: inputΔy / ΔxTotal,
    avgPriceDex: ΔyDex / Δx_dex_remaining,
    avgPriceOrder: ΔyUsedOrder / ΔxOrder,
  };
}
