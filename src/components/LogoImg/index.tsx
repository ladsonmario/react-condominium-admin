import { styled } from '@mui/material';

type Props = {
    size: string;
    measure: string;
    icoImg?: boolean;
}

export const LogoImg = ({ size, measure, icoImg }: Props) => {
    const LogoImg = styled('img')(
        () => `
          width: ${size}${measure};
        `
    );
         
    return <LogoImg src={icoImg ? '/favicon.png' : '/homelogo.png'} />;
}