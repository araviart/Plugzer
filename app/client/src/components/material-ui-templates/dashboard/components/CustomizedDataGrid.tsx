
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type Props = {
  rows: readonly any[];
  columns: GridColDef[];
  setSelectedRows?: (rows: any[]) => void;
};

export default function CustomizedDataGrid(props: Props) {
  const handleSelectionChange = (selectionModel: any) => {
    // Récupérer les lignes sélectionnées à partir du modèle de sélection
    const selectedRows = props.rows.filter(row => selectionModel.includes(row.id));
    
    // Appeler la fonction setSelectedRows si elle est définie
    if (props.setSelectedRows) {
      props.setSelectedRows(selectedRows);
    }
  };

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={props.rows}
      columns={props.columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      onRowSelectionModelChange={handleSelectionChange} // Ajout de l'événement
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
