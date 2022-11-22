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
import TodayIcon from '@mui/icons-material/Today';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ReservationsType, AreaType, UnitType, ReservationDataType } from 'src/types/types';

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
    type ResultReservationType = {
        error: string;
        list: ReservationsType[];
    }
   
    type ResultActionsReservationType = {
        error: string;
    } 
    
    type ResultUnitType = {
        error: string;
        list: UnitType[];
    }

    type ResultAreaType = {
        error: string;
        list: AreaType[];
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<ReservationsType[]>([]);
    const [showModal, setShowModal] = useState(false);    
    const [modalId, setModalId] = useState('');
    const [modalUnitList, setModalUnitList] = useState<UnitType[]>([]);
    const [modalAreaList, setModalAreaList] = useState<AreaType[]>([]);    
    const [modalUnitId, setModalUnitId] = useState(0);
    const [modalAreaId, setModalAreaId] = useState(0);
    const [modalDate, setModalDate] = useState('');

    useEffect(() => {
        getList();
        getUnitList();
        getAreaList();
    }, []);

    const handleInputModalDate = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalDate(e.target.value);
    }
    const handleInputUnit = (e: SelectChangeEvent) => {
        setModalUnitId(parseInt(e.target.value));        
    }
    const handleInputArea = (e: SelectChangeEvent) => {
        setModalAreaId(parseInt(e.target.value));        
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultReservationType = await useAPI.getReservations();
        setLoading(false);

        if(result.error !== '') {
            alert(result.error);
        } else {
            setList(result.list);            
        }
    }

    const getUnitList = async () => {
        const result: ResultUnitType = await useAPI.getUnits();        
        if(result.error === '') {
            setModalUnitList(result.list);
        }        
    }

    const getAreaList = async () => {
        const result: ResultAreaType = await useAPI.getAreas();        
        if(result.error === '') {
            setModalAreaList(result.list);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleNewButton = () => {
        setModalId('');
        setModalUnitId(modalUnitList[0].id);
        setModalAreaId(modalAreaList[0].id);
        setModalDate('');

        setShowModal(true);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());
        setModalUnitId(list[index].id_unit);
        setModalAreaId(list[index].id_area);
        setModalDate(list[index].reservation_date);   

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Você deseja excluir esse item?')) {
            const result: ResultActionsReservationType = await useAPI.removeReservation(id);

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        if(modalUnitId && modalAreaId && modalDate) {                        
            setLoading(true);            
            let result: ResultReservationType = null;
            const newDate = modalDate.length === 16 ? `${modalDate}:00` : modalDate;
            const data: ReservationDataType = {
                id_unit: modalUnitId,
                id_area: modalAreaId,
                reservation_date: newDate.replace('T', ' ')
            }
            
            if(!modalId) {
                result = await useAPI.addReservation(data);
            } else {                
                result = await useAPI.updateReservation(modalId, data);
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
                        disabled={modalUnitList.length === 0 || modalAreaList.length === 0 ? true : false}
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
                                disabled={modalUnitList.length === 0 || modalAreaList.length === 0 ? true : false}
                            >
                                Nova Reserva
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
                            <LabelInput htmlFor="modal--unit">Unidades</LabelInput>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="modal--unit">Unidade</InputLabel>
                                <Select
                                    labelId="modal--unit"
                                    id="modal--unit"                                
                                    label="Unidade"
                                    value={modalUnitId.toString()}
                                    onChange={handleInputUnit}                                    
                                >
                                    <MenuItem value=""><em>Escolha uma unidade</em></MenuItem>
                                    {modalUnitList.length > 0&& modalUnitList.map((item, index) => (                                    
                                        <MenuItem 
                                            key={index} 
                                            value={item.id}                                            
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <LabelInput htmlFor="modal--area">Áreas</LabelInput>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="modal--area">Área</InputLabel>
                                <Select
                                    labelId="modal--area"
                                    id="modal--area"                                
                                    label="Área"
                                    value={modalAreaId.toString()}
                                    onChange={handleInputArea}                                    
                                >
                                    <MenuItem value=""><em>Escolha uma área</em></MenuItem>
                                    {modalAreaList.length > 0&& modalAreaList.map((item, index) => (                                    
                                        <MenuItem 
                                            key={index} 
                                            value={item.id}                                            
                                        >
                                            {item.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <LabelInput htmlFor="modal--date">Data da reserva</LabelInput>
                            <Input                            
                                id="modal--date"
                                label="Data"
                                type="datetime-local"                                
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <TodayIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalDate}
                                onChange={handleInputModalDate}                                
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