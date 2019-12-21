import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import Encrypt from '../screens/Encrypt';


const app = createStackNavigator({
    home: { screen: Home },
    encrypt: { screen: Encrypt }
},{
    headerMode: "none"
});
const AppContainer = createAppContainer(app);
// Now AppContainer is the main component for React to render
export default AppContainer;