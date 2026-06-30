import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estructuración Léxica Avanzada | OnixLingo',
  description: 'Expansión de vocabulario corporativo mediante algoritmos SRS. Más de 3,000 palabras por idioma (Inglés, Francés, Chino) clasificadas desde A1 a C2.',
};

export default function VocabularioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
