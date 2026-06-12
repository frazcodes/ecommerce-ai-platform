/**
 * Revenue Chart Component
 * 
 * Purpose: Display revenue trends over time
 * Why it exists: Visualizes monthly revenue and order data
 * Features: Line chart with dual axes, glassmorphism design
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { RevenueData } from '../../types/admin'

interface RevenueChartProps {
  data: RevenueData[]
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="revenue"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <YAxis
          yAxisId="orders"
          orientation="right"
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
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#9333ea"
          strokeWidth={2}
          dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Revenue ($)"
        />
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          stroke="#ec4899"
          strokeWidth={2}
          dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart
