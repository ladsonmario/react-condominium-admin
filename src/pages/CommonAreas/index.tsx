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
    Switch,
    CardMedia,   
    Checkbox,
    FormControlLabel
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import TitleIcon from '@mui/icons-material/Title';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AreaType, AreaDataType, ResultAreaType } from 'src/types/types';

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

const ContainerCheckbox = styled(Box)(
    () => `
        display: flex;
        flex-direction: column;
        width: 50%;
    `
);

type Props = {
    item: GridRenderCellParams;
}
const ListDayWords = ({ item }: Props) => {   
    const dayWords = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const days: string[] = item.value.split(',');
    let dayString: string[] = [];

    for(let i in days) {
        if(days[i] && dayWords[days[i]]) {
            dayString.push(dayWords[days[i]]);
        }
    }

    return (
        <>
            {dayString.length < 7 &&
                <Box  sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {dayString.join(', ')}
                </Box>
            }
            {dayString.length === 7 &&
                <Box>Todos os dias</Box>
            }
        </>        
    );
}

const CommonAreas = () => {
    type ResultActionsAreaType = {
        error: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<AreaType[]>([]);
    const [showModal, setShowModal] = useState(false);    
    const [modalId, setModalId] = useState('');
    const [modalAllowed, setModalAllowed] = useState(1);
    const [modalTitle, setModalTitle] = useState('');
    const [modalCover, setModalCover] = useState<File>();
    const [modalDays, setModalDays] = useState<string[]>([]);
    const [modalStartTime, setModalStartTime] = useState('');
    const [modalEndTime, setModalEndTime] = useState('');

    useEffect(() => {
        getList();
    }, []);

    const handleInputModalAllowed = () => {                
        setModalAllowed(1 - modalAllowed);
    }
    const handleInputModalTitle = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalTitle(e.target.value);
    }
    const handleInputModalCover = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalCover(e.currentTarget.files[0]);
    }
    const handleInputModalStartTime = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalStartTime(e.target.value);
    }
    const handleInputModalEndTime = (e: ChangeEvent<HTMLInputElement>) => {                
        setModalEndTime(e.target.value);
    }
    const toggleModalDays = (item: string, e: ChangeEvent<HTMLInputElement>) => {
        let days = [...modalDays];
        
        if(e.target.checked === false) {
            days = days.filter(d => d !== item);
        } else {
            days.push(item);
        }

        setModalDays(days);
    }

    const getList = async () => {
        setLoading(true);
        const result: ResultAreaType = await useAPI.getAreas();
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
        setModalAllowed(1);
        setModalTitle('');
        setModalCover(null);
        setModalDays([]);
        setModalStartTime('');
        setModalEndTime('');

        setShowModal(true);
    }

    const handleEditButton = (id: string) => {        
        const index = list.findIndex(item => item.id === parseInt(id));
        
        setModalId(list[index].id.toString());        
        setModalAllowed(list[index].allowed);
        setModalTitle(list[index].title);
        setModalCover(null);
        setModalDays(list[index].days.split(','));
        setModalStartTime(list[index].start_time);
        setModalEndTime(list[index].end_time);  

        setShowModal(true);
    }

    const handleRemoveButton = async (id: string) => {
        if(window.confirm('Você deseja excluir esse item?')) {
            const result: ResultActionsAreaType = await useAPI.removeArea(id);

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const handleModalSave = async () => {
        if(modalTitle && modalStartTime && modalEndTime) {                        
            setLoading(true);            
            let result: ResultAreaType = null;            
            const data: AreaDataType = {
                allowed: modalAllowed,
                title: modalTitle,
                days: modalDays.join(','),
                start_time: modalStartTime,
                end_time: modalEndTime
            }
            
            if(modalCover) {
                data.cover = modalCover;
            }

            if(!modalId) {
                result = await useAPI.addArea(data);
            } else {                
                result = await useAPI.updateArea(modalId, data);
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

    const handleSwitchClick = async (id: number) => {
        if(window.confirm('Deseja alterar esse item?')) {
            setLoading(true);
            const result: ResultActionsAreaType = await useAPI.updateAreaAllowed(id.toString());
            setLoading(false);            

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const columns: GridColDef[] = [
        { 
            field: 'allowed', 
            headerName: 'Ativo',             
            width: 70,   
            sortable: false,         
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams) => (
                <Switch 
                    color="success" 
                    checked={params.value === 1} 
                    onChange={() => handleSwitchClick(params.row.id)}
                />
            )
        },        
        { 
            field: 'cover', 
            headerName: 'Capa',             
            width: 150,
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams) => (
                <CardMedia 
                    component="img"
                    src={params.value}
                    sx={{
                        width: '150px'                        
                    }}
                />
            )
        },        
        { 
            field: 'title', 
            headerName: 'Título', 
            width: 250,
            sortable: false,  
            hideable: false         
        },        
        { 
            field: 'days', 
            headerName: 'Dias de Funcionamento', 
            flex: 1, 
            minWidth: 300,
            disableColumnMenu: true,  
            hideable: false,
            sortable: false,
            filterable: false,            
            renderCell: (params: GridRenderCellParams) => <ListDayWords item={params} />
        },        
        { 
            field: 'start_time', 
            headerName: 'Abre', 
            width: 70,
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true
        },        
        { 
            field: 'end_time', 
            headerName: 'Fecha', 
            width: 70,
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true
        },      
        { 
            field: 'id', 
            headerName: 'Ações', 
            width: 180,
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
                <Typography variant="h2">Áreas Comuns</Typography>
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
                                Nova Área Comum
                            </Button>
                            <Divider sx={{ margin: '15px 0' }} />
                            <Box>
                                <DataGrid 
                                    rows={list}
                                    columns={columns}    
                                    autoHeight={true}    
                                    loading={loading} 
                                    rowHeight={100}                                                                          
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
                    <Typography variant="h3">{modalId === '' ? 'Novo' : 'Editar'} Área Comum</Typography>
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
                            <LabelInput htmlFor="modal--allowed">Ativo</LabelInput>
                            <Switch                            
                                id="modal--allowed"
                                color="success"
                                checked={modalAllowed === 1}
                                onChange={handleInputModalAllowed}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>

                        <Box>
                            <LabelInput htmlFor="modal--title">Nome da Área</LabelInput>
                            <Input                            
                                id="modal--title"
                                label="Título"
                                type="text"       
                                placeholder="Digite um nome para área"                         
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
                            <LabelInput htmlFor="modal--cover">Capa da Área</LabelInput>
                            <Input                            
                                id="modal--cover"
                                label="Foto"
                                type="file"                                
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachFileIcon />
                                    </InputAdornment>
                                    ),
                                }}                                
                                onChange={handleInputModalCover}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>

                        <Box>
                            <LabelInput htmlFor="modal--cover">Dias de Funcionamento</LabelInput>
                            <Box sx={{ display: 'flex' }}>
                                <ContainerCheckbox>
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-0"
                                                name="modal-days"
                                                value={0}
                                                checked={modalDays.includes('0')}                                        
                                                onChange={(event) => toggleModalDays('0', event)}
                                            />
                                        }
                                        label="Segunda-Feira"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-1"
                                                name="modal-days"
                                                value={1}
                                                checked={modalDays.includes('1')}                                        
                                                onChange={(event) => toggleModalDays('1', event)}
                                            />
                                        }
                                        label="Terça-Feira"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-2"
                                                name="modal-days"
                                                value={2}
                                                checked={modalDays.includes('2')}                                        
                                                onChange={(event) => toggleModalDays('2', event)}
                                            />
                                        }
                                        label="Quarta-Feira"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-3"
                                                name="modal-days"
                                                value={3}
                                                checked={modalDays.includes('3')}                                        
                                                onChange={(event) => toggleModalDays('3', event)}
                                            />
                                        }
                                        label="Quinta-Feira"
                                    />
                                </ContainerCheckbox>
                                <ContainerCheckbox>
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-4"
                                                name="modal-days"
                                                value={4}
                                                checked={modalDays.includes('4')}                                        
                                                onChange={(event) => toggleModalDays('4', event)}
                                            />
                                        }
                                        label="Sexta-Feira"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-5"
                                                name="modal-days"
                                                value={5}
                                                checked={modalDays.includes('5')}                                        
                                                onChange={(event) => toggleModalDays('5', event)}
                                            />
                                        }
                                        label="Sábado"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                id="modal-days-6"
                                                name="modal-days"
                                                value={6}
                                                checked={modalDays.includes('6')}                                        
                                                onChange={(event) => toggleModalDays('6', event)}
                                            />
                                        }
                                        label="Domingo"
                                    />
                                </ContainerCheckbox>
                            </Box>                            
                        </Box>
                        <Box>
                            <LabelInput htmlFor="modal--start--time">Horário de Abertura</LabelInput>
                            <Input                            
                                id="modal--start--time"
                                label="Abertura"
                                type="time"                                
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <HourglassTopIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalStartTime}                                
                                onChange={handleInputModalStartTime}                                
                                disabled={loading ? true : false}        
                            />
                        </Box>

                        <Box>
                            <LabelInput htmlFor="modal--end--time">Horário de Fechamento</LabelInput>
                            <Input                            
                                id="modal--end--time"
                                label="Fechamento"
                                type="time"                                
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <HourglassBottomIcon />
                                    </InputAdornment>
                                    ),
                                }}
                                value={modalEndTime}                                
                                onChange={handleInputModalEndTime}                                
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

export default CommonAreas;