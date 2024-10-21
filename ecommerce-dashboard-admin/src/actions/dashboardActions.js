import axios from 'axios'
import { DASHBOARD_STATS_FAILURE, DASHBOARD_STATS_REQUEST, DASHBOARD_STATS_SUCCESS } from 'constants/dashboardConstants'




export const getDashboardStats = () => async(dispatch,getState)=>{
    try{
        dispatch({type:DASHBOARD_STATS_REQUEST})
        const {userLogin:{userInfo}} = getState()
        const config = {
            headers:{
                Authorization:`Bearer ${userInfo.token}`
            }
        }
      
        const {data} = await axios.get('/api/orders/getordersummary',config)
          const overall = data.data
          console.log(overall)
         
               dispatch({
            type:DASHBOARD_STATS_SUCCESS,
            payload:overall
            
            
        })
        // console.log(allUsers)
    }catch(error){
        dispatch({
            type:DASHBOARD_STATS_FAILURE,
            payload:error.response.data.message
        })

    }
}