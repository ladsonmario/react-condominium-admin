import { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { useAPI } from 'src/services/api';
import { 
    styled,
    Box, 
    Card, 
    Container, 
    Typography, 
    CardContent,       
    Dialog,
    Switch,
    TextField,
    Button
} from '@mui/material';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { FoundAndLostType, ResultFoundAndLostType } from 'src/types/types';

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

const FoundAndLost = () => {
    type ResultActionsFoundAndLostType = {
        error: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<FoundAndLostType[]>([]);
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        const result: ResultFoundAndLostType = await useAPI.getFoundAndLost();
        setLoading(false);

        if(result.error !== '') {
            alert(result.error);
        } else {
            setList(result.list);            
        }
    }

    const handleSwitchClick = async (id: number) => {
        if(window.confirm('Deseja alterar esse item?')) {
            setLoading(true);
            const result: ResultActionsFoundAndLostType = await useAPI.updateFoundAndLost(id.toString());
            setLoading(false);            

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const showLightbox = (photo: string) => {
        setPhotoUrl(photo);
    }

    const handleCloseLightbox = () => {
        setPhotoUrl('');
    }

    const columns: GridColDef[] = [
        { 
            field: 'status', 
            headerName: 'Recuperado', 
             
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <>                
                    <Switch 
                        color="success" 
                        checked={params.value === 'recovered'} 
                        onChange={() => handleSwitchClick(params.row.id)}
                    />
                </>
            )
        },        
        { field: 'where', headerName: 'Local Encontrado', flex: 1, minWidth: 300 },        
        { field: 'description', headerName: 'Descrição', flex: 1, minWidth: 300 },        
        { 
            field: 'photo', 
            headerName: 'Foto', 
            width: 100,
            renderCell: (params: GridRenderCellParams)  => (
                <>
                    {params.row.photo &&
                        <Button 
                            color="success"
                            variant="contained"
                            onClick={() => showLightbox(params.row.photo)}
                        >
                            Ver foto
                        </Button>
                    }                    
                </>
            )
        },        
        { field: 'datecreated_formatted', headerName: 'Data', flex: 1, minWidth: 300 }
    ];

    return (
        <>
            <PageTitleWrapper>
                <Typography variant="h2">Achados e Perdidos</Typography>
            </PageTitleWrapper>
            <Container>
                <Box>                                
                    <Card>
                        <CardContent>                            
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

            {photoUrl &&
                <Lightbox 
                    mainSrc={photoUrl}
                    onCloseRequest={handleCloseLightbox}
                    reactModalStyle={{ overlay: { zIndex: 999 }}}                    
                />
            }
        </>        
    );
}

export default FoundAndLost;