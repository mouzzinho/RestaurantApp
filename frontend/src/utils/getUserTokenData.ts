export const getUserTokenData = () => {
    if (typeof window === 'undefined') return null;
    const tokenData = localStorage.getItem('tokenData');
    const data = tokenData ? JSON.parse(tokenData) : null;

    return {
        token: data ? data.token : '',
        isTokenExpired: data ? new Date().getTime() > data.expireAt : true,
    };
};
