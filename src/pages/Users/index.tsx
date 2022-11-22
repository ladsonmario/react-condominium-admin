import { ChangeEvent, useEffect, useState } from 'react';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { useAPI } from 'src/services/api';
import { 
    styled,
    Box, 
    Card, 
    Container, 
    Typography, 
    CardContent,
    Button,    
    Divider, 
    ButtonGroup,       
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,    
    FormGroup,
    TextField,
    InputAdornment  
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PinIcon from '@mui/icons-material/Pin';
import KeyIcon from '@mui/icons-material/Key';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { UserType, UserDataType } from 'src/types/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    }
}));

const LabelInput = styled('label')(
    () => `
        display: block;
        margin-bottom: 10px;
    `
);

const Input = styled(TextField)(
    () => `width: 100%;`
);

const Users = () => {
    type ResultUserType = {
        error: string;
        list: UserType[];
    }
   
    type ResultActionsUserType = {
        error: string;
    } 

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<UserType[]>([]);
    const [showModal, setShowModal] = useState(false);    
    const [modalId, setModalId] = useState('');
    const [modalName, setModalName] = useState('');
    const [modalEmail, setModalEmail] = useState('');
    const [modalCpf, setModalCpf] = useState('');
    const [modalPassword, setModalPassword] = useState('');
    const [modalConfirmPassword, setModalConfirmPassword] = useState('');

    useEffect(() => {
        getList();
    }, []);

    const handleNameModal = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalName(e.target.value);
    }
    const handleEmailModal = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalEmail(e.target.value);
    }
    const handleCpfModal = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalCpf(e.target.value);
    }
    const handlePasswordModal = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalPassword(e.target.value);
    }
    const handleConfirmPasswordModal = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalConfirmPassword(e.target.value);
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultUserType = await useAPI.getUsers();
        setLoading(false);

        if(result.error !== '') {
            alert(result.error);
        } else {
            setList(result.list);            
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleNewButton = () => {
        setModalId('');
        setModalName('');
        setModalEmail('');
        setModalCpf('');
        setModalPassword('');
        setModalConfirmPassword('');

        setShowModal(true);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());
        setModalName(list[index].name);
        setModalEmail(list[index].email);
        setModalCpf(list[index].cpf);
        setModalPassword('');
        setModalConfirmPassword('');   

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Você deseja excluir esse usuário?')) {
            const result: ResultActionsUserType = await useAPI.removeUser(id);

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        if(modalName && modalEmail && modalCpf) {                        
            setLoading(true);            
            let result: ResultUserType = null;            
            const data: UserDataType = {
                name: modalName,
                email: modalEmail,
                cpf: modalCpf
            }
            
            if(modalPassword) {
                if(modalPassword === modalConfirmPassword) {
                    data.password = modalName;
                } else {
                    alert('Senhas não batem!');
                    setLoading(false);
                }
            }
            
            if(!modalId) {
                result = await useAPI.addUser(data);
            } else {                
                result = await useAPI.updateUser(modalId, data);
            }
            
            setLoading(false);
            
            if(result.error === '') {
                getList();
                setShowModal(false);
            } else {
                alert(result.error);
            }
        } else {
            alert('Preencha todos os campos!')
        }
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nome', flex: 1, minWidth: 300 },        
        { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 300 },        
        { field: 'cpf', headerName: 'CPF', flex: 1, width: 130},        
        { 
            field: 'id', 
            headerName: 'Ações',              
            flex: 1,
            minWidth: 250,
            renderCell: (params: GridRenderCellParams) => (
                <ButtonGroup>                    
                    <Button 
                        variant="contained" 
                        color="info"
                        onClick={() => handleEditButton(params.value)}                        
                    >
                        Editar
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error"   
                        onClick={() => handleRemoveButton(params.value)}                          
                    >
                        Excluir
                    </Button>
                </ButtonGroup>
            )            
        }
    ];

    return (
        <>
            <PageTitleWrapper>
                <Typography variant="h2">Usuários</Typography>
            </PageTitleWrapper>
            <Container>
                <Box>                                
                    <Card>
                        <CardContent>
                            <Button 
                                variant="contained" 
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleNewButton}                                
                            >
                                Novo Usuário
                            </Button>
                            <Divider sx={{ margin: '15px 0' }} />
                            <Box>
                                <DataGrid 
                                    rows={list}
                                    columns={columns}    
                                    autoHeight={true}    
                                    loading={loading}                                                                                                                                                                     
                                />
                            </Box>                            
                        </CardContent>
                    </Card>
                </Box>
            </Container>

            <BootstrapDialog 
                open={showModal} 
                onClose={handleCloseModal}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Typography variant="h3">{modalId === '' ? 'Novo' : 'Editar'} Usuário</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >                           
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <FormGroup sx={{ gap: '20px' }}>                        
                        <Box>
                            <LabelInput htmlFor="modal--name">Nome do Usuário</LabelInput>
                            <Input                            
                                id="modal--name"
                                label="Nome"
                                type="text"    
                                placeholder="Digite o seu nome"                            
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalName}
                                onChange={handleNameModal}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>  
                        <Box>
                            <LabelInput htmlFor="modal--email">E-mail do Usuário</LabelInput>
                            <Input                            
                                id="modal--email"
                                label="E-mail"
                                type="email"  
                                placeholder="Digite o seu e-mail"                               
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalEmail}
                                onChange={handleEmailModal}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>   
                        <Box>
                            <LabelInput htmlFor="modal--cpf">CPF do Usuário</LabelInput>
                            <Input                            
                                id="modal--cpf"
                                label="CPF"
                                type="text"       
                                placeholder="Digite o seu CPF"                          
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <PinIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalCpf}
                                onChange={handleCpfModal}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>   
                        <Box>
                            <LabelInput htmlFor="modal--password">Nova Senha</LabelInput>
                            <Input                            
                                id="modal--password"
                                label="Senha"
                                type="password"
                                placeholder="Digite uma nova senha"                                
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <KeyIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalPassword}
                                onChange={handlePasswordModal}                                
                                disabled={loading ? true : false}        
                            />
                        </Box> 
                        <Box>
                            <LabelInput htmlFor="modal--confirm">Confirmar Senha</LabelInput>
                            <Input                            
                                id="modal--confirm"
                                label="Confirmar"
                                type="password"  
                                placeholder="Confirme a nova senha"                              
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <KeyIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalConfirmPassword}
                                onChange={handleConfirmPasswordModal}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>                                      
                    </FormGroup>
                </DialogContent>
                <DialogActions>                    
                    {loading &&
                        <LoadingButton loading variant="outlined" type="button">
                            Submit
                        </LoadingButton>
                    } 
                    <Button 
                        variant="contained" 
                        color="primary"  
                        onClick={handleModalSave}     
                        disabled={loading ? true : false}        
                    >
                        {loading && 'Carregando...'}
                        {(!loading && !modalId) && 'Adicionar'}
                        {(!loading && modalId) && 'Salvar'}
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={handleCloseModal}
                        disabled={loading ? true : false}        
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>        
    );
}

export default Users;