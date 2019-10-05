import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Theme from "./Theme";
import ProductList from "./ProductList";
import styled from "styled-components";

const Main = styled.main`
  padding: 30px;
`;

const theme = createMuiTheme(Theme);

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <div>
                    <Main>
                        <ProductList />
                    </Main>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;