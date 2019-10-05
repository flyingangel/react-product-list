/**
 * Input with autocomplete to search remote data
 */
import React, { PureComponent } from 'react';
import Input from '@material-ui/core/Input';
import styled from 'styled-components';
import axios from 'axios';

const Root = styled.div`
    & ul {
        position: fixed;
        list-style: none;
        background: white;
        z-index: 1;
        padding: 0;
        width: 250px;
        min-height: 40px;
        border: 1px #aaa solid;
    
        & li {
            padding: 10px;
            cursor: pointer;

            &:hover {
                background: MintCream;
            }
        }

        & li.new-item {
            border-top: 1px #ddd solid;
            color: CornFlowerBlue;
            font-weight: bold;

            & span {
                color: #888;
                float: right;
            }
        }
    }
`;

export default class Autocomplete extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            suggest: false,
            suggestionList: [],
            newItem: null
        };

        this.timer = null;
    }

    // Handle input change
    handleChange = (e) => {
        const { value } = e.target;
        const suggest = value.length >= 3;

        clearTimeout(this.timer);

        this.setState({
            value,
            suggest
        });

        this.props.onChange(e, value);

        if (!suggest) {
            return;
        }

        //prevent fast typing
        this.timer = setTimeout(() => {
            // Fetch suggestions from ajax
            axios.get(`/api/search/${value}`).then((response) => {
                let exist = false;

                const suggestionList = response.data.data.map((el) => {
                    const item = { ...el };

                    if (item.name === value) {
                        exist = true;
                    }

                    item.label = item.name.replace(new RegExp(value, 'i'), `<strong>${value}</strong>`);

                    return item;
                });

                // If not exist and text more than 1 letter
                let newItem = {};

                if (!exist && value.length >= 3) {
                    newItem.name = value;
                    newItem.label = value;
                } else {
                    newItem = null;
                }

                this.setState({
                    suggestionList,
                    value,
                    newItem
                });
            });
        }, 500);
    }

    handleSuggestClick = (item) => {
        return (e) => {
            const { id, name } = item;

            // Add new item
            if (!id) {
                axios.post('/api/new', {
                    name
                }).then((response) => {
                    if (response.data.code !== 0) {
                        console.warn('Saving item error');
                    }
                });
            }

            this.setState({
                value: name,
                suggest: false
            });

            this.props.onChange(e, name);
        };
    }

    render() {
        const { value, suggest, suggestionList, newItem } = this.state;

        return (
            <Root>
                <Input
                    onChange={this.handleChange}
                    type="search"
                    id="name"
                    value={value}
                    autoFocus
                />

                {suggest &&
                    <ul>
                        {Boolean(suggestionList.length) && suggestionList.map((item) =>
                            <li
                                key={item.id}
                                onClick={this.handleSuggestClick(item)}
                                dangerouslySetInnerHTML={{ __html: item.label }}
                            />
                        )}

                        {newItem &&
                            <li
                                className="new-item"
                                onClick={this.handleSuggestClick(newItem)}
                            >
                                {value}
                                <span>New item</span>
                            </li>
                        }
                    </ul>
                }
            </Root>
        );
    }
}