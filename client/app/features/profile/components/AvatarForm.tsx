import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/ui';

export function AvatarForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('data ', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input type="file" {...register('avatar')} />
      <button type="submit">Submit</button>
    </form>
  );
}
