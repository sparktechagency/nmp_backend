import ShippingCostModel from "../modules/ShippingCost/ShippingCost.model";


const calculateShippingCost = async (subtotal:number) =>{
  // Fetch active rules sorted by priority
  const rules = await ShippingCostModel.find({ isActive: true }).sort({ priority: 1 });

  for (let rule of rules) {
    if (subtotal >= rule.minSubTotal && subtotal <= rule.maxSubTotal) {
      return rule.cost;
    }
  }

  // Fallback if no rule applies
  return 0;
}


export default calculateShippingCost;
