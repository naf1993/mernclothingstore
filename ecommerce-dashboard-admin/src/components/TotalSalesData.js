
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTheme } from '@emotion/react';

const TotalSalesData = ({ data }) => {
    const theme = useTheme()
  console.log('this is data in chart', data);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' ,backgroundColor: 'white', padding: '10px', borderRadius: '8px'}}>
      <h3 style={{ position: 'absolute', top: '30px', right: '30px', margin: 0,color:theme.palette.primary.textcolor, }}>Sales per Month</h3>
    <ResponsiveContainer width='100%' height={270}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='_id' tickFormatter={(date) => new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })} tick={{
              fontSize: 10,
              fill: '#555',
              fontWeight: 'bold',
            }}/>
        <YAxis  tick={{
              fontSize: 10,
              fill: '#555',
              fontWeight: 'bold',
            }}/>
        <Tooltip />
        <Line type='monotone' dataKey='totalSales' stroke='#5e35b1' activeDot={{ r: 8 }}  />

        {/* Add a title */}
        
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
};

export default TotalSalesData;