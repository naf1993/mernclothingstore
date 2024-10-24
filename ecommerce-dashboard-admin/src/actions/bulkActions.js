import { getConfig } from "../utils/config.js";
import axios from "axios";
import { toast } from "react-hot-toast";

export const BULK_ACTION_REQUEST = "BULK_ACTION_REQUEST";
export const BULK_ACTION_SUCCESS = "BULK_ACTION_SUCCESS";
export const BULK_ACTION_FAIL = "BULK_ACTION_FAIL";

export const bulkAction = (type, action, orderIds) => async (dispatch, getState) => {
  try {
    dispatch({ type: BULK_ACTION_REQUEST });
    const config = getConfig(getState);
    const response = await axios.post(
      `/api/${type}/bulk-action`,
      { action, orderIds },
      config
    );
    dispatch({ type: BULK_ACTION_SUCCESS, payload: response.data });
    toast.success("Bulk action performed successfully!");
  } catch (error) {
    dispatch({
      type: BULK_ACTION_FAIL,
      payload: error.response?.data.message || error.message,
    });
    toast.error(
      "Error performing bulk action: " +
        (error.response?.data.message || error.message)
    );
  }
};
