import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export default function ComparisonCalculator() {
  const [salePrice, setSalePrice] = useState(400000);
  const [commissionRate, setCommissionRate] = useState(3);
  const [splitType, setSplitType] = useState('30');
  const [customSplit, setCustomSplit] = useState('');
  const [yearlyClosings, setYearlyClosings] = useState(10);

  const splitOptions = [
    { label: '50/50 Split', value: '50' },
    { label: '60/40 Split', value: '40' },
    { label: '70/30 Split', value: '30' },
    { label: '80/20 Split', value: '20' },
    { label: '85/15 Split', value: '15' },
    { label: 'Custom Split', value: 'custom' }
  ];

  const getTransactionFee = (price) => {
    if (price >= 600000 && price <= 1200000) {
      return 700;
    }
    return 350;
  };

  const getCurrentSplit = () => {
    if (!splitType) return 0;
    return splitType === 'custom' ? (customSplit || 0) : parseInt(splitType);
  };

  const calculateCommission = (type) => {
    const totalCommission = salePrice * (commissionRate / 100) * yearlyClosings;
    const transactionFee = getTransactionFee(salePrice) * yearlyClosings;
    let brokerAmount, agentAmount;

    if (type === 'percentage') {
      const brokerSplit = getCurrentSplit();
      brokerAmount = totalCommission * (brokerSplit / 100);
      agentAmount = totalCommission - brokerAmount;
    } else {
      brokerAmount = transactionFee;
      agentAmount = totalCommission - brokerAmount;
    }

    return {
      totalCommission,
      brokerAmount,
      agentAmount,
      transactionFee
    };
  };

  const percentageResults = calculateCommission('percentage');
  const flatResults = calculateCommission('flat');
  const currentSplit = getCurrentSplit();
  const isHighValue = salePrice >= 600000 && salePrice <= 1200000;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Calculate My Pay Raise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium">Sale Price ($)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-0 h-auto">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This is the estimated sale price of the home you are representing a buyer or seller on under your brokerage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <input
                type="number"
                value={salePrice === 0 ? '' : salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium">Commission Rate (%)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-0 h-auto">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This is the commission percentage that is negotiated for your side of the transaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <input
                type="number"
                value={commissionRate === 0 ? '' : commissionRate}
                onChange={(e) => setCommissionRate(e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium">Estimated Yearly Closings (#)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-0 h-auto">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This is the estimated number homes you will sell in a year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <input
                type="number"
                value={yearlyClosings === 0 ? '' : yearlyClosings}
                onChange={(e) => setYearlyClosings(e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Your Current Brokerage ({yearlyClosings} Transactions)</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Commission Split</label>
                <select
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                >
                  {splitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {splitType === 'custom' && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-2">Enter Your Split (%)</label>
                    <input
                      type="number"
                      value={customSplit}
                      onChange={(e) => setCustomSplit(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter broker's percentage"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Commission:</span>
                  <span className="font-medium">${percentageResults.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Broker Split ({currentSplit}%):</span>
                  <span className="font-medium text-red-600">-${percentageResults.brokerAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Agent Take-Home:</span>
                  <span className="font-semibold">${percentageResults.agentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Ready Real Estate ({yearlyClosings} Transactions)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Commission:</span>
                  <span className="font-medium">${flatResults.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Fees:</span>
                  <span className="font-medium text-red-600">-${flatResults.transactionFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Agent Take-Home:</span>
                  <span className="font-semibold">${flatResults.agentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="p-6 rounded-lg border-2 border-blue-200 bg-white">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-center">Agent Take-Home Comparison</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-0 h-auto">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This is where you will see the Pay Raise you will receive by switching brokerages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <div className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                    Your Current Brokerage
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="p-0 h-auto">
                            <InfoIcon className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">This is the amount of Gross Commission you will earn in one year at your current Brokerage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${percentageResults.agentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-2xl font-bold text-gray-600">VS</div>
                </div>
                <div className="col-span-2 bg-red-50 p-4 rounded-lg border-2 border-red-200 shadow-md">
                  <div className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                    Ready Real Estate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="p-0 h-auto">
                            <InfoIcon className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">This is the amount of Gross Commission you will earn in one year by joining Ready Real Estate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-4xl font-bold text-red-600">
                    ${flatResults.agentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-lg font-medium">Annual Difference</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-0 h-auto">
                          <InfoIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">This is the $ Amount that has been going to your current broker that will now go into your pocket, Congratulations on your Pay Raise!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-4xl font-extrabold text-green-600">
                  ${(flatResults.agentAmount - percentageResults.agentAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xl font-bold text-green-600 mt-2">
                  {((flatResults.agentAmount - percentageResults.agentAmount) / percentageResults.agentAmount * 100).toFixed(1)}% Increase
                </div>
              </div>
            </div>
            {isHighValue && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium">
                  Note: Sales Price is a High Value Property
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}