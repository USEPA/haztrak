import { zodResolver } from '@hookform/resolvers/zod';

import { FloatingLabel, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HtForm } from '~/components/legacyUi';
import { Spinner } from '~/components/ui/Spinner/Spinner';
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
      <div className="tw:flex tw:items-center tw:gap-5">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          <span>Login </span>
        </button>
        <Spinner show={isLoading} size="sm" />
      </div>
      {error && <div className="alert alert-danger mt-3 mb-0">{error.message}</div>}
    </HtForm>
  );
}
