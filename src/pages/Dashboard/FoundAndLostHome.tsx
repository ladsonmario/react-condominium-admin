import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  Divider,
  alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useAPI } from 'src/services/api';
import { FoundAndLostType, ResultFoundAndLostType } from 'src/types/types';
import { Link } from 'react-router-dom';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
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

function FoundAndLostHome() {  
  const [list, setList] = useState<FoundAndLostType[]>([]);
  const [recovered, setRecovered] = useState(0);
  const [lost, setLost] = useState(0);

  useEffect(() => {
    ( async () => {
      const result: ResultFoundAndLostType = await useAPI.getFoundAndLost();
      if(result.error === '') setList(result.list);
    })();
  }, []);

  useEffect(() => {
    const itemsRecovered: FoundAndLostType[] = []; 
    const itemsLost: FoundAndLostType[] = [];

    for(let i = 0; i < list.length; i++) {               
      if(list[i].status === 'recovered') {
        itemsRecovered.push(list[i]);        
      } else {
        itemsLost.push(list[i]);
      }        
    }

    setLost(itemsLost.length + 1);
    setRecovered(itemsRecovered.length + 1);
  }, [list]);

  const percentFormat = (n: number) => {    
    return `${((n * 100) / list.length).toFixed(2)}%`;
  }

  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    colors: ['#3835FB', '#F12B2B'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return parseInt(val.toString()) + '%';
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]]
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5
        }
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: ['Achados', 'Perdidos'],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [recovered, lost];

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Achados e Perdidos
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                Total de {list.length + 1}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                {recovered} itens recuperados
              </Typography>
              <Box
                display="flex"
                sx={{
                  py: 4
                }}
                alignItems="center"
              >
                <AvatarSuccess
                  sx={{
                    mr: 2
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">A taxa de itens recuperados</Typography>
                  <Typography variant="subtitle2" noWrap sx={{ whiteSpace: 'pre-line' }}>
                    Vem subindo a cada dia mais com a boa ação das pessoais ao fazer a sua devolução.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Grid container spacing={3}>              
              <Grid sm item>
                <Link to="/management/foundandlost">
                  <Button fullWidth variant="contained">
                    Ir para Achados e Perdidos
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          sx={{
            position: 'relative'
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' }
            }}
          >
            <Divider absolute orientation="vertical" />
          </Box>
          <Box py={4} pr={4} flex={1}>
            <Grid container spacing={0}>
              <Grid
                xs={12}
                sm={5}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Chart
                  height={250}
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                />
              </Grid>
              <Grid xs={12} sm={7} item display="flex" alignItems="center">
                <List
                  disablePadding
                  sx={{
                    width: '100%'
                  }}
                >
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <InsertEmoticonIcon />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="Itens"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Recuperados"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>                        
                        <Text color="success">{percentFormat(recovered)}</Text>
                      </Typography>                      
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatarWrapper>
                      <SentimentVeryDissatisfiedIcon />
                    </ListItemAvatarWrapper>
                    <ListItemText
                      primary="Itens"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Perdidos"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        <Text color="error">{percentFormat(lost)}</Text>
                      </Typography>                      
                    </Box>
                  </ListItem>                  
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default FoundAndLostHome;
