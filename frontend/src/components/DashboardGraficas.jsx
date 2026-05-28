import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function GraficaVacia({ mensaje }) {
  return <p className="grafica-vacia">{mensaje}</p>;
}

function DashboardGraficas({ actividad7Dias, distribucionCategorias, radarCategorias }) {
  return (
    <section className="dashboard-graficas" aria-label="Graficas de metas">
      <article className="grafica-card">
        <header>
          <h2>Actividad ultimos 7 dias</h2>
          <p>Registros y actualizaciones recientes</p>
        </header>
        <div className="grafica-wrap">
          {actividad7Dias.some((dia) => dia.actividad > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actividad7Dias} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="actividad" name="Actividad" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <GraficaVacia mensaje="Todavia no hay actividad en esta semana." />
          )}
        </div>
      </article>

      <article className="grafica-card">
        <header>
          <h2>Distribucion por categoria</h2>
          <p>Conteo de metas activas</p>
        </header>
        <div className="grafica-wrap">
          {distribucionCategorias.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribucionCategorias}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={82}
                  paddingAngle={2}
                  label
                >
                  {distribucionCategorias.map((categoria) => (
                    <Cell key={categoria.name} fill={categoria.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <GraficaVacia mensaje="Crea metas para ver la distribucion." />
          )}
        </div>
      </article>

      <article className="grafica-card grafica-card-wide">
        <header>
          <h2>Indice de enfoque</h2>
          <p>Metrica propia: avance, puntuacion y volumen por categoria</p>
        </header>
        <div className="grafica-wrap grafica-wrap-wide">
          {radarCategorias.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarCategorias} outerRadius="76%">
                <PolarGrid />
                <PolarAngleAxis dataKey="categoria" />
                <Tooltip />
                <Radar
                  name="Indice"
                  dataKey="indice"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.28}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <GraficaVacia mensaje="Agrega puntuaciones para calcular el indice." />
          )}
        </div>
      </article>
    </section>
  );
}

export default memo(DashboardGraficas);
