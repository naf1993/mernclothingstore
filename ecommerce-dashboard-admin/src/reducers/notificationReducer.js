const initialState = {
    notifications: [],
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        return {
          ...state,
          notifications: [...state.notifications, action.payload],
        };
      default:
        return state;
    }
  };
  
  export const addNotification = (notification) => ({
    type: 'ADD_NOTIFICATION',
    payload: notification,
  });
  
  export default notificationReducer;
  