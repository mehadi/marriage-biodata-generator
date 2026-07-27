/**
 * Server-Side PDF Template
 * React-PDF document rendered on the server. Produces a clean, A4 PDF
 * from BioData JSON without requiring headless Chromium.
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { BioData } from '@/types/biodata';

// Register a clean sans-serif font fallback (system Helvetica is available by default)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#059669',
    textAlign: 'center',
  },
  bismillah: {
    fontSize: 11,
    color: '#059669',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: '38%',
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    fontSize: 8.5,
  },
  value: {
    flex: 1,
    color: '#475569',
    fontSize: 8.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
});

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface BioDataPdfDocumentProps {
  bioData: BioData;
}

export function BioDataPdfDocument({ bioData }: BioDataPdfDocumentProps) {
  const p = bioData.personalInfo ?? {};
  const r = bioData.religiousInfo ?? {};
  const e = bioData.education ?? {};
  const pr = bioData.professionalInfo ?? {};
  const f = bioData.familyInfo ?? {};
  const c = bioData.contactInfo ?? {};
  const ex = bioData.partnerExpectations ?? {};

  return (
    <Document
      title={`Bio Data — ${p.fullName ?? 'Unknown'}`}
      author="Marriage Bio Data Maker"
      subject="Islamic Marriage Bio Data"
      keywords="marriage, bio data, islamic"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Text>
          <Text style={styles.name}>{p.fullName ?? 'Marriage Bio Data'}</Text>
          <Text style={styles.subtitle}>Marriage Bio Data</Text>
        </View>

        {/* Personal */}
        <Section title="Personal Information">
          <InfoRow label="Full Name"         value={p.fullName} />
          <InfoRow label="Date of Birth"     value={p.dateOfBirth} />
          <InfoRow label="Height"            value={p.height} />
          <InfoRow label="Complexion"        value={p.complexion} />
          <InfoRow label="Blood Group"       value={p.bloodGroup} />
          <InfoRow label="Marital Status"    value={p.maritalStatus} />
          <InfoRow label="Nationality"       value={p.nationality} />
          <InfoRow label="Place of Birth"    value={p.placeOfBirth} />
        </Section>

        {/* Religious */}
        <Section title="Religious Information">
          <InfoRow label="Sect"              value={r.sect} />
          <InfoRow label="Prayer Practice"   value={r.prayerPractice} />
          <InfoRow label="Quran Recitation"  value={r.quranRecitation} />
          <InfoRow label="Islamic Knowledge" value={r.islamicKnowledge} />
          <InfoRow label="Hijab / Beard"     value={r.hijabOrBeard} />
        </Section>

        {/* Education */}
        <Section title="Educational Background">
          <InfoRow label="Qualification"    value={e.highestQualification} />
          <InfoRow label="Institution"      value={e.institution} />
          <InfoRow label="Field of Study"   value={e.fieldOfStudy} />
          <InfoRow label="Year Completed"   value={e.yearOfCompletion} />
        </Section>

        {/* Professional */}
        <Section title="Professional Information">
          <InfoRow label="Occupation"       value={pr.occupation} />
          <InfoRow label="Company"          value={pr.company} />
          <InfoRow label="Designation"      value={pr.designation} />
          <InfoRow label="Income Range"     value={pr.incomeRange} />
        </Section>

        {/* Family */}
        <Section title="Family Information">
          <InfoRow label="Father's Name"    value={f.fatherName} />
          <InfoRow label="Father's Occ."    value={f.fatherOccupation} />
          <InfoRow label="Mother's Name"    value={f.motherName} />
          <InfoRow label="Mother's Occ."    value={f.motherOccupation} />
          <InfoRow label="Economic Status"  value={f.economicStatus} />
          <InfoRow label="Family Type"      value={f.familyType} />
        </Section>

        {/* Contact */}
        <Section title="Contact Information">
          <InfoRow label="Email"            value={c.email} />
          <InfoRow label="Phone"            value={c.phone} />
          <InfoRow label="Address"          value={c.permanentAddress} />
        </Section>

        {/* Expectations */}
        <Section title="Partner Expectations">
          <InfoRow label="Age Range"        value={ex.ageRange} />
          <InfoRow label="Height Range"     value={ex.heightRange} />
          <InfoRow label="Education"        value={ex.educationExpectation} />
          <InfoRow label="Occupation"       value={ex.occupationExpectation} />
          <InfoRow label="Religious"        value={ex.religiousExpectation} />
        </Section>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Generated by Marriage Bio Data Maker · marriagebiodata.com · All data is private and stored only on your device.
        </Text>
      </Page>
    </Document>
  );
}
