import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridToolbarExport,
    GridFooterContainer,
    GridPagination,
    GridFooter
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, Button, Stack } from '@mui/material';
import { useComputedColorScheme } from '@mantine/core';
import { IconListCheck, IconTableOptions } from '@tabler/icons-react';
import { theme } from 'theme';

interface DynamicTableProps {
    data: any[];
}

const darkTheme = createTheme({
    //direction: 'ltr',
    palette: {
        mode: 'dark',
        background: {
            default: theme?.colors?.mainColor?.[6],
            paper: theme?.colors?.mainColor?.[6],
        },
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
    },
});

const lightTheme = createTheme({
    //direction: 'ltr',
    palette: {
        mode: 'light',
    },
});

// Helper to detect numeric values
const isNumeric = (value: any) => !isNaN(Number(value));

/** 
 * 1) We remove the old CustomToolbar 
 *    and define a custom footer instead.
 */

function CustomFooter(props: any) {
    return (
        <GridFooterContainer
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Stack direction="row" spacing={2}>
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'CHATBOT_DATA',
                        utf8WithBom: true,
                    }}
                    slotProps={{
                        tooltip: { title: 'Export data' },
                        button: {
                            style: {
                                marginLeft: '10px',
                            },
                        },
                    }}
                />

            </Stack>

            <GridPagination {...props} />
        </GridFooterContainer>
    );
}



const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
    const computedColorScheme = useComputedColorScheme('light');
    if (!data || data.length === 0) {
        return null; // Handle empty data
    }

    // Gather all unique keys
    const allKeysSet = new Set<string>();
    data.forEach(item => {
        Object.keys(item).forEach(key => allKeysSet.add(key));
    });
    const headers = Array.from(allKeysSet);

    // Define columns for DataGrid
    const columns: GridColDef[] = headers.map((header) => ({
        field: header,
        headerName: header,
        flex: 1,
        minWidth: 100,
    }));

    // Preprocess rows to ensure consistent fields
    const preprocessedRows = data.map((row, index) => {
        const newRow: any = { id: index };
        headers.forEach(header => {
            newRow[header] = row[header] !== undefined ? row[header] : null;
            if (isNumeric(newRow[header])) {
                newRow[header] = Number(newRow[header]);
            }
        });
        return newRow;
    });

    const isDark = computedColorScheme === 'dark';

    return (
        <div dir="ltr">
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <Paper
                    sx={{
                        width: '100%',
                        overflow: 'auto',
                        marginBottom: '1rem',
                        marginTop: '1.5rem',
                    }}
                >
                    <DataGrid
                        rows={preprocessedRows}
                        columns={columns}
                        rowHeight={35}
                        columnHeaderHeight={35}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        slots={{
                            footer: CustomFooter,
                        }}
                        initialState={{
                            pagination: { paginationModel: { page: 0, pageSize: 5 } },
                        }}
                        sx={{
                            // scrollbarWidth: 'thin',
                            // scrollbarColor: `${isDark ? '#152f55' : '#eeeeee'} transparent`,
                            backgroundColor: isDark ? '#152f55' : undefined,
                            // Add your custom scrollbar styles here:
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888',
                                //borderRadius: '8px',
                                //border: '2px solid #f1f1f1', // optional border
                            },
                            // For Firefox:
                            scrollbarColor: isDark ? theme?.colors?.mainColor?.[6] : '#f1f1f1',
                            scrollbarWidth: 'thin',
                            '& .MuiDataGrid-cell': {
                                backgroundColor: isDark ? theme?.colors?.mainColor?.[6] : undefined,
                                color: isDark ? 'white' : undefined,
                                display: 'flex',
                                // alignItems: 'right',
                                justifyContent: 'right',
                                textAlign: 'right',
                                border: isDark ? '0.2px solid #515151' : '1px solid #eeeeee',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                //direction: 'ltr',
                                backgroundColor: isDark ? theme?.colors?.mainColor?.[6] : undefined,
                            },
                        }}
                    />
                </Paper>
            </ThemeProvider>
        </div>
    );
};

export default DynamicTable;
