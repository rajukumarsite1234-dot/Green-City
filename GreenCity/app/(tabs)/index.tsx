import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleReportIssue = () => {
    router.push('/(tabs)/report-issue');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.subtitle}>Report environmental issues in your city</Text>
      </View>

      {/* Quick Report Button */}
      <TouchableOpacity 
        style={styles.reportButton}
        onPress={handleReportIssue}
      >
        <View style={styles.reportButtonIcon}>
          <Ionicons name="camera" size={28} color="white" />
        </View>
        <Text style={styles.reportButtonText}>Report an Issue</Text>
        <Ionicons name="chevron-forward" size={24} color="white" />
      </TouchableOpacity>

      {/* Recent Reports */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        <View style={styles.recentReports}>
          <View style={styles.recentReportCard}>
            <View style={styles.recentReportImage} />
            <Text style={styles.recentReportTitle}>Illegal Dumping</Text>
            <Text style={styles.recentReportStatus}>Under Review</Text>
          </View>
          <View style={styles.recentReportCard}>
            <View style={styles.recentReportImage} />
            <Text style={styles.recentReportTitle}>Broken Street Light</Text>
            <Text style={[styles.recentReportStatus, styles.statusResolved]}>Resolved</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="leaf" size={24} color="white" />
            </View>
            <Text style={styles.quickActionText}>Green Tips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="stats-chart" size={24} color="white" />
            </View>
            <Text style={styles.quickActionText}>My Impact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="people" size={24} color="white" />
            </View>
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.emergencyContacts}>
          <TouchableOpacity style={styles.emergencyContact}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="alert-circle" size={24} color="#F44336" />
            </View>
            <Text style={styles.emergencyText}>Report Emergency</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emergencyContact}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="call" size={24} color="#2196F3" />
            </View>
            <Text style={styles.emergencyText}>Local Authorities</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  reportButtonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportButtonText: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  recentReports: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentReportCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  recentReportImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  recentReportTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  recentReportStatus: {
    color: '#FF9800',
    fontSize: 12,
  },
  statusResolved: {
    color: '#4CAF50',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
  },
  emergencyContacts: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emergencyIcon: {
    marginRight: 16,
  },
  emergencyText: {
    fontSize: 16,
    color: '#333',
  },
});
