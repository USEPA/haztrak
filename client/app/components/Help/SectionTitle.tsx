/** A section title for the textual content such as About and help content*/
export function SectionTitle({
  title,
  variant,
}: {
  title: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <div className="tw-pb-3 tw-text-center ">
      <h2 className={`${variant ?? 'h2'} text-primary tw-relative tw-font-bold tw-uppercase`}>
        <div
          className="bg-secondary-subtle"
          style={{
            position: 'absolute',
            content: '',
            display: 'block',
            width: '120px',
            height: '1px',
            left: 'calc(50% - 60px)',
            bottom: '1px',
          }}
        />
        {title}
        <div
          className="bg-primary"
          style={{
            position: 'absolute',
            content: '',
            display: 'block',
            width: '40px',
            height: '3px',
            bottom: '0',
            left: 'calc(50% - 20px)',
          }}
        />
      </h2>
    </div>
  );
}
