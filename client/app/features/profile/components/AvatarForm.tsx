import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage, Input } from '~/components/ui';
import { useAuth } from '~/hooks';
import { useUpdateAvatarMutation } from '~/store';

interface AvatarFormProps {
  avatar?: string;
}

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [preview, setPreview] = useState<string | undefined>(avatar);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, watch } = useForm({ mode: 'onChange' });
  const [updateAvatar, { data, isSuccess }] = useUpdateAvatarMutation();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);
    // if (user?.id) {
    //   updateAvatar({ id: user?.id, avatar: formData });
    // }
  };

  // When the avatar is changed, submit the form
  useEffect(() => {
    watch((data) => {
      onSubmit(data);
    });
  }, [watch]);

  useEffect(() => {
    if (isSuccess) {
      setPreview(data?.avatar);
    }
  }, [isSuccess, data]);

  // create the props for the avatar input
  const registerProps = register('avatar', {
    required: true,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="file"
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          inputRef.current = e;
        }}
        className="tw:hidden"
      />
      <div className="tw:flex tw:justify-center">
        <button type="button" onClick={() => inputRef.current?.click()}>
          <Avatar className="tw:size-40">
            <AvatarImage src={preview} alt="avatar" />
            <AvatarFallback>
              <FaUser size={80} />
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </form>
  );
}
