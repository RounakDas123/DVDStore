import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2, 
    borderBottomColor: '#4F46E5',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
  },
  col1: {
    width: '20%',
    fontSize: 10,
  },
  col2: {
    width: '50%',
    fontSize: 10,
  },
  col3: {
    width: '15%',
    fontSize: 10,
  },
  col4: {
    width: '15%',
    fontSize: 10,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 4,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  poster: {
    width: 40,
    height: 60,
  }
});

const InvoicePDF = ({ transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image 
        style={styles.logo}
        src="/logo_mini2.jpg" 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.subtitle}>Order #{transaction.trans_id}</Text>
        <Text style={styles.subtitle}>
          Date: {new Date(transaction.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 12, marginBottom: 8 }}>ITEMS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Type</Text>
            <Text style={styles.col2}>Title</Text>
            <Text style={styles.col3}>Quantity</Text>
            <Text style={styles.col4}>Price</Text>
          </View>
          {transaction.movie_tv.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.type.toUpperCase()}</Text>
              <Text style={styles.col2}>{item.title}</Text>
              <Text style={styles.col3}>{item.quantity}</Text>
              <Text style={styles.col4}>Rs.{item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            TOTAL: Rs.{transaction.movie_tv
              .reduce((sum, item) => sum + (item.price * item.quantity), 0)
              .toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your purchase!</Text>
        <Text>© {new Date().getFullYear()} DVDStore. All rights reserved.</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
