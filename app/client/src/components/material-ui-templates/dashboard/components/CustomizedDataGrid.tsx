import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

type Props = {
  rows: readonly any[];
  columns: GridColDef[];
  setSelectedRows?: (rows: any[]) => void;
  unselectRows?: boolean;
  setUnselectRows?: (value: boolean) => void;
};

export default function CustomizedDataGrid(props: Props) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel);

    // Met à jour les lignes sélectionnées en fonction du modèle de sélection actuel
    const selectedRows = props.rows.filter(row => newSelectionModel.includes(row.id));
    if (props.setSelectedRows) {
      props.setSelectedRows(selectedRows);
    }
  };

  // Fonction pour effacer la sélection
  const clearSelection = () => {
    setSelectionModel([]);
    if (props.setSelectedRows) {
      props.setSelectedRows([]); // Réinitialise les lignes sélectionnées dans le parent
    }
  };

  useEffect(() => {
    if (props.unselectRows) {
      props.setUnselectRows && props.setUnselectRows(false);
      clearSelection();
    }
  }, [props.unselectRows]);

  return (
    <div>
      <DataGrid
        sx={{ height: '70vh', maxHeight: '70vh' }}
        checkboxSelection
        rows={props.rows}
        columns={props.columns}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        disableMultipleRowSelection
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={selectionModel} // Utilise le modèle de sélection pour contrôle
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
      />  
    </div>
  );
}
