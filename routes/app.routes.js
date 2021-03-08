import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home";
import Details from "../screens/Details";

const App = createStackNavigator();

const AppRoutes = () => {
	return (
		<App.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: { backgroundColor: "#f3f3f3" },
			}}
		>
			<App.Screen name="Home" component={Home} />
			<App.Screen name="Details" component={Details} />
		</App.Navigator>
	);
};

export default AppRoutes;
