/**
 * Orders Chart Component
 * 
 * Purpose: Display order status trends over time
 * Why it exists: Visualizes order status distribution
 * Features: Bar chart with stacked bars, glassmorphism design
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { OrdersData } from '../../types/admin'

interface OrdersChartProps {
  data: OrdersData[]
}

const OrdersChart = ({ data }: OrdersChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar
          dataKey="delivered"
          fill="#22c55e"
          name="Delivered"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="pending"
          fill="#eab308"
          name="Pending"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="orders"
          fill="#9333ea"
          name="Total Orders"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default OrdersChart
