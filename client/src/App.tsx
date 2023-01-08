import {ReactElement} from 'react';

import './styles/Main.css';
import './styles/Header.css';
import './styles/DealsChart.css';
import './styles/DealsTable.css';
import './styles/Footer.css';
import './styles/NewDealModal.css';

import Main from './components/Main';

/**
 * Entry point to the application.
 * @returns ReactElement
 */
function App(): ReactElement {
    return <Main />;
}

export default App;
