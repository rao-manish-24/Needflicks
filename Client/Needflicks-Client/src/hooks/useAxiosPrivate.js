import { useEffect, useRef } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const useAxiosPrivate = () => {
    const { setAuth } = useAuth();
    const axiosAuth = useRef(
        axios.create({
            baseURL: apiUrl,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        })
    ).current;

    const isRefreshing = useRef(false);
    const failedQueue = useRef([]);

    const processQueue = (error) => {
        failedQueue.current.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve();
            }
        });
        failedQueue.current = [];
    };

    useEffect(() => {
        const interceptor = axiosAuth.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (!originalRequest) {
                    return Promise.reject(error);
                }

                if (originalRequest.url?.includes('/refresh') && error.response?.status === 401) {
                    localStorage.removeItem('user');
                    setAuth(null);
                    return Promise.reject(error);
                }

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing.current) {
                        return new Promise((resolve, reject) => {
                            failedQueue.current.push({ resolve, reject });
                        }).then(() => axiosAuth(originalRequest));
                    }

                    originalRequest._retry = true;
                    isRefreshing.current = true;

                    try {
                        await axiosAuth.post('/refresh');
                        processQueue(null);
                        return axiosAuth(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError);
                        localStorage.removeItem('user');
                        setAuth(null);
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing.current = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.response.eject(interceptor);
        };
    }, [axiosAuth, setAuth]);

    return axiosAuth;
};

export default useAxiosPrivate;
