import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ItineraryConfirmationProps {
  clientName: string;
  title: string;
  details: string;
}

export const ItineraryConfirmation = ({
  clientName,
  title,
  details,
}: ItineraryConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your Ceylon Luxe Travels Booking Confirmation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ceylon Luxe Travels</Heading>
        <Section style={content}>
          <Text style={text}>Dear {clientName || "Traveler"},</Text>
          <Text style={text}>
            Thank you for reaching out. We have received your booking request for:
          </Text>
          <Text style={highlightedText}>
            <strong>{title}</strong>
          </Text>
          <Text style={text}>
            Here are the details you provided:
          </Text>
          <Text style={text}>
            {details}
          </Text>
          <Text style={text}>
            Our team will contact you shortly to finalize your bespoke itinerary.
          </Text>
          <Text style={text}>
            Warm regards,
            <br />
            The Ceylon Luxe Travels Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f5f5f7",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "8px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const highlightedText = {
  ...text,
  backgroundColor: "#f9f9f9",
  padding: "12px",
  borderRadius: "4px",
  borderLeft: "4px solid #b8860b", // Golden accent
};

export default ItineraryConfirmation;
