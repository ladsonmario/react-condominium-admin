import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import { useEffect } from 'react';
import { useAPI } from 'src/services/api';

const Logout = () => {
    useEffect(() => {
        ( async () => {
            await useAPI.logout();
            window.location.href = '/login';
        })();
    }, []);
    
    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CircularProgress />
        </Box>
    );
}

export default Logout;