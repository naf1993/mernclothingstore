import { DASHBOARD_STATS_FAILURE, DASHBOARD_STATS_REQUEST, DASHBOARD_STATS_SUCCESS } from "../constants/dashboardConstants"



export const dashboardStatsReducer = (state={summary:{}},action)=>{
    switch(action.type){
        case DASHBOARD_STATS_REQUEST:
            return {loading:true,summary:{}}
        case DASHBOARD_STATS_SUCCESS:
            return {loading:false,summary:action.payload}
        case DASHBOARD_STATS_FAILURE:
            return {loading:false,error:action.payload}
        default:
            return state
    }
}