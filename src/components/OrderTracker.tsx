import React from 'react';
import { CheckCircle, Clock, Package, Truck, XCircle, CircleDot } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '../types';
import { format } from 'date-fns';

interface OrderTrackerProps {
  order: Order;
}

interface StepConfig {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  { status: 'PENDING', label: 'Order Received', icon: <CircleDot className="w-4 h-4" /> },
  { status: 'PAYMENT_RECEIVED', label: 'Payment Verified', icon: <Clock className="w-4 h-4" /> },
  { status: 'PROCESSING', label: 'Being Prepared', icon: <Package className="w-4 h-4" /> },
  { status: 'SHIPPED', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
];

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'PAYMENT_RECEIVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  if (order.status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
        <XCircle className="w-7 h-7 text-red-400 shrink-0" />
        <div>
          <p className="font-semibold text-red-700 text-sm">Order Cancelled</p>
          <p className="text-xs text-red-400 mt-0.5">
            {order.statusHistory.find((s) => s.status === 'CANCELLED')?.note || 'This order has been cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="space-y-1">
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const historyEntry = order.statusHistory.find((h) => h.status === step.status);

        return (
          <div key={step.status} className="flex items-start gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${
                isCompleted
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 text-gray-300'
              } ${isCurrent ? 'ring-4 ring-rose-100' : ''}`}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.icon}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 transition-colors ${index < currentIndex ? 'bg-rose-400' : 'bg-gray-100'}`} />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 pb-4">
              <p className={`font-medium text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {historyEntry && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(historyEntry.changedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
              {isCurrent && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;
