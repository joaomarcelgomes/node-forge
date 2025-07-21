import './toolbar.css'
import download from '../asserts/download.png'
import notes from '../asserts/notes.png'
import refresh from '../asserts/refresh.png'

function ToolBarComponent({ onRefresh }) {
    return (
        <div className="toolbar-wrapper">
            <div className="toolbar">
                <button className="icon-btn">
                    <img className="toolbar-img" src={download} alt="Download" />
                </button>
                <p className="divide">|</p>
                <label className="icon-select">
                    <img className="toolbar-img" src={notes} alt="Notes" />
                    <select>
                        <option>Simples</option>
                        <option>Árvore geradora mínima</option>
                        <option>Item 3</option>
                    </select>
                </label>
            </div>
            <button onClick={onRefresh} className="refresh-btn">
                <img className="toolbar-img" src={refresh} alt="Refresh" />
            </button>
        </div>
    )
}

export default ToolBarComponent
