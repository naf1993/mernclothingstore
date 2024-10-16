import React,{useState} from 'react'
import { useTheme } from '@mui/material';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const TopProductsChart = ({data}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const theme = useTheme()
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' ,backgroundColor: 'white', padding: '10px', borderRadius: '8px'}}>
      <h3 style={{ position: 'absolute', top: '30px', right: '30px', margin: 0,color:theme.palette.primary.textcolor, }}>Top Products</h3>
    <ResponsiveContainer width="100%" height={270}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" tick={{
              fontSize: 10,
              fill: theme.palette.primary.textcolor,
              fontWeight: 'bold',
            }} />
      <YAxis tick={{
              fontSize: 10,
              fill: theme.palette.primary.textcolor,
              fontWeight: 'bold',
            }}/>
      <Tooltip />
      <Bar dataKey="totalSales" fill={theme.palette.secondary.dark} onMouseEnter={(data,index)=>setHoveredIndex(index)} onMouseLeave={()=>setHoveredIndex(null)} >
      {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={hoveredIndex === index ? theme.palette.green.main : theme.palette.secondary.dark}
          />
        ))}
      </Bar>
        
    </BarChart>
  </ResponsiveContainer>
  </div>
  )
}

export default TopProductsChart
