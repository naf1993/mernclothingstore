import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";
import axios from "axios";

export const authenticateAdmin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  try {
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get("/api/users", config);
    console.log(userInfo);
    const allUsers = data.data.users;

    const filteredUsers = allUsers.filter((user) => !user.isAdmin);
    console.log(filteredUsers);
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: filteredUsers,
    });
    // console.log(allUsers)
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateUserStatusByAdmin = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token} `,
      },
    };
    const { data } = await axios.patch(
      `/api/users/updateStatus/${user._id}`,
      user,
      config
    );

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};
