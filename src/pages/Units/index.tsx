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
    InputAdornment,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent    
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import TitleIcon from '@mui/icons-material/Title';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { UnitType, UserType } from 'src/types/types';

let timer = 0;

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

const Units = () => {
    type ResultUnitType = {
        error: string;
        list: UnitType[];
    }
   
    type ResultActionsUnitType = {
        error: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<UnitType[]>([]);
    const [showModal, setShowModal] = useState(false);    
    const [modalId, setModalId] = useState('');
    const [modalName, setModalName] = useState('');
    const [modalOwnerSearch, setModalOwnerSearch] = useState('');
    const [modalOwnerList, setModalOwnerList] = useState<UserType[]>([]);
    const [modalOwner, setModalOwner] = useState<UserType>(null);

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        if(modalOwnerSearch !== '') {
            window.clearTimeout(timer);
            timer = window.setTimeout(searchUser, 1500);
        }
    }, [modalOwnerSearch]);

    const handleInputModalName = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalName(e.target.value);
    }
    const handleInputModalOwnerSearch = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalOwnerSearch(e.target.value);
    }
    const handleSetModalOwner = (e: SelectChangeEvent) => {
        const item = modalOwnerList.find(item => item.id === parseInt(e.target.value));
        setModalOwner(item);
        setModalOwnerList([]);
        setModalOwnerSearch('');
    }

    const searchUser = async () => {
        if(modalOwnerSearch !== '') {
            const result = await useAPI.searchUser(modalOwnerSearch);            
    
            if(result.error === '') {
                setModalOwnerList(result.list);
            } else {
                alert(result.error);
            }
        }
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultUnitType = await useAPI.getUnits();
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
        setShowModal(true);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());
        // setModalUnitId(list[index].id_unit);
        // setModalAreaId(list[index].id_area);
        // setModalDate(list[index].reservation_date);   

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Você deseja excluir esse item?')) {
            const result: ResultActionsUnitType = await useAPI.removeReservation(id);

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        // if(modalUnitId && modalAreaId && modalDate) {                        
        //     setLoading(true);            
        //     let result: ResultUnitType = null;
        //     const newDate = modalDate.length === 16 ? `${modalDate}:00` : modalDate;
        //     const data: ReservationDataType = {
        //         id_unit: modalUnitId,
        //         id_area: modalAreaId,
        //         reservation_date: newDate.replace('T', ' ')
        //     }
            
        //     if(!modalId) {
        //         result = await useAPI.addReservation(data);
        //     } else {                
        //         result = await useAPI.updateReservation(modalId, data);
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

    const handleResetOwnerButton = () => {
        setModalOwner(null);
    }

    const columns: GridColDef[] = [
        { 
            field: 'name', 
            headerName: 'Unidade', 
            flex: 1, minWidth: 300 
        },        
        { 
            field: 'name_owner', 
            headerName: 'Proprietário', 
            flex: 1, minWidth: 300,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    {params.value ?? '-'}
                </>
            )
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
                <Typography variant="h2">Unidades</Typography>
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
                                Nova Unidade
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
                            <LabelInput htmlFor="modal--name">Nome da unidade</LabelInput>
                            <Input                            
                                id="modal--name"
                                label="Unidade"
                                type="text"   
                                placeholder="Digite o nome da unidade"                             
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalName}
                                onChange={handleInputModalName}                                
                                disabled={loading ? true : false}        
                            />
                        </Box> 
                        <Box>
                            <LabelInput htmlFor="modal--owner">Proprietário (nome, cpf ou e-mail)</LabelInput>
                            {!modalOwner &&
                                <>
                                    <Input                            
                                        id="modal--owner"
                                        label="Proprietário"
                                        type="text"   
                                        placeholder="Digite nome, cpf ou e-mail do proprietário"                             
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <TitleIcon />
                                            </InputAdornment>
                                            ),
                                        }}
                                        value={modalOwnerSearch}
                                        onChange={handleInputModalOwnerSearch}                                
                                        disabled={loading ? true : false}        
                                    />
                                    {modalOwnerList.length > 0 &&
                                        <FormControl sx={{ width: '100%' }}>
                                            <Select                                         
                                                onChange={handleSetModalOwner}
                                                multiple
                                                native
                                            >
                                                {modalOwnerList.map((item, index) => (
                                                    <option key={index} value={item.id}>{item.name}</option>
                                                ))}
                                            </Select>
                                        </FormControl>                                
                                    }
                                </>
                            }                            
                            {modalOwner &&
                                <Box sx={{ marginTop: '10px' }}>
                                    <Button 
                                        variant="contained" 
                                        size="small" 
                                        color="error"
                                        onClick={handleResetOwnerButton}
                                    >
                                        x
                                    </Button>
                                    {modalOwner.name}
                                </Box>
                            }
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

export default Units;