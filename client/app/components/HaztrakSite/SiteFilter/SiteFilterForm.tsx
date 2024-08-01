import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FloatingLabel, Form } from 'react-bootstrap';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HaztrakSite } from '~/components/HaztrakSite/haztrakSiteSchema';
import { useSearchParams } from 'react-router-dom';

interface SiteFilterFormProps {
  sites: HaztrakSite[];
  setFilteredSites: Dispatch<SetStateAction<HaztrakSite[]>>;
  onClear?: () => void;
}

const siteFilterFormSchema = z.object({
  query: z.string(),
});

type SiteFilterForm = z.infer<typeof siteFilterFormSchema>;

export function SiteFilterForm({ sites, setFilteredSites, onClear }: SiteFilterFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteFilter, setSiteFilter] = useState(searchParams.get('q') ?? undefined);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SiteFilterForm>({
    defaultValues: { query: siteFilter },
    resolver: zodResolver(siteFilterFormSchema),
  });

  useEffect(() => {
    if (siteFilter) {
      const filtered = sites.filter((site) => {
        return (
          site.handler.epaSiteId.toLowerCase().includes(siteFilter.toLowerCase()) ||
          site.name.toLowerCase().includes(siteFilter.toLowerCase())
        );
      });
      setFilteredSites(filtered);
    } else {
      clearFilter();
    }
  }, [siteFilter]);

  const clearFilter = () => {
    if (onClear) {
      onClear();
    }
    setFilteredSites(sites);
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const onSubmit = (data: SiteFilterForm) => {
    setSiteFilter(data.query);
    setSearchParams({ q: data.query });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="form">
        <Form.Group>
          <FloatingLabel controlId="siteFilter" label="Filter">
            <Form.Control
              type="search"
              placeholder={'Filter'}
              {...register('query', {})}
              className={errors.query && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.query?.message}</div>
          </FloatingLabel>
        </Form.Group>
      </Form>
    </div>
  );
}
