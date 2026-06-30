import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes y Precios B2B | OnixLingo',
  description: 'Elige tu membresía corporativa en OnixLingo. Calculadora interactiva para licencias por volumen y beneficios exclusivos de Executive Speech Standard.',
};

export default function PlanesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
