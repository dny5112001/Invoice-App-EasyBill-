import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import Profile from "../../assets/ProfileImage.jpeg";

const AboutMePage = () => {
  const skills = [
    "React Native",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "Redux",
    "Zustand",
    "UI/UX Design",
    "API Integration",
    "Geolocation",
    "PDF Generation",
  ];

  const achievements = [
    "Developed geolocation-based attendance tracking systems",
    "Created innovative spam filter and messaging applications",
    "Developed a music player app with personalized recommendations",
    "Built an invoice generation app with seamless PDF handling",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={Profile} style={styles.profileImage} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Deepak Yadav</Text>
          <Text style={styles.title}>React Native Developer</Text>
          <Text style={styles.description}>
            Passionate about building robust and innovative mobile applications
            with a focus on clean code, scalability, and user-centric design.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crafts</Text>
          {achievements.map((achievement, index) => (
            <Text key={index} style={styles.achievement}>
              • {achievement}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:deepakyadav@example.com")}
          >
            <Text style={styles.contactItem}>
              deepakyadav20011114@gmail.com
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://deepakyadavportfolio.netlify.app")
            }
          >
            <Text style={styles.contactItem}>
              deepakyadavportfolio.netlify.app
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    height: 250,
    backgroundColor: "#3567E4",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 70,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
  },
  profileInfo: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: -50,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  skillBadge: {
    backgroundColor: "#A1B4E7",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  skillText: {
    color: "#fff",
    fontSize: 14,
  },
  achievement: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 22,
  },
  contactItem: {
    fontSize: 16,
    color: "#3498db",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
});

export default AboutMePage;
