import Select from 'react-select';

import './toolbar.css'
import download from '../asserts/download.png'
import notes from '../asserts/notes.png'
import refresh from '../asserts/refresh.png'

function ToolBarComponent({ onRefresh, onSelectChange, onDownload }) {

    const options = [
        { value: 'Simples', label: 'Simples' },
        { value: 'Prim', label: 'Árvore geradora mínima (Prim)' },
        { value: 'Kruskal', label: 'Árvore geradora mínima (Kruskal)' },
        { value: 'Dijkstra', label: 'Caminho mínimo (Dijkstra)' },
        { value: 'Bellman-Ford', label: 'Caminho mínimo (Bellman-Ford)' }
    ];

    const customStyles = {
        control: () => ({
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            minHeight: 'unset',
            width: '300px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            color: 'black',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: 0,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'white',
            zIndex: 9999,
            marginTop: 4,
        }),
        option: (base, state) => ({
        ...base,
        backgroundColor: 'transparent',
        color: 'black',
        cursor: 'pointer',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'black',
        }),
        };


    return (
        <div className="toolbar-wrapper">
            <div className="toolbar">
                <button className="icon-btn" onClick={onDownload}>
                    <img className="toolbar-img" src={download} alt="Download" />
                </button>
                <p className="divide">|</p>
                <label className="icon-select">
                    <img className="toolbar-img" src={notes} alt="Notes" />
                    <Select
                        classNamePrefix="react-select"
                        options={options}
                        defaultValue={options[0]}
                        onChange={(option) => {
  if (!option) return;
  onSelectChange(option?.value);
}}
                        styles={customStyles}
                    />
                </label>
            </div>
            <button onClick={onRefresh} className="refresh-btn">
                <img className="toolbar-img" src={refresh} alt="Refresh" />
            </button>
        </div>
    )
}

export default ToolBarComponent
