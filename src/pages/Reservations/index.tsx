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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ReservationsListType } from 'src/types/types';

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

const Reservations = () => {
    type ResultWallType = {
        error: string;
        list: ReservationsListType[];
    }
   
    type ResultActionsWallType = {
        error: string;
    }    

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<ReservationsListType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFile, setModalFile] = useState<File>();
    const [modalId, setModalId] = useState('');

    useEffect(() => {
        getList();
    }, []);

    const handleInputModalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    }
    const handleInputModalFile = (e: ChangeEvent<HTMLInputElement>) => {
        setModalFile(e.currentTarget.files[0]);
        console.log(e.currentTarget.files[0]);
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultWallType = await useAPI.getReservations();
        setLoading(false);
        
        console.log(result);

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
        setModalFile(null);

        setShowModal(true);
    }

    const handleDownloadButton = (id: string) => {
        const index = list.findIndex(item => item.id === parseInt(id));
        //window.open(list[index].fileurl);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());
        //setModalTitle(list[index].title);        

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Tem certeze que deseja excluir esse item?')) {
            const result: ResultActionsWallType = await useAPI.removeDocument(id);
            
            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        // if(modalTitle) {
        //     setLoading(true);
        //     let result: ResultActionsWallType = null;
        //     const data: DataType = {
        //         title: modalTitle                           
        //     }
            
        //     if(!modalId) {
        //         if(modalFile) {
        //             data.file = modalFile;
        //             result = await useAPI.addDocument(data);
        //         } else {
        //             alert('Selecione um arquivo!');
        //             setLoading(false);
        //             return;
        //         }
        //     } else {
        //         if(modalFile) {
        //             data.file = modalFile;
        //         }
        //         result = await useAPI.updateDocument(modalId, data);
        //     }
            
        //     setLoading(false);
            
        //     if(result.error === '') {
        //         getList();
        //         setShowModal(false);
        //     } else {
        //         alert(result.error);
        //     }
        // } else {
        //     alert('Preencha todos os campos!')
        // }
    }

    const columns: GridColDef[] = [
        { field: 'name_unit', headerName: 'Unidade', flex: 1, minWidth: 300 },        
        { field: 'name_area', headerName: 'Área', flex: 1, minWidth: 300 },        
        { field: 'reservation_date_formatted', headerName: 'Data da reserva', flex: 1, minWidth: 300 },        
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
                <Typography variant="h2">Reservas</Typography>
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
                                Novo Documento
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
                    <Typography variant="h3">{modalId === '' ? 'Novo' : 'Editar'} Documento</Typography>
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
                            <LabelInput htmlFor="modal--title">Título do documento</LabelInput>
                            <Input                            
                                id="modal--title"
                                label="Título"
                                type="text"
                                placeholder="Digite um título para seu documento"
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
                            <LabelInput htmlFor="modal--file">Arquivo (PDF)</LabelInput>
                            <Input                            
                                id="modal--body"
                                label="Arquivo"
                                type="file"                                                                                      
                                placeholder="Escolha um arquivo"
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachFileIcon />
                                    </InputAdornment>
                                    ),
                                }}                                
                                onChange={handleInputModalFile}
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

export default Reservations;