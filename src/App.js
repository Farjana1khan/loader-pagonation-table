import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import "./App.css";

function App() {
  const [gridApi, setGridApi] = useState(null);
  const perPage = 3;

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          

          gridApi.showLoadingOverlay();
          const page = params.endRow / perPage;
          fetch(`https://reqres.in/api/users?per_page=${perPage}&page=${page}`)
            .then((resp) => resp.json())
            .then((res) => {
              if (!res.data.length) {
                gridApi.showNoRowsOverlay();
              } else {
                gridApi.hideOverlay();
              }
              params.successCallback(res.data, res.total);
            })
            .catch((err) => {
              gridApi.showNoRowsOverlay();
              params.successCallback([], 0);
            });
        },
      };

      gridApi.setDatasource(dataSource);
    }
  }, [gridApi]);

  const avatarFormatter = ({ value }) => {
    return <img src={value} width="50px" height="50px" />;
  };

  return (
    <div className="App">
      <h2>
        Add a loading in React AG Grid 
       
      </h2>
      <div className="ag-theme-alpine ag-style">
        <AgGridReact
          pagination={true}
          rowModelType={"infinite"}
          paginationPageSize={perPage}
          cacheBlockSize={perPage}
          onGridReady={onGridReady}
          rowHeight={60}
          defaultColDef={{ flex: 1 }}
          overlayLoadingTemplate={
            '<span className="ag-overlay-loading-center">Please wait while your rows are loading...</span>'
          }
          overlayNoRowsTemplate={
            '<span className="ag-overlay-loading-center">No data found to display.</span>'
          }
        >
          <AgGridColumn
            field="first_name"
            headerName="First Name"
            cellClass="vertical-middle"
          />
          <AgGridColumn
            field="last_name"
            headerName="Last Name"
            cellClass="vertical-middle"
          />
          <AgGridColumn
            field="email"
            headerName="Email"
            cellClass="vertical-middle"
          />
          <AgGridColumn
            field="avatar"
            headerName="Avatar"
            cellRendererFramework={avatarFormatter}
            cellClass="vertical-middle"
          />
        </AgGridReact>
      </div>
    </div>
  );
}

export default App;
