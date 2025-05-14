import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '@/lib/supabase';

interface Incident {
  id: string;
  title: string;
  location: string;
  severity: string;
}

export default function MapScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*');

      if (error) throw error;
      setIncidents(data || []);
    } catch (err) {
      setError('Failed to load incidents');
      console.error('Error:', err);
    }
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {incidents.map((incident) => {
            const [lng, lat] = incident.location.slice(1, -1).split(',').map(Number);
            return (
              <Marker
                key={incident.id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={incident.title}
                pinColor={incident.severity === 'high' ? 'red' : 'orange'}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
    fontFamily: 'Inter-Regular',
  },
});