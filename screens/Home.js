import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
	AntDesign,
	SimpleLineIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "../utils";

const Home = () => {
	const [searchedCities, setSearchedCities] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	const { register, handleSubmit, setValue } = useForm();
	const onSubmit = async (data) => {
		if (!data) {
			return;
		}
		setLoading(true);
		let city = {};
		try {
			const response = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json?key=e85809527b0341b18712ec1bacc3aab9&q=${data.cityName}`
			);

			city = response.data.results[0];

			setSearchedCities([...searchedCities, city]);

			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		register("cityName");
	}, [register, searchedCities]);

	const handleSelectCity = (latitude, longitude) => {
		navigation.navigate("Details", { latitude, longitude });
	};

	return (
		<View style={styles.wrapper}>
			<Text style={styles.welcomeText}>Welcome to the Weather app!</Text>
			<MaterialCommunityIcons
				name="weather-cloudy"
				size={80}
				color={colors.PRIMARY_COLOR}
				style={styles.logo}
			/>
			<Text style={styles.header}>Type your location here:</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) => {
					setValue("cityName", text);
				}}
			/>
			<TouchableOpacity
				style={styles.submitButton}
				onPress={handleSubmit(onSubmit)}
			>
				{loading ? (
					<ActivityIndicator size="large" color="white" />
				) : (
					<Text style={styles.buttonText}>
						Search <SimpleLineIcons name="magnifier" size={16} color="white" />
					</Text>
				)}
			</TouchableOpacity>

			<ScrollView>
				<Text style={styles.previousText}>Previous Searches</Text>
				{searchedCities.length > 0 ? (
					searchedCities.map((city, index) => (
						<TouchableOpacity
							onPress={() =>
								handleSelectCity(city.geometry.lat, city.geometry.lng)
							}
							key={index}
							style={styles.detailsButton}
						>
							<View style={styles.details}>
								<View>
									{city.components.town ? (
										<Text style={styles.cityName}>{city.components.town}</Text>
									) : (
										<Text style={styles.cityName}>{city.components.city}</Text>
									)}

									<Text>
										{city.components.state_code}, {city.components.country}
									</Text>
								</View>
								<AntDesign
									name="arrowright"
									size={30}
									color={colors.PRIMARY_COLOR}
								/>
							</View>
						</TouchableOpacity>
					))
				) : (
					<Text style={styles.placeHolder}>
						You still have not searched a city.
					</Text>
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 60,
		flex: 1,
	},
	welcomeText: {
		textAlign: "center",
		fontSize: 36,
	},
	logo: {
		textAlign: "center",
	},
	header: {
		fontSize: 18,
		marginBottom: 14,
		marginLeft: 20,
	},
	placeHolder: {
		marginLeft: 20,
	},
	input: {
		borderColor: "#a9a9a9",
		borderRadius: 10,
		margin: 20,
		borderWidth: 1,
		padding: 6,
		marginBottom: 16,
	},
	submitButton: {
		margin: 20,

		backgroundColor: `${colors.PRIMARY_COLOR}`,
		height: 40,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
	},
	previousText: {
		fontSize: 24,
		fontWeight: "700",
		marginLeft: 20,
	},
	detailsButton: {
		backgroundColor: "#d0d0d0",
		margin: 20,
		marginBottom: -6,
		height: 80,
		borderRadius: 10,
		padding: 14,
		paddingTop: 18,
	},
	details: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderLeftWidth: 3,
		borderLeftColor: `${colors.PRIMARY_COLOR}`,
		paddingLeft: 8,
	},
	cityName: {
		fontSize: 16,
		color: "black",
		fontWeight: "bold",
	},
});

export default Home;
