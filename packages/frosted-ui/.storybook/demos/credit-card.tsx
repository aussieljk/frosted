import React from 'react';
import { Button, CreditCard } from '@aussieljk/frosted';

export default function CreditCardDemo() {
  return (
    <CreditCard.Root defaultFace="front">
      <CreditCard.Content>
        <CreditCard.Front>
          <CreditCard.FrontHeader>
            <CreditCard.Logo>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>frosted</span>
            </CreditCard.Logo>
            <CreditCard.Brand>
              <CreditCard.BrandLogo brand="visa" />
            </CreditCard.Brand>
          </CreditCard.FrontHeader>
          <CreditCard.FrontFooter>
            <CreditCard.Title>Claude credits</CreditCard.Title>
            <CreditCard.LastFour>•••• 0991</CreditCard.LastFour>
          </CreditCard.FrontFooter>
        </CreditCard.Front>

        <CreditCard.Back>
          <CreditCard.MagStripe />
          <CreditCard.BackContent>
            <CreditCard.Fieldset aria-label="Card details">
              <CreditCard.Field>
                <CreditCard.FieldLabel>Card number</CreditCard.FieldLabel>
                <CreditCard.NumberField readOnly defaultValue="4242 4242 4242 0991" />
              </CreditCard.Field>
              <CreditCard.FieldGroup>
                <CreditCard.Field>
                  <CreditCard.FieldLabel>Exp</CreditCard.FieldLabel>
                  <CreditCard.ExpiryField readOnly defaultValue="11/27" />
                </CreditCard.Field>
                <CreditCard.Field>
                  <CreditCard.FieldLabel>CVV</CreditCard.FieldLabel>
                  <CreditCard.CVVField readOnly defaultValue="817" />
                </CreditCard.Field>
              </CreditCard.FieldGroup>
            </CreditCard.Fieldset>
          </CreditCard.BackContent>
        </CreditCard.Back>
      </CreditCard.Content>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <CreditCard.Trigger render={<Button variant="surface" size="2" />}>Flip card</CreditCard.Trigger>
      </div>
    </CreditCard.Root>
  );
}
