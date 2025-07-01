import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
const About: React.FC = () => {
  return <div className="min-h-screen bg-background text-foreground font-ys">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <ScrollReveal>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к галерее
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="mb-8 text-foreground font-extrabold text-4xl">О проекте RFD MUSEUM</h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-muted-foreground mb-16 leading-relaxed text-base">Интерактивная галерея обложек RFD</p>
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal delay={600} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">Это интерактивная галерея-музей обложек RFD. Мы решили попробовать поэкспериментировать и создать такой проект с помощью вайбкодинга и без отрисовки макетов в Figma.</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">Описывали все задачи на русском языке, а Lovable сразу писал код и показывал результат.</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Получилась галерея, где можно листать обложки, слушать музыку 
              и переключаться между светлой и тёмной темами.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <section>
              <h2 className="text-3xl mb-8 text-foreground font-bold">Что использовали</h2>
              <div className="bg-card p-8 border border-border rounded-3xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Основа</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>React + TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Vite</li>
                      <li>React Router</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Дополнительно</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Shadcn/ui компоненты</li>
                      <li>Lucide иконки</li>
                      <li>next-themes для тем</li>
                      <li>Встроенный аудиоплеер</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1000} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">Основная задача — интересно и в движении показать все обложки. Сделали виртуализацию: показываем только видимые картинки и они зацикливается при исчезали с экрана.</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">Для размещения обложек в пространстве используется алгоритм Poisson Disk Sampling, который расставляет их естественно, но не случайно — каждый раз в одних местах.</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Картинки появляются мгновенно при попадании в область видимости без всяких задержек.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1200}>
            <section>
              <h2 className="text-3xl mb-8 text-foreground font-bold">Как это работает</h2>
              <div className="space-y-6">
                <div className="bg-card p-8 border border-border rounded-3xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Виртуализация</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Показываем только видимые обложки. Остальные создаются при прокрутке. 
                    Поэтому можно листать много картинок без зависаний.
                  </p>
                </div>
                <div className="bg-card p-8 border border-border rounded-3xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Poisson Disk Sampling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Алгоритм расставляет обложки так, чтобы они не налезали друг на друга, 
                    но выглядели естественно. У каждой своё фиксированное место.
                  </p>
                </div>
                <div className="bg-card p-8 border border-border rounded-3xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Momentum Scrolling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Реализована инерция при перетаскивании — галерея продолжает двигаться 
                    после отпускания пальца или мыши, как на мобильных устройствах.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1400} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">С Web Audio API было проще — браузеры не любят автопроигрывание. Поэтому сделали кнопку включения и паузы (хотя хотелось бы на фоне включать).</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
          </p>
          </ScrollReveal>

          <ScrollReveal delay={1600}>
            <section>
              <h2 className="mb-8 text-foreground font-bold text-3xl">Что в итоге получилось</h2>
              <div className="bg-card p-8 border border-border rounded-3xl">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Быстрая загрузка и плавная прокрутка</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Переключение между светлой и тёмной темой</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Встроенный аудиоплеер</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Работает на всех устройствах</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Drag & Drop с инерцией</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1800} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">Используем CSS Grid и Flexbox для адаптивной вёрстки, которая раньше требовала сложного кода.</p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              CSS Custom Properties обеспечивают плавное переключение тем — каждый элемент меняется синхронно.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2000}>
            <section>
              <h2 className="mb-8 text-foreground font-bold text-3xl">Как этот работает</h2>
              <div className="bg-card p-8 border border-border rounded-3xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-foreground">Производительность</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Intersection Observer API</li>
                      <li>RequestAnimationFrame</li>
                      <li>CSS Transform3D</li>
                      <li>Lazy Loading</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-foreground">Взаимодействие</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Touch Events</li>
                      <li>Mouse Events</li>
                      <li>Momentum Physics</li>
                      <li>Responsive Design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={2200}>
            <p className="text-foreground leading-relaxed mb-6 text-center text-3xl font-extrabold">
              RFD MUSEUM — галерея, созданная с помощью ИИ за несколько часов.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2400}>
            <div className="text-center py-12 border-t border-border">
              <div className="mb-6">
                <img src="/lovable-uploads/0a7fd895-cc6a-4687-bdd6-32846b9cd638.png" alt="AntoshkinBaskirov" className="w-auto h-16 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-medium text-foreground">AntoshkinBashkirov</h3>
              </div>
              
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>;
};
export default About;