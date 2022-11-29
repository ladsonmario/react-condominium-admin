import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import FoundAndLostHome from './FoundAndLostHome';
import AreaHome from './AreaHome';
import ContactsHome from './ContactsHome';

function Dashboard() {
  return (
    <>      
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <FoundAndLostHome />
          </Grid>
          <Grid item lg={8} xs={12}>
            <AreaHome />
          </Grid>
          <Grid item lg={4} xs={12}>
            <ContactsHome />
          </Grid>          
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Dashboard;
