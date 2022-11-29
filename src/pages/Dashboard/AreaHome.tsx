import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  Tooltip,
  CardActionArea,
  styled,
  Switch,
  CardMedia,
  Divider
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { AreaType, ResultAreaType } from 'src/types/types';
import { useAPI } from 'src/services/api';
import { Link } from 'react-router-dom';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        transition: ${theme.transitions.create(['all'])};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[70]};
        }
`
);

function AreaHome() {
  const [list, setList] = useState<AreaType[]>([]);
  
  useEffect(() => {
    ( async () => {
      const result: ResultAreaType = await useAPI.getAreas();
      if(result.error === '') setList(result.list);
    })();
  }, []);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">Áreas</Typography>
        <Link to="/data/commonareas" style={{ textDecoration: 'none' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Ir para Áreas Comuns
          </Button>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {list && list.length > 0 && list.map((item, index) => (
          <Grid xs={12} sm={6} md={3} item key={index}>
            <Card
              sx={{
                px: 1
              }}
            >
              <CardContent>
                <Box>
                  <Typography variant="subtitle1" noWrap>
                    {item.allowed === 1 ? 'Ativo' : 'Desativado'}
                  </Typography>
                  <Switch 
                    checked={item.allowed === 1}
                    color="success"                    
                  />
                </Box>
                <Divider /> 
                <Box sx={{ margin: '10px 0' }}>
                  <CardMedia component="img" src={item.cover} /> 
                </Box> 
                <Divider />              
                <Box
                  sx={{
                    pt: 3
                  }}
                >
                  <Typography variant="h4" gutterBottom noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    Abre as {item.start_time}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid xs={12} sm={6} md={3} item>
          <Tooltip arrow title="Adicionar ou editar Área Comum">
            <Link to="/data/commonareas">
              <CardAddAction>
                <CardActionArea
                  sx={{
                    px: 1
                  }}
                >
                  <CardContent>
                    <AvatarAddWrapper>
                      <AddTwoToneIcon fontSize="large" />
                    </AvatarAddWrapper>
                  </CardContent>
                </CardActionArea>
              </CardAddAction>
            </Link>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

export default AreaHome;
