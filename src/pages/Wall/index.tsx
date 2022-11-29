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
import TitleIcon from '@mui/icons-material/Title';
import ArticleIcon from '@mui/icons-material/Article';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { WallType, WallDataType } from 'src/types/types';

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

const Wall = () => {
    type ResultWallType = {
        error: string;
        list: WallType[];
    }
   
    type ResultActionsWallType = {
        error: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<WallType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalId, setModalId] = useState('');

    useEffect(() => {
        getList();
    }, []);

    const handleInputModalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    }
    const handleInputModalBody = (e: ChangeEvent<HTMLInputElement>) => {
        setModalBody(e.target.value);
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultWallType = await useAPI.getWall();
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
        setModalTitle('');
        setModalBody('');

        setShowModal(true);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());
        setModalTitle(list[index].title);
        setModalBody(list[index].body);

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Tem certeze que deseja excluir esse item?')) {
            const result: ResultActionsWallType = await useAPI.removeWall(id);
            
            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        if(modalTitle && modalBody) {
            setLoading(true);
            let result: ResultActionsWallType = null;
            const data: WallDataType = {
                title: modalTitle, 
                body: modalBody
            }
            
            if(!modalId) {
                result = await useAPI.addWall(data);
            } else {
                result = await useAPI.updateWall(modalId, data);
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
        { 
            field: 'title', 
            headerName: 'Título', 
            flex: 2, 
            minWidth: 300,
            hideable: false 
        },
        { 
            field: 'datecreated', 
            headerName: 'Data de criação', 
            flex: 1, 
            minWidth: 150,
            hideable: false
        },
        { 
            field: 'id', 
            headerName: 'Ações',              
            width: 190,
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
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
                <Typography variant="h2">Mural de Avisos</Typography>
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
                                Novo Aviso
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
                    <Typography variant="h3">{modalId === '' ? 'Novo' : 'Editar'} Aviso</Typography>
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
                            <LabelInput htmlFor="modal--title">Título do aviso</LabelInput>
                            <Input                            
                                id="modal--title"
                                label="Título"
                                type="text"
                                placeholder="Digite um título para seu aviso"
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalTitle}
                                onChange={handleInputModalTitle}
                                disabled={loading ? true : false}        
                            />
                        </Box>                        
                        <Box>
                            <LabelInput htmlFor="modal--body">Corpo do aviso</LabelInput>
                            <Input                            
                                id="modal--body"
                                label="Corpo"
                                type="text"
                                multiline
                                rows={4}
                                maxRows={Infinity}                                                        
                                placeholder="Digite o conteúdo do aviso"
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <ArticleIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalBody}
                                onChange={handleInputModalBody}
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

export default Wall;