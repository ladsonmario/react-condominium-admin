import { useEffect, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import router, { RouterLogin } from 'src/router';
import { useAPI } from './services/api';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';

const App = () => {
  type ResultType = {
    error: string;
  }

  const content = useRoutes(router);
  const navigate = useNavigate();  

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ( async () => {
      if(useAPI.getToken()) {
        const result: ResultType = await useAPI.validateToken();        
        
        if(!result.error) {
          setLoading(false);
        } else {
          alert(result.error);
          navigate('/login');
        }

      } else {
        navigate('/login');
      }
    })();
  }, []);  

  return (      
    <ThemeProvider>
      <CssBaseline />
      {!loading &&
        <LocalizationProvider dateAdapter={AdapterDateFns}>              
          {content}
        </LocalizationProvider>
      }
      <RouterLogin />
    </ThemeProvider> 
  );
}
export default App;