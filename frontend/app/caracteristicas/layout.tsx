import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Características de la Plataforma | OnixLingo',
  description: 'Descubre el motor neuronal Sistema, simuladores de Alta Dirección y herramientas de Speech Analytics de OnixLingo. Tecnología diseñada para escalar sin fricciones.',
};

export default function CaracteristicasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
