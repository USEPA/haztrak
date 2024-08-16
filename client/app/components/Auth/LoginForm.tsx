import { zodResolver } from '@hookform/resolvers/zod';
import { HtForm, HtSpinner } from 'app/components/legacyUi';
import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '~/hooks/useAuth/useAuth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username Required').min(8),
  password: z.string().min(1, 'Password Required').min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    login: { login, isLoading, error },
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  async function onSubmit({ username, password }: LoginSchema) {
    login({ username, password });
  }

  return (
    <HtForm onSubmit={handleSubmit(onSubmit)}>
      <HtForm.Group>
        <FloatingLabel controlId="username" label="Username">
          <Form.Control
            type="text"
            placeholder={'Username'}
            {...register('username', {})}
            className={errors.username && 'is-invalid'}
          />
        </FloatingLabel>
        <div className="invalid-feedback">{errors.username?.message}</div>
      </HtForm.Group>
      <HtForm.Group>
        <FloatingLabel controlId="password" label="Password">
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('password', {})}
            className={errors.password && 'is-invalid'}
          />
        </FloatingLabel>
        <div className="invalid-feedback">{errors.password?.message}</div>
      </HtForm.Group>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary m-2">
        <span>Login </span>
        {isLoading && <HtSpinner size="lg" className="text-reset" />}
      </button>
      {error && <div className="alert alert-danger mt-3 mb-0">{error.message}</div>}
    </HtForm>
  );
}
