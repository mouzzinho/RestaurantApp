import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { tableApi } from '@/redux/api/table';

const useWebSocket = (url: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            console.log(message);

            if (message.type === 'TABLE_UPDATED') {
                dispatch(tableApi.util.invalidateTags(['Tables', 'ActiveTables']));
            }
        };

        ws.onclose = (event) => {
            console.warn('WebSocket closed:', event.reason);
        };

        ws.onerror = () => {
            console.log('Could not connect to WebSocket');
        };

        return () => {
            ws.close();
        };
    }, [dispatch, url]);
};

export default useWebSocket;
