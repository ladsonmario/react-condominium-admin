import { ChangeEvent, FormEvent, useState } from 'react';
import { 
    Box, 
    styled, 
    Typography, 
    TextField, 
    InputAdornment, 
    Grid, 
    Button,
    Alert    
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAPI } from '../../services/api';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

const ContainerLogin = styled(Box)(
    () => `
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-color: #eee;
        padding: 15px;
    `
);

const LoginArea = styled(Grid)(
    () => `
        max-width: 900px;
        width: 100%;        
        border-radius: 10px;
        box-shadow: 0 0 5px #ccc;        
        background-color: #fff;
        border: 1px solid #ddd;
    `
);

const Form = styled('form')(
    () => `
        padding: 60px;
        display: flex;
        gap: 30px;
        flex-direction: column;
        width: 100%;           
        
        @media(max-width: 500px) {
            padding: 30px;
        }
    `
);
const InfoArea = styled('div')(
    () => `
        width: 100%;
        background-color: rgb(68, 84, 204);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #fff;
        padding: 60px 40px;
        border-radius: 10px;
    `
);

const Input = styled(TextField)(
    () => `width: 100%;`
);

const Login = () => {
    type ResultLoginType = {
        error: string;
        token: string;
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(email && password) {
            setLoading(true);
            const result: ResultLoginType = await useAPI.login(email, password);
            setLoading(false);

            if(result.token) {                
                localStorage.setItem('token', result.token);                
                window.location.href="/";                
            } else {
                setError(result.error);
            }
        } else {
            alert('Digite os dados!');
        }
    }

    return (        
        <ContainerLogin>
            <LoginArea container>
                <Grid item xs={12} md={6}>
                    <Form onSubmit={handleSubmitLogin}>
                        <Box>
                            <Typography 
                                component="h1" 
                                variant="h1"
                                mb={1}                                
                            >
                                Login
                            </Typography>
                            <Typography mb={1}>Digite seus dados de acesso</Typography>

                            {error !== '' &&
                                <Alert severity="error">{error}</Alert>
                            }

                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <Input                                
                                id="email"
                                label="E-mail"  
                                type="email" 
                                placeholder="E-mail"   
                                onChange={handleInputEmail} 
                                value={email}    
                                disabled={loading ? true : false}             
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                    ),
                                }}                            
                            />
                            <Input                                
                                id="password"
                                label="Password"   
                                type="password"  
                                placeholder="Senha" 
                                onChange={handleInputPassword}   
                                value={password}      
                                disabled={loading ? true : false}         
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',                            
                            alignItems: 'center'
                        }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                type="submit"  
                                disabled={loading ? true : false}
                            >
                                {loading ? 'Carregando...': 'Entrar'}
                            </Button>  
                            {loading &&
                                <LoadingButton loading variant="outlined" type="button">
                                    Submit
                                </LoadingButton>
                            }                          
                        </Box>
                    </Form>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoArea>
                        <Box>
                            <Typography 
                                component="h2" 
                                variant="h2"
                                mb={2}                                
                            >
                                Sign up
                            </Typography>
                            <Typography mb={2}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>                            
                            <Button sx={{ color: '#fff' }}>Register Now!</Button>
                        </Box>
                    </InfoArea>
                </Grid>                
            </LoginArea>            
        </ContainerLogin>        
    );
}

export default Login;