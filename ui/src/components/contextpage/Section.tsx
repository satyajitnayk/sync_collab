import { LevelContext } from './LevelContext';

interface Props {
  level: number;
  children: any[];
}

export const Section = ({ level, children }: Props) => {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
    </section>
  );
};
