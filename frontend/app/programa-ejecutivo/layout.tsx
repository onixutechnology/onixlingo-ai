import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programa Ejecutivo y Oratoria Alta Dirección | OnixLingo',
  description: 'Domina el lenguaje de los negocios globales. Simulador interactivo para CEOs y ejecutivos, con análisis fonométrico en tiempo real de diplomacia y fluidez.',
};

export default function ProgramaEjecutivoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
