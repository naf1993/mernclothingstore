import {
  FETCH_NOTIFICATIONS,
  ADD_NOTIFICATION,
  MARK_AS_READ,MARK_ALL_AS_READ
} from "actions/notificationAction";
const initialState = {
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    case MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n._id === action.payload._id ? { ...n, isRead: true } : n
        ),
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      case MARK_ALL_AS_READ:
        return{
          ...state,
          notifications:state.notifications.map((item)=>({...item,isRead:true}))
        }
    default:
      return state;
  }
};

export default notificationReducer;
