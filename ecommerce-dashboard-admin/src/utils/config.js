
export const getConfig = (getState) => {
    const {
        userLogin: { userInfo },
    } = getState();

    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`, // Add authorization token
        },
    };
};
