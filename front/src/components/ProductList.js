/**
 * Table product list
 */
import React, { PureComponent } from 'react';
import MaterialTable from 'material-table';
import Autocomplete from './Autocomplete';

const columns = [
    {
        title: 'Product name',
        field: 'name',
        editComponent: (props) => {
            console.log(props);
            return <Autocomplete
                value={props.value}
                onChange={(_, value) => props.onChange(value)}
                onRowDataChange={props.onRowDataChange}
                submit={() => {
                    const rowData = props.rowData;

                    rowData.totalPrice = rowData.quantity * rowData.price;

                    const cloneData = [...this.state.data, rowData];

                    this.setState({ data: cloneData });
                }}
            />
        },
        headerStyle: {
            width: 400
        }
    },
    {
        title: 'Quantity',
        field: 'quantity',
        type: 'numeric',
        initialEditValue: '1'
    },
    {
        title: 'Price per quantity',
        field: 'price',
        type: 'numeric',
        initialEditValue: '0'
    },
    {
        title: 'Total product price',
        field: 'totalPrice',
        type: 'numeric',
        editable: 'never'
    }
];

export default class ProductList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    onPrint = () => {

    }

    // eslint-disable-next-line max-lines-per-function
    render() {
        const { data } = this.state;

        return (
            <MaterialTable
                options={{
                    pageSize: 10,
                    actionsColumnIndex: -1,
                    searchFieldAlignment: 'left',
                    showTitle: false,
                    paging: false
                }}
                actions={[
                    {
                        icon: 'print',
                        tooltip: 'Print',
                        isFreeAction: true,
                        onClick: (event) => {
                            window.print();
                        }
                    }
                ]}
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve) => {
                            newData.totalPrice = newData.quantity * newData.price;

                            const cloneData = [...this.state.data, newData];

                            this.setState({ data: cloneData }, () => resolve());
                        }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                        newData.totalPrice = newData.quantity * newData.price;

                        const { data } = this.state;
                        const index = data.indexOf(oldData);
                        const cloneData = [...data];

                        cloneData[index] = newData;

                        this.setState({ data: cloneData }, () => resolve());
                    }),
                    onRowDelete: (oldData) => new Promise((resolve) => {
                        const { data } = this.state;
                        const index = data.indexOf(oldData);
                        const cloneData = [...data];

                        cloneData.splice(index, 1);
                        this.setState({ data: cloneData }, () => resolve());
                    })
                }}
            />
        );
    }
}