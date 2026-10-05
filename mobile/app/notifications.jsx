import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Button, Card, Empty, ErrorText, Loading, styles } from '../src/components/UI';
import { notifications } from '../src/services/domain';
import { apiError } from '../src/services/api';
export default function Notifications() { const [data, setData] = useState(null); const [error, setError] = useState(''); const load = () => notifications.list().then(setData).catch((e) => setError(apiError(e))); useEffect(load, []); if (!data && !error) return <Loading />; return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Notifications</Text><Text style={styles.subtitle}>Updates about your applications.</Text>{error && <ErrorText message={error} />}{!data?.results?.length ? <Empty title="All caught up" /> : data.results.map((n) => <Card key={n.id}><Text style={styles.heading}>{n.title}</Text><Text style={styles.subtitle}>{n.message}</Text>{!n.is_read && <Button title="Mark as read" secondary onPress={async () => { await notifications.read(n.id); load(); }} />}</Card>)}</ScrollView></SafeAreaView>; }
