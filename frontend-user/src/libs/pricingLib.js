import { differenceInDays } from 'date-fns';

export default function PriceCalculator(startDate, endDate) {
  const basePrice = 115;
  const cleaningFee = 90;
  const taxPercentage = 12;
  
  function calculateBaseCost() {
    return basePrice * differenceInDays(endDate, startDate);
  }
  
  function calculateDiscountTotal() {
    const numNights = differenceInDays(endDate, startDate);
    let discounts = 0;
    let price = basePrice * numNights;
    if (numNights >= 28) {
      discounts = price * 0.25;
    } else if (numNights >= 7) {
      discounts = price * 0.05;
    }
    return discounts;
  }
  
  function getDiscountText() {
    let discountText = '';
    const numNights = differenceInDays(endDate, startDate);
    if (numNights >= 28) {
      discountText = '25% monthly price discount';
    } else if (numNights >= 7) {
      discountText = '5% weekly price discount';
    }
    return discountText;
  }
  
  function calculateTaxes() {
    return (calculateBaseCost() - calculateDiscountTotal() + cleaningFee) * (taxPercentage/100);
  }
  
  function calculateTotalCost() {
    return calculateBaseCost() - calculateDiscountTotal() + cleaningFee + calculateTaxes();
  }
  
  return {
    basePrice: basePrice,
    cleaningFee: cleaningFee,
    
    calculateBaseCost: () => calculateBaseCost(),
    calculateDiscountTotal: () => calculateDiscountTotal(),
    getDiscountText: () => getDiscountText(),
    calculateTaxes: () => calculateTaxes(),
    calculateTotalCost: () => calculateTotalCost()
  }
}
