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
import { WarningListType } from 'src/types/types';

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

const Warnings = () => {
    type ResultWarningType = {
        error: string;
        list: WarningListType[];
    }
    type ResultActionsWarningType = {
        error: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<WarningListType[]>([]);
    const [photoList, setPhotoList] = useState<string[]>([]);
    const [photoListIndex, setPhotoListIndex] = useState(0);

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        const result: ResultWarningType = await useAPI.getWarnings();
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
            const result: ResultActionsWarningType = await useAPI.updateWarning(id.toString());
            setLoading(false);

            if(result.error === '') {
                getList();
            } else {
                alert(result.error);
            }
        }
    }

    const showLightbox = (photos: string[]) => {
        setPhotoListIndex(0);
        setPhotoList(photos);
    }

    const handleCloseLightbox = () => {
        setPhotoList([]);
    }
    const handlePrevPhoto = () => {
        if(photoList[photoListIndex - 1] !== undefined) {
            setPhotoListIndex(photoListIndex - 1);
        }
    }
    const handleNextPhoto = () => {
        if(photoList[photoListIndex + 1] !== undefined) {
            setPhotoListIndex(photoListIndex + 1);
        }
    }

    const columns: GridColDef[] = [
        { 
            field: 'status', 
            headerName: 'Resolvido', 
            flex: 1, 
            minWidth: 300,
            renderCell: (params: GridRenderCellParams) => (
                <Switch 
                    color="success" 
                    checked={params.value === 'RESOLVED'} 
                    onChange={() => handleSwitchClick(params.row.id)}
                />
            )
        },        
        { field: 'name_unit', headerName: 'Unidade', flex: 1, minWidth: 300 },        
        { field: 'title', headerName: 'Título', flex: 1, minWidth: 300 },        
        { 
            field: 'photos', 
            headerName: 'Fotos', 
            flex: 1, 
            minWidth: 300,
            renderCell: (params: GridRenderCellParams)  => (
                <td>
                    {params.value &&
                        <Button 
                            color="success"
                            onClick={() => showLightbox(params.row.photos)}
                        >
                            {params.row.photos.length} foto{params.row.photos.length !== 1 ? 's' : ''}
                        </Button>
                    }                    
                </td>
            )
        },        
        { field: 'datecreated_formatted', headerName: 'Data', flex: 1, minWidth: 300 }
    ];

    return (
        <>
            <PageTitleWrapper>
                <Typography variant="h2">Ocorrências</Typography>
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

            {photoList.length > 0 &&
                <Lightbox 
                    mainSrc={photoList[photoListIndex]}
                    nextSrc={photoList[photoListIndex + 1]}
                    prevSrc={photoList[photoListIndex - 1]}
                    onCloseRequest={handleCloseLightbox}
                    onMoveNextRequest={handleNextPhoto}
                    onMovePrevRequest={handlePrevPhoto}
                    reactModalStyle={{ overlay: { zIndex: 999 }}}                    
                />
            }
        </>        
    );
}

export default Warnings;