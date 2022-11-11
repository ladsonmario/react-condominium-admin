import { styled } from '@mui/material';

type Props = {
    size: string;
    measure: string
}

export const LogoImg = ({ size, measure }: Props) => {
    const LogoImg = styled('img')(
        () => `
          width: ${size}${measure};
        `
    );
         
    return <LogoImg src="/homelogo.png" />;
}