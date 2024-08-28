import React, { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui';
import { HtForm } from '~/components/legacyUi';
import { Row } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

interface AvatarFormProps {
  avatar?: string;
}

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [editable, setEditable] = useState(false);
  const fileRef = createRef<HTMLInputElement>();

  const { handleSubmit } = useForm<{ avatar?: string }>({ values: { avatar } });

  const onSubmit = () => {
    setEditable(!editable);
  };

  return (
    <HtForm onSubmit={handleSubmit(onSubmit)}>
      <Row className="p-2">
        <input
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Profile Picture"
          ref={fileRef}
          style={{ display: 'none' }}
        />
        <div className="avatar-container d-flex justify-content-center">
          <button onClick={() => fileRef.current?.click()}>
            <Avatar className="tw-h-40 tw-w-40">
              <AvatarImage src={avatar} alt="avatar" />
              <AvatarFallback>
                <FaUser size={80} />
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </Row>
    </HtForm>
  );
}
