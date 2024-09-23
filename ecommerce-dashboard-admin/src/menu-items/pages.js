import Inventory2Icon from "@mui/icons-material/Inventory2";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";

const icons = {
  products: Inventory2Icon,
  order: GradingIcon,
  users: GroupIcon,
};
const pages = {
  id: "pages",
  title: "Pages",
  type: "group",
  children: [
    {
      id: "products",
      title: "Products",
      type:'collapse',
      icon:icons.products,
      children:[
        {
            id:'grid',
            title:'Grid',
            type:'item',
            url:'/products/grid',
            
        },
        {
            id:'table',
            title:'Table',
            type:'item',
            url:'/products/table',
            
        }
      ]
    },
    {
      id: "users",
      title: "Users",
      type:'collapse',
      icon:icons.users,
      children:[
        {
            id:'table',
            title:'Table',
            type:'item',
            url:'/customers/table',
            
        },
       
      ]
    },
    {
      id: "orders",
      title: "Orders",
      type:'collapse',
      icon:icons.order,
      url:'/orders'
      
    },
    
  
  ],
};
export default pages