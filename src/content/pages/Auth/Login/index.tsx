import { Box, styled, Typography, TextField, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

const ContainerLogin = styled(Box)(
    () => `
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-color: #eee;
    `
);

const LoginArea = styled(Box)(
    () => `
        max-width: 900px;
        width: 100%;        
        border-radius: 10px;
        box-shadow: 0 0 5px #ccc;        
        background-color: #fff;
        border: 1px solid #ddd;
        display: flex;
    `
);

const Form = styled('form')(
    () => `
        padding: 30px;
        display: flex;
        flex-direction: column;
        width: 100%;
    `
);
const InfoArea = styled('div')(
    () => `
        width: 100%;
        background-color: #000;
    `
);

const Input = styled(TextField)(
    () => `width: 100%;`
);

const Login = () => {
    return (        
        <ContainerLogin>
            <LoginArea>
                <Form>
                    <Box>
                        <Typography component="h1" variant="h1">Login</Typography>
                        <Typography>Sign In to your account</Typography>
                    </Box>
                    <Box>
                    <Input
                        required
                        id="username"
                        label="Username"                        
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
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                        }}
                    />
                    </Box>
                </Form>
                <InfoArea>

                </InfoArea>
            </LoginArea>            
        </ContainerLogin>        
    );
}

export default Login;