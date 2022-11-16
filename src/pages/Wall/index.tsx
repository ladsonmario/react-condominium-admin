import { useEffect, useState } from 'react';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { useAPI } from 'src/services/api';
import { 
    Grid, 
    Box, 
    Card, 
    Container, 
    Typography, 
    CardContent,
    Button,    
    Divider    
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Wall = () => {
    type ResultWallType = {
        error: string;
        list: ListType[];
    }

    type ListType = {
        id: number;
        title: string;
        body: string;
        datecreated: string;
    }

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<ListType[]>([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        const result: ResultWallType = await useAPI.getWall();
        setLoading(false);

        console.log(result);

        if(result.error !== '') {
            alert(result.error);
        } else {
            setList(result.list);            
        }
    }

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Título', flex: 1 },
        { field: 'datecreated', headerName: 'Data de criação', flex: 1 },
        { field: 'actions', headerName: 'Ações', flex: 1 }
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
        </>        
    );
}

export default Wall;