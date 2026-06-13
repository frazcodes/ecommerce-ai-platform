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
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="revenue"
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={45}
        />
        <YAxis
          yAxisId="orders"
          orientation="right"
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#9333ea"
          strokeWidth={2}
          dot={{ fill: '#9333ea', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5 }}
          name="Revenue ($)"
        />
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          stroke="#ec4899"
          strokeWidth={2}
          dot={{ fill: '#ec4899', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5 }}
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart
