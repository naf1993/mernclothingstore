import React from 'react'

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const TopProductsChart = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="totalSales" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
  )
}

export default TopProductsChart
