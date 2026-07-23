import React from 'react';
import { Button, Field, Form, TextField } from '@aussieljk/frosted';

export default function FormDemo() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <Form
      style={{ width: 300 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <TextField.Root>
          <TextField.Input type="email" placeholder="you@example.com" required />
        </TextField.Root>
        <Field.Error match="valueMissing">Email is required</Field.Error>
        <Field.Error match="typeMismatch">Please enter a valid email</Field.Error>
      </Field.Root>

      <Button type="submit" variant="solid" style={{ width: '100%' }}>
        {submitted ? 'Subscribed!' : 'Subscribe'}
      </Button>
    </Form>
  );
}
