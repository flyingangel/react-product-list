import { createMuiTheme } from '@material-ui/core/styles';

const Theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                marginLeft: 5,
                marginRight: 5
            }
        }
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
        useNextVariants: true
    }
});

export default Theme;