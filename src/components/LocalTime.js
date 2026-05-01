import React from 'react';

function LocalTime({ tz = 'Australia/Sydney' }) {
  const [t, setT] = React.useState('');
  React.useEffect(() => {
    const f = () => setT(
      new Date().toLocaleTimeString('en-AU', {
        timeZone: tz, hour: '2-digit', minute: '2-digit',
      })
    );
    f();
    const id = setInterval(f, 30_000);
    return () => clearInterval(id);
  }, [tz]);
  return <>{t} AEDT</>;
}

export default LocalTime;
