import axios from "axios";

export const FETCH_NOTIFICATIONS = 'FETCH_NOTOFICATIONS'
export const MARK_AS_READ = 'MARK_AS_READ'
export const ADD_NOTIFICATION = 'ADD_NOTOFICATION'
export const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';

export const markAllAsRead = () => {
    return (dispatch) => {
        dispatch({ type: 'MARK_ALL_AS_READ' });
        // Additional logic can be added here if necessary
    };
};

export const fetchAllNotifications = () =>async(dispatch)=>{
    const response = await axios.get('/api/notifications')
    dispatch({type:FETCH_NOTIFICATIONS,payload:response.data.data})
}

export const markAsRead = (id) => async (dispatch) => {
    const response = await axios.put(`/api/notifications/${id}/read`);
    dispatch({ type: MARK_AS_READ, payload: response.data.data });
};

export const addNotification = (notification) => {
    return { type: ADD_NOTIFICATION, payload: notification };
};