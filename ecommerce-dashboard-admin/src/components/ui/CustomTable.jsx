import React from "react";
import {
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const statusColorMapping = {
    paymentStatus: {
        Pending: '#FFCC00',  // Yellow
        Paid: '#4CAF50', // Green
        Failed: '#F44336',    // Red
    }, orderStatus: {
        'Not Processed': '#FFC107', // Amber
        Processing: '#2196F3',       // Blue
        Shipped: '#FF9800',          // Orange
        Delivered: '#8BC34A',        // Light Green
    },
   
};
const Badge = ({ status, color }) => {
    return (
      <Box
        sx={{
          display: "inline-block",
          padding: "0.15rem 0.4rem",
          borderRadius: "12px",
          backgroundColor: color,
          color: "white",
          fontSize: "0.57rem",
          fontWeight: "normal",
        }}
      >
        {status}
      </Box>
    );
  };

const CustomTable = ({ data, columns, onRowClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleRowClick = (id) => {
    if (onRowClick) {
      onRowClick(id);
    } else {
      navigate(`/products/${id}`);
    }
  };

  return (
    <TableContainer component={Paper} style={{ overflowX: "auto" }}>
      <Table stickyHeader>
        <TableHead sx={{ backgroundColor: theme.palette.secondary.dark }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell  sx={{padding:'0.6rem',fontSize:'0.7rem',fontWeight:'normal',color:'white'}} key={column.id}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item) => (
            <TableRow
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.secondary.main;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
              style={{ cursor: "pointer", transition: "background-color 0.3s" }}
              key={item.id}
              onClick={() => handleRowClick(item.id)}
            >
               {columns.map((column) => {
                let cellContent;

                // Apply badge for paymentStatus
                if (column.id === "paymentStatus") {
                  const color = statusColorMapping.paymentStatus[item.paymentStatus] || '#FFFFFF';
                  cellContent = <Badge status={item.paymentStatus} color={color} />;
                } else if (column.id === "orderStatus") {
                  // You can style orderStatus similarly if needed
                  const color = statusColorMapping.orderStatus[item.orderStatus] || '#FFFFFF';
                  cellContent = (
                    <Box
                      sx={{
                        display: "inline-block",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "12px",
                        backgroundColor: color,
                        color: "white",
                        fontSize: "0.57rem",
                        fontWeight: "light",
                      }}
                    >
                      {item.orderStatus}
                    </Box>
                  );
                } else {
                  cellContent = column.render ? column.render(item) : item[column.id];
                }

                return (
                  <TableCell
                    key={column.id}
                    sx={{ padding: '0.4rem', fontSize: '0.67rem', fontWeight: 'light' }}
                  >
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
