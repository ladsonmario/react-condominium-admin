import { 
    Box, 
    styled, 
    Typography, 
    TextField, 
    InputAdornment, 
    Grid, 
    Button 
} from '@mui/material';

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
        gap: 40px;
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
    return (        
        <ContainerLogin>
            <LoginArea container>
                <Grid item xs={12} md={6}>
                    <Form>
                        <Box>
                            <Typography 
                                component="h1" 
                                variant="h1"
                                mb={1}                                
                            >
                                Login
                            </Typography>
                            <Typography>Sign In to your account</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <Input
                                required
                                id="username"
                                label="Username"  
                                type="text"                      
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                    ),
                                }}                            
                            />
                            <Input
                                required
                                id="password"
                                label="Password"   
                                type="password"                     
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
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Button variant="contained" size="large">Login</Button>
                            <Button size="small">Forgot password?</Button>
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