import DashboardIcon from '@mui/icons-material/Dashboard';

const icons = {DashboardIcon}

const dashboard = {
    id:'dashboard',
    title:'Dashboard',
    type:'group',
    children:[
        {
            id:'default',
            title:'Dashboard',
            type:'item',
            url:'/',
            icon:icons.DashboardIcon,
            breadcrumbs:false
        }
    ]
}
export default dashboard